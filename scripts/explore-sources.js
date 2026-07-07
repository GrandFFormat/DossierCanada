// Reconnaissance — À quoi ressemblent les vraies données fédérales ?
//
// Ce script N'EST PAS un scraper de production. Il tape LEGISinfo et
// OpenParliament, imprime un résumé lisible de la forme des données réelles,
// et dépose quelques échantillons bruts dans data/samples/ pour inspection.
// Objectif : voir les vraies données AVANT de figer le modèle de données.
//
// Aucune donnée n'est inventée ni transformée ici — on ne fait que lire,
// résumer et échantillonner ce que les sources publiques renvoient réellement.
//
// Sources (voir README pour les licences) :
//   - LEGISinfo      https://www.parl.ca/legisinfo  (Licence du gouvernement ouvert – Canada)
//   - OpenParliament https://api.openparliament.ca  (voir conditions d'OpenParliament)
//
// Usage : npm run explore   (ou : node scripts/explore-sources.js)

import { writeFileSync, mkdirSync } from 'node:fs';

// Législature/session en cours. La 45e législature, 1re session a débuté le
// 26 mai 2025 (vérifiable dans le champ ParlSessionEn de LEGISinfo).
const SESSION = '45-1';
const SAMPLES_DIR = 'data/samples';

// OpenParliament demande explicitement un User-Agent qui identifie l'application
// et fournit un moyen de contact. On le respecte pour toutes les requêtes.
const USER_AGENT = 'DossierCanada/0.1 (veille citoyenne; mart.archambault@gmail.com)';

async function fetchJson(url) {
  const res = await fetch(url, {
    headers: { 'User-Agent': USER_AGENT, Accept: 'application/json' },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} pour ${url}`);
  return res.json();
}

// Écrit un échantillon brut pour inspection manuelle, et renvoie le chemin.
function saveSample(name, data) {
  const path = `${SAMPLES_DIR}/${name}.json`;
  writeFileSync(path, JSON.stringify(data, null, 2));
  return path;
}

// Petit utilitaire d'affichage : coupe les longues chaînes pour un aperçu lisible.
function preview(obj, max = 55) {
  const out = {};
  for (const [k, v] of Object.entries(obj)) {
    out[k] = typeof v === 'string' && v.length > max ? v.slice(0, max) + '…' : v;
  }
  return out;
}

function heading(title) {
  console.log('\n' + '═'.repeat(72));
  console.log(title);
  console.log('═'.repeat(72));
}

function countBy(items, keyFn) {
  const acc = {};
  for (const it of items) {
    const k = keyFn(it) ?? '(null)';
    acc[k] = (acc[k] ?? 0) + 1;
  }
  return acc;
}

// ─────────────────────────────────────────────────────────────────────────────
// LEGISinfo — la source canonique des projets de loi
// ─────────────────────────────────────────────────────────────────────────────
async function exploreLegisinfo() {
  heading(`LEGISinfo — projets de loi de la session ${SESSION}`);

  // Liste complète des projets de loi de la session, en un seul appel.
  const url = `https://www.parl.ca/legisinfo/en/bills/json?parlsession=${SESSION}`;
  const bills = await fetchJson(url);
  console.log(`URL      : ${url}`);
  console.log(`Total    : ${bills.length} projets de loi dans la session ${SESSION}`);

  // Répartition Communes vs Sénat (OriginatingChamberId : 1 = Communes, 2 = Sénat,
  // d'après les données ; on l'expose tel quel plutôt que de le supposer).
  const chamberLabel = (id) => (id === 1 ? 'Communes (C-)' : id === 2 ? 'Sénat (S-)' : `chambre ${id}`);
  console.log('\nPar chambre d\'origine :', countBy(bills, (b) => chamberLabel(b.OriginatingChamberId)));
  console.log('Par type de projet    :', countBy(bills, (b) => b.BillTypeEn));
  console.log('Par statut courant    :', countBy(bills, (b) => b.CurrentStatusEn));

  // Un projet de loi gouvernemental des Communes, pour montrer la timeline
  // bicamérale complète (les 6 lectures + sanction royale).
  const sample =
    bills.find((b) => b.BillNumberFormatted?.startsWith('C-') && b.ReceivedRoyalAssentDateTime) ??
    bills.find((b) => b.BillNumberFormatted?.startsWith('C-')) ??
    bills[0];

  console.log(`\n─── Exemple : ${sample.BillNumberFormatted} ───`);
  console.log(`Titre (EN) : ${sample.LongTitleEn}`);
  console.log(`Titre (FR) : ${sample.LongTitleFr}`);
  console.log(`Parrain    : ${sample.SponsorEn} / ${sample.SponsorFr}`);
  console.log(`Type       : ${sample.BillTypeEn} — ${sample.BillTypeFr}`);
  console.log(`Statut     : ${sample.CurrentStatusEn} — ${sample.CurrentStatusFr}`);
  console.log('\nJalons (le cœur du cycle bicaméral fédéral) :');
  const milestones = [
    ['Communes — 1re lecture', sample.PassedHouseFirstReadingDateTime],
    ['Communes — 2e lecture', sample.PassedHouseSecondReadingDateTime],
    ['Communes — 3e lecture', sample.PassedHouseThirdReadingDateTime],
    ['Sénat — 1re lecture', sample.PassedSenateFirstReadingDateTime],
    ['Sénat — 2e lecture', sample.PassedSenateSecondReadingDateTime],
    ['Sénat — 3e lecture', sample.PassedSenateThirdReadingDateTime],
    ['Sanction royale', sample.ReceivedRoyalAssentDateTime],
  ];
  for (const [label, date] of milestones) {
    console.log(`  ${date ? '✓' : '·'} ${label.padEnd(24)} ${date ? date.slice(0, 10) : '—'}`);
  }

  console.log(`\nTous les champs disponibles (${Object.keys(sample).length}) :`);
  console.log('  ' + Object.keys(sample).join(', '));

  const path = saveSample('legisinfo-bills-45-1', bills);
  console.log(`\n→ Liste complète sauvegardée : ${path}`);
  return { bills, sample };
}

// ─────────────────────────────────────────────────────────────────────────────
// OpenParliament — députés, votes, et une 2e vue des projets de loi
// ─────────────────────────────────────────────────────────────────────────────
async function exploreOpenParliament() {
  heading('OpenParliament — députés, votes, projets de loi');

  // Députés en poste (la liste par défaut renvoie les député·es actuel·les).
  const pols = await fetchJson('https://api.openparliament.ca/politicians/?format=json&limit=5');
  console.log(`Députés — champs par entrée : ${Object.keys(pols.objects[0]).join(', ')}`);
  console.log('Exemple :', JSON.stringify(preview(pols.objects[0]), null, 1));
  console.log('(pagination :', JSON.stringify(pols.pagination) + ')');
  saveSample('openparliament-politicians-sample', pols);

  // Votes récents de la session courante. Note : chaque vote pointe vers un
  // bill_url quand il est rattaché à un projet de loi — c'est le lien vote↔loi.
  const votes = await fetchJson(`https://api.openparliament.ca/votes/?format=json&session=${SESSION}&limit=5`);
  console.log(`\nVotes — champs par entrée : ${Object.keys(votes.objects[0]).join(', ')}`);
  console.log('Vote le plus récent :', JSON.stringify(preview(votes.objects[0]), null, 1));
  saveSample('openparliament-votes-sample', votes);

  // Projets de loi vus par OpenParliament (2e source, pour recouper LEGISinfo).
  const bills = await fetchJson(`https://api.openparliament.ca/bills/?format=json&session=${SESSION}&limit=5`);
  console.log(`\nProjets de loi (OpenParliament) — champs : ${Object.keys(bills.objects[0]).join(', ')}`);
  console.log('Exemple :', JSON.stringify(preview(bills.objects[0]), null, 1));
  saveSample('openparliament-bills-sample', bills);

  return { pols, votes, bills };
}

// ─────────────────────────────────────────────────────────────────────────────
// Test de jointure — LEGISinfo.BillId  ⇔  OpenParliament.legisinfo_id ?
// Question décisive pour le modèle : peut-on relier de façon fiable un projet de
// loi entre les deux sources ? On le vérifie sur un vrai projet de la session,
// on ne le suppose pas.
// ─────────────────────────────────────────────────────────────────────────────
async function testJoinKey(legisBills) {
  heading('Test de jointure LEGISinfo ⇔ OpenParliament');

  // On prend un projet des Communes bien avancé de la session courante.
  const legis =
    legisBills.find((b) => b.BillNumberFormatted?.startsWith('C-') && b.IsFromCurrentSession) ??
    legisBills.find((b) => b.BillNumberFormatted?.startsWith('C-'));
  if (!legis) {
    console.log('Aucun projet des Communes trouvé pour le test — ignoré.');
    return;
  }

  const num = legis.BillNumberFormatted; // ex. "C-5"
  const opUrl = `https://api.openparliament.ca/bills/${SESSION}/${num}/?format=json`;
  let op;
  try {
    op = await fetchJson(opUrl);
  } catch (err) {
    console.log(`OpenParliament n'a pas ${num} (${err.message}) — jointure non vérifiable sur ce cas.`);
    return;
  }

  console.log(`Projet testé            : ${num} — ${legis.LongTitleEn}`);
  console.log(`LEGISinfo.BillId        : ${legis.BillId}`);
  console.log(`OpenParliament.legisinfo_id : ${op.legisinfo_id}`);
  const match = Number(op.legisinfo_id) === Number(legis.BillId);
  console.log(`\n${match ? '✓ CONCORDANCE' : '✗ PAS DE CONCORDANCE'} : legisinfo_id ${match ? '===' : '!=='} BillId`);
  console.log(
    match
      ? '→ On peut joindre les deux sources par cet identifiant. À reconfirmer sur un lot.'
      : '→ Ces deux identifiants ne coïncident pas ; la jointure devra passer par (session, numéro).'
  );
}

async function main() {
  mkdirSync(SAMPLES_DIR, { recursive: true });
  const { bills: legisBills } = await exploreLegisinfo();
  await exploreOpenParliament();
  await testJoinKey(legisBills);

  console.log('\n' + '═'.repeat(72));
  console.log('Terminé. Échantillons bruts dans data/samples/ pour inspection.');
  console.log('═'.repeat(72));
}

main().catch((err) => {
  console.error('\nÉchec de la reconnaissance :', err);
  process.exitCode = 1;
});
