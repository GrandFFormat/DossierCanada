// Enrichissement — Lobbying déclaré, par projet de loi (Commissariat au lobbying)
//
// Source : « Rapports mensuels de communications » du Commissariat au lobbying du
// Canada, publié sur le portail fédéral des données ouvertes (Licence du
// gouvernement ouvert) :
//   https://open.canada.ca/data/fr/dataset  → « Rapports mensuels de communications »
//   fichier : communications_ocl_cal.zip
//
// ⚠️ ACCÈS AU FICHIER
// L'hôte des fichiers (lobbycanada.gc.ca) est derrière un défi JavaScript
// Cloudflare : sans autorisation, `fetch`/curl reçoivent un 403. On n'a JAMAIS
// cherché à contourner cette protection. En septembre 2026, le Commissariat a
// accepté d'ajouter notre agent (DossierCanada/1.0) à sa liste blanche — voir
// fetchArchive() plus bas. Le scraper tente donc le téléchargement lui-même,
// au plus une fois par mois, et retombe sur une archive locale déposée à la main
// dans data/source/communications_ocl_cal.zip si le serveur refuse encore.
// Sans l'une ni l'autre, il sort proprement sans rien casser : le build quotidien
// continue avec les données précédentes.
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

import { readFileSync, writeFileSync, existsSync, mkdirSync, statSync } from 'node:fs';
import { inflateRawSync } from 'node:zlib';

const ZIP_PATH = process.env.LOBBY_ZIP || 'data/source/communications_ocl_cal.zip';
const BILLS_PATH = 'data/bills.json';
const OUT_PATH = 'data/lobbying.json';
const PAST_PATH = 'data/past-bill-titles.json';
const DEBUG_BILL = (process.env.LOBBY_DEBUG || '').toUpperCase() || null;

// Combien on garde par projet (le reste est sur le registre officiel, qu'on lie).
// Ces données partent en clair dans index.html : on reste frugal.
// MAX_ORGS est volontairement large : la recherche par mot-clé fouille les noms
// d'organisations, et on refuse de trouver un projet sans pouvoir montrer POURQUOI
// il correspond. Ce qui est indexé doit donc être affichable. Au 2026-09 le projet
// le plus lobbyé en compte 25 ; 30 laisse de la marge pour ~1 Ko de plus.
const MAX_ORGS = 30;
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

// GARDE-FOU 1 — les mots creux, mesurés plutôt que devinés.
// « Self-Government » dans un titre produisait le radical « gover », qui colle à
// « government officials » et « data governance »… présents dans 24,5 % de TOUTES
// les descriptions du registre. Résultat : 28 communications sur l'IA et la vie
// privée (ancien C-27) attribuées au C-27 actuel sur l'autonomie gouvernementale
// des Tlegohli Got'ine. On ne blackliste donc pas à la main : on calcule la
// fréquence réelle de chaque radical dans le corpus et on écarte ceux qui sont
// partout. Un mot présent dans un dixième des descriptions ne prouve rien.
const CORPUS_STEM_MAX_SHARE = 0.10;

// Et en deçà : un radical VRAIMENT rare (« cyber », « comba », « tlego ») est à
// lui seul une preuve solide. Un radical banal mais pas éliminé (« prote » 5,1 %,
// « syste » 5,0 %, « natio » 8,5 %) ne l'est pas : c'est lui qui rattachait Lenovo
// (« protects video game consoles », vieux C-244 sur le droit de réparer) à la
// Loi sur la lutte contre la pollution des côtes. Ceux-là exigent que la
// description nomme explicitement la bonne loi.
const CORPUS_STEM_RARE_SHARE = 0.03;

function corpusStemFrequency(descriptions) {
  const df = new Map();
  let n = 0;
  for (const d of descriptions) {
    n++;
    for (const k of stems(d)) df.set(k, (df.get(k) || 0) + 1);
  }
  const banned = new Set();
  const rare = new Set();
  for (const [k, c] of df) {
    if (c / n > CORPUS_STEM_MAX_SHARE) banned.add(k);
    else if (c / n < CORPUS_STEM_RARE_SHARE) rare.add(k);
  }
  return { banned, rare };
}

// GARDE-FOU 2 — une description qui nomme une AUTRE loi parle d'un autre projet.
// C'est la signature des mentions périmées : « the Online Streaming Act (formerly
// Bill C-11) », « An Act to enact the Consumer Privacy Protection Act… Bill C-27 ».
// La fréquence seule ne les attrapait pas (« syste », 5 % du corpus, reliait le
// « broadcasting system » du vieux C-11 au « système de justice militaire » de
// l'actuel). Donc : si des noms de lois apparaissent et qu'AUCUN ne partage de
// vocabulaire avec le titre du projet, on refuse — quel que soit le radical trouvé.
const ACT_EN_RE = /((?:[A-Z][\w’'-]+|of|and|for|the|to|on|in)(?:\s+(?:[A-Z][\w’'-]+|of|and|for|the|to|on|in)){0,6}\s+Acts?)\b/g;
const ACT_FR_RE = /Loi\s+(?:sur|visant|concernant|modifiant|portant|relative|instituant|edictant|de|des|du|no)\b[^,.;:()]{0,80}/gi;

function namedActs(description) {
  const out = [];
  ACT_EN_RE.lastIndex = 0;
  let m;
  while ((m = ACT_EN_RE.exec(description))) out.push(m[1]);
  ACT_FR_RE.lastIndex = 0;
  while ((m = ACT_FR_RE.exec(description))) out.push(m[0]);
  return out;
}

// Date à partir de laquelle le numéro existe : la 1re lecture. Une communication
// antérieure ne peut pas parler de CE projet-là.
function firstReading(bill) {
  const d = (bill.milestones || []).map((m) => m.date).filter(Boolean).sort();
  return d[0] || null;
}

// TÉLÉCHARGEMENT AUTOMATIQUE — possible depuis que le Commissariat a accepté
// d'ajouter notre agent à sa liste blanche Cloudflare (courriel de Manon Dion,
// Service des communications, septembre 2026). Tant que ce n'est pas actif, le
// serveur répond 403 et on retombe proprement sur l'archive locale.
//
// ⚠️ ENGAGEMENT PRIS AUPRÈS DU COMMISSARIAT : « une requête par mois, au rythme
// de votre publication ». Ils nous rendent service ; on tient parole.
//   • Pas de requête du tout tant que nos données ont moins de ARCHIVE_MIN_AGE_DAYS.
//   • Ensuite, requête CONDITIONNELLE (If-Modified-Since) : si l'archive n'a pas
//     changé, le serveur répond 304 en quelques octets et on ne retélécharge pas
//     24 Mo pour rien.
const ARCHIVE_URL = 'https://lobbycanada.gc.ca/media/mqbbmaqk/communications_ocl_cal.zip';
const USER_AGENT = 'DossierCanada/1.0 (+https://dossiercanada.ca; site citoyen; contact mart.archambault@gmail.com)';
const ARCHIVE_MIN_AGE_DAYS = 25;

function readPrevious() {
  try { return JSON.parse(readFileSync(OUT_PATH, 'utf-8')); } catch { return null; }
}

// Renvoie 'downloaded' | 'unchanged' | 'too-recent' | 'blocked' | 'failed'.
async function fetchArchive(previous) {
  const ageDays = previous?.scrapedAt
    ? Math.floor((Date.now() - new Date(previous.scrapedAt)) / 86400000)
    : Infinity;
  if (ageDays < ARCHIVE_MIN_AGE_DAYS) return { status: 'too-recent', ageDays };

  const headers = { 'User-Agent': USER_AGENT, Accept: 'application/zip, application/octet-stream, */*' };
  if (previous?.archiveLastModified) headers['If-Modified-Since'] = previous.archiveLastModified;

  let res;
  try {
    res = await fetch(ARCHIVE_URL, { headers });
  } catch (err) {
    return { status: 'failed', detail: err.message };
  }
  if (res.status === 304) return { status: 'unchanged', ageDays };
  if (res.status === 403 && res.headers.get('cf-mitigated')) return { status: 'blocked', detail: 'défi Cloudflare (agent pas encore autorisé)' };
  if (!res.ok) return { status: 'failed', detail: `HTTP ${res.status}` };

  const buf = Buffer.from(await res.arrayBuffer());
  // Un 200 ne prouve rien : une page HTML de défi peut aussi répondre 200. On
  // exige la signature d'une archive ZIP (« PK\x03\x04 ») avant d'y toucher.
  if (buf.length < 1_000_000 || buf.readUInt32LE(0) !== 0x04034b50) {
    return { status: 'failed', detail: `réponse qui n'est pas une archive ZIP (${buf.length} octets, type ${res.headers.get('content-type')})` };
  }
  mkdirSync('data/source', { recursive: true });
  writeFileSync(ZIP_PATH, buf);
  return { status: 'downloaded', bytes: buf.length, lastModified: res.headers.get('last-modified') };
}

async function main() {
  const previous = readPrevious();
  let archiveLastModified = previous?.archiveLastModified ?? null;
  let archiveDate = null; // date de l'ARCHIVE, pas du calcul

  if (!process.env.LOBBY_ZIP) {
    const r = await fetchArchive(previous);
    switch (r.status) {
      case 'too-recent':
        console.log(`  lobbying : données de ${r.ageDays} j, sous le seuil de ${ARCHIVE_MIN_AGE_DAYS} j — aucune requête au registre.`);
        if (!existsSync(ZIP_PATH)) return; // données fraîches et pas d'archive locale : rien à faire
        break;
      case 'unchanged':
        console.log('  lobbying : archive inchangée depuis la dernière lecture (304) — rien à retélécharger.');
        return;
      case 'downloaded':
        console.log(`  lobbying : archive téléchargée automatiquement (${(r.bytes / 1e6).toFixed(1)} Mo).`);
        archiveLastModified = r.lastModified ?? archiveLastModified;
        if (r.lastModified) archiveDate = new Date(r.lastModified).toISOString();
        break;
      case 'blocked':
      case 'failed':
        console.warn(`  ⚠ téléchargement automatique impossible : ${r.detail}. Repli sur l'archive locale.`);
        break;
    }
  }

  if (!existsSync(ZIP_PATH)) {
    console.warn(`⚠ ${ZIP_PATH} absent — lobbying sauté, données précédentes conservées.`);
    console.warn('  Télécharger « communications_ocl_cal.zip » depuis le registre (navigateur)');
    console.warn(`  puis le déposer dans ${ZIP_PATH}. Voir l'en-tête de ce fichier.`);
    return; // sortie propre : le build quotidien ne casse jamais
  }
  // Archive déposée à la main (ou téléchargée sans en-tête Last-Modified) : la date
  // du fichier est la meilleure approximation honnête de la date des données.
  archiveDate ??= statSync(ZIP_PATH).mtime.toISOString();
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
  const detailsCsv = get('Communication_SubjectMatterDetailsExport.csv');

  // Passe préalable : quels radicaux sont trop répandus pour prouver quoi que ce
  // soit ? Mesuré sur le corpus lui-même, donc valable au fil des mois.
  const { banned, rare } = (() => {
    const it = csvRows(detailsCsv);
    const idx = headerIndex(it.next().value);
    const cDesc = need(idx, 'DESCRIPTION');
    const descs = [];
    for (const r of it) if (r[cDesc]) descs.push(r[cDesc]);
    return corpusStemFrequency(descs);
  })();

  const stemsByBill = new Map();
  for (const [num, b] of known) {
    const s = billStems(b);
    for (const k of banned) s.delete(k);
    stemsByBill.set(num, s);
  }

  // GARDE-FOU 3 — comparer au projet qui portait CE numéro avant.
  // Le décisif, quand deux titres partagent un mot banal : lequel des deux la
  // description décrit-elle vraiment ? « Bill C-11, Copyright Modernization Act »
  // partage « moder » avec la Loi sur la modernisation du système de justice
  // militaire — mais il partage « copyr » ET « moder » avec le C-11 de la 41e
  // législature. Le passé gagne, donc on refuse. Voir scrapers/past-bill-titles.js.
  const pastStems = new Map();
  if (existsSync(PAST_PATH)) {
    const past = JSON.parse(readFileSync(PAST_PATH, 'utf-8')).titles || {};
    for (const [num, list] of Object.entries(past)) {
      if (!known.has(num)) continue;
      pastStems.set(num, list.map((t) => {
        const s = stems(t);
        for (const k of banned) s.delete(k);
        return s;
      }));
    }
    console.log(`  ${pastStems.size} numéros confrontés à leurs anciens porteurs`);
  } else {
    console.warn(`  ⚠ ${PAST_PATH} absent — désambiguïsation par les législatures passées désactivée.`);
  }
  console.log(`  ${banned.size} radicaux écartés comme trop courants (> ${CORPUS_STEM_MAX_SHARE * 100} % des descriptions)`);

  const billsByComlog = new Map();
  let rejected = 0;
  let rejectedOtherAct = 0;
  let rejectedWeak = 0;
  let rejectedOldBill = 0;
  {
    const rows = csvRows(detailsCsv);
    const idx = headerIndex(rows.next().value);
    const cId = need(idx, 'COMLOG_ID');
    const cDesc = need(idx, 'DESCRIPTION');
    for (const r of rows) {
      const desc = r[cDesc];
      if (!desc) continue;
      const hits = numbersMentioned(desc);
      if (!hits.size) continue;
      let descStems = null;
      let actStems = null; // vocabulaire des lois nommées dans la description
      const id = r[cId];
      for (const num of hits) {
        if (!known.has(num)) continue; // pas un projet de la session courante
        descStems ??= stems(desc);
        const wanted = stemsByBill.get(num);
        const matched = [...wanted].filter((k) => descStems.has(k));
        if (!matched.length) { rejected++; continue; } // numéro sans le titre → autre législature

        // Un ancien projet du même numéro colle-t-il STRICTEMENT mieux ?
        // L'égalité ne prouve rien : « Building Canada Act (Bill C-5, Part 2) »
        // marquait 1 pour l'actuel et 1 pour un vieux C-5 sur un mot sans rapport
        // — refuser à égalité jetait 66 attributions parfaitement claires.
        const olds = pastStems.get(num);
        if (olds) {
          let best = 0;
          for (const s of olds) {
            let n = 0;
            for (const k of s) if (descStems.has(k)) n++;
            if (n > best) best = n;
          }
          if (best > matched.length) {
            rejectedOldBill++;
            if (DEBUG_BILL === num) console.log(`\n  ✗ REFUSÉ (actuel ${matched.length} [${matched.join(',')}] vs ancien ${best})\n    ${desc.replace(/\s+/g, ' ').slice(0, 220)}`);
            continue;
          }
        }

        if (actStems === null) {
          // On ne retient que les lois VRAIMENT nommées : « the Act » tout court
          // ne donne aucun radical et ferait tout rejeter à tort.
          const acts = namedActs(desc).map((a) => stems(a)).filter((s) => s.size);
          actStems = acts.length ? acts : false;
        }

        if (actStems) {
          // Des lois sont nommées : l'une d'elles doit être celle-ci. Sinon la
          // description parle d'un autre texte — signature des mentions périmées.
          if (!actStems.some((s) => matched.some((k) => s.has(k)))) { rejectedOtherAct++; continue; }
        } else if (!matched.some((k) => rare.has(k))) {
          // Aucune loi nommée : seul un mot rare peut porter la preuve à lui seul.
          rejectedWeak++;
          continue;
        }

        // Sonde d'audit : LOBBY_DEBUG=C-11 affiche ce qui est retenu pour ce
        // projet et POURQUOI. Indispensable pour re-vérifier les appariements à
        // chaque nouvelle archive — les collisions de numéros changent tous les mois.
        if (DEBUG_BILL === num) {
          console.log(`\n  [${matched.join(',')}]${actStems ? ' via loi nommée' : ' via mot rare'}\n    ${desc.replace(/\s+/g, ' ').slice(0, 260)}`);
        }
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
    // La date des DONNÉES, pas celle du calcul : c'est elle qui s'affiche sur le site
    // (« au 10 sept. »), qui arme l'alerte de péremption et le seuil mensuel. Reparser
    // une vieille archive ne doit pas faire croire que les données sont fraîches.
    scrapedAt: archiveDate,
    parsedAt: new Date().toISOString(),
    archiveLastModified, // pour la requête conditionnelle suivante (If-Modified-Since)
    billsWithLobbying: Object.keys(out).length,
    bills: out,
  }, null, 2));

  const totalComms = Object.values(out).reduce((a, b) => a + b.total, 0);
  console.log(`Lobbying écrit dans ${OUT_PATH}`);
  console.log(`  ${Object.keys(out).length} projets de loi avec du lobbying déclaré · ${totalComms} communications (depuis ${sessionStart})`);
  console.log(`  écartées : ${rejected} numéros sans le titre, ${rejectedOldBill} décrivant un ancien projet du même numéro, ${rejectedOtherAct} nommant une autre loi, ${rejectedWeak} sur un mot trop banal, ${tooEarly} antérieures à la 1re lecture`);
  const top = Object.entries(out).sort((a, b) => b[1].total - a[1].total).slice(0, 5);
  console.log('  top projets :', top.map(([n, v]) => `${n} (${v.total})`).join(' · '));
}

function clean(s) {
  if (s == null) return null;
  const t = String(s).trim();
  return t === '' || t.toLowerCase() === 'null' ? null : t;
}

main().catch((err) => {
  console.error('Échec de lobbying.js :', err.message);
  process.exitCode = 1;
});
