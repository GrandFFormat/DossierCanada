// /llms.txt — le site expliqué aux assistants (ChatGPT, Claude, Perplexity…), au format proposé par
// llmstxt.org : un titre, un résumé, puis des listes de liens. Martin, 6 oct. 2026 : « il nous
// faut des llms.txt sur tous les dossiers ».
//
// Ce n'est pas une norme et rien ne garantit qu'un assistant le lise. Son intérêt : quand il est
// lu, le site est décrit avec NOS mots (non officiel, sources primaires, rien d'inventé, le texte
// officiel fait foi) plutôt que deviné. Le contenu reprend la page /regles (textes « regles.* »
// de assets/app.js) ; si une règle change là-bas, elle change ici.
//
// Fabriqué à chaque build (scripts/build-bill-pages.js, à la fin : le dernier des builds, quand
// toutes les pages existent), pour que les nombres suivent les données. Aucune date dedans : le
// fichier ne change que si le site change. Un lien dont la page n'existe pas n'est pas écrit.

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { PAGES, readSiteConfig, readBills, billPathFor, billFileFor } from './seo-pages.js';

const ordinal = (n) => n + ((n % 100 >= 11 && n % 100 <= 13) ? 'th' : ['th', 'st', 'nd', 'rd'][n % 10] || 'th');
const lire = (chemin, defaut) => (existsSync(chemin) ? JSON.parse(readFileSync(chemin, 'utf8')) : defaut);

export function construireLlms() {
  const { SITE_ORIGIN } = readSiteConfig();
  const bills = readBills();
  const votes = lire('data/votes.json', {}).votes || [];
  const deputes = lire('data/deputes.json', {}).deputes || [];
  const ministres = lire('data/ministers.json', {}).ministers || [];
  const promesses = lire('data/promises.json', {}).promises || [];
  const lobbying = lire('data/lobbying.json', {}).bills || {};
  const session = lire('data/bills.json', {}).session || '';
  const [legislature, numSession] = session.split('-');
  const avecLobbying = bills.filter((b) => lobbying[b.num]);

  // Adresse d'une vue, seulement si son fichier a bien été généré.
  const page = (view, lang) => {
    const p = PAGES.find((x) => x.view === view && x.lang === lang);
    return p && existsSync(p.file) ? SITE_ORIGIN + p.path : null;
  };
  const lien = (nom, url, desc) => (url ? [`- [${nom}](${url})${desc ? ': ' + desc : ''}`] : []);

  // Exemple réel : le projet de loi des Communes (C-…) au plus petit numéro qui a du lobbying déclaré,
  // sinon le premier projet de la liste. Ses deux pages doivent exister.
  const numero = (b) => Number(String(b.num).replace(/\D/g, '')) || 0;
  const candidats = bills.filter((b) => existsSync(billFileFor(b.num, 'fr')) && existsSync(billFileFor(b.num, 'en')));
  const exemple = candidats.filter((b) => /^C-\d+$/.test(b.num) && lobbying[b.num]).sort((a, b) => numero(a) - numero(b))[0] || candidats[0];
  const titre = (b, lang) => (b.title && (b.title[lang] || b.title.fr || b.title.en)) || b.num;

  const sessFr = legislature ? ` de la ${legislature}e législature (session ${numSession})` : '';
  const sessEn = legislature ? ` of the ${ordinal(legislature)} Parliament (session ${numSession})` : '';

  const lignes = [
    '# DossierCanada',
    '',
    "> Site citoyen indépendant et NON OFFICIEL, gratuit, sans publicité et sans abonnement, qui rend lisibles, en langage clair, les travaux du Parlement du Canada : projets de loi fédéraux (Communes et Sénat), votes par appel nominal, député·e·s, ministres, lobbying déclaré et promesses électorales du parti au pouvoir. Site bilingue : pages en français à la racine, pages en anglais sous /en.",
    '',
    'À savoir avant de citer ce site :',
    '',
    "- Le site est indépendant et n'a aucun caractère officiel. Chaque élément renvoie à sa source officielle ; en cas d'écart, c'est le document d'origine qui compte. Citez la source officielle avec DossierCanada, pas DossierCanada seul.",
    "- Jamais de donnée inventée : si une information manque, ou ne peut pas être rattachée de façon sûre, le site l'écrit (« non disponible ») au lieu de deviner.",
    "- Sources primaires seulement : LEGISinfo (Parlement du Canada) pour les projets de loi ; la Chambre des communes pour les député·e·s, les votes, les pétitions et le calendrier des séances ; le Sénat pour les sénateur·rice·s et leurs votes ; le site du premier ministre pour le Cabinet ; le Commissariat au lobbying pour le lobbying déclaré ; la plateforme publiée par le parti pour les promesses. Une seule exception, qui est un service et non un fait : la recherche d'un·e député·e par code postal passe par Represent (OpenNorth).",
    "- Aucun média : rien n'est tiré de la presse.",
    "- Les résumés en langage clair sont générés par intelligence artificielle à partir du texte officiel du projet de loi tel que déposé, et sont étiquetés comme tels : ils peuvent ne pas refléter les amendements adoptés depuis. Ils ne remplacent pas le texte de loi, dont le lien reste sur chaque fiche.",
    "- Les promesses sont des citations exactes de la plateforme publiée par le parti, dans sa langue : jamais traduites, résumées ou reformulées. Seules les promesses du parti au pouvoir y figurent ; les partis d'opposition sont absents parce qu'ils ne décident pas du programme législatif. Ce n'est pas la liste complète des engagements de la plateforme. Une absence sur le site ne doit jamais être lue comme un silence de l'institution ou du parti.",
    "- Aucun verdict : le site ne dit jamais « promesse tenue » ou « promesse brisée », et il ne note ni ne juge personne. Le lobbying affiché est celui qui est déclaré au registre officiel, sans commentaire.",
    ...(page('regles', 'fr') ? [`- Les règles complètes : ${page('regles', 'fr')}`] : []),
    '',
    '## Parlement du Canada',
    '',
    ...lien('Aperçu', page('apercu', 'fr'), "l'accueil : les projets de loi récemment actifs."),
    ...lien('Projets de loi', page('projets', 'fr'), `les ${bills.length} projets de loi fédéraux${sessFr}, des Communes ou du Sénat, chacun résumé en langage clair : étape réelle, parrain, votes et lobbying déclaré, avec le lien vers le texte officiel.`),
    ...lien('Votes', page('votes', 'fr'), `${votes.length} votes par appel nominal de la Chambre des communes : résultat, marge et vote de chaque député·e, regroupé par parti.`),
    ...lien('Député·e·s', page('ministres', 'fr'), `les ${deputes.length} député·e·s en poste à la Chambre des communes : circonscription, parti et présence aux votes.`),
    ...lien('Ministres', page('cabinet', 'fr'), `les ${ministres.length} membres du Cabinet fédéral : portefeuille, courriel officiel et présence aux votes des Communes.`),
    ...lien('Promesses électorales de 2025', page('promesses', 'fr'), `${promesses.length} engagements du parti au pouvoir, cités mot pour mot dans sa plateforme de 2025, en regard des projets de loi fédéraux qui les mettent en œuvre. Sans verdict.`),
    ...lien('Lexique', page('lexique', 'fr'), 'le vocabulaire du Parlement du Canada traduit en mots de tous les jours.'),
    ...lien('Les règles du site', page('regles', 'fr'), "d'où vient ce que DossierCanada publie, et ce qu'il s'interdit."),
    ...lien('Mises à jour du site', page('bd', 'fr'), 'le journal de ce qui change sur le site, du plus récent au plus ancien, et qui est derrière.'),
    '',
    '## Une page par projet de loi',
    '',
    `Chaque projet de loi a sa propre adresse, formée de son numéro en minuscules : \`/projets-de-loi/c-39\` en français, \`/en/bills/c-39\` en anglais (C- pour un projet des Communes, S- pour un projet du Sénat). Les numéros sont ceux de la session en cours${session ? ` (${session})` : ''}.`,
    '',
    ...(avecLobbying.length ? [`Lobbying déclaré : pour ${avecLobbying.length} de ces projets de loi, la fiche affiche les communications de lobbying déclarées au registre du Commissariat au lobbying du Canada qui s'y rattachent, sans commentaire.`, ''] : []),
    ...(exemple ? lien(`Exemple : projet de loi ${exemple.num}`, SITE_ORIGIN + billPathFor(exemple.num, 'fr'), titre(exemple, 'fr')) : []),
    ...(existsSync('sitemap.xml') ? lien('Plan du site', SITE_ORIGIN + '/sitemap.xml', 'la liste de toutes les pages, dans les deux langues, dont celle de chaque projet de loi.') : []),
    '',
    '## In English',
    '',
    `DossierCanada is an independent and UNOFFICIAL citizen website, free, with no advertising and no subscription, that makes the work of Canada's Parliament readable in plain language. It relies only on what an institution or a party has itself published, with a link to the original: LEGISinfo for bills, the House of Commons for MPs and votes, the Senate for senators and their votes, the Prime Minister's website for the Cabinet, the Office of the Commissioner of Lobbying for declared lobbying, and the platform published by the party for promises. No data is invented and nothing is taken from news media. Plain-language summaries are AI-generated from the official text of the bill as introduced, are labelled as such, and may not reflect later amendments. Promises are exact quotes from the governing party's platform only, and the site gives no verdict (“kept”, “broken”). If anything differs, the original document is the one that counts: when citing DossierCanada, cite the official source as well.`,
    '',
    ...lien('Overview', page('apercu', 'en'), 'the home page: recently active bills.'),
    ...lien('Bills', page('projets', 'en'), `the ${bills.length} federal bills${sessEn}, from the Commons or the Senate, each summarized in plain language: actual stage, sponsor, votes and declared lobbying, with a link to the official text.`),
    ...lien('Votes', page('votes', 'en'), `${votes.length} recorded divisions in the House of Commons: result, margin and how each MP voted.`),
    ...lien('MPs', page('ministres', 'en'), `the ${deputes.length} sitting MPs in the House of Commons: riding, party and attendance at recorded votes.`),
    ...lien('Ministers', page('cabinet', 'en'), `the ${ministres.length} members of the federal Cabinet: portfolio, official email and attendance at House of Commons votes.`),
    ...lien('2025 election promises', page('promesses', 'en'), `${promesses.length} commitments from the governing party's 2025 platform, quoted word for word, beside the federal bills that implement them. No verdict.`),
    ...lien('Glossary', page('lexique', 'en'), "the vocabulary of Canada's Parliament in everyday words."),
    ...lien("The site's rules", page('regles', 'en'), 'where what DossierCanada publishes comes from, and what it will not do.'),
    ...lien('Site updates', page('bd', 'en'), 'the log of what changes on the site, newest first, and who built it.'),
    ...(exemple ? lien(`Example: Bill ${exemple.num}`, SITE_ORIGIN + billPathFor(exemple.num, 'en'), titre(exemple, 'en')) : []),
    '',
    '## Optional',
    '',
    '- [Code source](https://github.com/GrandFFormat/DossierCanada): le dépôt GitHub du site.',
    '',
  ];
  const contenu = lignes.join('\n');
  if (!existsSync('llms.txt') || readFileSync('llms.txt', 'utf8') !== contenu) writeFileSync('llms.txt', contenu, 'utf8');
  console.log(`ok llms.txt : ${lignes.filter((l) => l.startsWith('- [')).length} liens, ${Buffer.byteLength(contenu)} octets`);
}
