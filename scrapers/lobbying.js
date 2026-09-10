// Enrichissement — Lobbying déclaré, par projet de loi (Commissariat au lobbying)
//
// Source : « Rapports mensuels de communications » du Commissariat au lobbying du
// Canada, publié sur le portail fédéral des données ouvertes (Licence du
// gouvernement ouvert) :
//   https://open.canada.ca/data/fr/dataset  → « Rapports mensuels de communications »
//   fichier : communications_ocl_cal.zip
//
// ⚠️ POURQUOI CE SCRAPER NE TÉLÉCHARGE PAS TOUT SEUL
// L'hôte des fichiers (lobbycanada.gc.ca) est derrière un défi JavaScript
// Cloudflare : `fetch`/curl reçoivent un 403, même avec un User-Agent de
// navigateur. Un vrai navigateur passe sans problème. On ne cherche donc PAS à
// contourner la protection : le ZIP est téléchargé À LA MAIN (un clic, une fois
// par mois — c'est la cadence de publication du jeu de données) et déposé dans :
//   data/source/communications_ocl_cal.zip
// Sans ce fichier, le scraper sort proprement sans rien casser (comme les résumés
// IA sans clé API) : le build quotidien continue avec les données précédentes.
//
// CE QU'ON PRODUIT (data/lobbying.json) : pour chaque projet de loi de la session
// courante, les communications de lobbying qui le mentionnent explicitement.
//
// GARDE-FOUS D'HONNÊTETÉ (les mêmes que partout sur le site) :
//   • On n'attribue une communication à un projet QUE si sa description dit
//     explicitement « Bill C-5 » / « projet de loi C-5 ». Jamais de déduction.
//   • Les numéros de projets sont RÉUTILISÉS d'une session à l'autre → on ne garde
//     que les communications datées de la session courante, sinon on attribuerait
//     un « C-5 » de 2015 au C-5 d'aujourd'hui.
//   • Ton neutre : le lobbying est une activité LÉGALE et DÉCLARÉE. On rapporte le
//     registre officiel, jamais un jugement. Chaque ligne garde son `comlogId` pour
//     pointer vers sa fiche officielle et rester vérifiable.
//   • Une rencontre n'est pas une influence : on montre qui a parlé à qui, sur quoi.

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { inflateRawSync } from 'node:zlib';

const ZIP_PATH = process.env.LOBBY_ZIP || 'data/source/communications_ocl_cal.zip';
const BILLS_PATH = 'data/bills.json';
const OUT_PATH = 'data/lobbying.json';

// Combien on garde par projet (le reste est sur le registre officiel, qu'on lie).
// Ces données partent en clair dans index.html : on reste frugal.
const MAX_ORGS = 10;
const MAX_RECENT = 10;
const MAX_DPOH = 3;

// ---------------------------------------------------------------- ZIP (sans dép.)
// Lecture minimale d'une archive ZIP : on lit le « central directory » puis on
// décompresse (deflate brut) l'entrée demandée. Node fournit zlib, rien à installer.
function readZipEntries(buf) {
  let eocd = -1;
  for (let i = buf.length - 22; i >= 0 && i > buf.length - 70000; i--) {
    if (buf.readUInt32LE(i) === 0x06054b50) { eocd = i; break; }
  }
  if (eocd < 0) throw new Error('Archive ZIP illisible (fin de répertoire central introuvable).');
  const count = buf.readUInt16LE(eocd + 10);
  let p = buf.readUInt32LE(eocd + 16);
  const entries = new Map();
  for (let k = 0; k < count; k++) {
    if (buf.readUInt32LE(p) !== 0x02014b50) break;
    const method = buf.readUInt16LE(p + 10);
    const compSize = buf.readUInt32LE(p + 20);
    const nameLen = buf.readUInt16LE(p + 28);
    const extraLen = buf.readUInt16LE(p + 30);
    const cmtLen = buf.readUInt16LE(p + 32);
    const lho = buf.readUInt32LE(p + 42);
    const name = buf.toString('latin1', p + 46, p + 46 + nameLen);
    entries.set(name, { method, compSize, lho });
    p += 46 + nameLen + extraLen + cmtLen;
  }
  return entries;
}

// Les CSV du Commissariat sont en Windows-1252, PAS en UTF-8 : décoder en UTF-8
// casse tous les accents (« Société » → « Soci�t� »).
const win1252 = new TextDecoder('windows-1252');

function extractCsv(buf, entry) {
  const nameLen = buf.readUInt16LE(entry.lho + 26);
  const extraLen = buf.readUInt16LE(entry.lho + 28);
  const start = entry.lho + 30 + nameLen + extraLen;
  const raw = buf.subarray(start, start + entry.compSize);
  const out = entry.method === 8 ? inflateRawSync(raw) : raw;
  return win1252.decode(out);
}

// ---------------------------------------------------------------- CSV
// Analyseur tolérant : champs entre guillemets, virgules et sauts de ligne
// À L'INTÉRIEUR des champs (fréquent dans les descriptions), guillemets doublés.
function* csvRows(text) {
  let i = 0, field = '', row = [], inQuotes = false;
  const n = text.length;
  while (i < n) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') { field += '"'; i += 2; continue; }
        inQuotes = false; i++; continue;
      }
      field += c; i++; continue;
    }
    if (c === '"') { inQuotes = true; i++; continue; }
    if (c === ',') { row.push(field); field = ''; i++; continue; }
    if (c === '\r') { i++; continue; }
    if (c === '\n') { row.push(field); yield row; row = []; field = ''; i++; continue; }
    field += c; i++;
  }
  if (field.length || row.length) { row.push(field); yield row; }
}

// Index des colonnes par nom d'en-tête (les positions peuvent bouger d'un mois
// à l'autre — on ne code JAMAIS un numéro de colonne en dur).
function headerIndex(headerRow) {
  const idx = {};
  headerRow.forEach((h, i) => { idx[h.trim().toUpperCase()] = i; });
  return idx;
}
function need(idx, ...names) {
  for (const n of names) if (idx[n] !== undefined) return idx[n];
  throw new Error(`Colonne introuvable dans le CSV : ${names.join(' / ')} — le schéma du Commissariat a peut-être changé.`);
}

// ---------------------------------------------------------------- projets de loi
// On exige le mot « bill » ou « projet de loi » devant le numéro : un « C-5 » isolé
// dans une phrase peut vouloir dire tout autre chose (code, norme, formulaire).
const BILL_RE = /\b(?:bill|projet\s+de\s+loi)\s*(?:n[o°]\s*)?([CS])[-\s]?(\d{1,3})\b/gi;
function numbersMentioned(description) {
  const found = new Set();
  let m;
  BILL_RE.lastIndex = 0;
  while ((m = BILL_RE.exec(description))) found.add(`${m[1].toUpperCase()}-${m[2]}`);
  return found;
}

// ⚠️ LE PIÈGE CENTRAL DE CE JEU DE DONNÉES
// Les numéros de projets de loi sont recyclés à chaque législature, et la
// description d'un lobbyiste est rattachée à son ENREGISTREMENT, pas à la
// rencontre : une description rédigée en 2022 continue d'apparaître sur des
// communications déclarées en 2026. Résultat, un filtre par date ne suffit PAS —
// on retrouvait Netflix « sur C-11 » (Loi sur la diffusion continue en ligne,
// 44e législature) collé au C-11 actuel (Loi sur la défense nationale).
// Règle retenue : on n'attribue une communication à un projet que si UNE MÊME
// description contient à la fois son numéro ET du vocabulaire distinctif de son
// VRAI titre. Dans les faits les lobbyistes écrivent presque toujours les deux
// (« Building Canada Act (Bill C-5, Part 2) »), et les mentions périmées se
// trahissent en nommant une autre loi (« Online Streaming Act (formerly Bill C-11) »).
// On préfère rater une communication qu'en attribuer une fausse.

// Mots trop courants dans les titres de lois pour prouver quoi que ce soit.
const TITLE_STOP = new Set([
  'loi', 'lois', 'autre', 'autres', 'certain', 'certains', 'certaine', 'certaines',
  'dispositions', 'modifiant', 'modifie', 'portant', 'visant', 'apportant',
  'concernant', 'edictant', 'relative', 'relatives', 'correlatives', 'connexes',
  'texte', 'textes', 'matiere', 'mesure', 'mesures', 'parlement', 'canada',
  'canadien', 'canadienne', 'canadiennes', 'canadiens', 'projet',
  'act', 'acts', 'other', 'others', 'provision', 'provisions', 'amend', 'amends',
  'amending', 'amendment', 'amendments', 'enact', 'enacts', 'enacting',
  'respecting', 'related', 'consequential', 'making', 'measure', 'measures',
  'parliament', 'canadian', 'certains', 'thereto', 'therein', 'between',
]);

// Radical de 5 lettres : rapproche « implement » / « implementation »,
// « bâtir » / « bâtir », sans traîner un vrai lemmatiseur.
function stems(text) {
  const norm = String(text || '').normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();
  const out = new Set();
  for (const w of norm.split(/[^a-z]+/)) {
    if (w.length < 5 || TITLE_STOP.has(w)) continue;
    out.add(w.slice(0, 5));
  }
  return out;
}

function billStems(bill) {
  const s = new Set();
  for (const t of [bill.title?.fr, bill.title?.en, bill.shortTitle?.fr, bill.shortTitle?.en]) {
    for (const k of stems(t)) s.add(k);
  }
  return s;
}

// Date à partir de laquelle le numéro existe : la 1re lecture. Une communication
// antérieure ne peut pas parler de CE projet-là.
function firstReading(bill) {
  const d = (bill.milestones || []).map((m) => m.date).filter(Boolean).sort();
  return d[0] || null;
}

function main() {
  if (!existsSync(ZIP_PATH)) {
    console.warn(`⚠ ${ZIP_PATH} absent — lobbying sauté, données précédentes conservées.`);
    console.warn('  Télécharger « communications_ocl_cal.zip » depuis le registre (navigateur)');
    console.warn(`  puis le déposer dans ${ZIP_PATH}. Voir l'en-tête de ce fichier.`);
    return; // sortie propre : le build quotidien ne casse jamais
  }
  const { bills, session } = JSON.parse(readFileSync(BILLS_PATH, 'utf-8'));
  const known = new Map(bills.map((b) => [b.num.toUpperCase(), b]));

  // Début de session = plus ancien jalon franchi de la session. Sert de coupure
  // pour ne pas attribuer un vieux « C-5 » d'une législature précédente.
  const dates = bills.flatMap((b) => (b.milestones || []).map((m) => m.date)).filter(Boolean).sort();
  const sessionStart = dates[0] || '2025-05-26';

  const zip = readFileSync(ZIP_PATH);
  const entries = readZipEntries(zip);
  const get = (name) => {
    const e = entries.get(name);
    if (!e) throw new Error(`Entrée absente de l'archive : ${name}`);
    return extractCsv(zip, e);
  };

  // 1) Descriptions → quels COMLOG_ID mentionnent quels projets
  // Corroboration OBLIGATOIRE par le titre, dans la MÊME description (voir la
  // note « piège central » plus haut) : le numéro seul ne prouve pas la session.
  const stemsByBill = new Map();
  for (const [num, b] of known) stemsByBill.set(num, billStems(b));

  const billsByComlog = new Map();
  let rejected = 0;
  {
    const rows = csvRows(get('Communication_SubjectMatterDetailsExport.csv'));
    const idx = headerIndex(rows.next().value);
    const cId = need(idx, 'COMLOG_ID');
    const cDesc = need(idx, 'DESCRIPTION');
    for (const r of rows) {
      const desc = r[cDesc];
      if (!desc) continue;
      const hits = numbersMentioned(desc);
      if (!hits.size) continue;
      let descStems = null;
      const id = r[cId];
      for (const num of hits) {
        if (!known.has(num)) continue; // pas un projet de la session courante
        descStems ??= stems(desc);
        const wanted = stemsByBill.get(num);
        let ok = false;
        for (const k of wanted) if (descStems.has(k)) { ok = true; break; }
        if (!ok) { rejected++; continue; } // numéro sans le titre → très probablement une autre législature
        const set = billsByComlog.get(id) || new Set();
        set.add(num);
        billsByComlog.set(id, set);
      }
    }
  }

  // 2) Communications : organisation cliente + date (filtrées sur la session)
  const comms = new Map();
  {
    const rows = csvRows(get('Communication_PrimaryExport.csv'));
    const idx = headerIndex(rows.next().value);
    const cId = need(idx, 'COMLOG_ID');
    const cEn = need(idx, 'EN_CLIENT_ORG_CORP_NM_AN');
    const cFr = need(idx, 'FR_CLIENT_ORG_CORP_NM');
    const cDate = need(idx, 'COMM_DATE');
    for (const r of rows) {
      const id = r[cId];
      if (!billsByComlog.has(id)) continue;
      const date = (r[cDate] || '').slice(0, 10);
      if (!date || date < sessionStart) continue; // session courante uniquement
      const en = clean(r[cEn]);
      const fr = clean(r[cFr]);
      comms.set(id, { date, org: { en: en || fr, fr: fr || en }, dpoh: [] });
    }
  }

  // 3) Qui a été rencontré (titulaires de charge publique désignés)
  {
    const rows = csvRows(get('Communication_DpohExport.csv'));
    const idx = headerIndex(rows.next().value);
    const cId = need(idx, 'COMLOG_ID');
    const cLast = need(idx, 'DPOH_LAST_NM_TCPD');
    const cFirst = need(idx, 'DPOH_FIRST_NM_PRENOM_TCPD');
    const cTitle = need(idx, 'DPOH_TITLE_TITRE_TCPD');
    const cInst = need(idx, 'INSTITUTION');
    for (const r of rows) {
      const c = comms.get(r[cId]);
      if (!c) continue;
      const name = [clean(r[cFirst]), clean(r[cLast])].filter(Boolean).join(' ');
      if (!name) continue;
      c.dpoh.push({ name, title: clean(r[cTitle]) || null, institution: clean(r[cInst]) || null });
    }
  }

  // 4) Agrégation par projet de loi
  // Seconde barrière : une communication ne peut pas porter sur un projet qui
  // n'avait pas encore de numéro. Le plancher est la 1re lecture du projet.
  const floorByBill = new Map();
  for (const [num, b] of known) floorByBill.set(num, firstReading(b) || sessionStart);

  const byBill = {};
  let tooEarly = 0;
  for (const [id, set] of billsByComlog) {
    const c = comms.get(id);
    if (!c) continue; // hors session, ou communication non retenue
    for (const num of set) {
      if (c.date < floorByBill.get(num)) { tooEarly++; continue; }
      const b = (byBill[num] = byBill[num] || { total: 0, orgs: new Map(), recent: [] });
      b.total++;
      // Clé de regroupement = nom FR (toujours présent), mais on garde les deux
      // versions : le site est bilingue et le registre fournit les deux raisons
      // sociales quand elles diffèrent.
      const key = c.org.fr || c.org.en;
      const seen = b.orgs.get(key);
      if (seen) seen.n++;
      else b.orgs.set(key, { name: c.org.fr === c.org.en ? c.org.fr : { ...c.org }, n: 1 });
      // Nom d'organisation : une seule chaîne quand FR et EN sont identiques
      // (c'est le cas le plus courant — beaucoup de raisons sociales unilingues).
      const org = c.org.fr === c.org.en ? c.org.fr : c.org;
      b.recent.push({ comlogId: id, date: c.date, org, dpoh: c.dpoh.slice(0, MAX_DPOH) });
    }
  }

  const out = {};
  for (const [num, b] of Object.entries(byBill)) {
    out[num] = {
      total: b.total,
      orgTotal: b.orgs.size, // organisations distinctes — la liste ci-dessous est tronquée
      orgs: [...b.orgs.values()].sort((a, z) => z.n - a.n).slice(0, MAX_ORGS),
      recent: b.recent.sort((a, z) => z.date.localeCompare(a.date)).slice(0, MAX_RECENT),
    };
  }

  mkdirSync('data', { recursive: true });
  writeFileSync(OUT_PATH, JSON.stringify({
    source: 'Commissariat au lobbying du Canada — Rapports mensuels de communications',
    sourceUrl: 'https://lobbycanada.gc.ca/app/secure/ocl/lrs/do/cmmLgPblcVw?comlogId=',
    session: session || null,
    sessionStart,
    scrapedAt: new Date().toISOString(),
    billsWithLobbying: Object.keys(out).length,
    bills: out,
  }, null, 2));

  const totalComms = Object.values(out).reduce((a, b) => a + b.total, 0);
  console.log(`Lobbying écrit dans ${OUT_PATH}`);
  console.log(`  ${Object.keys(out).length} projets de loi avec du lobbying déclaré · ${totalComms} communications (depuis ${sessionStart})`);
  console.log(`  écartées : ${rejected} mentions d'un numéro sans le titre (autre législature), ${tooEarly} antérieures à la 1re lecture`);
  const top = Object.entries(out).sort((a, b) => b[1].total - a[1].total).slice(0, 5);
  console.log('  top projets :', top.map(([n, v]) => `${n} (${v.total})`).join(' · '));
}

function clean(s) {
  if (s == null) return null;
  const t = String(s).trim();
  return t === '' || t.toLowerCase() === 'null' ? null : t;
}

try {
  main();
} catch (err) {
  console.error('Échec de lobbying.js :', err.message);
  process.exitCode = 1;
}
