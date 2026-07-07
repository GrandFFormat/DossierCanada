// Scraper — Votes par appel nominal de la Chambre des communes
//
// Source : exports XML officiels de la Chambre des communes.
//   Liste des votes  : https://www.ourcommons.ca/members/{en,fr}/votes/xml
//   Détail nominatif : https://www.ourcommons.ca/members/en/votes/{parl}/{sess}/{num}/xml
//   Licence du gouvernement ouvert – Canada.
//
// Pourquoi ourcommons et pas OpenParliament ? OpenParliament identifie chaque
// votant par un slug (« ziad-aboultaif ») alors que data/deputes.json est clé par
// PersonId. La source officielle donne le détail nominatif directement clé par
// PersonId — jointure propre avec les député·e·s, sans pont fragile par le nom. Elle
// est aussi bilingue (le sujet et le résultat du vote diffèrent en français) et fait
// autorité sur les décomptes.
//
// Chaque vote peut être rattaché à un projet de loi (BillNumberCode, ex. « C-30 »).
// On stocke ce numéro + la session ; la RÉSOLUTION vers l'id stable de data/bills.json
// est laissée à l'étape de fusion (le couple session+numéro est unique dans une
// session, mais le numéro seul ne l'est pas — voir bills.js). 77 des 173 votes ne
// portent sur aucun projet de loi (motions, autres affaires) → billNumber = null.
//
// Aucune donnée inventée : la valeur du vote de chaque député·e vient des drapeaux
// officiels IsVoteYea/IsVoteNay/IsVotePaired (indépendants de la langue). Un·e
// député·e absent·e n'apparaît tout simplement pas dans la liste — on ne suppose rien.
// Garde-fou : on compare notre décompte extrait au décompte officiel de la liste, et
// on avertit à la moindre divergence plutôt que de publier un total silencieusement faux.
//
// Modèle produit (data/votes.json → votes[]) :
//   /**
//    * @typedef {Object} Vote
//    * @property {number} number        Numéro de scrutin dans la session (ex. 173)
//    * @property {string} session       Code de session, ex. "45-1"
//    * @property {number} parliament
//    * @property {number} sessionNumber
//    * @property {string} date          AAAA-MM-JJ
//    * @property {{en:string, fr:string}} description  Sujet du scrutin
//    * @property {{en:string, fr:string}} result       Résultat textuel (ex. "Agreed To"/"Adoptée")
//    * @property {boolean} passed        Vrai si la motion est adoptée
//    * @property {{yea:number, nay:number, paired:number}} totals  Décomptes officiels
//    * @property {{en:string, fr:string}} documentType  Type de décision (ex. "Legislative Process")
//    * @property {string|null} billNumber  Projet de loi visé (ex. "C-30") ou null
//    * @property {{en:string, fr:string}} url  Page du scrutin sur ourcommons.ca
//    * @property {Object.<string,'yea'|'nay'|'paired'>} ballots  PersonId → vote nominal
//    */

import { writeFileSync, mkdirSync } from 'node:fs';
import * as cheerio from 'cheerio';

// Session ciblée. Par défaut 45e législature, 1re session. Surchargable : `node scrapers/votes.js 44-1`.
const SESSION = process.argv[2] || '45-1';
const [PARLIAMENT, SESSION_NUMBER] = SESSION.split('-').map(Number);
const OUT_PATH = 'data/votes.json';
const USER_AGENT = 'DossierCanada/0.1 (veille citoyenne; mart.archambault@gmail.com)';
const REQUEST_DELAY_MS = 250; // politesse entre les fetch de détail
// Plafond de test : `VOTE_LIMIT=5 node scrapers/votes.js` ne traite que 5 scrutins.
const VOTE_LIMIT = process.env.VOTE_LIMIT ? Number(process.env.VOTE_LIMIT) : Infinity;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function fetchXml(url) {
  const res = await fetch(url, { headers: { 'User-Agent': USER_AGENT, Accept: 'application/xml' } });
  if (!res.ok) throw new Error(`HTTP ${res.status} pour ${url}`);
  return cheerio.load(await res.text(), { xml: true });
}

function toDate(dt) {
  return dt ? dt.slice(0, 10) : null;
}

// Lit la liste des votes d'un feed (une langue) → Map(numéro → champs utiles).
function parseVoteList($) {
  const byNumber = new Map();
  $('Vote').each((_, el) => {
    const $v = $(el);
    if (Number($v.find('ParliamentNumber').text()) !== PARLIAMENT) return;
    if (Number($v.find('SessionNumber').text()) !== SESSION_NUMBER) return;
    const number = Number($v.find('DecisionDivisionNumber').text());
    byNumber.set(number, {
      number,
      date: toDate($v.find('DecisionEventDateTime').text()),
      subject: $v.find('DecisionDivisionSubject').text().trim(),
      result: $v.find('DecisionResultName').text().trim(),
      documentType: $v.find('DecisionDivisionDocumentTypeName').text().trim(),
      yea: Number($v.find('DecisionDivisionNumberOfYeas').text()),
      nay: Number($v.find('DecisionDivisionNumberOfNays').text()),
      paired: Number($v.find('DecisionDivisionNumberOfPaired').text()),
      billNumber: $v.find('BillNumberCode').text().trim() || null,
    });
  });
  return byNumber;
}

// Récupère le détail nominatif d'un scrutin → { ballots, extracted }.
// ballots : PersonId (chaîne) → 'yea' | 'nay' | 'paired'.
async function fetchBallots(number) {
  const url = `https://www.ourcommons.ca/members/en/votes/${PARLIAMENT}/${SESSION_NUMBER}/${number}/xml`;
  const $ = await fetchXml(url);
  const ballots = {};
  const extracted = { yea: 0, nay: 0, paired: 0 };
  $('VoteParticipant').each((_, el) => {
    const $p = $(el);
    const personId = $p.find('PersonId').text().trim();
    if (!personId) return;
    let value = null;
    if ($p.find('IsVoteYea').text() === 'true') value = 'yea';
    else if ($p.find('IsVoteNay').text() === 'true') value = 'nay';
    else if ($p.find('IsVotePaired').text() === 'true') value = 'paired';
    if (!value) return; // pas de drapeau reconnu → on ne devine pas
    ballots[personId] = value;
    extracted[value]++;
  });
  return { ballots, extracted };
}

async function main() {
  const [$en, $fr] = await Promise.all([
    fetchXml('https://www.ourcommons.ca/members/en/votes/xml'),
    fetchXml('https://www.ourcommons.ca/members/fr/votes/xml'),
  ]);
  const listEn = parseVoteList($en);
  const listFr = parseVoteList($fr);

  // Ordre croissant des numéros ; on plafonne éventuellement pour les tests.
  let numbers = [...listEn.keys()].sort((a, b) => a - b);
  if (VOTE_LIMIT !== Infinity) numbers = numbers.slice(-VOTE_LIMIT); // les plus récents

  const votes = [];
  let mismatches = 0;
  for (const number of numbers) {
    const en = listEn.get(number);
    const fr = listFr.get(number) ?? {};
    const { ballots, extracted } = await fetchBallots(number);

    // Garde-fou : le détail nominatif doit reproduire les décomptes officiels de la liste.
    for (const key of ['yea', 'nay', 'paired']) {
      if (extracted[key] !== en[key]) {
        mismatches++;
        console.error(`  ⚠ scrutin ${number} : ${key} extrait=${extracted[key]} ≠ officiel=${en[key]}`);
      }
    }

    votes.push({
      number,
      session: SESSION,
      parliament: PARLIAMENT,
      sessionNumber: SESSION_NUMBER,
      date: en.date,
      description: { en: en.subject, fr: fr.subject ?? null },
      result: { en: en.result, fr: fr.result ?? null },
      passed: /agreed/i.test(en.result),
      totals: { yea: en.yea, nay: en.nay, paired: en.paired },
      documentType: { en: en.documentType, fr: fr.documentType ?? null },
      billNumber: en.billNumber,
      url: {
        en: `https://www.ourcommons.ca/members/en/votes/${PARLIAMENT}/${SESSION_NUMBER}/${number}`,
        fr: `https://www.ourcommons.ca/members/fr/votes/${PARLIAMENT}/${SESSION_NUMBER}/${number}`,
      },
      ballots,
    });

    if (votes.length % 25 === 0) console.log(`  … ${votes.length}/${numbers.length} scrutins traités`);
    await sleep(REQUEST_DELAY_MS);
  }

  votes.sort((a, b) => b.number - a.number); // plus récent d'abord

  mkdirSync('data', { recursive: true });
  writeFileSync(
    OUT_PATH,
    JSON.stringify(
      {
        source: 'https://www.ourcommons.ca/members/en/votes/xml',
        session: SESSION,
        scrapedAt: new Date().toISOString(),
        count: votes.length,
        votes,
      },
      null,
      2
    )
  );

  const withBill = votes.filter((v) => v.billNumber).length;
  console.log(`${votes.length} scrutins (session ${SESSION}) écrits dans ${OUT_PATH}`);
  console.log(`  rattachés à un projet de loi : ${withBill} | motions/autres : ${votes.length - withBill}`);
  console.log(mismatches ? `  ⚠ ${mismatches} divergence(s) de décompte — à investiguer.` : '  ✓ tous les décomptes concordent avec l\'officiel.');
}

main().catch((err) => {
  console.error('Échec du scraper votes.js :', err);
  process.exitCode = 1;
});
