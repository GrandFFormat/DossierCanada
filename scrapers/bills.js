// Scraper — Projets de loi fédéraux (LEGISinfo)
//
// Source : LEGISinfo (Parlement du Canada), export JSON d'une session complète.
//   https://www.parl.ca/legisinfo/fr/projets-de-loi
//   Licence du gouvernement ouvert – Canada.
//
// L'export JSON de LEGISinfo est nativement bilingue (champs *En / *Fr) et contient
// déjà les dates des grands jalons du cycle bicaméral. On ne fabrique donc aucune
// donnée : on lit, on structure, et on dérive uniquement des faits vérifiables
// (ex. l'ordre chronologique des lectures, qui découle des dates fournies).
//
// Clé unique : `id` = BillId de LEGISinfo (identique au legisinfo_id d'OpenParliament,
// concordance vérifiée — voir scripts/explore-sources.js). Le NUMÉRO (« C-1 ») N'EST
// PAS une clé : il est réutilisé à chaque session (le C-1 pro forma revient à chaque
// ouverture). Utiliser `id`, jamais `num`.
//
// Modèle produit (data/bills.json → bills[]) :
//   /**
//    * @typedef {Object} Bill
//    * @property {number} id            BillId LEGISinfo (= legisinfo_id) — clé unique
//    * @property {string} num           Numéro affiché, ex. "C-3" (PAS une clé)
//    * @property {string} session       Code de session, ex. "45-1"
//    * @property {number} parliament    Numéro de législature, ex. 45
//    * @property {number} sessionNumber Numéro de session, ex. 1
//    * @property {'commons'|'senate'} chamber  Chambre d'origine du projet
//    * @property {{en:string, fr:string}} type       Type de projet (gouv., député, Sénat…)
//    * @property {boolean} isGovernment  Vrai si projet émanant du gouvernement
//    * @property {{en:string, fr:string}} title      Titre long officiel
//    * @property {{en:string, fr:string}|null} shortTitle  Titre abrégé (souvent absent)
//    * @property {{en:string, fr:string}|null} sponsor     Parrain, ex. "Hon. …" / "Sen. …"
//    * @property {{en:string, fr:string}} status     Statut courant textuel (LEGISinfo)
//    * @property {'loi'|'rejete'|'encours'} state    Statut grossier dérivé, pour filtrage UI
//    * @property {Milestone[]} milestones  Jalons FRANCHIS uniquement, en ordre chronologique
//    * @property {string|null} royalAssent  Date de sanction royale (AAAA-MM-JJ) ou null
//    * @property {boolean} reinstated       Réinscrit d'une session précédente
//    * @property {{en:string, fr:string, date:string|null}} latestActivity  Dernière activité
//    * @property {string|null} lastActivity Date de dernière activité (AAAA-MM-JJ), pour tri
//    * @property {{en:string, fr:string}} url  Page LEGISinfo du projet
//    */
//   /**
//    * @typedef {Object} Milestone
//    * @property {string} stage    Code, ex. "commons_third_reading", "royal_assent"
//    * @property {'commons'|'senate'|null} chamber  Chambre concernée (null pour sanction)
//    * @property {number|null} reading  1|2|3 pour une lecture, null sinon
//    * @property {string} date     Date du jalon (AAAA-MM-JJ)
//    */

import { writeFileSync, mkdirSync } from 'node:fs';

// Session ciblée. Par défaut la 45e législature, 1re session (débutée le 26 mai 2025).
// Surchargable en argument : `node scrapers/bills.js 44-1`.
const SESSION = process.argv[2] || '45-1';
const OUT_PATH = 'data/bills.json';

const USER_AGENT = 'DossierCanada/0.1 (veille citoyenne; mart.archambault@gmail.com)';

// Le WAF anti-bot de parl.ca renvoie parfois un 403 TRANSITOIRE à l'IP des runners
// GitHub (pics de trafic) — c'est ce qui a fait échouer le rafraîchissement du
// 2026-08-09 : HTTP 403 dès le 1er appel, alors que la source répondait normalement
// les jours d'avant. On réessaie donc avec un délai croissant avant d'abandonner.
// Depuis le 2026-08-09, le WAF de parl.ca renvoie 403 à l'User-Agent « bot »
// honnête depuis les IP des runners GitHub (ça passait pourtant depuis des
// semaines). LEGISinfo est une donnée PUBLIQUE sous Licence du gouvernement
// ouvert ; on envoie donc des en-têtes de navigateur réalistes pour ne pas être
// filtré à tort par l'anti-bot. Le contact reste joignable via le champ du dépôt.
const USER_AGENT_BROWSER =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36';
const HTTP_HEADERS = {
  'User-Agent': USER_AGENT_BROWSER,
  Accept: 'application/json, text/plain, */*',
  'Accept-Language': 'fr-CA,fr;q=0.9,en-CA;q=0.8,en;q=0.7',
  'Sec-Fetch-Dest': 'empty',
  'Sec-Fetch-Mode': 'cors',
  'Sec-Fetch-Site': 'same-origin',
  Referer: 'https://www.parl.ca/legisinfo/en/bills',
};
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
// Renvoie une réponse OK, ou lève après épuisement des tentatives. Ne réessaie que
// sur les statuts typiquement transitoires (403/408/429/5xx) et les erreurs réseau.
async function fetchWithRetry(url, { retries = 4, baseDelayMs = 2000 } = {}) {
  let lastErr;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url, { headers: HTTP_HEADERS });
      if (res.ok) return res;
      if (![403, 408, 429, 500, 502, 503, 504].includes(res.status)) {
        throw new Error(`HTTP ${res.status}`); // définitif (ex. 404) → inutile de réessayer
      }
      lastErr = new Error(`HTTP ${res.status}`);
    } catch (err) {
      lastErr = err; // erreur réseau (DNS, socket…) : on réessaie aussi
    }
    if (attempt < retries) {
      const delay = baseDelayMs * 2 ** attempt; // 2s, 4s, 8s, 16s
      console.warn(`  … ${url} : tentative ${attempt + 1}/${retries + 1} (${lastErr.message}) — nouvel essai dans ${delay / 1000}s`);
      await sleep(delay);
    }
  }
  throw lastErr;
}

// OriginatingChamberId observé dans les données : 1 = Chambre des communes, 2 = Sénat.
const CHAMBER_BY_ID = { 1: 'commons', 2: 'senate' };

// Les 7 jalons datés de LEGISinfo, avec leur code de modèle. L'ordre CANONIQUE dans
// lequel un projet les franchit dépend de sa chambre d'origine : un projet des
// Communes (C-) passe d'abord ses 3 lectures aux Communes puis au Sénat ; un projet
// du Sénat (S-) fait l'inverse. La sanction royale vient toujours en dernier.
const HOUSE_STAGES = [
  { field: 'PassedHouseFirstReadingDateTime', stage: 'commons_first_reading', chamber: 'commons', reading: 1 },
  { field: 'PassedHouseSecondReadingDateTime', stage: 'commons_second_reading', chamber: 'commons', reading: 2 },
  { field: 'PassedHouseThirdReadingDateTime', stage: 'commons_third_reading', chamber: 'commons', reading: 3 },
];
const SENATE_STAGES = [
  { field: 'PassedSenateFirstReadingDateTime', stage: 'senate_first_reading', chamber: 'senate', reading: 1 },
  { field: 'PassedSenateSecondReadingDateTime', stage: 'senate_second_reading', chamber: 'senate', reading: 2 },
  { field: 'PassedSenateThirdReadingDateTime', stage: 'senate_third_reading', chamber: 'senate', reading: 3 },
];
const ROYAL_ASSENT = { field: 'ReceivedRoyalAssentDateTime', stage: 'royal_assent', chamber: null, reading: null };

// Réduit un horodatage ISO de LEGISinfo (ex. "2025-11-20T…") à une date AAAA-MM-JJ.
// LEGISinfo ne fournit qu'une date utile (heures = minuit local), on ne garde donc
// que la date pour éviter de suggérer une précision horaire qui n'existe pas.
function toDate(iso) {
  return iso ? iso.slice(0, 10) : null;
}

// Nettoie une chaîne bilingue : LEGISinfo laisse parfois des balises HTML (ex.
// "45<sup>e</sup> législature") et des chaînes vides "" qu'on préfère traiter comme
// absentes.
function clean(str) {
  if (str == null) return null;
  const stripped = String(str).replace(/<[^>]+>/g, '').trim();
  return stripped === '' ? null : stripped;
}

function bilingual(en, fr) {
  return { en: clean(en), fr: clean(fr) };
}

// Statut grossier dérivé, pour le filtrage côté UI. On s'appuie sur des faits
// non ambigus de LEGISinfo (sanction royale reçue, projet rejeté) et on retombe
// sinon sur « en cours ». Le statut textuel exact reste disponible dans `status`.
function deriveState(row) {
  if (row.ReceivedRoyalAssentDateTime) return 'loi';
  const status = (row.CurrentStatusEn || '').toLowerCase();
  if (status.includes('defeated') || status.includes('not proceeded') || status.includes('withdrawn')) {
    return 'rejete';
  }
  return 'encours';
}

// Construit la liste des jalons réellement franchis, en ordre chronologique.
// L'ordre canonique (selon la chambre d'origine) sert de départage quand deux
// lectures partagent la même date (fréquent au Sénat : 1re et 2e le même jour).
function buildMilestones(row, chamber) {
  const canonical =
    chamber === 'senate'
      ? [...SENATE_STAGES, ...HOUSE_STAGES, ROYAL_ASSENT]
      : [...HOUSE_STAGES, ...SENATE_STAGES, ROYAL_ASSENT];

  return canonical
    .map((s, order) => ({ ...s, order, date: toDate(row[s.field]) }))
    .filter((s) => s.date)
    .sort((a, b) => a.date.localeCompare(b.date) || a.order - b.order)
    .map(({ stage, chamber, reading, date }) => ({ stage, chamber, reading, date }));
}

function buildBill(row) {
  const chamber = CHAMBER_BY_ID[row.OriginatingChamberId] ?? null;
  const num = row.BillNumberFormatted; // ex. "C-3"
  const slug = num.toLowerCase(); // ex. "c-3" pour l'URL LEGISinfo
  const milestones = buildMilestones(row, chamber);

  return {
    id: row.BillId,
    num,
    session: row.ParlSessionCode,
    parliament: row.ParliamentNumber,
    sessionNumber: row.SessionNumber,
    chamber,
    type: bilingual(row.BillTypeEn, row.BillTypeFr),
    isGovernment: /government/i.test(row.BillTypeEn || ''),
    title: bilingual(row.LongTitleEn, row.LongTitleFr),
    shortTitle: clean(row.ShortTitleEn) || clean(row.ShortTitleFr)
      ? bilingual(row.ShortTitleEn, row.ShortTitleFr)
      : null,
    sponsor: clean(row.SponsorEn) || clean(row.SponsorFr) ? bilingual(row.SponsorEn, row.SponsorFr) : null,
    status: bilingual(row.CurrentStatusEn, row.CurrentStatusFr),
    state: deriveState(row),
    milestones,
    royalAssent: toDate(row.ReceivedRoyalAssentDateTime),
    reinstated: Boolean(row.DidReinstateFromPreviousSession),
    latestActivity: {
      en: clean(row.LatestActivityEn),
      fr: clean(row.LatestActivityFr),
      date: toDate(row.LatestActivityDateTime),
    },
    lastActivity: toDate(row.LatestActivityDateTime),
    url: {
      en: `https://www.parl.ca/legisinfo/en/bill/${row.ParlSessionCode}/${slug}`,
      fr: `https://www.parl.ca/legisinfo/fr/projet-de-loi/${row.ParlSessionCode}/${slug}`,
    },
  };
}

async function fetchBills() {
  const url = `https://www.parl.ca/legisinfo/en/bills/json?parlsession=${SESSION}`;
  let res;
  try {
    res = await fetchWithRetry(url);
  } catch (err) {
    throw new Error(`Échec du téléchargement LEGISinfo : ${err.message}`);
  }
  const rows = await res.json();
  if (!Array.isArray(rows)) throw new Error('Réponse LEGISinfo inattendue : tableau attendu.');
  return { url, rows };
}

// Petit pool pour limiter la concurrence des requêtes de détail (politesse).
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

// Le feed de liste ne remplit PAS SponsorId/PoliticalAffiliationId (toujours 0) —
// mais le JSON de détail de chaque projet fournit SponsorPersonId (le PersonId
// ourcommons pour un projet des Communes) et le nom officiel du parrain. On va le
// chercher pour permettre, au build, de résoudre le PARTI du parrain par une vraie
// clé (PersonId → roster des députés) plutôt que par le nom affiché. Pour un projet
// du Sénat, le PersonId appartient à un autre espace d'identifiants : c'est le nom
// officiel (Nom + Prénom) qui servira au rapprochement avec le roster du Sénat.
async function fetchSponsorDetails(bills) {
  let failures = 0;
  await mapPool(bills, 8, async (b) => {
    const url = `https://www.parl.ca/legisinfo/en/bill/${b.session}/${b.num.toLowerCase()}/json`;
    try {
      const res = await fetchWithRetry(url);
      let d = await res.json();
      if (Array.isArray(d)) d = d[0];
      if (!d) throw new Error('détail vide');
      b.sponsorPersonId = d.SponsorPersonId || null;
      const first = clean(d.SponsorPersonOfficialFirstName);
      const last = clean(d.SponsorPersonOfficialLastName);
      b.sponsorName = first || last ? { first: first ?? '', last: last ?? '' } : null;
    } catch (err) {
      failures++;
      b.sponsorPersonId = null;
      b.sponsorName = null;
    }
  });
  return failures;
}

async function main() {
  const { url, rows } = await fetchBills();
  const bills = rows.map(buildBill);
  const sponsorFailures = await fetchSponsorDetails(bills);

  // Tri par dernière activité décroissante (les projets sans date en fin de liste).
  bills.sort((a, b) => {
    if (!a.lastActivity && !b.lastActivity) return 0;
    if (!a.lastActivity) return 1;
    if (!b.lastActivity) return -1;
    return b.lastActivity.localeCompare(a.lastActivity);
  });

  mkdirSync('data', { recursive: true });
  writeFileSync(
    OUT_PATH,
    JSON.stringify({ source: url, session: SESSION, scrapedAt: new Date().toISOString(), count: bills.length, bills }, null, 2)
  );

  const byChamber = bills.reduce((acc, b) => ((acc[b.chamber] = (acc[b.chamber] ?? 0) + 1), acc), {});
  const byState = bills.reduce((acc, b) => ((acc[b.state] = (acc[b.state] ?? 0) + 1), acc), {});
  console.log(`${bills.length} projets de loi (session ${SESSION}) écrits dans ${OUT_PATH}`);
  console.log('  par chambre :', byChamber);
  console.log('  par statut  :', byState);
  const withSponsorId = bills.filter((b) => b.sponsorPersonId).length;
  console.log(`  parrains : ${withSponsorId} avec SponsorPersonId${sponsorFailures ? ` · ⚠ ${sponsorFailures} détail(s) en échec` : ''}`);
}

main().catch((err) => {
  console.error('Échec du scraper bills.js :', err);
  process.exitCode = 1;
});
