// Scraper — Calendrier officiel des jours de séance de la Chambre des communes
//
// Source : https://www.ourcommons.ca/en/sitting-calendar/{année} (HTML statique).
// Chaque jour de séance est une cellule <td> dont la CLASSE contient littéralement
// la date et le type : class="1/26/2026 chamber-meeting". On lit l'année courante
// et la suivante (les deux sont publiées). Les dates sont neutres en langue —
// les libellés bilingues sont ajoutés côté frontend.
//
// C'est le calendrier PRÉVU, adopté par la Chambre : il peut changer (prolongations,
// rappels, ajournements anticipés). Le frontend l'indique. Les horaires des comités
// et le calendrier du Sénat ne sont pas couverts ici.
//
// Modèle produit (data/house-calendar.json) :
//   { years: [2026, 2027], sittingDays: ["2026-01-26", ...] }  (ordre croissant)

import { writeFileSync, mkdirSync } from 'node:fs';
import * as cheerio from 'cheerio';

const USER_AGENT = 'DossierCanada/0.1 (veille citoyenne; mart.archambault@gmail.com)';
const OUT_PATH = 'data/house-calendar.json';

async function fetchYear(year) {
  const url = `https://www.ourcommons.ca/en/sitting-calendar/${year}`;
  const res = await fetch(url, { headers: { 'User-Agent': USER_AGENT, Accept: 'text/html' } });
  if (!res.ok) throw new Error(`HTTP ${res.status} pour ${url}`);
  const $ = cheerio.load(await res.text());
  const days = [];
  $('td[class]').each((_, td) => {
    const cls = ($(td).attr('class') || '').trim();
    // class="M/D/YYYY chamber-meeting" — on ne retient que les jours de séance.
    const m = cls.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})\s+chamber-meeting\b/);
    if (!m) return;
    const [, mo, d, y] = m;
    days.push(`${y}-${String(mo).padStart(2, '0')}-${String(d).padStart(2, '0')}`);
  });
  return days;
}

async function main() {
  const thisYear = new Date().getFullYear();
  const years = [thisYear, thisYear + 1];
  const all = [];
  for (const y of years) {
    const days = await fetchYear(y);
    console.log(`  ${y} : ${days.length} jours de séance`);
    all.push(...days);
  }
  const sittingDays = [...new Set(all)].sort();

  mkdirSync('data', { recursive: true });
  writeFileSync(
    OUT_PATH,
    JSON.stringify(
      { source: 'https://www.ourcommons.ca/en/sitting-calendar', scrapedAt: new Date().toISOString(), years, count: sittingDays.length, sittingDays },
      null,
      2
    )
  );
  console.log(`${sittingDays.length} jours de séance (${years.join(', ')}) écrits dans ${OUT_PATH}`);
}

main().catch((err) => {
  console.error('Échec du scraper house-calendar.js :', err);
  process.exitCode = 1;
});
