// MÉMOIRES DÉPOSÉS EN COMITÉ (Communes) — 7 nov. 2026, portée de DossierQuébec.
//
// Pour chaque projet de loi de data/bills.json :
//   1. le JSON LEGISinfo du projet (https://www.parl.ca/legisinfo/en/bill/45-1/c-5/json)
//      donne, étape par étape aux Communes, le comité (CommitteeAcronym) et l'étude
//      (StudyActivityId) ;
//   2. la liste des mémoires de l'étude, en HTML, vient de GetBriefs (le fragment
//      que la page StudyActivity charge en AJAX), en anglais ET en français :
//      https://www.ourcommons.ca/committees/en/TRAN/StudyActivity/GetBriefs?studyActivityId=13100297
//      Les deux versions s'apparient par l'identifiant BR… du lien. Le nom du fichier
//      français diffère souvent de l'anglais : on prend le lien de la page /fr/ tel quel,
//      et le lien anglais quand la version française manque.
// Sénat : hors portée pour l'instant.
//
// robots.txt d'ourcommons.ca (relu le 7 nov. 2026) : n'interdit que /Search/,
// /PublicationSearch/, /Embed/, /ParlDataWidgets/, /ErrorPage/. GetBriefs est permis.
// Politesse : 1,2 s entre requêtes, User-Agent identifié, et un CACHE dans le fichier
// de sortie : le JSON LEGISinfo n'est redemandé que si l'activité du projet a changé,
// la liste des mémoires que si le projet a bougé ou qu'elle date de plus de 7 jours.
//
// Sortie : data/bill-briefs.json → { scrapedAt, bills: { <id>: { num, studies:[{acr,id}],
//   checked, briefs:[{ n:{en,fr}, u:{en,fr}, d }] } } }. Sans IA, sans coût.
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import * as cheerio from 'cheerio';

const BILLS_PATH = 'data/bills.json';
const OUT_PATH = 'data/bill-briefs.json';
const USER_AGENT = 'DossierCanada/1.0 (+https://dossiercanada.ca; site citoyen; contact mart.archambault@gmail.com)';
const DELAI = 1200;
const STUDY_MAX_AGE = 7 * 86400000;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let derniere = 0;
async function get(url) {
  const attente = derniere + DELAI - Date.now();
  if (attente > 0) await sleep(attente);
  derniere = Date.now();
  const res = await fetch(url, { headers: { 'User-Agent': USER_AGENT } });
  if (!res.ok) throw new Error(`HTTP ${res.status} — ${url}`);
  return res.text();
}

function studiesFromLegisinfo(json) {
  const o = Array.isArray(json) ? json[0] : json;
  const out = [];
  for (const st of o?.BillStages?.HouseBillStages ?? []) {
    const c = st.Committee;
    if (!c || !c.CommitteeAcronym || !c.StudyActivityId || c.IsSenateCommittee) continue;
    if (!out.some((s) => s.id === c.StudyActivityId)) out.push({ acr: c.CommitteeAcronym, id: c.StudyActivityId });
  }
  return out;
}

function parseBriefs(html) {
  const $ = cheerio.load(html);
  const map = new Map();
  $('.brief-item').each((_, el) => {
    const a = $(el).find('a.btn-brief').first();
    let href = a.attr('href');
    if (!href) return;
    if (href.startsWith('//')) href = 'https:' + href;
    else if (href.startsWith('/')) href = 'https://www.ourcommons.ca' + href;
    const br = (href.match(/\/Brief\/(BR\d+)\//) || [])[1] || href;
    const nameEl = $(el).find('.name').first().clone();
    nameEl.find('a').remove();
    const name = nameEl.text().replace(/\s+/g, ' ').trim() || (a.attr('title') || '').trim();
    const pub = $(el).find('.published').text().replace(/\s+/g, ' ').trim();
    map.set(br, { name, href, pub });
  });
  return map;
}

const MOIS = { january: 1, february: 2, march: 3, april: 4, may: 5, june: 6, july: 7, august: 8, september: 9, october: 10, november: 11, december: 12 };
function isoDate(txt) {
  const m = (txt || '').match(/([A-Z][a-z]+) (\d{1,2}), (\d{4})/);
  if (!m || !MOIS[m[1].toLowerCase()]) return null;
  return `${m[3]}-${String(MOIS[m[1].toLowerCase()]).padStart(2, '0')}-${m[2].padStart(2, '0')}`;
}

async function briefsForStudy({ acr, id }) {
  const en = parseBriefs(await get(`https://www.ourcommons.ca/committees/en/${acr}/StudyActivity/GetBriefs?studyActivityId=${id}`));
  const fr = parseBriefs(await get(`https://www.ourcommons.ca/committees/fr/${acr}/StudyActivity/GetBriefs?studyActivityId=${id}`));
  const out = [];
  for (const [br, e] of en) {
    const f = fr.get(br);
    out.push({ n: { en: e.name, fr: f?.name || e.name }, u: { en: e.href, fr: f?.href || e.href }, d: isoDate(e.pub) });
  }
  for (const [br, f] of fr) if (!en.has(br)) out.push({ n: { en: f.name, fr: f.name }, u: { en: f.href, fr: f.href }, d: null });
  return out.sort((a, z) => a.n.en.localeCompare(z.n.en, 'en'));
}

async function main() {
  const { bills, session } = JSON.parse(readFileSync(BILLS_PATH, 'utf-8'));
  const prev = existsSync(OUT_PATH) ? JSON.parse(readFileSync(OUT_PATH, 'utf-8')) : { bills: {} };
  const out = { source: 'https://www.ourcommons.ca/committees (GetBriefs)', session, scrapedAt: new Date().toISOString(), bills: {} };
  let req = 0, erreurs = 0;
  for (const b of bills) {
    const old = prev.bills?.[b.id];
    const activite = JSON.stringify(b.lastActivity ?? b.latestActivity ?? b.status ?? null);
    const entry = { num: b.num, activite, studies: old?.studies ?? [], checked: old?.checked ?? {}, briefs: old?.briefs ?? [] };
    const change = !old || old.activite !== activite;
    try {
      if (change) {
        const url = `https://www.parl.ca/legisinfo/en/bill/${b.session || session}/${b.num.toLowerCase()}/json`;
        entry.studies = studiesFromLegisinfo(JSON.parse(await get(url)));
        req++;
      }
      const tous = [];
      for (const st of entry.studies) {
        const vieux = !entry.checked[st.id] || Date.now() - Date.parse(entry.checked[st.id]) > STUDY_MAX_AGE;
        if (change || vieux) {
          st.briefs = await briefsForStudy(st);
          entry.checked[st.id] = new Date().toISOString();
          req += 2;
        } else {
          st.briefs = (old.briefs || []).filter((x) => x.s === st.id).map(({ s, ...r }) => r);
        }
        for (const x of st.briefs) if (!tous.some((y) => y.u.en === x.u.en)) tous.push({ ...x, s: st.id });
        delete st.briefs;
      }
      entry.briefs = tous;
    } catch (e) {
      erreurs++;
      console.error(`  ⚠ ${b.num} : ${e.message} — données précédentes gardées`);
      if (old) Object.assign(entry, old);
    }
    out.bills[b.id] = entry;
  }
  const avec = Object.values(out.bills).filter((x) => x.briefs.length);
  console.log(`${avec.length} projets avec mémoires, ${avec.reduce((s, x) => s + x.briefs.length, 0)} mémoires (${req} requêtes, ${erreurs} erreurs)`);
  if (erreurs && erreurs === bills.length) throw new Error('Toutes les requêtes ont échoué');
  writeFileSync(OUT_PATH, JSON.stringify(out, null, 1) + '\n');
}

main().catch((e) => { console.error(e); process.exit(1); });
