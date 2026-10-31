// ARCHIVES PAR LÉGISLATURE — recopie, à chaque build, les projets de loi et les votes de la
// législature en direct dans data/archives/<n>/ :
//   d-bills.js (projets + lobbying), d-votes.js (Communes + Sénat), votes/<id>.json (qui a
//   voté quoi), bill-texts.json (sommaires et résumés en clair).
// Dès que la session passe à une nouvelle législature (SESSION « 46-1 »), l'ancienne n'est
// plus recopiée : son dossier reste figé et elle entre dans data/archives/index.json
// { enDirect, legislatures } (legislatures = les législatures terminées, consultables).
// L'index est aussi recopié dans data/site-data.js (const ARCHIVES) : le site sait sans
// requête quelles archives existent (onglet Archives, liens « N PL » des législatures passées).
//
// Les copies sont autonomes : les étiquettes en dictionnaire (DICTS) y sont remises en clair
// et chaque projet ou vote porte son adresse officielle, qui dépend de la session.
// Appelé à la fin de scrapers/build-frontend-data.js ; lançable seul : node scripts/archive-legislature.js
import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync, rmSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const SITE_DATA = 'data/site-data.js';
const ROOT = 'data/archives';
const INDEX = `${ROOT}/index.json`;
const START = '/* ARCHIVES_DATA_START */';
const END = '/* ARCHIVES_DATA_END */';

function sets(path) {
  const out = {};
  for (const line of readFileSync(path, 'utf-8').split(/\r?\n/)) {
    const m = /^(\w+)\.push\(\.\.\.(\[[\s\S]*\])\);$/.exec(line.trim())
      || /^Object\.assign\((\w+), (\{[\s\S]*\})\);$/.exec(line.trim());
    if (m) out[m[1]] = JSON.parse(m[2]);
  }
  return out;
}
const body = (s) => Object.entries(s).map(([k, v]) => (Array.isArray(v)
  ? `${k}.push(...${JSON.stringify(v)});` : `Object.assign(${k}, ${JSON.stringify(v)});`)).join('\n') + '\n';
// N'écrit que si le contenu change : pas de commit de nuit pour rien.
function writeIfChanged(path, text) {
  if (existsSync(path) && readFileSync(path, 'utf-8') === text) return false;
  writeFileSync(path, text, 'utf-8');
  return true;
}

export function archiveLegislature() {
  const site = readFileSync(SITE_DATA, 'utf-8');
  const session = /const SESSION = "([^"]+)"/.exec(site)?.[1];
  const leg = Number(String(session || '').split('-')[0]);
  if (!leg) { console.log('  archives : session introuvable, rien recopié'); return; }
  const dicts = JSON.parse(/const DICTS = (\{[\s\S]*?\});\r?\n\/\* DICTS_DATA_END/.exec(site)?.[1] || '{}');
  const [p, s] = session.split('-');

  const index = existsSync(INDEX) ? JSON.parse(readFileSync(INDEX, 'utf-8')) : { enDirect: leg, legislatures: [] };
  // Changement de législature : l'ancienne devient une archive, figée.
  if (index.enDirect && index.enDirect !== leg && existsSync(`${ROOT}/${index.enDirect}`)
      && !index.legislatures.includes(index.enDirect)) index.legislatures.push(index.enDirect);
  index.enDirect = leg;
  index.legislatures = index.legislatures.filter((n) => n !== leg).sort((a, b) => b - a);

  const dir = `${ROOT}/${leg}`;
  mkdirSync(`${dir}/votes`, { recursive: true });
  let changed = 0;
  const head = (name) => `// DossierCanada — ARCHIVE de la ${leg}e législature : ${name}. Fichier GÉNÉRÉ par\n`
    + '// scripts/archive-legislature.js ; recopié de data/ tant que la législature est en direct.\n';

  // Projets de loi : étiquettes en clair, adresse LEGISinfo de la session.
  const b = sets('data/d-bills.js');
  const put = (rows, field, table) => { for (const r of rows || []) if (typeof r[field] === 'number' && table) r[field] = table[r[field]]; };
  put(b.bills, 'type', dicts.types);
  put(b.bills, 'latestActivity', dicts.activities);
  put(b.bills, 'sponsorParty', dicts.parties);
  for (const x of b.bills || []) if (!x.url) {
    const num = String(x.num).toLowerCase();
    x.url = { fr: `https://www.parl.ca/legisinfo/fr/projet-de-loi/${session}/${num}`, en: `https://www.parl.ca/legisinfo/en/bill/${session}/${num}` };
  }
  changed += writeIfChanged(`${dir}/d-bills.js`, head('projets de loi') + body(b));

  // Votes : adresse noscommunes.ca de la session (le Sénat garde la sienne, déjà en donnée).
  const v = sets('data/d-votes.js');
  for (const x of v.votes || []) if (!x.url) x.url = {
    fr: `https://www.ourcommons.ca/members/fr/votes/${p}/${s}/${x.number}`,
    en: `https://www.ourcommons.ca/members/en/votes/${p}/${s}/${x.number}`,
  };
  changed += writeIfChanged(`${dir}/d-votes.js`, head('votes') + body(v));

  if (existsSync('data/bill-texts.json')) changed += writeIfChanged(`${dir}/bill-texts.json`, readFileSync('data/bill-texts.json', 'utf-8'));

  // Qui a voté quoi : un fichier par vote, comme data/votes/.
  const live = new Set(existsSync('data/votes') ? readdirSync('data/votes').filter((f) => f.endsWith('.json')) : []);
  for (const f of live) changed += writeIfChanged(`${dir}/votes/${f}`, readFileSync(`data/votes/${f}`, 'utf-8'));
  for (const f of readdirSync(`${dir}/votes`)) if (!live.has(f)) { rmSync(`${dir}/votes/${f}`); changed++; }

  writeIfChanged(INDEX, JSON.stringify(index, null, 2) + '\n');
  // Recopie de l'index dans le noyau du site.
  const nl = site.includes('\r\n') ? '\r\n' : '\n';
  const bloc = `${START}${nl}const ARCHIVES = ${JSON.stringify(index)};${nl}${END}`;
  const i = site.indexOf(START), j = site.indexOf(END);
  let out;
  if (i !== -1 && j !== -1) out = site.slice(0, i) + bloc + site.slice(j + END.length);
  else {
    const k = site.indexOf('/* SESSION_DATA_END */') + '/* SESSION_DATA_END */'.length;
    out = site.slice(0, k) + nl + nl + bloc + site.slice(k);
  }
  writeIfChanged(SITE_DATA, out);
  console.log(`  archives : ${leg}e législature recopiée dans ${dir}/ (${changed} fichier(s) changé(s)) · terminées : ${index.legislatures.join(', ') || 'aucune'}`);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) archiveLegislature();
