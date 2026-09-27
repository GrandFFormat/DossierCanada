// Fusion — Assemble bills + deputes + votes en un jeu prêt pour le frontend
//
// Lit les trois fichiers produits par les scrapers (chacun tape UNE source) et
// résout les jointures entre eux, une bonne fois, dans data/frontend.json :
//   - vote  → projet de loi : (session, billNumber) → id stable de bills.json
//   - projet → ses scrutins  : liste des divisions rattachées, avec résultat
//   - député → son bilan de votes : participation depuis son entrée en fonction
//
// On ne fabrique aucune donnée : on relie et on agrège des faits déjà vérifiés.
// Le rattachement se fait par des clés sûres (id de projet, PersonId de député,
// couple session+numéro de scrutin) — jamais par le nom ni par un numéro seul.
//
// Il écrit data/frontend.json, puis injecte les données du site dans
// data/site-data.js (blocs « const X = … » entre marqueurs) : un seul fichier
// partagé et mis en cache par toutes les pages, au lieu d'1,7 Mo recopié dans
// chaque page HTML. index.html le charge en <script> classique avant son script.
// Le sitemap, lui, est écrit par scripts/build-section-pages.js (liste des pages).

import { readFileSync, writeFileSync, existsSync, statSync, mkdirSync, readdirSync, rmSync } from 'node:fs';
import { detectOmnibus } from './omnibus.js';

// Listes nominatives (qui a voté quoi) : un fichier PAR VOTE, chargé au clic.
// Recopiées dans site-data.js, elles pesaient 1 Mo téléchargé sur chaque page
// pour un détail que presque personne n'ouvre. Ne restent partagés que les
// décomptes par parti / par groupe, eux nécessaires à l'affichage de la carte.
const BALLOTS_DIR = 'data/votes';
const ballotFiles = new Set();
const ballotPrefixes = new Set(); // « c- » (Communes), « s- » (Sénat)
function writeBallots(key, names) {
  ballotPrefixes.add(key.slice(0, 2));
  mkdirSync(BALLOTS_DIR, { recursive: true });
  const byName = (a, b) => a.n.localeCompare(b.n, 'fr');
  for (const g of ['yea', 'nay', 'third']) names[g].sort(byName);
  writeFileSync(`${BALLOTS_DIR}/${key}.json`, JSON.stringify(names), 'utf-8');
  ballotFiles.add(key + '.json');
}
/* Adresses officielles : celles de LEGISinfo et de la Chambre se déduisent de
   l'identifiant et de la session. Les recopier coûtait 76 Ko sur chaque page.
   On ne les retire QUE si la déduction redonne EXACTEMENT l'adresse publiée ;
   sinon l'adresse reste dans la donnée et c'est elle qui sert. */
const sameUrl = (u, d) => u && d && u.fr === d.fr && u.en === d.en;
const derivedBillUrl = (num, session) => ({
  en: `https://www.parl.ca/legisinfo/en/bill/${session}/${String(num).toLowerCase()}`,
  fr: `https://www.parl.ca/legisinfo/fr/projet-de-loi/${session}/${String(num).toLowerCase()}`,
});
const derivedMemberUrl = (id) => ({
  en: `https://www.ourcommons.ca/members/en/${id}`,
  fr: `https://www.ourcommons.ca/members/fr/${id}`,
});
const derivedVoteUrl = (number, session) => {
  const [parl, sess] = String(session || '').split('-');
  return {
    en: `https://www.ourcommons.ca/members/en/votes/${parl}/${sess}/${number}`,
    fr: `https://www.ourcommons.ca/members/fr/votes/${parl}/${sess}/${number}`,
  };
};
const derivedSenatorUrl = (slug) => ({
  en: `https://sencanada.ca/en/senators/${slug}/`,
  fr: `https://sencanada.ca/fr/senateurs/${slug}/`,
});
let urlsKept = 0;

/* ÉTIQUETTES RÉPÉTÉES — « Projet de loi émanant d'un député », les partis, les
   provinces : les mêmes objets bilingues recopiés 187 ou 337 fois. On les sort
   dans un dictionnaire et la donnée ne garde qu'un rang. Le site les remet en
   place au chargement (voir « rehydrate » dans assets/app.js), donc AUCUN code
   d'affichage ne change : la différence n'existe que sur le fil. */
/* DONNÉES PAR ONGLET — le noyau (data/site-data.js) est chargé par toutes les
   pages ; ces trois fichiers ne le sont qu'à l'ouverture de l'onglet qui les
   affiche. Ils REMPLISSENT les contenants déclarés vides par le noyau (même
   identité d'objet), donc le code d'affichage n'a rien à savoir de tout ça. */
const VIEW_DATA_FILES = {
  bills: 'data/d-bills.js',
  people: 'data/d-people.js',
  votes: 'data/d-votes.js',
};
const viewData = { bills: {}, people: {}, votes: {} };
function writeViewData(stamp) {
  const out = [];
  for (const [name, path] of Object.entries(VIEW_DATA_FILES)) {
    const sets = viewData[name];
    // Une chambre non régénérée ne doit pas effacer ce que le fichier contient :
    // on ne réécrit le fichier que si on a bien de quoi le remplir.
    if (!Object.keys(sets).length) continue;
    const body = Object.entries(sets).map(([varName, data]) => (Array.isArray(data)
      ? `${varName}.push(...${JSON.stringify(data)});`
      : `Object.assign(${varName}, ${JSON.stringify(data)});`)).join('\n');
    writeFileSync(path, [
      `// DossierCanada — données de l'onglet « ${name} ». Fichier GÉNÉRÉ par`,
      '// scrapers/build-frontend-data.js ; ne pas éditer à la main.',
      '// Chargé par le site quand on ouvre l\'onglet, PAS sur les autres pages.',
      `// Généré le ${stamp}`,
      body,
      '',
    ].join('\n'), 'utf-8');
    out.push(`${path} ${(statSync(path).size / 1024).toFixed(0)} Ko`);
  }
  return out;
}

const DICTS = {};
function dictify(rows, field, name) {
  const values = (DICTS[name] = DICTS[name] || []);
  const index = new Map(values.map((v, i) => [JSON.stringify(v), i]));
  for (const r of rows) {
    if (r[field] == null) { r[field] = null; continue; }
    const k = JSON.stringify(r[field]);
    if (!index.has(k)) { index.set(k, values.length); values.push(r[field]); }
    r[field] = index.get(k);
  }
}
// Renvoie l'adresse à garder en donnée : rien si elle se déduit, sinon l'adresse.
function keepUrl(url, derived) {
  if (sameUrl(url, derived)) return undefined;
  urlsKept++;
  return url;
}

// Un vote retiré de la source ne doit pas laisser son fichier derrière. On ne
// nettoie que les chambres effectivement régénérées (le Sénat peut manquer).
function pruneBallots() {
  if (!existsSync(BALLOTS_DIR)) return 0;
  let n = 0;
  for (const f of readdirSync(BALLOTS_DIR))
    if (ballotPrefixes.has(f.slice(0, 2)) && !ballotFiles.has(f)) { rmSync(`${BALLOTS_DIR}/${f}`); n++; }
  return n;
}

const BILLS_PATH = 'data/bills.json';
const DEPUTES_PATH = 'data/deputes.json';
const VOTES_PATH = 'data/votes.json';
const OUT_PATH = 'data/frontend.json';
const HTML_PATH = 'data/site-data.js';
const START_MARKER = '/* BILLS_DATA_START';
const END_MARKER = '/* BILLS_DATA_END */';
const DEP_START_MARKER = '/* DEPUTES_DATA_START';
const DEP_END_MARKER = '/* DEPUTES_DATA_END */';
const VOTES_START_MARKER = '/* VOTES_DATA_START';
const VOTES_END_MARKER = '/* VOTES_DATA_END */';
const COUNTS_START_MARKER = '/* COUNTS_DATA_START';
const COUNTS_END_MARKER = '/* COUNTS_DATA_END */';
const DICT_START_MARKER = '/* DICTS_DATA_START';
const DICT_END_MARKER = '/* DICTS_DATA_END */';
const SESSION_START_MARKER = '/* SESSION_DATA_START';
const SESSION_END_MARKER = '/* SESSION_DATA_END */';
const MIN_START_MARKER = '/* MINISTERS_DATA_START';
const MIN_END_MARKER = '/* MINISTERS_DATA_END */';
const MINISTERS_PATH = 'data/ministers.json';
const PET_START_MARKER = '/* PETITIONS_DATA_START';
const PET_END_MARKER = '/* PETITIONS_DATA_END */';
const PETITIONS_PATH = 'data/petitions.json';
const SENATORS_PATH = 'data/senators.json';
const SENATE_VOTES_PATH = 'data/senate-votes.json';
const CALENDAR_PATH = 'data/house-calendar.json';
const SIT_START_MARKER = '/* SITTINGS_DATA_START';
const SIT_END_MARKER = '/* SITTINGS_DATA_END */';
const SEN_START_MARKER = '/* SENATORS_DATA_START';
const SEN_END_MARKER = '/* SENATORS_DATA_END */';
const SENVOTES_START_MARKER = '/* SENATE_VOTES_DATA_START';
const SENVOTES_END_MARKER = '/* SENATE_VOTES_DATA_END */';

// Clé de rapprochement d'un nom de sénateur·rice : minuscule, sans accents ni
// ponctuation. "Ringuette, Pierrette" et lastName+firstName du roster convergent
// vers la même chaîne, ce qui permet la jointure bulletin → fiche par le nom
// (le Sénat n'expose pas d'identifiant stable comme le PersonId des Communes).
function normName(s) {
  return (s || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[^a-z]/g, '');
}

function read(path) {
  return JSON.parse(readFileSync(path, 'utf-8'));
}

// Remplace le contenu entre deux marqueurs par `const <varName> = <data>;`.
// Cible : data/site-data.js (script classique partagé, pas de fetch à la volée).
// La session (« 45-1 ») est une seule chaîne : bloc court, sans en-tête généré.
function injectSession(html, session) {
  const s = html.indexOf(SESSION_START_MARKER), e = html.indexOf(SESSION_END_MARKER);
  if (s === -1 || e === -1) throw new Error('Marqueurs SESSION_DATA introuvables');
  const nl = html.includes('\r\n') ? '\r\n' : '\n';
  return html.slice(0, s) + `/* SESSION_DATA_START */${nl}const SESSION = ${JSON.stringify(session)};${nl}` + html.slice(e);
}

function injectBlock(html, startMarker, endMarker, varName, data, stamp) {
  const startIdx = html.indexOf(startMarker);
  const endIdx = html.indexOf(endMarker);
  if (startIdx === -1 || endIdx === -1) {
    throw new Error(`Marqueurs ${startMarker}/${endMarker} introuvables dans ${HTML_PATH}`);
  }
  const block =
    `${startMarker} — généré automatiquement par scrapers/build-frontend-data.js à partir des\n` +
    `   fichiers data/*.json (voir les scrapers). Ne pas éditer ce bloc à la main : relancer\n` +
    `   \`node scrapers/build-frontend-data.js\`. Généré le ${stamp} */\n` +
    `const ${varName} = ${JSON.stringify(data)};\n`;
  return html.slice(0, startIdx) + block + html.slice(endIdx);
}

function main() {
  const billsData = read(BILLS_PATH);
  const deputesData = read(DEPUTES_PATH);
  const votesData = read(VOTES_PATH);

  const bills = billsData.bills;
  const deputes = deputesData.deputes;
  const votes = votesData.votes;

  // Index (session, numéro de projet) → id stable. Le numéro seul ne suffit pas :
  // il est réutilisé d'une session à l'autre. On clé donc par session+numéro.
  const billIdByKey = new Map(bills.map((b) => [`${b.session}/${b.num}`, b.id]));

  // 1) Résout chaque vote vers l'id de projet de loi (ou null si motion/hors projet).
  const resolvedVotes = votes.map((v) => ({
    ...v,
    billId: v.billNumber ? billIdByKey.get(`${v.session}/${v.billNumber}`) ?? null : null,
  }));

  // Signale les votes rattachés à un projet qu'on n'a pas su résoudre (ne devrait
  // pas arriver dans une même session, mais on ne masque pas un trou éventuel).
  const unresolved = resolvedVotes.filter((v) => v.billNumber && v.billId == null);

  // 2) Attache à chaque projet la liste compacte de ses scrutins (divisions).
  const divisionsByBillId = new Map();
  for (const v of resolvedVotes) {
    if (v.billId == null) continue;
    if (!divisionsByBillId.has(v.billId)) divisionsByBillId.set(v.billId, []);
    divisionsByBillId.get(v.billId).push({
      number: v.number,
      date: v.date,
      description: v.description,
      result: v.result,
      passed: v.passed,
      totals: v.totals,
    });
  }
  const billsOut = bills.map((b) => ({
    ...b,
    divisions: (divisionsByBillId.get(b.id) ?? []).sort((a, z) => z.number - a.number),
  }));

  // 3) Calcule le bilan de votes de chaque député·e. Dénominateur honnête : seuls
  // les scrutins tenus À PARTIR de son entrée en fonction (memberSince) comptent —
  // on ne pénalise pas quelqu'un pour des votes d'avant son arrivée (élection
  // partielle). Un vote « pairé » est une position enregistrée, pas une absence.
  const deputesOut = deputes.map((d) => {
    const pid = String(d.id);
    let eligible = 0;
    const tally = { yea: 0, nay: 0, paired: 0 };
    for (const v of resolvedVotes) {
      if (d.memberSince && v.date && v.date < d.memberSince) continue;
      eligible++;
      const ballot = v.ballots[pid];
      if (ballot) tally[ballot]++;
    }
    const cast = tally.yea + tally.nay + tally.paired;
    return {
      ...d,
      votingRecord: {
        eligible,
        cast,
        ...tally,
        absent: eligible - cast,
        participationRate: eligible ? Number((cast / eligible).toFixed(3)) : null,
      },
    };
  });

  // Votants présents dans les scrutins mais absents du roster courant = ancien·ne·s
  // député·e·s parti·e·s depuis leur dernier vote. On les compte pour transparence
  // (ils seront nommables quand on ajoutera un roster historique).
  const currentIds = new Set(deputes.map((d) => String(d.id)));
  const formerVoterIds = new Set();
  for (const v of resolvedVotes) for (const pid in v.ballots) if (!currentIds.has(pid)) formerVoterIds.add(pid);

  // Session en cours (« 45-1 ») : sert aussi à déduire les adresses officielles.
  const session = billsData.session ?? votesData.session ?? null;

  const out = {
    generatedAt: new Date().toISOString(),
    session,
    meta: {
      counts: { bills: billsOut.length, deputes: deputesOut.length, votes: resolvedVotes.length },
      votesLinkedToBill: resolvedVotes.filter((v) => v.billId != null).length,
      formerMembersInVotes: formerVoterIds.size,
    },
    bills: billsOut,
    deputes: deputesOut,
    votes: resolvedVotes,
  };

  writeFileSync(OUT_PATH, JSON.stringify(out, null, 2));

  // ---- Parti / groupe parlementaire du parrain de chaque projet ----
  // Communes : bills.js fournit SponsorPersonId (= PersonId ourcommons) → jointure
  // directe au roster des députés, par une vraie clé. Sénat : le PersonId du parrain
  // appartient à un autre espace d'identifiants — on rapproche son nom OFFICIEL
  // (Nom + Prénom, fournis par LEGISinfo) du roster des sénateurs, exact puis repli
  // « nom + 1er prénom » seulement s'il est sans ambiguïté. Introuvable → null
  // (aucune pastille), jamais deviné.
  const deputeByIdMap = new Map(deputes.map((d) => [d.id, d]));
  const senatorsForSponsors = existsSync(SENATORS_PATH) ? read(SENATORS_PATH).senators : [];
  const spExact = new Map();
  const spLooseCount = new Map();
  const spLoose = new Map();
  const spLooseKey = (last, first) => normName(`${last}${(first || '').split(/\s+/)[0]}`);
  for (const s of senatorsForSponsors) {
    spExact.set(normName(`${s.lastName}${s.firstName}`), s);
    const lk = spLooseKey(s.lastName, s.firstName);
    spLooseCount.set(lk, (spLooseCount.get(lk) || 0) + 1);
    spLoose.set(lk, s);
  }
  function sponsorPartyOf(b) {
    if (b.sponsorPersonId) {
      const d = deputeByIdMap.get(b.sponsorPersonId);
      if (d && d.party && d.party.code) {
        return { kind: 'party', code: d.party.code, abbr: { en: d.party.code, fr: d.party.code }, name: { en: d.party.en, fr: d.party.fr } };
      }
    }
    if (b.sponsorName) {
      const lk = spLooseKey(b.sponsorName.last, b.sponsorName.first);
      const s = spExact.get(normName(`${b.sponsorName.last}${b.sponsorName.first}`)) ?? (spLooseCount.get(lk) === 1 ? spLoose.get(lk) : null);
      if (s && s.group && s.group.code) {
        return { kind: 'group', code: s.group.code, abbr: { en: s.group.en, fr: s.group.fr }, name: { en: s.group.enName || s.group.en, fr: s.group.frName || s.group.fr } };
      }
    }
    return null;
  }

  // Résumés « langage clair » générés par IA (scrapers/bill-ai-summaries.js),
  // ancrés dans le texte officiel et mis en cache par projet. Joints par id.
  const AI_SUMMARIES_PATH = 'data/bill-ai-summaries.json';
  const aiById = existsSync(AI_SUMMARIES_PATH) ? (read(AI_SUMMARIES_PATH).summaries ?? {}) : {};

  // Injecte les projets de loi (prêts pour billCard) dans data/site-data.js
  // entre les marqueurs BILLS_DATA — le prototype reste un fichier HTML autonome,
  // sans fetch. On ne garde que les champs consommés par le rendu.
  const frontendBills = billsOut.map((b) => ({
    id: b.id,
    num: b.num,
    chamber: b.chamber,
    title: b.title,
    type: b.type,
    sponsor: b.sponsor,
    sponsorPersonId: b.sponsorPersonId ?? null,
    sponsorParty: sponsorPartyOf(b),
    state: b.state,
    reinstated: b.reinstated,
    // Omnibus : nombre de parties (et de sections), lu dans le sommaire officiel.
    // Le titre d'un omnibus ne nomme qu'une de ses lois : la fiche doit le dire.
    omnibus: (() => {
      const om = detectOmnibus(b.summary);
      return om.isOmnibus ? { parts: om.parts.length, divisions: om.divisions.length } : null;
    })(),
    // Les TEXTES (sommaire officiel + résumé IA) partent dans un fichier à part,
    // chargé à la demande — voir billTexts plus bas. Ils pesaient 1 035 Ko sur les
    // 3 Mo de la page alors qu'un visiteur en lit un ou deux.
    fullSummaryAvailable: b.fullSummaryAvailable ?? false,
    // Étape + date : la chambre et le numéro de lecture se lisent dans `stage`,
    // les recopier coûtait 25 Ko. Le détail complet reste dans data/frontend.json.
    milestones: b.milestones.map((m) => ({ stage: m.stage, date: m.date })),
    lastActivity: b.lastActivity,
    latestActivity: { fr: b.latestActivity.fr, en: b.latestActivity.en },
    url: keepUrl(b.url, derivedBillUrl(b.num, session)),
    // `divisions` (44 Ko) n'était lu par aucune page : il reste dans data/frontend.json.
  }));
  const sponsorResolved = frontendBills.filter((b) => b.sponsorParty).length;

  // TEXTES DES PROJETS — fichier séparé, chargé par le navigateur seulement quand
  // quelqu'un ouvre une fiche. Clés courtes (s / src / ai) : répétées 185 fois,
  // les noms longs coûtaient plus cher que leur lisibilité ne valait.
  const BILL_TEXTS_PATH = 'data/bill-texts.json';
  const billTexts = {};
  for (const b of billsOut) {
    const ai = aiById[String(b.id)];
    const s = b.summary ?? {};
    const entry = {};
    if (s.en || s.fr) { entry.s = { en: s.en ?? null, fr: s.fr ?? null }; entry.src = b.summarySource ?? null; }
    if (ai && (ai.en || ai.fr)) entry.ai = { en: ai.en ?? null, fr: ai.fr ?? null };
    if (Object.keys(entry).length) billTexts[b.id] = entry;
  }
  writeFileSync(BILL_TEXTS_PATH, JSON.stringify(billTexts));

  // Courriels officiels (scrapers/depute-emails.js) — joints par PersonId.
  const EMAILS_PATH = 'data/depute-emails.json';
  const emailById = existsSync(EMAILS_PATH) ? read(EMAILS_PATH).emails : {};

  // Députés prêts pour le rendu (roster fédéral + bilan de votes précalculé).
  const frontendDeputes = deputesOut.map((d) => ({
    id: d.id,
    email: emailById[d.id] ?? null,
    name: d.name,
    honorific: d.honorific,
    party: d.party,
    constituency: d.constituency,
    province: d.province,
    memberSince: d.memberSince,
    url: keepUrl(d.url, derivedMemberUrl(d.id)),
    votingRecord: d.votingRecord,
  }));

  // Scrutins prêts pour le rendu (résultat, totaux, décompte par parti, lien projet).
  // Les noms partent dans data/votes/c-<numéro>.json (chargé au clic).
  const partyOfPid = new Map(deputesOut.map((d) => [String(d.id), (d.party && d.party.code) || 'IND']));
  const nameOfPid = new Map(deputesOut.map((d) => [String(d.id), d.name]));
  const frontendVotes = resolvedVotes.map((v) => {
    const per = {};
    const names = { yea: [], nay: [], third: [] };
    for (const pid in v.ballots) {
      const raw = v.ballots[pid];
      const g = raw === 'yea' ? 'yea' : raw === 'nay' ? 'nay' : 'third';
      const code = partyOfPid.get(pid) || 'IND';
      (per[code] = per[code] || { yea: 0, nay: 0, third: 0 })[g]++;
      names[g].push({ n: nameOfPid.get(pid) || '#' + pid, c: code });
    }
    writeBallots('c-' + v.number, names);
    return {
      number: v.number,
      date: v.date,
      description: v.description,
      result: v.result,
      passed: v.passed,
      totals: v.totals,
      billNumber: v.billNumber,
      billId: v.billId,
      url: keepUrl(v.url, derivedVoteUrl(v.number, session)),
      per,
    };
  });

  const stamp = new Date().toISOString();
  let html = readFileSync(HTML_PATH, 'utf-8');
  html = injectSession(html, session);
  // Étiquettes répétées -> dictionnaire (voir dictify). À faire AVANT l'injection.
  dictify(frontendBills, 'type', 'types');
  dictify(frontendBills, 'latestActivity', 'activities');
  dictify(frontendBills, 'sponsorParty', 'parties');
  dictify(frontendDeputes, 'party', 'parties');
  dictify(frontendDeputes, 'province', 'provinces');
  // Les gros jeux ne vont plus dans le noyau : chacun part dans le fichier de son
  // onglet, chargé quand on l'ouvre (voir writeViewData plus bas).
  viewData.bills.bills = frontendBills;
  viewData.people.deputes = frontendDeputes;
  viewData.votes.votes = frontendVotes;
  // Ministres : fichier séparé (scrapers/ministers.js) — injecté s'il existe.
  if (existsSync(MINISTERS_PATH)) {
    const ministers = read(MINISTERS_PATH).ministers;
    html = injectBlock(html, MIN_START_MARKER, MIN_END_MARKER, 'ministers', ministers, stamp);
  }
  // Pétitions : fichier séparé (scrapers/petitions.js) — injecté s'il existe.
  if (existsSync(PETITIONS_PATH)) {
    const petitions = read(PETITIONS_PATH).petitions;
    html = injectBlock(html, PET_START_MARKER, PET_END_MARKER, 'petitions', petitions, stamp);
  }

  // Lobbying déclaré par projet de loi (scrapers/lobbying.js) — injecté s'il existe.
  // Alimenté par une archive téléchargée à la main (voir l'en-tête du scraper) :
  // le fichier survit aux rafraîchissements où l'archive n'a pas été mise à jour.
  const LOBBYING_PATH = 'data/lobbying.json';
  if (existsSync(LOBBYING_PATH)) {
    const lobbying = read(LOBBYING_PATH);
    // Il accompagne les projets : c'est la même page qui l'affiche.
    viewData.bills.lobbying = { updatedAt: lobbying.scrapedAt, bills: lobbying.bills };
  }

  // Calendrier des séances de la Chambre (scrapers/house-calendar.js) — injecté s'il existe.
  if (existsSync(CALENDAR_PATH)) {
    const sittingDays = read(CALENDAR_PATH).sittingDays;
    html = injectBlock(html, SIT_START_MARKER, SIT_END_MARKER, 'sittingDays', sittingDays, stamp);
  }

  // Titulaires à forte rotation (scrapers/officeholders.js) — noms validés qui
  // REMPLACENT les noms codés en dur du lexique ; sinon on garde le codé en dur.
  const OFFICEHOLDERS_PATH = 'data/officeholders.json';
  if (existsSync(OFFICEHOLDERS_PATH)) {
    const officeholders = read(OFFICEHOLDERS_PATH).officeholders;
    html = injectBlock(html, '/* OFFICEHOLDERS_DATA_START', '/* OFFICEHOLDERS_DATA_END */', 'officeholderNames', officeholders, stamp);
  }

  // Sénat : roster + votes nominatifs (fichiers séparés) — injectés s'ils existent.
  let senateStats = null;
  if (existsSync(SENATORS_PATH) && existsSync(SENATE_VOTES_PATH)) {
    const senators = read(SENATORS_PATH).senators;
    const senateVotesData = read(SENATE_VOTES_PATH);
    const senateSession = senateVotesData.session;
    const senateVotes = senateVotesData.votes;

    // Jointure bulletin → fiche (le Sénat n'expose pas ici d'identifiant stable
    // comme le PersonId des Communes). D'abord le nom complet normalisé, puis un
    // repli sur « nom + 1er prénom » qui tolère un 2e prénom ou des post-nominaux
    // présents d'un seul côté — et seulement si ce repli est SANS ambiguïté.
    const exactBySlug = new Map();
    const looseCount = new Map();
    const looseBySlug = new Map();
    const looseKey = (last, first) => normName(`${last}${(first || '').split(/\s+/)[0]}`);
    for (const s of senators) {
      exactBySlug.set(normName(`${s.lastName}${s.firstName}`), s.slug);
      const lk = looseKey(s.lastName, s.firstName);
      looseCount.set(lk, (looseCount.get(lk) || 0) + 1);
      looseBySlug.set(lk, s.slug);
    }
    const slugForBallot = (name) => {
      const exact = exactBySlug.get(normName(name));
      if (exact) return exact;
      const [last = '', first = ''] = name.split(',').map((p) => p.trim());
      const lk = looseKey(last, first);
      return looseCount.get(lk) === 1 ? looseBySlug.get(lk) : null;
    };

    const resolvedSenateVotes = senateVotes.map((v) => ({
      ...v,
      billId: v.billNumber ? billIdByKey.get(`${senateSession}/${v.billNumber}`) ?? null : null,
      ballots: v.ballots.map((b) => ({ ...b, slug: slugForBallot(b.name) })),
    }));

    // Bilan de votes par sénateur·rice : dénominateur = scrutins tenus depuis sa
    // nomination (on ne pénalise pas pour des votes d'avant son arrivée).
    const mineBySlug = new Map();
    for (const v of resolvedSenateVotes)
      for (const b of v.ballots)
        if (b.slug) {
          if (!mineBySlug.has(b.slug)) mineBySlug.set(b.slug, new Map());
          mineBySlug.get(b.slug).set(v.id, b.vote);
        }
    const senatorsOut = senators.map((s) => {
      let eligible = 0;
      const tally = { yea: 0, nay: 0, abstention: 0 };
      const mine = mineBySlug.get(s.slug);
      for (const v of resolvedSenateVotes) {
        if (s.appointedOn && v.date && v.date < s.appointedOn) continue;
        eligible++;
        const vote = mine ? mine.get(v.id) : undefined;
        if (vote) tally[vote]++;
      }
      const cast = tally.yea + tally.nay + tally.abstention;
      return {
        ...s,
        votingRecord: {
          eligible,
          cast,
          ...tally,
          absent: eligible - cast,
          participationRate: eligible ? Number((cast / eligible).toFixed(3)) : null,
        },
      };
    });

    // Bulletins sans fiche = ancien·ne·s sénateur·rice·s (parti·e·s depuis leur vote).
    const formerSenators = new Set();
    for (const v of resolvedSenateVotes) for (const b of v.ballots) if (!b.slug) formerSenators.add(normName(b.name));

    const frontendSenators = senatorsOut.map((s) => ({
      slug: s.slug,
      name: s.name,
      lastName: s.lastName,
      group: s.group,
      province: s.province,
      appointedOn: s.appointedOn,
      retirementOn: s.retirementOn,
      appointedBy: s.appointedBy,
      url: keepUrl(s.url, derivedSenatorUrl(s.slug)),
      votingRecord: s.votingRecord,
    }));
    // Comme aux Communes : décompte par groupe ici, noms dans data/votes/s-<id>.json.
    const groupOfSlug = new Map(senatorsOut.map((s) => [s.slug, s.group && s.group.code]));
    const nameOfSlug = new Map(senatorsOut.map((s) => [s.slug, s.name]));
    const frontendSenateVotes = resolvedSenateVotes.map((v) => {
      const per = {};
      const names = { yea: [], nay: [], third: [] };
      for (const b of v.ballots) {
        const g = b.vote === 'yea' ? 'yea' : b.vote === 'nay' ? 'nay' : 'third';
        const code = (b.slug && groupOfSlug.get(b.slug)) || b.affiliation || '—';
        (per[code] = per[code] || { yea: 0, nay: 0, third: 0 })[g]++;
        names[g].push({ n: (b.slug && nameOfSlug.get(b.slug)) || b.name, c: code });
      }
      writeBallots('s-' + v.id, names);
      return {
        id: v.id,
        date: v.date,
        title: v.title,
        billNumber: v.billNumber,
        billId: v.billId,
        totals: v.totals,
        result: v.result,
        passed: v.passed,
        url: v.url,
        per,
      };
    });

    dictify(frontendSenators, 'group', 'groups');
    dictify(frontendSenators, 'province', 'senateProvinces');
    dictify(frontendSenators, 'appointedBy', 'appointers');
    viewData.people.senators = frontendSenators;
    viewData.votes.senateVotes = frontendSenateVotes;

    senateStats = {
      senators: frontendSenators.length,
      votes: frontendSenateVotes.length,
      linked: resolvedSenateVotes.filter((v) => v.billId != null).length,
      former: formerSenators.size,
    };
  }

  // Le dictionnaire s'écrit en dernier : il s'est rempli au fil des blocs. Si une
  // chambre n'a pas été régénérée (source en panne), ses données restent celles du
  // tour précédent : on garde donc les entrées de dictionnaire qu'elles utilisent.
  const previous = /const DICTS = (\{[\s\S]*?\});\r?\n\/\* DICTS_DATA_END/.exec(html);
  if (previous) {
    try {
      const old = JSON.parse(previous[1]);
      for (const k in old) if (!DICTS[k]) DICTS[k] = old[k];
    } catch { /* premier passage : bloc vide */ }
  }
  html = injectBlock(html, DICT_START_MARKER, DICT_END_MARKER, 'DICTS', DICTS, stamp);
  // Les comptes restent dans le noyau : les titres des pages les affichent même
  // quand l'onglet correspondant n'est pas chargé (« 187 projets de loi »).
  html = injectBlock(html, COUNTS_START_MARKER, COUNTS_END_MARKER, 'COUNTS', {
    bills: (viewData.bills.bills || []).length,
    deputes: (viewData.people.deputes || []).length,
    senators: (viewData.people.senators || []).length,
    votes: (viewData.votes.votes || []).length,
    senateVotes: (viewData.votes.senateVotes || []).length,
  }, stamp);
  const viewFiles = writeViewData(stamp);
  writeFileSync(HTML_PATH, html);
  const ballotsRemoved = pruneBallots();

  // ⚠️ Plus de sitemap ici : ce bloc le réécrivait chaque nuit avec UNE seule
  // URL (apex), effaçant les 12 pages FR/EN. C'est build-section-pages.js qui
  // l'écrit désormais, depuis la même liste que les pages qu'il génère.

  console.log(`Fusion écrite dans ${OUT_PATH}`);
  console.log(`  ${frontendBills.length} projets · ${frontendDeputes.length} députés · ${frontendVotes.length} scrutins injectés dans ${HTML_PATH}`);
  console.log(`  ${billsOut.length} projets · ${deputesOut.length} députés · ${resolvedVotes.length} scrutins`);
  console.log(`  scrutins reliés à un projet : ${out.meta.votesLinkedToBill}`);
  console.log(`  parti du parrain résolu : ${sponsorResolved}/${frontendBills.length} projets`);
  console.log(`  textes des projets : ${Object.keys(billTexts).length} entrées dans ${BILL_TEXTS_PATH} (${(statSync(BILL_TEXTS_PATH).size / 1024).toFixed(0)} Ko, chargé à la demande)`);
  console.log(`  ancien·ne·s député·e·s présent·e·s dans les votes : ${formerVoterIds.size}`);
  console.log(`  adresses officielles déduites de l'identifiant${urlsKept ? ` · ${urlsKept} gardée(s) en donnée (déduction ≠ source)` : ' (toutes)'}`);
  console.log(`  données par onglet : ${viewFiles.join(' · ')}`);
  console.log(`  listes nominatives : ${ballotFiles.size} fichiers dans ${BALLOTS_DIR}/ (chargés au clic)${ballotsRemoved ? ` · ${ballotsRemoved} supprimé(s)` : ''}`);
  if (unresolved.length) {
    console.log(`  ⚠ ${unresolved.length} vote(s) avec projet non résolu : ${unresolved.map((v) => `#${v.number}→${v.billNumber}`).join(', ')}`);
  }
  if (senateStats) {
    console.log(`  Sénat : ${senateStats.senators} sénateur·rice·s · ${senateStats.votes} votes (${senateStats.linked} reliés à un projet) injectés`);
    if (senateStats.former) console.log(`  ⚠ ${senateStats.former} nom(s) de bulletin sans fiche au roster (ancien·ne·s sénateur·rice·s)`);
  }
}

main();
