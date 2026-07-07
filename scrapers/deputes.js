// Scraper — Liste des député·e·s de la Chambre des communes (roster)
//
// Source : export XML officiel de la Chambre des communes, en deux langues :
//   https://www.ourcommons.ca/members/en/search/xml   (anglais)
//   https://www.ourcommons.ca/members/fr/search/xml   (français)
//   Licence du gouvernement ouvert – Canada.
//
// Pourquoi ourcommons plutôt qu'OpenParliament pour le roster ? OpenParliament ne
// fournit le parti et la circonscription qu'en anglais ; l'export de la Chambre est
// nativement bilingue (parti, circonscription ET province diffèrent en français —
// ex. « Quebec » / « Québec », « Conservative » / « Conservateur »). Pour un site
// bilingue officiel, on prend la source qui donne les deux langues vérifiées, sans
// jamais inventer de traduction.
//
// Clé unique : `id` = PersonId de la Chambre des communes (ex. 89156). C'est aussi
// le `parl_mp_id` d'OpenParliament — donc le pivot naturel pour enrichir plus tard
// (photo, dossier de votes) sans dépendre du nom, qui peut être ambigu. On joint les
// deux feeds EN/FR par ce PersonId.
//
// Le nombre de député·e·s est LU depuis la source (≈343 sièges à la 45e législature,
// vacances comprises) — jamais codé en dur.
//
// Modèle produit (data/deputes.json → deputes[]) :
//   /**
//    * @typedef {Object} Depute
//    * @property {number} id            PersonId (= parl_mp_id OpenParliament) — clé unique
//    * @property {string|null} honorific  Titre honorifique court (ex. "Hon."/"L'hon.") ou null
//    * @property {string} firstName
//    * @property {string} lastName
//    * @property {string} name          "Prénom Nom"
//    * @property {{code:string|null, en:string, fr:string}} party  Parti (code court + noms bilingues)
//    * @property {{en:string, fr:string}} constituency  Circonscription
//    * @property {{en:string, fr:string}} province       Province ou territoire
//    * @property {string|null} memberSince  Début du mandat courant (AAAA-MM-JJ)
//    * @property {{en:string, fr:string}} url  Profil sur ourcommons.ca
//    */

import { writeFileSync, mkdirSync } from 'node:fs';
import * as cheerio from 'cheerio';

const XML_EN = 'https://www.ourcommons.ca/members/en/search/xml';
const XML_FR = 'https://www.ourcommons.ca/members/fr/search/xml';
const OUT_PATH = 'data/deputes.json';
const USER_AGENT = 'DossierCanada/0.1 (veille citoyenne; mart.archambault@gmail.com)';

// Code court par nom de caucus ANGLAIS (les noms bilingues eux-mêmes viennent des
// feeds, pas d'ici). Le code ne sert que d'étiquette stable côté front-end (couleurs
// de parti, etc.). Un caucus inconnu → code null + avertissement, jamais deviné.
const PARTY_CODE_BY_EN = {
  Liberal: 'LPC',
  Conservative: 'CPC',
  'Bloc Québécois': 'BQ',
  NDP: 'NDP',
  'Green Party': 'GPC',
  Independent: 'IND',
};

function textOf($, el, tag) {
  const t = $(el).find(tag).first().text().trim();
  return t === '' ? null : t;
}

// Réduit un horodatage "2025-04-28T00:00:00" à une date AAAA-MM-JJ (l'heure est
// toujours minuit dans ce feed — pas de précision horaire à laisser entendre).
function toDate(dt) {
  return dt ? dt.slice(0, 10) : null;
}

async function fetchXml(url) {
  const res = await fetch(url, { headers: { 'User-Agent': USER_AGENT, Accept: 'application/xml' } });
  if (!res.ok) throw new Error(`HTTP ${res.status} pour ${url}`);
  return res.text();
}

// Indexe un feed par PersonId → { party, constituency, province } (dans la langue
// du feed). Sert à récupérer la version française à partir du feed anglais.
function indexByPerson(xml) {
  const $ = cheerio.load(xml, { xml: true });
  const byId = new Map();
  $('MemberOfParliament').each((_, el) => {
    const id = Number(textOf($, el, 'PersonId'));
    byId.set(id, {
      party: textOf($, el, 'CaucusShortName'),
      constituency: textOf($, el, 'ConstituencyName'),
      province: textOf($, el, 'ConstituencyProvinceTerritoryName'),
    });
  });
  return byId;
}

async function main() {
  const [xmlEn, xmlFr] = await Promise.all([fetchXml(XML_EN), fetchXml(XML_FR)]);
  const fr = indexByPerson(xmlFr);

  const $ = cheerio.load(xmlEn, { xml: true });
  const deputes = [];
  const missingFr = [];
  const unknownParty = new Set();

  $('MemberOfParliament').each((_, el) => {
    const id = Number(textOf($, el, 'PersonId'));
    const firstName = textOf($, el, 'PersonOfficialFirstName') ?? '';
    const lastName = textOf($, el, 'PersonOfficialLastName') ?? '';
    const partyEn = textOf($, el, 'CaucusShortName');
    const frRow = fr.get(id);
    if (!frRow) missingFr.push(id);

    const code = partyEn ? (PARTY_CODE_BY_EN[partyEn] ?? null) : null;
    if (partyEn && code === null) unknownParty.add(partyEn);

    deputes.push({
      id,
      honorific: textOf($, el, 'PersonShortHonorific'),
      firstName,
      lastName,
      name: `${firstName} ${lastName}`.trim(),
      party: { code, en: partyEn, fr: frRow?.party ?? null },
      constituency: { en: textOf($, el, 'ConstituencyName'), fr: frRow?.constituency ?? null },
      province: { en: textOf($, el, 'ConstituencyProvinceTerritoryName'), fr: frRow?.province ?? null },
      memberSince: toDate(textOf($, el, 'FromDateTime')),
      url: {
        en: `https://www.ourcommons.ca/members/en/${id}`,
        fr: `https://www.ourcommons.ca/members/fr/${id}`,
      },
    });
  });

  deputes.sort((a, b) => a.lastName.localeCompare(b.lastName, 'fr'));

  mkdirSync('data', { recursive: true });
  writeFileSync(
    OUT_PATH,
    JSON.stringify(
      { source: { en: XML_EN, fr: XML_FR }, scrapedAt: new Date().toISOString(), count: deputes.length, deputes },
      null,
      2
    )
  );

  const byParty = deputes.reduce((acc, d) => ((acc[d.party.code ?? '(?)'] = (acc[d.party.code ?? '(?)'] ?? 0) + 1), acc), {});
  console.log(`${deputes.length} député·e·s écrit·e·s dans ${OUT_PATH}`);
  console.log('  par parti :', byParty);
  if (missingFr.length) console.log(`  ⚠ ${missingFr.length} sans correspondance dans le feed FR : ${missingFr.join(', ')}`);
  if (unknownParty.size) console.log(`  ⚠ caucus sans code connu : ${[...unknownParty].join(', ')}`);
}

main().catch((err) => {
  console.error('Échec du scraper deputes.js :', err);
  process.exitCode = 1;
});
