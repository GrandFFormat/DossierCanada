// Enrichissement — Sommaire des projets de loi (deux sources officielles, sans IA)
//
// Contrairement au patron QC (qui générait un résumé par IA à partir du PDF), on
// utilise ici uniquement des sommaires OFFICIELS déjà rédigés — aucune IA, aucune
// clé API, rien à « valider ». Deux sources, par ordre de préférence :
//
//   1. Bibliothèque du Parlement — le sommaire éditorial (ShortLegislativeSummary
//      En/Fr de la fiche LEGISinfo). Plus détaillé, mais seulement pour les projets
//      que la Bibliothèque priorise (surtout les projets gouvernementaux).
//   2. Repli : la clause SOMMAIRE / SUMMARY du TEXTE MÊME du projet de loi, rédigée
//      par les légistes, présente dans presque tous les projets. Extraite du texte
//      de première lecture (parl.ca/DocumentViewer, bilingue).
//
// Chaque projet reçoit donc :
//   summary: { en: string|null, fr: string|null }
//   summarySource: 'library' | 'bill' | null   (pour un étiquetage honnête à l'écran)
//   fullSummaryAvailable: boolean               (un résumé législatif long existe-t-il ?)
//
// Rien n'est inventé : si aucune des deux sources n'a de sommaire, summary reste null.

import { readFileSync, writeFileSync } from 'node:fs';
import * as cheerio from 'cheerio';

const BILLS_PATH = 'data/bills.json';
const REQUEST_DELAY_MS = 180;
const USER_AGENT = 'DossierCanada/0.1 (veille citoyenne; mart.archambault@gmail.com)';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Nettoie le HTML du sommaire Bibliothèque : <br> → saut de ligne, on retire les
// autres balises et on décode les entités (via cheerio), puis on normalise.
function cleanLibrary(html) {
  if (!html) return null;
  const withBreaks = String(html).replace(/<br\s*\/?>/gi, '\n');
  const text = cheerio.load(`<div>${withBreaks}</div>`)('div').text();
  return normalize(text);
}

function normalize(text) {
  const cleaned = String(text || '')
    .split('\n')
    .map((l) => l.replace(/[ \t]+/g, ' ').trim())
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
  return cleaned === '' ? null : cleaned;
}

// Extrait la clause SOMMAIRE/SUMMARY du texte de loi : le titre <h2> puis tout ce
// qui suit jusqu'au <h2> suivant (section « Titre abrégé » / articles).
function extractBillClause(html) {
  const $ = cheerio.load(html);
  const h2 = $('h2')
    .filter((_, el) => /^(summary|sommaire)$/i.test($(el).text().replace(/\s+/g, ' ').trim()))
    .first();
  if (!h2.length) return null;
  const text = h2.nextUntil('h2').map((_, el) => $(el).text()).get().join('\n');
  return normalize(text);
}

async function fetchJson(url) {
  const res = await fetch(url, { headers: { 'User-Agent': USER_AGENT, Accept: 'application/json' } });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

async function fetchText(url) {
  const res = await fetch(url, { headers: { 'User-Agent': USER_AGENT } });
  if (!res.ok) return null; // texte pas (encore) publié → pas de sommaire, on ne devine pas
  return res.text();
}

// Sommaire Bibliothèque (fiche LEGISinfo individuelle).
async function librarySummary(session, num) {
  const url = `https://www.parl.ca/legisinfo/en/bill/${session}/${num.toLowerCase()}/json`;
  const data = await fetchJson(url);
  const b = Array.isArray(data) ? data[0] : data;
  return {
    en: cleanLibrary(b.ShortLegislativeSummaryEn),
    fr: cleanLibrary(b.ShortLegislativeSummaryFr),
    fullSummaryAvailable: Boolean(b.IsFullLegislativeSummaryAvailable),
  };
}

// Clause SOMMAIRE du texte de loi (première lecture), bilingue. Les chemins d'URL
// diffèrent selon la langue (bill/first-reading vs projet-loi/premiere-lecture).
async function billClauseSummary(session, num) {
  const [enHtml, frHtml] = await Promise.all([
    fetchText(`https://www.parl.ca/DocumentViewer/en/${session}/bill/${num}/first-reading`),
    fetchText(`https://www.parl.ca/DocumentViewer/fr/${session}/projet-loi/${num}/premiere-lecture`),
  ]);
  return {
    en: enHtml ? extractBillClause(enHtml) : null,
    fr: frHtml ? extractBillClause(frHtml) : null,
  };
}

async function main() {
  const data = JSON.parse(readFileSync(BILLS_PATH, 'utf-8'));
  const bills = data.bills;

  const counts = { library: 0, bill: 0, none: 0 };
  let errors = 0;
  for (const [i, bill] of bills.entries()) {
    try {
      const lib = await librarySummary(bill.session, bill.num);
      bill.fullSummaryAvailable = lib.fullSummaryAvailable;
      if (lib.en || lib.fr) {
        bill.summary = { en: lib.en, fr: lib.fr };
        bill.summarySource = 'library';
        counts.library++;
      } else {
        await sleep(REQUEST_DELAY_MS);
        const clause = await billClauseSummary(bill.session, bill.num);
        if (clause.en || clause.fr) {
          bill.summary = { en: clause.en, fr: clause.fr };
          bill.summarySource = 'bill';
          counts.bill++;
        } else {
          bill.summary = { en: null, fr: null };
          bill.summarySource = null;
          counts.none++;
        }
      }
    } catch (err) {
      errors++;
      bill.summary = { en: null, fr: null };
      bill.summarySource = null;
      bill.fullSummaryAvailable = false;
      counts.none++;
      console.error(`  ⚠ ${bill.num} : ${err.message}`);
    }
    if ((i + 1) % 25 === 0) console.log(`  … ${i + 1}/${bills.length} projets traités`);
    await sleep(REQUEST_DELAY_MS);
  }

  data.summariesScrapedAt = new Date().toISOString();
  writeFileSync(BILLS_PATH, JSON.stringify(data, null, 2));

  console.log(`Sommaires ajoutés à ${BILLS_PATH}`);
  console.log(`  Bibliothèque : ${counts.library} · texte de loi : ${counts.bill} · aucun : ${counts.none} · erreurs : ${errors}`);
  console.log(`  couverture totale : ${counts.library + counts.bill} / ${bills.length}`);
}

main().catch((err) => {
  console.error('Échec de bill-summaries.js :', err);
  process.exitCode = 1;
});
