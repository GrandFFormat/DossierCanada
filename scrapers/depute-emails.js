// Scraper — Courriels officiels des député·e·s (Chambre des communes)
//
// Source : la fiche officielle de chaque député·e sur ourcommons.ca
// (https://www.ourcommons.ca/members/en/{PersonId}), qui expose UN lien mailto:
// avec le courriel parlementaire officiel (@parl.gc.ca). Ni le feed XML du roster
// ni l'export CSV ne contiennent le courriel — il faut visiter chaque fiche
// (~339 requêtes, limitées par un petit pool, une fois par rafraîchissement).
// On LIT le courriel affiché — on ne devine JAMAIS un format d'adresse.
//
// Volontairement PAS de réseaux sociaux (LinkedIn/FB/Instagram) : ils ne sont pas
// listés de façon fiable sur les pages officielles, et les chercher par nom
// risquerait de confondre des homonymes ou de pointer un faux compte. Courriel
// officiel seulement.
//
// Modèle produit (data/depute-emails.json → emails{}) : { "<PersonId>": "prenom.nom@parl.gc.ca", ... }

import { writeFileSync, readFileSync, mkdirSync } from 'node:fs';

const DEPUTES_PATH = 'data/deputes.json';
const OUT_PATH = 'data/depute-emails.json';
const USER_AGENT = 'DossierCanada/0.1 (veille citoyenne; mart.archambault@gmail.com)';

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

async function fetchEmail(id) {
  const url = `https://www.ourcommons.ca/members/en/${id}`;
  const res = await fetch(url, { headers: { 'User-Agent': USER_AGENT, Accept: 'text/html' } });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const html = await res.text();
  // La fiche contient un unique lien mailto: — le courriel parlementaire officiel.
  const m = html.match(/mailto:([^"'?]+@parl\.gc\.ca)/i);
  return m ? m[1].trim().toLowerCase() : null;
}

async function main() {
  const deputes = JSON.parse(readFileSync(DEPUTES_PATH, 'utf8')).deputes;
  const emails = {};
  let missing = 0;
  let failures = 0;

  await mapPool(deputes, 8, async (d, idx) => {
    try {
      const email = await fetchEmail(d.id);
      if (email) emails[d.id] = email;
      else missing++;
    } catch (err) {
      failures++;
    }
    if ((idx + 1) % 50 === 0) console.log(`  … ${idx + 1}/${deputes.length} fiches visitées`);
  });

  mkdirSync('data', { recursive: true });
  writeFileSync(
    OUT_PATH,
    JSON.stringify(
      { source: 'https://www.ourcommons.ca/members/en/{PersonId}', scrapedAt: new Date().toISOString(), count: Object.keys(emails).length, emails },
      null,
      2
    )
  );

  console.log(`${Object.keys(emails).length}/${deputes.length} courriels officiels écrits dans ${OUT_PATH}`);
  if (missing) console.log(`  ⚠ ${missing} fiche(s) sans mailto (aucune adresse devinée)`);
  if (failures) console.log(`  ⚠ ${failures} fiche(s) en échec de téléchargement`);
}

main().catch((err) => {
  console.error('Échec du scraper depute-emails.js :', err);
  process.exitCode = 1;
});
