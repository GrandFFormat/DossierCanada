// Scraper — Pétitions électroniques fédérales ouvertes à la signature
//
// Source : la LISTE PUBLIQUE des pétitions de la Chambre des communes, telle que
// le site l'affiche à tout visiteur — chargée en AJAX (POST) depuis
//   https://www.ourcommons.ca/petitions/{en,fr}/Petition/SearchAsync
// qui renvoie un JSON { html: "<table>…" }. On lit ce contenu public, bilingue.
//
// IMPORTANT — honnêteté : on N'UTILISE PAS l'export XML/CSV de ce site, qui est
// protégé par un reCAPTCHA (mesure anti-automatisation délibérée) — le contourner
// ne serait pas correct, même règle que le registre des lobbyistes QC. Ici on ne
// fait que lire la même liste publique qu'un navigateur, à un rythme raisonnable
// (le contenu chargé en AJAX n'est pas un obstacle, seulement le téléchargement en
// masse l'est). Rien n'est inventé : on recopie ce que la Chambre publie.
//
// Modèle produit (data/petitions.json → petitions[]) :
//   { code, topic:{en,fr}, keywords:{en,fr}, status:{en,fr}, sponsor, signatures, url:{en,fr} }

import { writeFileSync, mkdirSync } from 'node:fs';
import * as cheerio from 'cheerio';

const OUT_PATH = 'data/petitions.json';
const REQUEST_DELAY_MS = 300;
const USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0 Safari/537.36';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function fetchPage(lang, page) {
  const url = `https://www.ourcommons.ca/petitions/${lang}/Petition/SearchAsync`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'User-Agent': USER_AGENT,
      'X-Requested-With': 'XMLHttpRequest',
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: `category=Open&order=Recent&Page=${page}`,
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} (${lang} p${page})`);
  const data = await res.json();
  return data.html || '';
}

// Extrait les pétitions d'un fragment HTML de liste (une page).
function parseRows(html) {
  const $ = cheerio.load(html);
  const rows = $('tbody tr').length ? $('tbody tr') : $('tr').slice(1);
  const out = [];
  rows.each((_, tr) => {
    const cells = $(tr).find('td');
    if (cells.length < 6) return;
    const link = $(cells[0]).find('a').first();
    const href = link.attr('href') || '';
    const code = (href.match(/e-\d+/) || $(cells[0]).text().match(/e-\d+/) || [])[0];
    if (!code) return;
    const topic = $(cells[0]).text().replace(code, '').replace(/\s+/g, ' ').trim();
    out.push({
      code,
      topic,
      keywords: $(cells[1]).text().replace(/\s+/g, ' ').trim() || null,
      status: $(cells[3]).text().replace(/\s+/g, ' ').trim() || null,
      sponsor: $(cells[4]).text().replace(/\s+/g, ' ').trim() || null,
      signatures: Number($(cells[5]).text().replace(/[^\d]/g, '')) || 0,
    });
  });
  return out;
}

// Première page seulement : les ~20 pétitions ouvertes les plus récentes.
// La pagination du site est à état de session (le paramètre Page est ignoré au-delà
// de la 1re page), et forcer plus reviendrait à lutter contre son anti-automatisation.
// On se contente donc du snapshot public fiable + on renverra vers la liste complète
// officielle côté frontend. → Map(code → champs).
async function fetchFirstPage(lang) {
  const rows = parseRows(await fetchPage(lang, 1));
  const byCode = new Map();
  for (const r of rows) if (!byCode.has(r.code)) byCode.set(r.code, r);
  return byCode;
}

async function main() {
  const en = await fetchFirstPage('en');
  await sleep(REQUEST_DELAY_MS);
  const fr = await fetchFirstPage('fr');

  const petitions = [...en.values()]
    .map((e) => {
      const f = fr.get(e.code) || {};
      return {
        code: e.code,
        topic: { en: e.topic || null, fr: f.topic || null },
        keywords: { en: e.keywords, fr: f.keywords ?? null },
        status: { en: e.status, fr: f.status ?? null },
        sponsor: e.sponsor, // nom du·de la député·e parrain — indépendant de la langue
        signatures: e.signatures,
        url: {
          en: `https://www.ourcommons.ca/petitions/en/Petition/Details?Petition=${e.code}`,
          fr: `https://www.ourcommons.ca/petitions/fr/Petition/Details?Petition=${e.code}`,
        },
      };
    })
    .sort((a, b) => b.signatures - a.signatures);

  mkdirSync('data', { recursive: true });
  writeFileSync(
    OUT_PATH,
    JSON.stringify(
      { source: 'https://www.ourcommons.ca/petitions/', scrapedAt: new Date().toISOString(), count: petitions.length, petitions },
      null,
      2
    )
  );

  console.log(`${petitions.length} pétitions ouvertes écrites dans ${OUT_PATH}`);
  const totalSig = petitions.reduce((s, p) => s + p.signatures, 0);
  console.log(`  signatures cumulées : ${totalSig.toLocaleString('fr-CA')} · sans correspondance FR : ${petitions.filter((p) => !p.topic.fr).length}`);
}

main().catch((err) => {
  console.error('Échec du scraper petitions.js :', err);
  process.exitCode = 1;
});
