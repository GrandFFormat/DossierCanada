// Enrichissement — Sommaire officiel des projets de loi (LEGISinfo)
//
// Contrairement au patron QC (qui générait un résumé par IA à partir du PDF),
// on utilise ici le SOMMAIRE OFFICIEL rédigé par la Bibliothèque du Parlement
// (Service d'information, d'éducation et de recherche parlementaires), exposé
// par LEGISinfo dans la fiche INDIVIDUELLE de chaque projet de loi, champs
// ShortLegislativeSummaryEn / ShortLegislativeSummaryFr. C'est de la donnée
// officielle et bilingue — aucune IA, aucune clé API, rien à « valider ».
//
// La liste de session (bills.js) ne contient PAS ce champ : il faut donc un
// fetch par projet de loi (~185, avec un délai poli). On enrichit data/bills.json
// en place, en ajoutant à chaque projet :
//   summary: { en: string|null, fr: string|null }
//   fullSummaryAvailable: boolean   (un résumé législatif long existe-t-il ?)
//
// Beaucoup de projets de député·e·s / du Sénat n'ont PAS de sommaire (la
// Bibliothèque priorise les projets gouvernementaux) : dans ce cas summary reste
// à null, et le site affichera « non disponible » plutôt que d'inventer.

import { readFileSync, writeFileSync } from 'node:fs';
import * as cheerio from 'cheerio';

const BILLS_PATH = 'data/bills.json';
const REQUEST_DELAY_MS = 200;
const USER_AGENT = 'DossierCanada/0.1 (veille citoyenne; mart.archambault@gmail.com)';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Nettoie le HTML du sommaire : <br> → saut de ligne, on retire les autres
// balises et on décode les entités (via cheerio), puis on normalise les espaces.
function cleanSummary(html) {
  if (!html) return null;
  const withBreaks = String(html).replace(/<br\s*\/?>/gi, '\n');
  const text = cheerio.load(`<div>${withBreaks}</div>`)('div').text();
  const cleaned = text
    .split('\n')
    .map((l) => l.replace(/\s+/g, ' ').trim())
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
  return cleaned === '' ? null : cleaned;
}

async function fetchBillSummary(session, num) {
  const url = `https://www.parl.ca/legisinfo/en/bill/${session}/${num.toLowerCase()}/json`;
  const res = await fetch(url, { headers: { 'User-Agent': USER_AGENT, Accept: 'application/json' } });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  const b = Array.isArray(data) ? data[0] : data;
  return {
    en: cleanSummary(b.ShortLegislativeSummaryEn),
    fr: cleanSummary(b.ShortLegislativeSummaryFr),
    fullSummaryAvailable: Boolean(b.IsFullLegislativeSummaryAvailable),
  };
}

async function main() {
  const data = JSON.parse(readFileSync(BILLS_PATH, 'utf-8'));
  const bills = data.bills;

  let withSummary = 0;
  let errors = 0;
  for (const [i, bill] of bills.entries()) {
    try {
      const s = await fetchBillSummary(bill.session, bill.num);
      bill.summary = { en: s.en, fr: s.fr };
      bill.fullSummaryAvailable = s.fullSummaryAvailable;
      if (s.en || s.fr) withSummary++;
    } catch (err) {
      errors++;
      bill.summary = { en: null, fr: null };
      bill.fullSummaryAvailable = false;
      console.error(`  ⚠ ${bill.num} : ${err.message}`);
    }
    if ((i + 1) % 25 === 0) console.log(`  … ${i + 1}/${bills.length} projets traités`);
    await sleep(REQUEST_DELAY_MS);
  }

  data.summariesScrapedAt = new Date().toISOString();
  writeFileSync(BILLS_PATH, JSON.stringify(data, null, 2));

  console.log(`Sommaires officiels ajoutés à ${BILLS_PATH}`);
  console.log(`  avec sommaire : ${withSummary} / ${bills.length} · sans : ${bills.length - withSummary} · erreurs : ${errors}`);
}

main().catch((err) => {
  console.error('Échec de bill-summaries.js :', err);
  process.exitCode = 1;
});
