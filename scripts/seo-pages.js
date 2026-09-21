// Configuration partagée des pages indexables (FR à la racine, EN sous /en).
// Utilisée par scripts/build-section-pages.js (génère les pages + sitemap) et
// scripts/prerender-pages.js (remplit le contenu visible sans JavaScript).
//
// Les TEXTES (titres, descriptions) ne vivent pas ici : ils sont lus dans
// PAGE_META de index.html, la même source que le site utilise en navigation.
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

export const SRC = 'index.html';

// view = id de la section (#view-…) et data-view du menu ; slug = URL (cleanUrls).
// ⚠️ data-view "ministres" = onglet DÉPUTÉS (/deputes) ; "cabinet" = MINISTRES (/ministres).
export const VIEWS = [
  { view: 'apercu',    slug: '' },
  { view: 'ministres', slug: 'deputes' },
  { view: 'cabinet',   slug: 'ministres' },
  { view: 'projets',   slug: 'projets-de-loi' },
  { view: 'votes',     slug: 'votes' },
  { view: 'lexique',   slug: 'lexique' },
  // « et moi » en bas de page : la personne derrière le site et le journal des mises à jour.
  { view: 'bd',        slug: 'mises-a-jour' },
];
export const LANGS = ['fr', 'en'];

// Zones pré-rendues de chaque vue : conteneurs balisés <!--ssr-->…<!--/ssr--> dans
// index.html. `h1` = id du titre promu en <h1> sur la page de la vue ; `title` = id d'un
// titre dont le TEXTE est écrit par le JavaScript (il porte le compte) et donc pré-rendu.
export const SSR = {
  apercu:    { regions: ['a3intro', 'apercuBills', 'newsList'], h1: null, title: null },
  ministres: { regions: ['partyFilters', 'deputesList'], h1: 'deputesCountTitle', title: 'deputesCountTitle' },
  cabinet:   { regions: ['ministresGrid', 'ministresCount2'], h1: 'cabinetTitle', title: 'cabinetTitle' },
  projets:   { regions: ['sortToggle', 'statusFilters', 'stepFilters', 'billsList'], h1: 'projetsCountTitle', title: 'projetsCountTitle' },
  votes:     { regions: ['petitionsToggle', 'votesList'], h1: 'votesCountTitle', title: 'votesCountTitle' },
  lexique:   { regions: ['accountBox', 'lexiqueList'], h1: 'lexiqueCountTitle', title: 'lexiqueCountTitle' },
  bd:        { regions: ['journalListe'], h1: 'majTitle', title: null },
};
// Zones communes à toutes les pages (en-tête) : sans elles, le bandeau défilant et les
// pastilles des provinces se remplissaient après coup et faisaient sauter la page.
export const GLOBAL_REGIONS = ['tickerTrack', 'provinceNetwork', 'provinceNetworkR'];
export const regionsOf = (view) => [...GLOBAL_REGIONS, ...SSR[view].regions];
export const ALL_REGIONS = [...GLOBAL_REGIONS, ...Object.values(SSR).flatMap((s) => s.regions)];

export function pathFor(view, lang) {
  const { slug } = VIEWS.find((v) => v.view === view);
  if (lang === 'en') return slug ? '/en/' + slug : '/en';
  return '/' + slug;
}
// Fichier servi pour une URL (Vercel cleanUrls : /votes → votes.html, /en → en.html).
export function fileFor(view, lang) {
  const { slug } = VIEWS.find((v) => v.view === view);
  if (lang === 'en') return slug ? 'en/' + slug + '.html' : 'en.html';
  return slug ? slug + '.html' : 'index.html';
}
export const PAGES = LANGS.flatMap((lang) => VIEWS.map(({ view }) => ({ view, lang, path: pathFor(view, lang), file: fileFor(view, lang) })));

// Extrait un littéral « const NAME = … ; » de index.html et l'évalue (objets de
// données pures : chaînes et objets, aucune référence au reste du script).
function extractConst(src, name, endToken) {
  const start = src.indexOf('const ' + name + ' = ');
  if (start < 0) throw new Error(`const ${name} introuvable dans ${SRC}`);
  const end = src.indexOf(endToken, start);
  if (end < 0) throw new Error(`fin de ${name} introuvable dans ${SRC}`);
  const code = src.slice(start, end + endToken.length).replace('const ' + name + ' =', name + ' =');
  return vm.runInNewContext(code + '\n;' + name, {});
}

export function readSiteConfig(src = readFileSync(SRC, 'utf8')) {
  const PAGE_META = extractConst(src, 'PAGE_META', '\n};');
  const translations = extractConst(src, 'translations', '\n};');
  const SITE_ORIGIN = extractConst(src, 'SITE_ORIGIN', ';');
  for (const { view } of VIEWS) {
    const m = PAGE_META[view];
    if (!m || !m.fr || !m.en || !m.dfr || !m.den) throw new Error(`PAGE_META.${view} incomplet`);
  }
  if (!/^https:\/\/[a-z.]+$/.test(SITE_ORIGIN)) throw new Error('SITE_ORIGIN invalide : ' + SITE_ORIGIN);
  return { PAGE_META, translations, SITE_ORIGIN };
}

// Contenu d'une zone <!--ssr--> d'un conteneur (id), ou null.
export function readRegion(html, id) {
  const re = new RegExp('\\bid="' + id + '"[^>]*><!--ssr-->([\\s\\S]*?)<!--/ssr-->');
  const m = html.match(re);
  return m ? m[1] : null;
}
export function writeRegion(html, id, content) {
  const re = new RegExp('(\\bid="' + id + '"[^>]*><!--ssr-->)[\\s\\S]*?(<!--/ssr-->)');
  if (!re.test(html)) throw new Error(`zone <!--ssr--> #${id} introuvable`);
  return html.replace(re, (_, a, b) => a + content + b);
}
// Texte du titre de bande (h1 ou h2 .band-title), sans balise interne.
export function readTitle(html, id) {
  const m = html.match(new RegExp('<h[12] class="band-title" id="' + id + '"[^>]*>([^<]*)</h[12]>'));
  return m ? m[1] : null;
}
export function writeTitle(html, id, text) {
  const re = new RegExp('(<h([12]) class="band-title" id="' + id + '"[^>]*>)[^<]*(</h\\2>)');
  if (!re.test(html)) throw new Error(`titre .band-title #${id} introuvable`);
  return html.replace(re, (_, a, _lvl, b) => a + text + b);
}
