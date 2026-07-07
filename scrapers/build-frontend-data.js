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
// Ce build produit un JSON autonome (pas d'injection dans index.html : le gabarit
// QC n'est pas encore adapté au modèle fédéral bicaméral). Le frontand, une fois
// adapté, consommera ce fichier.

import { readFileSync, writeFileSync, existsSync } from 'node:fs';

const BILLS_PATH = 'data/bills.json';
const DEPUTES_PATH = 'data/deputes.json';
const VOTES_PATH = 'data/votes.json';
const OUT_PATH = 'data/frontend.json';
const HTML_PATH = 'index.html';
const START_MARKER = '/* BILLS_DATA_START';
const END_MARKER = '/* BILLS_DATA_END */';
const DEP_START_MARKER = '/* DEPUTES_DATA_START';
const DEP_END_MARKER = '/* DEPUTES_DATA_END */';
const VOTES_START_MARKER = '/* VOTES_DATA_START';
const VOTES_END_MARKER = '/* VOTES_DATA_END */';
const MIN_START_MARKER = '/* MINISTERS_DATA_START';
const MIN_END_MARKER = '/* MINISTERS_DATA_END */';
const MINISTERS_PATH = 'data/ministers.json';

function read(path) {
  return JSON.parse(readFileSync(path, 'utf-8'));
}

// Remplace le contenu entre deux marqueurs par `const <varName> = <data>;`.
// Garde le prototype autonome (données inline, pas de fetch).
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

  const out = {
    generatedAt: new Date().toISOString(),
    session: billsData.session ?? votesData.session ?? null,
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

  // Injecte les projets de loi (prêts pour billCard) directement dans index.html
  // entre les marqueurs BILLS_DATA — le prototype reste un fichier HTML autonome,
  // sans fetch. On ne garde que les champs consommés par le rendu.
  const frontendBills = billsOut.map((b) => ({
    id: b.id,
    num: b.num,
    chamber: b.chamber,
    title: b.title,
    type: b.type,
    sponsor: b.sponsor,
    state: b.state,
    reinstated: b.reinstated,
    milestones: b.milestones,
    lastActivity: b.lastActivity,
    latestActivity: { fr: b.latestActivity.fr, en: b.latestActivity.en },
    url: b.url,
    divisions: b.divisions,
  }));

  // Députés prêts pour le rendu (roster fédéral + bilan de votes précalculé).
  const frontendDeputes = deputesOut.map((d) => ({
    id: d.id,
    name: d.name,
    honorific: d.honorific,
    party: d.party,
    constituency: d.constituency,
    province: d.province,
    memberSince: d.memberSince,
    url: d.url,
    votingRecord: d.votingRecord,
  }));

  // Scrutins prêts pour le rendu (résultat, totaux, ballots par PersonId, lien projet).
  const frontendVotes = resolvedVotes.map((v) => ({
    number: v.number,
    date: v.date,
    description: v.description,
    result: v.result,
    passed: v.passed,
    totals: v.totals,
    billNumber: v.billNumber,
    billId: v.billId,
    url: v.url,
    ballots: v.ballots,
  }));

  const stamp = new Date().toISOString();
  let html = readFileSync(HTML_PATH, 'utf-8');
  html = injectBlock(html, START_MARKER, END_MARKER, 'bills', frontendBills, stamp);
  html = injectBlock(html, DEP_START_MARKER, DEP_END_MARKER, 'deputes', frontendDeputes, stamp);
  html = injectBlock(html, VOTES_START_MARKER, VOTES_END_MARKER, 'votes', frontendVotes, stamp);
  // Ministres : fichier séparé (scrapers/ministers.js) — injecté s'il existe.
  if (existsSync(MINISTERS_PATH)) {
    const ministers = read(MINISTERS_PATH).ministers;
    html = injectBlock(html, MIN_START_MARKER, MIN_END_MARKER, 'ministers', ministers, stamp);
  }
  writeFileSync(HTML_PATH, html);

  console.log(`Fusion écrite dans ${OUT_PATH}`);
  console.log(`  ${frontendBills.length} projets · ${frontendDeputes.length} députés · ${frontendVotes.length} scrutins injectés dans ${HTML_PATH}`);
  console.log(`  ${billsOut.length} projets · ${deputesOut.length} députés · ${resolvedVotes.length} scrutins`);
  console.log(`  scrutins reliés à un projet : ${out.meta.votesLinkedToBill}`);
  console.log(`  ancien·ne·s député·e·s présent·e·s dans les votes : ${formerVoterIds.size}`);
  if (unresolved.length) {
    console.log(`  ⚠ ${unresolved.length} vote(s) avec projet non résolu : ${unresolved.map((v) => `#${v.number}→${v.billNumber}`).join(', ')}`);
  }
}

main();
