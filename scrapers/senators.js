// Scraper — Liste des sénateur·rice·s (roster du Sénat du Canada)
//
// Source : la vue « liste » du répertoire des sénateur·rice·s de sencanada.ca,
// rendue par un contrôleur Umbraco (AJAX), en deux langues via le paramètre
// `culture` :
//   .../umbraco/surface/SenatorsAjax/GetSenators?displayFor=senatorslist&culture=en-CA
//   .../umbraco/surface/SenatorsAjax/GetSenators?displayFor=senatorslist&culture=fr-CA
//   Licence du gouvernement ouvert – Canada.
//
// Pourquoi cet endpoint ? La page /en/senators/ est rendue en JavaScript (aucun
// nom dans le HTML brut). Cet appel AJAX est ce que la page consomme elle-même —
// il renvoie une TABLE HTML propre : par sénateur·rice, le nom, le code de groupe
// parlementaire, la province/région, la date de nomination, la date de retraite
// obligatoire (75 ans) et le premier ministre qui l'a nommé·e. On ne touche à
// aucune protection : c'est la même requête publique que le navigateur.
//
// Contrairement aux Communes (PersonId stable), le Sénat n'expose pas d'identifiant
// numérique ici — la clé stable est le **slug** de la fiche (ex. "adler-charles"),
// présent dans l'URL de profil et identique dans les deux langues. On joint EN↔FR
// par ce slug. Le même slug servira à relier les votes nominatifs du Sénat.
//
// Pas de photos (choix éditorial du site — voir la fiche = initiales + lien officiel).
//
// Modèle produit (data/senators.json → senators[]) :
//   /**
//    * @typedef {Object} Senator
//    * @property {string} slug          Clé stable (segment d'URL de la fiche)
//    * @property {string} firstName
//    * @property {string} lastName
//    * @property {string} name          "Prénom Nom" (reconstruit depuis "Nom, Prénom")
//    * @property {{code:string|null, en:string, fr:string, enName:string|null, frName:string|null}} group
//    * @property {{code:string|null, en:string, fr:string}} province  Province ou région
//    * @property {string|null} appointedOn   Date de nomination (AAAA-MM-JJ)
//    * @property {string|null} retirementOn  Date de retraite obligatoire (AAAA-MM-JJ)
//    * @property {string|null} appointedBy   Premier ministre ayant recommandé la nomination (tel qu'affiché)
//    * @property {{en:string, fr:string}} url  Fiche officielle sur sencanada.ca
//    */

import { writeFileSync, mkdirSync } from 'node:fs';
import * as cheerio from 'cheerio';

const BASE = 'https://sencanada.ca/umbraco/surface/SenatorsAjax/GetSenators?displayFor=senatorslist';
const URL_EN = `${BASE}&culture=en-CA`;
const URL_FR = `${BASE}&culture=fr-CA`;
const OUT_PATH = 'data/senators.json';
const USER_AGENT = 'DossierCanada/0.1 (veille citoyenne; mart.archambault@gmail.com)';

// Noms officiels bilingues des groupes parlementaires du Sénat, indexés par le
// code STABLE (celui de l'attribut data-search="aff-{CODE}-", identique EN/FR).
// Les libellés courts affichés (CSG/GSC, ISG/GSI…) viennent des feeds ; seuls les
// noms longs officiels sont fixés ici. Un code inconnu → noms null + avertissement,
// jamais deviné.
const GROUP_NAME_BY_CODE = {
  ISG: { en: 'Independent Senators Group', fr: 'Groupe des sénateurs indépendants' },
  CSG: { en: 'Canadian Senators Group', fr: 'Groupe des sénateurs canadiens' },
  PSG: { en: 'Progressive Senate Group', fr: 'Groupe progressiste du Sénat' },
  C: { en: 'Conservative Party of Canada', fr: 'Parti conservateur du Canada' },
  GRO: { en: 'Government Representative Office', fr: 'Bureau du représentant du gouvernement' },
  'Non-affiliated': { en: 'Non-affiliated', fr: 'Non affilié(e)' },
};

async function fetchHtml(url) {
  const res = await fetch(url, {
    headers: { 'User-Agent': USER_AGENT, 'X-Requested-With': 'XMLHttpRequest', Accept: 'text/html' },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} pour ${url}`);
  return res.text();
}

// "Adler, Charles S." → { lastName:"Adler", firstName:"Charles S.", name:"Charles S. Adler" }
// Le feed écrit "Nom, Prénom[, post-nominaux]". Certains ont un 3e champ de titres
// (ex. "Carignan, Claude, P.C." = Conseil privé) : on l'isole dans postNominal pour
// ne pas polluer le prénom (affichage ET rapprochement des votes). Sans virgule,
// tout va dans lastName.
function splitName(raw) {
  const parts = raw.split(',').map((p) => p.trim()).filter(Boolean);
  if (parts.length === 0) return { lastName: raw.trim(), firstName: '', name: raw.trim(), postNominal: null };
  const lastName = parts[0];
  const firstName = parts[1] || '';
  const postNominal = parts.slice(2).join(', ') || null;
  return { lastName, firstName, name: `${firstName} ${lastName}`.trim(), postNominal };
}

const clean = (s) => (s || '').replace(/\s+/g, ' ').trim();
const orNull = (s) => (clean(s) === '' ? null : clean(s));

// Indexe une table (dans la langue du feed) par slug → { name, groupLabel, groupCode,
// province, provinceCode, appointedOn, retirementOn, appointedBy }.
function indexBySlug(html) {
  const $ = cheerio.load(html);
  const bySlug = new Map();
  $('tr').each((_, tr) => {
    const link = $(tr).find('a[href]').filter((__, a) => /\/senators\/[a-z0-9-]+\/?$/i.test($(a).attr('href') || '')).first();
    if (!link.length) return;
    const href = link.attr('href');
    const slug = (href.match(/\/senators\/([a-z0-9-]+)\/?$/i) || [])[1];
    if (!slug) return;

    const tds = $(tr).find('td');
    const affTd = $(tr).find('td[data-search^="aff-"]').first();
    const provTd = $(tr).find('td[data-search^="province-"]').first();
    const groupCode = (affTd.attr('data-search') || '').replace(/^aff-/, '').replace(/-$/, '') || null;
    const provinceCode = (provTd.attr('data-search') || '').replace(/^province-/, '') || null;

    // Colonnes après nom / groupe / province : date de nomination, retraite, PM.
    // On repère par position relative aux td connus pour rester robuste.
    const provIdx = provTd.length ? provTd.index() : -1;
    const appointedOn = provIdx >= 0 ? orNull($(tds.get(provIdx + 1)).text()) : null;
    const retirementOn = provIdx >= 0 ? orNull($(tds.get(provIdx + 2)).text()) : null;
    const appointedBy = provIdx >= 0 ? orNull($(tds.get(provIdx + 3)).text()) : null;

    bySlug.set(slug, {
      name: clean(link.text()),
      groupCode,
      groupLabel: orNull(affTd.text()),
      provinceCode,
      province: orNull(provTd.text()),
      appointedOn,
      retirementOn,
      appointedBy,
    });
  });
  return bySlug;
}

async function main() {
  const [htmlEn, htmlFr] = await Promise.all([fetchHtml(URL_EN), fetchHtml(URL_FR)]);
  const en = indexBySlug(htmlEn);
  const fr = indexBySlug(htmlFr);

  const senators = [];
  const missingFr = [];
  const unknownGroup = new Set();

  for (const [slug, e] of en) {
    const f = fr.get(slug);
    if (!f) missingFr.push(slug);

    const code = e.groupCode;
    const longNames = code ? GROUP_NAME_BY_CODE[code] : null;
    if (code && !longNames) unknownGroup.add(code);

    const { firstName, lastName, name, postNominal } = splitName(e.name);

    senators.push({
      slug,
      firstName,
      lastName,
      name,
      postNominal,
      group: {
        code,
        en: e.groupLabel,
        fr: f?.groupLabel ?? null,
        enName: longNames?.en ?? null,
        frName: longNames?.fr ?? null,
      },
      province: { code: e.provinceCode, en: e.province, fr: f?.province ?? null },
      appointedOn: e.appointedOn,
      retirementOn: e.retirementOn,
      appointedBy: e.appointedBy,
      url: {
        en: `https://sencanada.ca/en/senators/${slug}/`,
        fr: `https://sencanada.ca/fr/senateurs/${slug}/`,
      },
    });
  }

  senators.sort((a, b) => a.lastName.localeCompare(b.lastName, 'fr'));

  mkdirSync('data', { recursive: true });
  writeFileSync(
    OUT_PATH,
    JSON.stringify(
      { source: { en: URL_EN, fr: URL_FR }, scrapedAt: new Date().toISOString(), count: senators.length, senators },
      null,
      2
    )
  );

  const byGroup = senators.reduce((acc, s) => ((acc[s.group.code ?? '(?)'] = (acc[s.group.code ?? '(?)'] ?? 0) + 1), acc), {});
  console.log(`${senators.length} sénateur·rice·s écrit·e·s dans ${OUT_PATH}`);
  console.log('  par groupe :', byGroup);
  if (missingFr.length) console.log(`  ⚠ ${missingFr.length} sans correspondance FR : ${missingFr.slice(0, 10).join(', ')}${missingFr.length > 10 ? '…' : ''}`);
  if (unknownGroup.size) console.log(`  ⚠ code de groupe sans nom connu : ${[...unknownGroup].join(', ')}`);
}

main().catch((err) => {
  console.error('Échec du scraper senators.js :', err);
  process.exitCode = 1;
});
