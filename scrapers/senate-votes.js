// Scraper — Votes par appel nominal (« standing votes ») du Sénat du Canada
//
// Sources (Licence du gouvernement ouvert – Canada), toutes servies par le serveur
// (HTML statique, pas de JavaScript à exécuter) :
//   Liste EN : https://sencanada.ca/en/in-the-chamber/votes/45-1
//   Liste FR : https://sencanada.ca/fr/dans-la-chambre/votes/45-1
//   Détail   : https://sencanada.ca/en/in-the-chamber/votes/details/{id}/45-1
//
// La liste donne, par vote : la date, le titre (motion ou projet de loi), les
// décomptes (Pour / Contre / Abstentions / Total) et le résultat. La page de détail
// donne le vote NOMINATIF : une table « Sénateur | Groupe | Province | Pour | Contre
// | Abstention », où la colonne du choix porte une icône. On lit uniquement les
// choix réels (Pour/Contre/Abstention) — leur somme égale le total officiel.
//
// Le Sénat n'expose pas ici d'identifiant numérique stable joignable au roster : on
// enregistre donc chaque bulletin par NOM (« Nom, Prénom », même format que
// senators.js), et la jointure nom → sénateur·rice (slug, groupe/province bilingues)
// se fait au build (build-frontend-data.js), jamais au scrape — chaque scraper ne
// tape qu'UNE source, comme votes.js pour les Communes.
//
// Modèle produit (data/senate-votes.json → votes[]) :
//   /**
//    * @typedef {Object} SenateVote
//    * @property {number} id        Identifiant du vote (segment d'URL de la fiche détail)
//    * @property {string} date      AAAA-MM-JJ
//    * @property {{en:string, fr:string}} title
//    * @property {string|null} billNumber  Numéro de projet lié (ex. "S-4", "C-5") ou null (motion)
//    * @property {{yea:number, nay:number, abstention:number, total:number}} totals
//    * @property {{en:string, fr:string}} result   ex. Adopted / Adoptée
//    * @property {boolean|null} passed
//    * @property {{en:string, fr:string}} url
//    * @property {Array<{name:string, affiliation:string|null, province:string|null, vote:'yea'|'nay'|'abstention'}>} ballots
//    */

import { writeFileSync, mkdirSync } from 'node:fs';
import * as cheerio from 'cheerio';

const SESSION = '45-1';
const LIST_EN = `https://sencanada.ca/en/in-the-chamber/votes/${SESSION}`;
const LIST_FR = `https://sencanada.ca/fr/dans-la-chambre/votes/${SESSION}`;
const detailUrl = (lang, id) =>
  lang === 'fr'
    ? `https://sencanada.ca/fr/dans-la-chambre/votes/details/${id}/${SESSION}`
    : `https://sencanada.ca/en/in-the-chamber/votes/details/${id}/${SESSION}`;
const OUT_PATH = 'data/senate-votes.json';
const USER_AGENT = 'DossierCanada/0.1 (veille citoyenne; mart.archambault@gmail.com)';

const clean = (s) => (s || '').replace(/\s+/g, ' ').trim();
const orNull = (s) => (clean(s) === '' ? null : clean(s));

async function fetchHtml(url) {
  const res = await fetch(url, { headers: { 'User-Agent': USER_AGENT, Accept: 'text/html' } });
  if (!res.ok) throw new Error(`HTTP ${res.status} pour ${url}`);
  return res.text();
}

// Petit pool pour limiter la concurrence des 36 requêtes de détail (poli + robuste).
async function mapPool(items, limit, fn) {
  const results = new Array(items.length);
  let i = 0;
  async function worker() {
    while (i < items.length) {
      const idx = i++;
      results[idx] = await fn(items[idx], idx);
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
  return results;
}

// Parse une page-liste (dans une langue) → Map id → { date, title, yea, nay, abstention, total, result }.
function parseList(html) {
  const $ = cheerio.load(html);
  const byId = new Map();
  $('tr').each((_, tr) => {
    const link = $(tr).find('a[href*="/votes/details/"]').first();
    if (!link.length) return;
    const id = Number((link.attr('href').match(/\/votes\/details\/(\d+)\//) || [])[1]);
    if (!id) return;

    const tds = $(tr).find('td');
    const date = (clean($(tds.get(0)).text()).match(/\d{4}-\d{2}-\d{2}/) || [])[0] || null;
    const title = clean(link.text());
    const rowText = clean($(tr).text());

    // Décomptes : on repère chaque valeur via son étiquette (bilingue) pour ne
    // jamais se tromper de nombre.
    const grab = (labels) => {
      for (const l of labels) {
        const m = rowText.match(new RegExp(l + '\\s*:?\\s*(\\d+)', 'i'));
        if (m) return Number(m[1]);
      }
      return null;
    };
    const yea = grab(['Yeas', 'Pour']);
    const nay = grab(['Nays', 'Contre']);
    const abstention = grab(['Abstentions']);
    const total = grab(['Total']);

    // Résultat : libellé reconnu (EN ou FR, masculin/féminin selon la source).
    const rm = rowText.match(/(Adopted|Defeated|Tie|Adopté|Adoptée|Rejeté|Rejetée|Égalité|Négative)/i);
    const result = rm ? rm[1] : null;

    byId.set(id, { id, date, title, yea, nay, abstention, total, result });
  });
  return byId;
}

// Parse une page de détail (EN) → bulletins réels [{ name, affiliation, province, vote }].
function parseDetail(html) {
  const $ = cheerio.load(html);
  let table = null;
  $('table').each((_, t) => {
    if (/Senator/i.test($(t).find('thead').text())) table = t;
  });
  if (!table) return [];
  const ballots = [];
  $(table)
    .find('tbody tr')
    .each((_, tr) => {
      const tds = $(tr).find('td');
      if (tds.length < 6) return;
      const name = orNull($(tds.get(0)).text());
      if (!name) return;
      const affiliation = orNull($(tds.get(1)).text());
      const province = orNull($(tds.get(2)).text());
      // La colonne du choix porte une icône (<i>) ; les autres sont vides.
      const vote = $(tds.get(3)).find('i').length
        ? 'yea'
        : $(tds.get(4)).find('i').length
        ? 'nay'
        : $(tds.get(5)).find('i').length
        ? 'abstention'
        : null;
      if (!vote) return; // sénateur·rice listé·e mais n'ayant pas voté → ignoré
      ballots.push({ name, affiliation, province, vote });
    });
  return ballots;
}

function detectBillNumber(title) {
  const m = title.match(/\b([SC]-\d+[A-E]?)\b/i);
  return m ? m[1].toUpperCase() : null;
}

async function main() {
  const [listEnHtml, listFrHtml] = await Promise.all([fetchHtml(LIST_EN), fetchHtml(LIST_FR)]);
  const en = parseList(listEnHtml);
  const fr = parseList(listFrHtml);
  const ids = [...en.keys()];

  const details = await mapPool(ids, 5, async (id) => {
    const html = await fetchHtml(detailUrl('en', id));
    return parseDetail(html);
  });

  const votes = ids.map((id, idx) => {
    const e = en.get(id);
    const f = fr.get(id) || {};
    const ballots = details[idx];
    const counted = { yea: 0, nay: 0, abstention: 0 };
    for (const b of ballots) counted[b.vote]++;

    // Cohérence : la somme des bulletins lus doit égaler les décomptes officiels.
    const okYea = e.yea == null || e.yea === counted.yea;
    const okNay = e.nay == null || e.nay === counted.nay;
    const okAbs = e.abstention == null || e.abstention === counted.abstention;
    if (!okYea || !okNay || !okAbs) {
      console.log(`  ⚠ vote ${id} : décompte lu ${JSON.stringify(counted)} ≠ officiel {yea:${e.yea}, nay:${e.nay}, abstention:${e.abstention}}`);
    }

    const passed = e.result ? /Adopted|Adoptée/i.test(e.result) : null;

    return {
      id,
      date: e.date,
      title: { en: e.title, fr: f.title ?? e.title },
      billNumber: detectBillNumber(e.title),
      totals: {
        yea: e.yea ?? counted.yea,
        nay: e.nay ?? counted.nay,
        abstention: e.abstention ?? counted.abstention,
        total: e.total ?? counted.yea + counted.nay + counted.abstention,
      },
      result: { en: e.result, fr: f.result ?? e.result },
      passed,
      url: { en: detailUrl('en', id), fr: detailUrl('fr', id) },
      ballots,
    };
  });

  votes.sort((a, b) => (b.date || '').localeCompare(a.date || '') || b.id - a.id);

  mkdirSync('data', { recursive: true });
  writeFileSync(
    OUT_PATH,
    JSON.stringify(
      { source: { en: LIST_EN, fr: LIST_FR }, session: SESSION, scrapedAt: new Date().toISOString(), count: votes.length, votes },
      null,
      2
    )
  );

  const withBill = votes.filter((v) => v.billNumber).length;
  console.log(`${votes.length} votes du Sénat écrits dans ${OUT_PATH}`);
  console.log(`  ${withBill} liés à un projet de loi, ${votes.length - withBill} sur motions/autres`);
  console.log(`  bulletins nominatifs (1er vote) : ${votes[0]?.ballots.length ?? 0}`);
}

main().catch((err) => {
  console.error('Échec du scraper senate-votes.js :', err);
  process.exitCode = 1;
});
