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

// Contexte (mis à jour le 2026-08-11) : après analyse de leurs journaux, l'IT du
// Parlement confirme qu'il N'Y A PAS de blocage au pare-feu — l'User-Agent honnête
// reçoit normalement des HTTP 200. Les 403 du 2026-08-09 étaient TRANSITOIRES (pic
// de charge de leur site). Recommandation officielle : sur échec / redirection vers
// la page d'erreur, attendre quelques MINUTES et réessayer. On garde donc l'User-
// Agent honnête (il identifie l'outil + un contact) et on espace les réessais.
const HTTP_HEADERS = {
  'User-Agent': USER_AGENT,
  Accept: 'application/json, text/plain, */*',
  'Accept-Language': 'fr-CA,fr;q=0.9,en-CA;q=0.8,en;q=0.7',
};
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
// Barèmes de réessai. La LISTE des projets est critique (1er appel de la chaîne) →
// réessais à l'échelle des minutes, comme recommandé par le Parlement. Les DÉTAILS
// de parrain sont non critiques et déjà tolérés → réessais courts, sinon un pic
// généralisé ferait exploser la durée sur 185 appels.
const RETRY_DELAYS_MS = [30000, 90000, 180000]; // 30 s · 1 min 30 · 3 min
const RETRY_DELAYS_SHORT_MS = [2000, 6000]; // 2 s · 6 s
// Renvoie une réponse OK, ou lève après épuisement des tentatives. Ne réessaie que
// sur les statuts typiquement transitoires (403/408/429/5xx) et les erreurs réseau.
async function fetchWithRetry(url, delays = RETRY_DELAYS_MS) {
  let lastErr;
  for (let attempt = 0; attempt <= delays.length; attempt++) {
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
    if (attempt < delays.length) {
      const delay = delays[attempt];
      console.warn(`  … ${url} : tentative ${attempt + 1}/${delays.length + 1} (${lastErr.message}) — nouvel essai dans ${delay / 1000}s`);
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
  const status = (row.StatusNameEn || '').toLowerCase();
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

// ⚠️ Schéma LEGISinfo mis à jour le 2026-08-15 : plusieurs champs de l'export JSON
// ont été renommés (BillId→Id, BillNumberFormatted→NumberCode, BillTypeEn→
// BillDocumentTypeNameEn, CurrentStatusEn→StatusNameEn, OriginatingChamberId→
// OriginatingChamberOrganizationId), le code de session (ParlSessionCode) et la
// « dernière activité » datée ne sont plus dans la liste, et le parrain a migré
// vers le point d'accès de détail. `id` (= ancien BillId) est PRÉSERVÉ : la clé de
// jointure du projet (résumés IA, votes, campagne challenge) reste intacte.
function buildBill(row) {
  const num = clean(row.NumberCode); // ex. "C-3"
  // Entrée sans numéro (placeholder / donnée incomplète) → pas d'identité ni d'URL
  // utilisable : on l'ignore. Un schéma qui viderait TOUS les numéros est rattrapé
  // par le garde-fou dans main() (on ne publie jamais du vide).
  if (!num) return null;
  const slug = num.toLowerCase(); // ex. "c-3" pour l'URL LEGISinfo
  const session = `${row.ParliamentNumber}-${row.SessionNumber}`; // ex. "45-1"
  const chamber = CHAMBER_BY_ID[row.OriginatingChamberOrganizationId] ?? null;
  const milestones = buildMilestones(row, chamber);
  // La liste ne fournit plus de « dernière activité » datée : on la dérive du
  // dernier jalon franchi (lecture / sanction), en fin de la liste chronologique.
  const lastMilestone = milestones.length ? milestones[milestones.length - 1].date : null;

  return {
    id: row.Id, // = ancien BillId (clé de jointure) — valeurs identiques
    num,
    session,
    parliament: row.ParliamentNumber,
    sessionNumber: row.SessionNumber,
    chamber,
    type: bilingual(row.BillDocumentTypeNameEn, row.BillDocumentTypeNameFr),
    isGovernment: /government/i.test(row.BillDocumentTypeNameEn || ''),
    title: bilingual(row.LongTitleEn, row.LongTitleFr),
    shortTitle: clean(row.ShortTitleEn) || clean(row.ShortTitleFr)
      ? bilingual(row.ShortTitleEn, row.ShortTitleFr)
      : null,
    sponsor: null, // rempli par fetchSponsorDetails (la liste ne le fournit plus)
    status: bilingual(row.StatusNameEn, row.StatusNameFr),
    state: deriveState(row),
    milestones,
    royalAssent: toDate(row.ReceivedRoyalAssentDateTime),
    reinstated: Boolean(row.DidReinstateFromPreviousSession),
    latestActivity: {
      en: clean(row.StatusNameEn),
      fr: clean(row.StatusNameFr),
      date: lastMilestone,
    },
    lastActivity: lastMilestone,
    url: {
      en: `https://www.parl.ca/legisinfo/en/bill/${session}/${slug}`,
      fr: `https://www.parl.ca/legisinfo/fr/projet-de-loi/${session}/${slug}`,
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
      const res = await fetchWithRetry(url, RETRY_DELAYS_SHORT_MS);
      let d = await res.json();
      if (Array.isArray(d)) d = d[0];
      if (!d) throw new Error('détail vide');
      b.sponsorPersonId = d.SponsorPersonId || null;
      const first = clean(d.SponsorPersonOfficialFirstName);
      const last = clean(d.SponsorPersonOfficialLastName);
      b.sponsorName = first || last ? { first: first ?? '', last: last ?? '' } : null;
      // Nom affiché (honorifique + nom) — la liste ne le fournit plus (schéma
      // 2026-08-15), on le prend au détail. Ex. "Sen. Margo Greenwood".
      const dispName = clean(d.SponsorPersonName) || [first, last].filter(Boolean).join(' ');
      if (dispName) {
        const honEn = clean(d.SponsorPersonShortHonorificEn);
        const honFr = clean(d.SponsorPersonShortHonorificFr);
        b.sponsor = {
          en: honEn ? `${honEn} ${dispName}` : dispName,
          fr: honFr ? `${honFr} ${dispName}` : dispName,
        };
      }
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
  const bills = rows.map(buildBill).filter(Boolean);
  const dropped = rows.length - bills.length;
  if (dropped) console.warn(`  ⚠ ${dropped} entrée(s) sans numéro ignorée(s) (LEGISinfo).`);
  // Garde-fou anti-catastrophe : si le schéma LEGISinfo rechange et qu'on n'extrait
  // presque rien, on LÈVE au lieu d'écraser les bonnes données par du vide. La chaîne
  // tolérante (scripts/refresh.js) conserve alors les données de la veille et alerte.
  if (bills.length < 50) {
    throw new Error(
      `Trop peu de projets extraits (${bills.length}/${rows.length}) — schéma LEGISinfo suspect ; on n'écrase pas les données existantes.`,
    );
  }
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
