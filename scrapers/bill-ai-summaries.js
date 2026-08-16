// Enrichissement — Résumé « langage clair » des projets de loi, généré par IA
//
// Les sommaires OFFICIELS (bill-summaries.js) sont honnêtes mais souvent illisibles
// pour le grand public : soit une clause juridique d'une ligne (« Le texte abroge la
// Loi de clarification. »), soit un pavé de dizaines de pages. Comme sur DossierQuébec,
// on génère ici un résumé en langage clair, EN FRANÇAIS ET EN ANGLAIS, ancré
// STRICTEMENT dans le TEXTE OFFICIEL du projet de loi (première lecture, parl.ca).
//
// Garde-fous d'honnêteté :
//   • Rien n'est inventé : le modèle résume uniquement le texte officiel fourni ;
//     s'il n'y a pas de source, aucun résumé n'est produit (aiSummary reste null).
//   • Jamais de jugement ni de recommandation sur le projet ou sur des personnes.
//   • Chaque fiche garde le lien vers le texte officiel + l'étiquette « généré par IA ».
//   • Le résultat est mis en cache par empreinte de la source : un projet inchangé
//     n'est jamais re-généré (coût quasi nul au rafraîchissement quotidien).
//
// Modèle : Claude Opus 5 (claude-opus-5), pensée adaptative, via @anthropic-ai/sdk.
// Résumé en FORMAT À PUCES (phrase d'intro + 3-4 puces) pour la lisibilité.
// Clé : process.env.ANTHROPIC_API_KEY (jamais dans le code). En local, on lit aussi
// un fichier api.env (git-ignoré). SANS clé, le script n'échoue PAS : il conserve le
// cache existant et sort proprement — le build quotidien ne casse jamais.

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import * as cheerio from 'cheerio';
import Anthropic from '@anthropic-ai/sdk';

const BILLS_PATH = 'data/bills.json';
const CACHE_PATH = 'data/bill-ai-summaries.json';
const MODEL = 'claude-opus-5';
// Version du prompt : entre dans l'empreinte de cache. La bumper force la
// régénération de tous les résumés au prochain rafraîchissement (utile quand on
// change le STYLE du prompt sans changer le modèle).
const PROMPT_VERSION = 'v3-puces7';
const MAX_SOURCE_CHARS = 40000; // ~13k tokens : couvre l'immense majorité des textes
const REQUEST_DELAY_MS = 400;
const USER_AGENT = 'DossierCanada/0.1 (veille citoyenne; mart.archambault@gmail.com)';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ---- Petit chargeur d'env local (api.env, git-ignoré). Vercel/GitHub injectent
// déjà les variables ; ceci ne sert qu'au lancement manuel sur la machine. ----
function loadLocalEnv() {
  for (const file of ['api.env', '.env']) {
    if (!existsSync(file)) continue;
    for (const line of readFileSync(file, 'utf-8').split('\n')) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
    }
  }
}

function normalize(text) {
  return String(text || '')
    .replace(/\r/g, '')
    .split('\n')
    .map((l) => l.replace(/[ \t]+/g, ' ').trim())
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

// Texte lisible de la page (on retire le chrome : scripts, styles, nav, etc.).
function htmlToText(html) {
  const $ = cheerio.load(html);
  $('script, style, noscript, nav, header, footer').remove();
  return normalize($('body').text());
}

async function fetchText(url) {
  try {
    const res = await fetch(url, { headers: { 'User-Agent': USER_AGENT } });
    if (!res.ok) return null;
    return res.text();
  } catch {
    return null;
  }
}

// Meilleure source d'ancrage disponible : le TEXTE de première lecture (complet),
// sinon le sommaire officiel déjà présent dans bills.json. Jamais rien d'inventé.
async function groundingFor(bill) {
  const enHtml = await fetchText(
    `https://www.parl.ca/DocumentViewer/en/${bill.session}/bill/${bill.num}/first-reading`,
  );
  const fullText = enHtml ? htmlToText(enHtml) : null;
  if (fullText && fullText.length > 400) {
    return { source: fullText.slice(0, MAX_SOURCE_CHARS), kind: 'text' };
  }
  const off = bill.summary || {};
  const fallback = normalize([off.en, off.fr].filter(Boolean).join('\n\n'));
  if (fallback) return { source: fallback.slice(0, MAX_SOURCE_CHARS), kind: 'summary' };
  return null;
}

function hashOf(bill, source) {
  return createHash('sha256').update(`${bill.num}\n${MODEL}\n${PROMPT_VERSION}\n${source}`).digest('hex');
}

const SYSTEM = [
  "Tu écris pour DossierCanada, un site citoyen non partisan de transparence parlementaire.",
  "Lectorat : une personne curieuse, SANS formation juridique, qui veut comprendre vite ce qu'un projet de loi change.",
  "Résume le projet de loi fédéral fourni, en français ET en anglais, STRICTEMENT et UNIQUEMENT d'après le texte officiel fourni.",
  "",
  "FORMAT (impératif — c'est ce qui rend le résumé facile à lire) :",
  "- UNIQUEMENT une liste de puces. PAS de phrase d'introduction, PAS de conclusion, PAS de titre.",
  "- Vise 6 à 8 puces (idéalement 7). CHAQUE puce commence par « - » et tient en UNE phrase courte et simple.",
  "- Commence chaque puce par un verbe d'action quand c'est naturel : Oblige, Crée, Modifie, Fixe, Fait passer, Supprime, Interdit, Permet, Exige…",
  "- Une seule idée concrète par puce : ce que le projet change · qui est touché · les chiffres clés (montants, seuils, dates) · organismes ou comités créés · échéances · entrée en vigueur.",
  "- Factuel et précis. Pas de remplissage, pas de puce vague ou générique.",
  "",
  "Langue : le français et l'anglais disent la même chose, mais chacun sonne NATUREL (pas une traduction mot à mot). Zéro jargon juridique inutile ; si un terme technique est indispensable, explique-le en quelques mots.",
  "",
  "Honnêteté (impératif) :",
  "- N'invente RIEN. Si une information n'est pas dans le texte fourni, ne la mentionne pas.",
  "- Ton neutre et factuel. JAMAIS de jugement, d'opinion ni de recommandation, sur le projet comme sur des personnes.",
  "- Ne dis pas que tu es une IA et ne parle pas de « ce texte » ou « ce résumé » ; va droit au contenu.",
  'Réponds UNIQUEMENT avec un objet JSON valide, sans texte autour : {"fr": "...", "en": "..."}, où chaque valeur est la liste des puces (chaque puce sur sa propre ligne, commençant par « - », séparées par des sauts de ligne \\n).',
].join('\n');

function extractJson(text) {
  if (!text) return null;
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const raw = fenced ? fenced[1] : text;
  const start = raw.indexOf('{');
  const end = raw.lastIndexOf('}');
  if (start === -1 || end === -1 || end <= start) return null;
  try {
    const obj = JSON.parse(raw.slice(start, end + 1));
    const fr = typeof obj.fr === 'string' ? obj.fr.trim() : null;
    const en = typeof obj.en === 'string' ? obj.en.trim() : null;
    return fr && en ? { fr, en } : null;
  } catch {
    return null;
  }
}

async function summarize(client, bill, grounding) {
  const off = bill.summary || {};
  const user = [
    `PROJET DE LOI : ${bill.num}`,
    `TITRE (FR) : ${(bill.title && bill.title.fr) || '—'}`,
    `TITRE (EN) : ${(bill.title && bill.title.en) || '—'}`,
    `TYPE : ${(bill.type && bill.type.fr) || '—'}`,
    off.fr ? `SOMMAIRE OFFICIEL (FR, repère) :\n${off.fr}` : '',
    '',
    grounding.kind === 'text' ? 'TEXTE OFFICIEL DU PROJET (première lecture) :' : 'SOMMAIRE OFFICIEL :',
    grounding.source,
  ]
    .filter(Boolean)
    .join('\n');

  const res = await client.messages.create({
    model: MODEL,
    max_tokens: 6000, // marge LARGE : opus-5 pense (adaptatif) ET écrit le JSON sous
    // le même plafond ; 3000 tronquait parfois le JSON (« réponse non exploitable »).
    thinking: { type: 'adaptive' },
    output_config: { effort: 'medium' },
    system: SYSTEM,
    messages: [{ role: 'user', content: user }],
  });
  const text = (res.content || [])
    .filter((b) => b.type === 'text')
    .map((b) => b.text)
    .join('');
  return extractJson(text);
}

async function main() {
  loadLocalEnv();

  const cache = existsSync(CACHE_PATH)
    ? JSON.parse(readFileSync(CACHE_PATH, 'utf-8'))
    : { model: MODEL, generatedAt: null, summaries: {} };
  cache.summaries = cache.summaries || {};

  if (!process.env.ANTHROPIC_API_KEY) {
    console.warn('⚠ ANTHROPIC_API_KEY absente — génération IA sautée, cache existant conservé.');
    if (!existsSync(CACHE_PATH)) writeFileSync(CACHE_PATH, JSON.stringify(cache, null, 2));
    return; // sortie propre : le build quotidien ne casse pas
  }

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY, maxRetries: 4 });
  const { bills } = JSON.parse(readFileSync(BILLS_PATH, 'utf-8'));

  let generated = 0;
  let reused = 0;
  let skipped = 0;
  let errors = 0;
  // Génération par LOTS : `AI_BATCH=30 node scrapers/bill-ai-summaries.js` génère au
  // plus 30 résumés puis s'arrête proprement et sauvegarde. Les projets restants
  // seront faits au(x) lancement(s) suivant(s) — le cache saute ceux déjà générés.
  // Sans la variable (ex. le cron quotidien), tout est généré d'un coup, comme avant.
  const BATCH_LIMIT = Number(process.env.AI_BATCH) > 0 ? Number(process.env.AI_BATCH) : Infinity;

  for (const [i, bill] of bills.entries()) {
    const id = String(bill.id);
    try {
      const grounding = await groundingFor(bill);
      if (!grounding) {
        skipped++;
        continue; // ni texte ni sommaire → on ne devine pas
      }
      const hash = hashOf(bill, grounding.source);
      const cached = cache.summaries[id];
      if (cached && cached.hash === hash && cached.fr && cached.en) {
        reused++;
        continue; // projet inchangé — aucune requête
      }
      const out = await summarize(client, bill, grounding);
      if (out) {
        cache.summaries[id] = { num: bill.num, hash, fr: out.fr, en: out.en, at: new Date().toISOString() };
        generated++;
      } else {
        errors++;
        console.error(`  ⚠ ${bill.num} : réponse IA non exploitable`);
      }
      await sleep(REQUEST_DELAY_MS);
      if (generated >= BATCH_LIMIT) {
        console.log(`  ⏸ Lot de ${BATCH_LIMIT} atteint — arrêt propre ; le reste au prochain lancement.`);
        break;
      }
    } catch (err) {
      errors++;
      console.error(`  ⚠ ${bill.num} : ${err.message}`);
    }
    if ((i + 1) % 10 === 0) {
      console.log(`  … ${i + 1}/${bills.length} · générés ${generated} · réutilisés ${reused}`);
      cache.generatedAt = new Date().toISOString();
      writeFileSync(CACHE_PATH, JSON.stringify(cache, null, 2)); // sauvegarde incrémentale
    }
  }

  cache.model = MODEL;
  cache.generatedAt = new Date().toISOString();
  writeFileSync(CACHE_PATH, JSON.stringify(cache, null, 2));

  console.log(`Résumés IA écrits dans ${CACHE_PATH}`);
  console.log(`  générés : ${generated} · réutilisés (cache) : ${reused} · sans source : ${skipped} · erreurs : ${errors}`);
  console.log(`  couverture : ${Object.keys(cache.summaries).length} / ${bills.length}`);
}

main().catch((err) => {
  console.error('Échec de bill-ai-summaries.js :', err);
  process.exitCode = 1;
});
