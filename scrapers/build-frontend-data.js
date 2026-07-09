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
    sponsorPersonId: b.sponsorPersonId ?? null,
    sponsorParty: sponsorPartyOf(b),
    state: b.state,
    reinstated: b.reinstated,
    summary: b.summary ?? { en: null, fr: null },
    summarySource: b.summarySource ?? null,
    fullSummaryAvailable: b.fullSummaryAvailable ?? false,
    milestones: b.milestones,
    lastActivity: b.lastActivity,
    latestActivity: { fr: b.latestActivity.fr, en: b.latestActivity.en },
    url: b.url,
    divisions: b.divisions,
  }));
  const sponsorResolved = frontendBills.filter((b) => b.sponsorParty).length;

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
  // Pétitions : fichier séparé (scrapers/petitions.js) — injecté s'il existe.
  if (existsSync(PETITIONS_PATH)) {
    const petitions = read(PETITIONS_PATH).petitions;
    html = injectBlock(html, PET_START_MARKER, PET_END_MARKER, 'petitions', petitions, stamp);
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
      url: s.url,
      votingRecord: s.votingRecord,
    }));
    const frontendSenateVotes = resolvedSenateVotes.map((v) => ({
      id: v.id,
      date: v.date,
      title: v.title,
      billNumber: v.billNumber,
      billId: v.billId,
      totals: v.totals,
      result: v.result,
      passed: v.passed,
      url: v.url,
      ballots: v.ballots.map((b) => ({ slug: b.slug, name: b.name, affiliation: b.affiliation, vote: b.vote })),
    }));

    html = injectBlock(html, SEN_START_MARKER, SEN_END_MARKER, 'senators', frontendSenators, stamp);
    html = injectBlock(html, SENVOTES_START_MARKER, SENVOTES_END_MARKER, 'senateVotes', frontendSenateVotes, stamp);

    senateStats = {
      senators: frontendSenators.length,
      votes: frontendSenateVotes.length,
      linked: resolvedSenateVotes.filter((v) => v.billId != null).length,
      former: formerSenators.size,
    };
  }

  writeFileSync(HTML_PATH, html);

  // sitemap.xml — régénéré à chaque build pour garder <lastmod> à jour (le site
  // change tous les jours). Une seule URL : c'est une application à page unique.
  const today = new Date().toISOString().slice(0, 10);
  writeFileSync(
    'sitemap.xml',
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
      `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
      `  <url>\n    <loc>https://dossiercanada.ca/</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>daily</changefreq>\n    <priority>1.0</priority>\n  </url>\n` +
      `</urlset>\n`
  );

  console.log(`Fusion écrite dans ${OUT_PATH}`);
  console.log(`  ${frontendBills.length} projets · ${frontendDeputes.length} députés · ${frontendVotes.length} scrutins injectés dans ${HTML_PATH}`);
  console.log(`  ${billsOut.length} projets · ${deputesOut.length} députés · ${resolvedVotes.length} scrutins`);
  console.log(`  scrutins reliés à un projet : ${out.meta.votesLinkedToBill}`);
  console.log(`  parti du parrain résolu : ${sponsorResolved}/${frontendBills.length} projets`);
  console.log(`  ancien·ne·s député·e·s présent·e·s dans les votes : ${formerVoterIds.size}`);
  if (unresolved.length) {
    console.log(`  ⚠ ${unresolved.length} vote(s) avec projet non résolu : ${unresolved.map((v) => `#${v.number}→${v.billNumber}`).join(', ')}`);
  }
  if (senateStats) {
    console.log(`  Sénat : ${senateStats.senators} sénateur·rice·s · ${senateStats.votes} votes (${senateStats.linked} reliés à un projet) injectés`);
    if (senateStats.former) console.log(`  ⚠ ${senateStats.former} nom(s) de bulletin sans fiche au roster (ancien·ne·s sénateur·rice·s)`);
  }
}

main();
