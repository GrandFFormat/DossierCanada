// Scraper — Conseil des ministres fédéral (cabinet)
//
// Source : la page officielle du Cabinet sur le site du premier ministre,
//   https://www.pm.gc.ca/en/cabinet  et  https://www.pm.gc.ca/fr/cabinet
//   HTML server-rendu (pas de JS ni de reCAPTCHA), bilingue via /en et /fr.
//   (Contrairement à petitions.ourcommons.ca, dont l'export est protégé par
//    reCAPTCHA — écarté volontairement, comme le registre des lobbyistes QC.)
//
// Chaque fiche `.minister-teaser` donne le nom et le portefeuille (`.role`). On
// rapproche ensuite chaque ministre de data/deputes.json PAR NOM NORMALISÉ pour
// récupérer son parti, son PersonId et son lien officiel — sans jamais deviner :
// si le rapprochement échoue (ex. un·e sénateur·rice ministre, ou une graphie
// différente), les champs liés restent à null plutôt que d'inventer.
//
// Modèle produit (data/ministers.json → ministers[]) :
//   { name, role:{en,fr}, isPM, party|null, personId|null, url:{en,fr}|null }

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import * as cheerio from 'cheerio';

const URL_EN = 'https://www.pm.gc.ca/en/cabinet';
const URL_FR = 'https://www.pm.gc.ca/fr/cabinet';
const DEPUTES_PATH = 'data/deputes.json';
const OUT_PATH = 'data/ministers.json';
const USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0 Safari/537.36';

// Enlève le préfixe honorifique pour ne garder que le nom (clé de rapprochement).
function stripHonorific(raw) {
  return raw
    .replace(/^\s*The\s+(Right\s+)?Honou?rable\s+/i, '')
    .replace(/^\s*(Le\s+très\s+honorable|La\s+très\s+honorable|L['’]honorable)\s+/i, '')
    .trim();
}

// Même normalisation que le front (norm) : insensible aux accents, casse, tirets.
function fold(s) {
  return String(s ?? '')
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .toLowerCase().replace(/[-–—'’]/g, ' ').replace(/\s+/g, ' ').trim();
}

async function fetchCabinet(url) {
  const res = await fetch(url, { headers: { 'User-Agent': USER_AGENT } });
  if (!res.ok) throw new Error(`HTTP ${res.status} pour ${url}`);
  const $ = cheerio.load(await res.text());
  const out = [];
  $('.minister-teaser').each((_, el) => {
    const name = $(el).find('.name').text().replace(/\s+/g, ' ').trim();
    const role = $(el).find('.role').text().replace(/\s+/g, ' ').trim();
    if (name) out.push({ rawName: name, name: stripHonorific(name), role });
  });
  return out;
}

async function main() {
  const [en, fr] = await Promise.all([fetchCabinet(URL_EN), fetchCabinet(URL_FR)]);

  // Rôle FR par nom normalisé (les deux pages listent les mêmes personnes).
  const roleFrByName = new Map(fr.map((m) => [fold(m.name), m.role]));

  // Roster pour le rapprochement parti / PersonId / lien.
  const deputes = JSON.parse(readFileSync(DEPUTES_PATH, 'utf-8')).deputes;
  const depByName = new Map(deputes.map((d) => [fold(d.name), d]));

  // Repli robuste par (prénom, nom) : pm.gc.ca inclut parfois un second prénom
  // (« David J. McGuinty ») absent du roster (« David McGuinty »). On indexe par
  // prénom+nom officiels et on n'apparie QUE si la clé est unique — sinon on
  // refuse de deviner (deux homonymes possibles).
  const byFirstLast = new Map();
  const ambiguous = new Set();
  for (const d of deputes) {
    const key = fold(d.firstName) + '|' + fold(d.lastName);
    if (byFirstLast.has(key)) ambiguous.add(key);
    else byFirstLast.set(key, d);
  }
  const matchByFirstLast = (name) => {
    const toks = name.split(/\s+/);
    if (toks.length < 2) return null;
    const key = fold(toks[0]) + '|' + fold(toks[toks.length - 1]);
    return ambiguous.has(key) ? null : byFirstLast.get(key) || null;
  };

  const unmatched = [];
  const ministers = en.map((m) => {
    const dep = depByName.get(fold(m.name)) || matchByFirstLast(m.name);
    if (!dep) unmatched.push(m.name);
    return {
      name: m.name,
      role: { en: m.role, fr: roleFrByName.get(fold(m.name)) ?? null },
      isPM: /^prime minister|^premier ministre/i.test(m.role),
      party: dep ? dep.party.code : null,
      personId: dep ? dep.id : null,
      url: dep ? dep.url : null,
    };
  });

  mkdirSync('data', { recursive: true });
  writeFileSync(
    OUT_PATH,
    JSON.stringify(
      { source: { en: URL_EN, fr: URL_FR }, scrapedAt: new Date().toISOString(), count: ministers.length, ministers },
      null,
      2
    )
  );

  const matched = ministers.filter((m) => m.personId).length;
  console.log(`${ministers.length} ministres écrits dans ${OUT_PATH}`);
  console.log(`  rapprochés au roster (parti/PersonId) : ${matched} · non rapprochés : ${ministers.length - matched}`);
  if (unmatched.length) console.log(`  ⚠ sans correspondance député : ${unmatched.join(', ')}`);
}

main().catch((err) => {
  console.error('Échec du scraper ministers.js :', err);
  process.exitCode = 1;
});
