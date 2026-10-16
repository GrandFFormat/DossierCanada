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
import { detectOmnibus } from './omnibus.js';

const BILLS_PATH = 'data/bills.json';
const CACHE_PATH = 'data/bill-ai-summaries.json';
const MODEL = 'claude-opus-5';
// Version du prompt : entre dans l'empreinte de cache. La bumper force la
// régénération de tous les résumés au prochain rafraîchissement (utile quand on
// change le STYLE du prompt sans changer le modèle).
const PROMPT_VERSION = 'v3-puces7';
const MAX_SOURCE_CHARS = 40000; // ~13k tokens : couvre l'immense majorité des textes
// Un omnibus est résumé depuis son SOMMAIRE OFFICIEL entier (il couvre toutes les
// parties) plutôt que depuis le texte de loi coupé : plafond plus large, jamais atteint
// en pratique (le plus long sommaire de la session fait ~30 000 caractères).
const MAX_OMNIBUS_CHARS = 90000;
// Empreinte de cache des seuls omnibus : la bumper régénère ces résumés-là, sans
// toucher aux 170 autres (PROMPT_VERSION, lui, régénère tout).
const OMNIBUS_VERSION = 'omni-v2-lois';
const REQUEST_DELAY_MS = 400;
const USER_AGENT = 'DossierCanada/0.1 (veille citoyenne; mart.archambault@gmail.com)';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
// Jetons consommés pendant l'exécution (la réflexion compte dans les jetons de sortie).
const USAGE = { input: 0, output: 0, calls: 0 };

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
  // OMNIBUS : le sommaire officiel énumère chaque partie ; le texte de loi complet,
  // lui, dépasse le plafond et se ferait couper — le résumé ne parlerait alors que
  // des deux premières parties, sans que le lecteur puisse le savoir.
  const om = detectOmnibus(bill.summary);
  if (om.isOmnibus) {
    const both = normalize([(bill.summary || {}).fr, (bill.summary || {}).en].filter(Boolean).join('\n\n'));
    if (both) return { source: both.slice(0, MAX_OMNIBUS_CHARS), kind: 'summary', omnibus: om };
  }
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

function hashOf(bill, source, omnibus) {
  const marque = omnibus && omnibus.isOmnibus ? `\n${OMNIBUS_VERSION}:${omnibus.parts.length}` : '';
  return createHash('sha256').update(`${bill.num}\n${MODEL}\n${PROMPT_VERSION}${marque}\n${source}`).digest('hex');
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
  "Langue : le français et l'anglais disent la même chose, mais chacun sonne NATUREL (pas une traduction mot à mot).",
  "",
  "LISIBILITÉ (impératif — le site existe pour ça) :",
  "- Écris pour quelqu'un qui lit au niveau de la fin du primaire / début du secondaire. Phrases de 20 mots au plus. Mots de tous les jours.",
  "- Dis d'abord QUI est touché et CE QUI CHANGE pour cette personne ou cette organisation, puis les chiffres.",
  "- AUCUNE puce de procédure : ne dis pas qui a déposé le projet, quand, ni à quelle étape il est. Ces informations sont déjà affichées sur la page ; les répéter gaspille une puce.",
  "- Remplace le jargon par des mots courants. Exemples à appliquer (FR → mots courants) :",
  "  « gouverneur en conseil » → « le gouvernement (le Cabinet) » ; « promoteur » → « l'entreprise ou l'organisme qui porte le projet » ;",
  "  « projet désigné » → « grand projet qui doit passer une évaluation fédérale » ; « annexe » → « liste officielle » ;",
  "  « édicte la Loi sur X » → « crée une nouvelle loi, la Loi sur X » ; « abroge » → « supprime » ; « disposition » → « règle » ;",
  "  « par règlement » → « par une règle du gouvernement, sans nouveau vote au Parlement » ; « entrée en vigueur » → « s'applique à partir de ».",
  "  « de compétence fédérale » → « encadré par Ottawa (banques, transport aérien, télécoms, etc.) » quand il s'agit de milieux de travail ; « désigné(e) » (ligne, projet, activité) → dis CE QUI le rend désigné, ou omets le mot.",
  "  EN : « federally regulated » → « regulated by Ottawa (banks, airlines, telecoms, etc.) » ; « designated » → say what makes it designated, or drop the word.",
  "  EN : « Governor in Council » → « the federal Cabinet » ; « proponent » → « the company or organization behind the project » ;",
  "  « designated project » → « major project that needs a federal review » ; « schedule » → « official list » ; « enacts » → « creates » ; « repeals » → « removes » ; « provision » → « rule ».",
  "- Un nom de loi ou d'organisme peut rester tel quel, mais la PREMIÈRE fois, dis en quelques mots à quoi il sert (« la Commission canadienne de sûreté nucléaire, qui surveille le nucléaire au Canada »).",
  "- Une seule idée par puce. Si une phrase contient « et » deux fois, coupe-la en deux puces.",
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

async function summarize(client, bill, grounding, maxTokens) {
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

  const om = grounding.omnibus;
  const consigne = om
    ? [
        '',
        `⚠️ PROJET OMNIBUS : ce projet touche plusieurs lois différentes, une par PARTIE (${om.parts.length} parties : ${om.parts.join(', ')}${om.divisions.length ? `, dont ${om.divisions.length} sections` : ''}). Le titre n'en nomme qu'une partie.`,
        'FORMAT PARTICULIER, qui REMPLACE la consigne « 6 à 8 puces » :',
        "- D'abord 1 ou 2 puces d'aperçu : ce que le projet fait dans l'ensemble.",
        `- Ensuite, POUR CHAQUE partie (les ${om.parts.length}, aucune omise, dans l'ordre) : une ligne de titre « ## Partie N — <les lois touchées> » (en anglais « ## Part N — … »), puis 1 à 4 puces sous cette ligne.`,
        "- Dans la ligne de titre, NOMME LA OU LES LOIS que la partie touche, par leur nom officiel (« Loi sur l'évaluation d'impact », « Loi sur les douanes »). Une ou deux lois : les nommer toutes. Trois ou plus : nommer les deux principales, puis « et autres lois ». Une partie qui crée une loi : « nouvelle Loi sur … ». Aucune loi nommée dans le sommaire : donner le sujet de la partie à la place.",
        '- Une ligne de titre commence par « ## » et ne porte PAS de puce.',
        "- Les sections d'une partie se résument DANS les puces de cette partie ; on ne leur fait pas de titre.",
        `- Le résumé doit donc contenir exactement ${om.parts.length} lignes « ## », une par partie.`,
      ].join('\n')
    : '';
  const res = await client.messages.create({
    model: MODEL,
    max_tokens: maxTokens || (om ? 16000 : 6000), // marge LARGE : opus-5 pense (adaptatif) ET écrit le JSON sous
    // le même plafond ; 3000 tronquait parfois le JSON (« réponse non exploitable »).
    thinking: { type: 'adaptive' },
    output_config: { effort: 'medium' },
    system: SYSTEM,
    messages: [{ role: 'user', content: user + consigne }],
  });
  // Compteur de jetons : c'est ce qui se facture. Affiché en fin d'exécution.
  if (res.usage) {
    USAGE.input += res.usage.input_tokens || 0;
    USAGE.output += res.usage.output_tokens || 0;
    USAGE.calls++;
  }
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
  // Régénération CIBLÉE : `AI_ONLY=C-39,C-5 node scrapers/bill-ai-summaries.js` ne
  // traite que ces projets, et les régénère MÊME si le cache est à jour. Sert à
  // essayer une consigne de rédaction sur un projet avant de la payer sur 188.
  // Le résumé est rangé sous l'empreinte courante : la nuit le garde tel quel.
  const ONLY = new Set(String(process.env.AI_ONLY || '').split(',').map((s) => s.trim().toUpperCase()).filter(Boolean));

  for (const [i, bill] of bills.entries()) {
    const id = String(bill.id);
    if (ONLY.size && !ONLY.has(String(bill.num).toUpperCase())) continue;
    try {
      const grounding = await groundingFor(bill);
      if (!grounding) {
        skipped++;
        continue; // ni texte ni sommaire → on ne devine pas
      }
      const hash = hashOf(bill, grounding.source, grounding.omnibus);
      const cached = cache.summaries[id];
      if (!ONLY.size && cached && cached.hash === hash && cached.fr && cached.en) {
        reused++;
        continue; // projet inchangé — aucune requête
      }
      // Une réponse illisible arrive (JSON tronqué par le plafond de jetons, format
      // inattendu) : on réessaie UNE fois avec plus de marge avant de laisser le projet
      // sans résumé en clair — sinon la fiche ne montre que le sommaire officiel brut.
      let out = await summarize(client, bill, grounding);
      const partsRendues = (s) => (String(s || '').match(/^##\s+/gm) || []).length;
      if (out && grounding.omnibus) {
        const attendu = grounding.omnibus.parts.length;
        if (partsRendues(out.fr) !== attendu || partsRendues(out.en) !== attendu) {
          console.warn(`  ↻ ${bill.num} : ${partsRendues(out.fr)}/${partsRendues(out.en)} parties rendues sur ${attendu} — deuxième essai`);
          await sleep(REQUEST_DELAY_MS);
          const retry = await summarize(client, bill, grounding, 20000);
          if (retry && partsRendues(retry.fr) === attendu && partsRendues(retry.en) === attendu) out = retry;
          else if (retry) { out = retry; console.warn(`  ⚠ ${bill.num} : toujours ${partsRendues(retry.fr)}/${attendu} parties — publié tel quel`); }
        }
      }
      if (!out) {
        console.warn(`  ↻ ${bill.num} : réponse inexploitable, 2e essai avec plus de marge`);
        await sleep(REQUEST_DELAY_MS);
        out = await summarize(client, bill, grounding, 12000);
      }
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
  console.log(`  jetons : ${USAGE.calls} appel(s) · entrée ${USAGE.input} · sortie ${USAGE.output} (réflexion comprise)`);
}

main().catch((err) => {
  console.error('Échec de bill-ai-summaries.js :', err);
  process.exitCode = 1;
});
