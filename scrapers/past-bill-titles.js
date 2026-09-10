// Titres des projets de loi des législatures PASSÉES — pour désambiguïser les
// numéros recyclés.
//
// POURQUOI CE FICHIER EXISTE
// Les numéros de projets de loi repartent à C-1 à chaque législature. Le registre
// du lobbying, lui, garde des descriptions rédigées il y a des années : on y lit
// « Bill C-11, Copyright Modernization Act » (41e législature) sur une
// communication déclarée en 2026, alors que le C-11 d'aujourd'hui modernise la
// justice militaire. Aucune règle lexicale ne distingue ces deux « Modernization
// Act » — il FAUT savoir ce qu'était C-11 avant. C'est ce que ce scraper va
// chercher : pour chaque numéro, tous les titres qu'il a portés depuis 2004.
//
// scrapers/lobbying.js compare ensuite : si une description ressemble davantage à
// un ANCIEN projet portant ce numéro qu'à l'actuel, on refuse l'attribution.
//
// À relancer une fois par législature (les titres passés ne changent plus).
// Le résultat est versionné : le parseur mensuel n'a donc jamais besoin du réseau.

import { writeFileSync } from 'node:fs';

const USER_AGENT = 'DossierCanada/1.0 (+https://dossiercanada.ca; site citoyen; contact mart.archambault@gmail.com)';
const OUT_PATH = 'data/past-bill-titles.json';

// Depuis la 38e (2004) : au-delà, plus aucune description du registre actuel n'y
// renvoie, et LEGISinfo se fait avare.
const PARLIAMENTS = [38, 39, 40, 41, 42, 43, 44];
const SESSIONS = [1, 2, 3];
const CURRENT = '45-1'; // exclu : c'est la session en cours, gérée par bills.js

async function fetchSession(session) {
  const url = `https://www.parl.ca/legisinfo/en/bills/json?parlsession=${session}`;
  const res = await fetch(url, {
    headers: { 'User-Agent': USER_AGENT, Accept: 'application/json' },
  });
  if (!res.ok) return null;
  const json = await res.json();
  return Array.isArray(json) ? json : null;
}

function clean(s) {
  return String(s ?? '').replace(/\s+/g, ' ').trim();
}

async function main() {
  const byNumber = new Map();
  let sessions = 0;
  let bills = 0;

  for (const p of PARLIAMENTS) {
    for (const s of SESSIONS) {
      const session = `${p}-${s}`;
      if (session === CURRENT) continue;
      let rows = null;
      try {
        rows = await fetchSession(session);
      } catch (err) {
        console.warn(`  ⚠ ${session} : ${err.message}`);
      }
      if (!rows || !rows.length) continue;
      sessions++;
      for (const r of rows) {
        const num = clean(r.NumberCode).toUpperCase();
        if (!num) continue;
        // Titres longs ET courts, dans les deux langues : une description peut
        // citer n'importe lequel (« Online Streaming Act », « Loi sur la
        // diffusion continue en ligne », ou le titre intégral).
        const titles = [r.ShortTitleEn, r.ShortTitleFr, r.LongTitleEn, r.LongTitleFr]
          .map(clean).filter(Boolean);
        if (!titles.length) continue;
        // UNE entrée par projet passé, pas un sac commun : on comparera une
        // description à chaque ancien projet séparément. Fondre les douze
        // législatures ensemble gonflerait le vocabulaire et finirait par
        // rejeter de vraies attributions sur une coïncidence.
        const list = byNumber.get(num) || new Set();
        list.add(`${session} :: ${[...new Set(titles)].join(' | ')}`);
        byNumber.set(num, list);
        bills++;
      }
      await new Promise((r) => setTimeout(r, 400)); // on ne bouscule pas parl.ca
    }
  }

  if (sessions < 5) throw new Error(`Seulement ${sessions} session(s) récupérée(s) — on ne remplace pas le fichier existant.`);

  // Un tableau par numéro, une entrée par ancien projet. Sert au rapprochement
  // de vocabulaire, jamais à l'affichage.
  const out = {};
  for (const [num, set] of [...byNumber.entries()].sort()) out[num] = [...set];

  writeFileSync(OUT_PATH, JSON.stringify({
    source: 'LEGISinfo — projets de loi des législatures antérieures',
    note: "Sert uniquement à désambiguïser les numéros recyclés dans le registre du lobbying. Aucun affichage.",
    parliaments: PARLIAMENTS,
    scrapedAt: new Date().toISOString(),
    numbers: Object.keys(out).length,
    titles: out,
  }, null, 2));

  console.log(`Titres passés écrits dans ${OUT_PATH}`);
  console.log(`  ${sessions} sessions · ${bills} projets · ${Object.keys(out).length} numéros distincts`);
}

try {
  await main();
} catch (err) {
  console.error('Échec de past-bill-titles.js :', err.message);
  process.exitCode = 1;
}
