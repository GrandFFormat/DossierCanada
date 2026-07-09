// Scraper — Titulaires de charges à forte rotation (Président des Communes,
// gouverneur·e général·e). Ces deux-là changent à chaque élection / nomination
// (~tous les 5 ans pour la Couronne), depuis des sources officielles STABLES.
//
// Philosophie « filet de sécurité » : le frontend garde des noms vérifiés codés
// en dur (voir lexiconPeople dans index.html). Ce scraper ne fait que PRODUIRE un
// nom quand il l'extrait ET qu'il passe une validation stricte de format (2-4 mots,
// nom propre). Au build, un nom validé REMPLACE le nom codé en dur ; sinon le nom
// codé en dur (vérifié à la main) est conservé. On ne publie donc JAMAIS de valeur
// douteuse — au pire, on reste sur le dernier nom vérifié.
//
// Les autres titulaires (agents du Parlement : VG, DGE, éthique, lobbying, langues,
// vie privée, information, DPB) sont sur ~8 sites disparates aux structures
// instables (et lobbycanada.gc.ca bloque tout accès automatisé). Leurs mandats
// durent ~7 ans ; ils restent codés en dur (vérifiés) plutôt que scrapés de façon
// fragile. On pourra en ajouter ici si une source stable se présente.
//
// Modèle produit (data/officeholders.json) : { "<key>": "Prénom Nom", ... }

import { writeFileSync, mkdirSync } from 'node:fs';
import * as cheerio from 'cheerio';

const USER_AGENT = 'DossierCanada/0.1 (veille citoyenne; mart.archambault@gmail.com)';
const OUT_PATH = 'data/officeholders.json';

// Un nom de personne plausible : 2 à 5 mots, chaque mot en capitale initiale
// (accents permis), aucune ponctuation suspecte ni chiffre. Rejette les titres,
// slogans et fragments de navigation.
function looksLikeName(s) {
  if (!s) return false;
  s = s.replace(/\s+/g, ' ').trim();
  if (s.length < 5 || s.length > 45) return false;
  if (/[0-9@:/|]/.test(s)) return false;
  const words = s.split(' ');
  if (words.length < 2 || words.length > 5) return false;
  return /^[A-ZÀ-Ý][A-Za-zÀ-ÿ.'’-]*(\s+[A-Za-zÀ-ÿ.'’-]+){1,4}$/.test(s);
}

const stripHonorific = (s) =>
  (s || '')
    .replace(/^(the\s+)?(rt\.?\s+)?hon(ou?rable|\.)?\s+/i, '')
    .replace(/^l['’]honorable\s+/i, '')
    .replace(/\s+/g, ' ')
    .trim();

async function fetchDoc(url) {
  const res = await fetch(url, { headers: { 'User-Agent': USER_AGENT, Accept: 'text/html' } });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return cheerio.load(await res.text());
}

// Chaque source : sa page officielle + une fonction d'extraction ciblée. L'extraction
// peut renvoyer null ; la validation finale (looksLikeName) tranche.
const SOURCES = [
  {
    key: 'house_speaker',
    label: 'Président·e de la Chambre des communes',
    url: 'https://www.ourcommons.ca/speaker/en',
    extract: ($) => stripHonorific($('h2').first().text()),
  },
  {
    key: 'governor_general',
    label: 'Gouverneur·e général·e',
    url: 'https://www.gg.ca/en/governor-general',
    extract: ($) => {
      const cands = $('h2, h1, title')
        .map((_, e) => $(e).text().replace(/\s+/g, ' ').trim())
        .get()
        .filter((t) => /governor general/i.test(t) && t.length < 60);
      for (const t of cands) {
        const name = t.replace(/.*governor general\s*/i, '').replace(/\bof canada\b/i, '').trim();
        if (looksLikeName(name)) return name;
      }
      return null;
    },
  },
];

async function main() {
  const out = {};
  const failed = [];
  for (const s of SOURCES) {
    try {
      const $ = await fetchDoc(s.url);
      const name = s.extract($);
      if (looksLikeName(name)) {
        out[s.key] = name;
        console.log(`  ✓ ${s.key} : ${name}`);
      } else {
        failed.push(`${s.key} (extraction non valide : ${JSON.stringify(name)})`);
      }
    } catch (err) {
      failed.push(`${s.key} (${err.message})`);
    }
  }

  mkdirSync('data', { recursive: true });
  writeFileSync(
    OUT_PATH,
    JSON.stringify({ scrapedAt: new Date().toISOString(), sources: SOURCES.map((s) => ({ key: s.key, url: s.url })), officeholders: out }, null, 2)
  );

  console.log(`${Object.keys(out).length}/${SOURCES.length} titulaires écrits dans ${OUT_PATH}`);
  if (failed.length) console.log(`  ⚠ non résolus (le nom codé en dur sera conservé) : ${failed.join(' ; ')}`);
}

main().catch((err) => {
  console.error('Échec du scraper officeholders.js :', err);
  process.exitCode = 1;
});
