// Génère les 14 pages indexables depuis index.html (gabarit ET page d'accueil FR) :
//   FR : index.html (réécrit sur place), deputes, ministres, projets-de-loi, votes, lexique, mises-a-jour
//   EN : en.html, en/deputes, en/ministres, en/projets-de-loi, en/votes, en/lexique, en/mises-a-jour
// puis sitemap.xml. Artefacts de build : régénérés par « npm run refresh », jamais
// édités à la main (on édite index.html, puis on relance ce script).
//
// Pour chaque page :
//   - <head> SEO complet (titre, description, canonical, hreflang, OG, X, JSON-LD)
//     entre <!-- SEO:START --> et <!-- SEO:END -->, textes tirés de PAGE_META ;
//   - UN SEUL <h1> : celui de la vue affichée (les autres vues restent en <h2>) ;
//   - liens internes et bascule FR/EN pointés vers la bonne langue ;
//   - pages EN : balisage statique TRADUIT (sans attendre le JavaScript) ;
//   - zones pré-rendues <!--ssr--> : on garde celles de la vue affichée (remplies
//     par scripts/prerender-pages.js) et on vide les autres.
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { SRC, PAGES, SSR, ALL_REGIONS, regionsOf, pathFor, readSiteConfig, readRegion, writeRegion, readTitle, writeTitle } from './seo-pages.js';

const raw = readFileSync(SRC, 'utf8');
const NL = raw.includes('\r\n') ? '\r\n' : '\n';
const { PAGE_META, translations, SITE_ORIGIN } = readSiteConfig(raw);
const abs = (p) => SITE_ORIGIN + p;

function must(cond, msg) { if (!cond) { console.error('build-section-pages : ' + msg); process.exit(1); } }
must(raw.includes('<section class="view active" id="view-apercu">'), 'vue Aperçu active absente du gabarit');
must(/<a class="active" data-view="apercu" href="\/" aria-current="page">/.test(raw), 'lien de menu Aperçu actif absent du gabarit');
must(raw.includes('<!-- SEO:START') && raw.includes('<!-- SEO:END -->'), 'marqueurs SEO:START / SEO:END absents');
must((raw.match(/<h1\b/g) || []).length === 1, 'le gabarit doit contenir exactement un <h1> (celui de l’Aperçu)');

const escAttr = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
const escText = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
const jsonLd = (obj) => JSON.stringify(obj, null, 2).replace(/</g, '\\u003c');

// Titres de bande quand aucun pré-rendu n'existe encore (le pré-rendu y ajoute le compte).
const TITLE_FALLBACK = {
  deputesCountTitle: { fr: 'Députés fédéraux', en: 'Federal MPs' },
  cabinetTitle: { fr: 'Le Cabinet fédéral', en: 'The federal Cabinet' },
  projetsCountTitle: { fr: 'Projets de loi fédéraux', en: 'Federal bills' },
  votesCountTitle: { fr: 'Votes aux Communes', en: 'Votes in the Commons' },
  lexiqueCountTitle: { fr: 'Lexique du Parlement', en: 'Parliament glossary' },
};
const NAV_KEY = { apercu: 'nav.apercu', ministres: 'nav.ministres', cabinet: 'nav.cabinet', projets: 'nav.projets', votes: 'nav.votes', lexique: 'nav.lexique', bd: 'maj.h' };

function headBlock({ view, lang, path }) {
  const m = PAGE_META[view];
  const en = lang === 'en';
  const title = en ? m.en : m.fr;
  const desc = en ? m.den : m.dfr;
  const url = abs(path);
  const frUrl = abs(pathFor(view, 'fr'));
  const enUrl = abs(pathFor(view, 'en'));
  const home = abs(pathFor('apercu', lang));
  const orgId = abs('/#organization');
  let ld;
  if (view === 'apercu') {
    ld = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Organization',
          '@id': orgId,
          name: 'DossierCanada',
          url: abs('/'),
          logo: { '@type': 'ImageObject', url: abs('/logo.png'), width: 512, height: 512 },
          sameAs: ['https://www.facebook.com/dossierocanada', 'https://github.com/GrandFFormat/DossierCanada'],
        },
        {
          '@type': 'WebSite',
          '@id': abs('/#website'),
          name: 'DossierCanada',
          alternateName: 'Dossier Canada',
          url: abs('/'),
          inLanguage: ['fr-CA', 'en-CA'],
          description: desc,
          publisher: { '@id': orgId },
        },
      ],
    };
  } else {
    ld = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'DossierCanada', item: home },
        { '@type': 'ListItem', position: 2, name: translations[lang][NAV_KEY[view]], item: url },
      ],
    };
  }
  const L = [
    '<!-- SEO:START — bloc GÉNÉRÉ par scripts/build-section-pages.js pour CHAQUE page',
    '     (titre, description, canonical, hreflang, Open Graph, X, JSON-LD). Ne pas éditer',
    '     à la main : les textes viennent de PAGE_META (plus bas dans ce fichier). -->',
    `<title>${escText(title)}</title>`,
    `<meta name="description" content="${escAttr(desc)}">`,
    '<meta name="robots" content="index, follow, max-image-preview:large">',
    `<link rel="canonical" href="${url}">`,
    `<link rel="alternate" hreflang="fr" href="${frUrl}">`,
    `<link rel="alternate" hreflang="en" href="${enUrl}">`,
    `<link rel="alternate" hreflang="x-default" href="${frUrl}">`,
    '<meta property="og:type" content="website">',
    '<meta property="og:site_name" content="DossierCanada">',
    `<meta property="og:title" content="${escAttr(title)}">`,
    `<meta property="og:description" content="${escAttr(desc)}">`,
    `<meta property="og:url" content="${url}">`,
    `<meta property="og:image" content="${abs('/og-image.png')}">`,
    '<meta property="og:image:width" content="1200">',
    '<meta property="og:image:height" content="630">',
    `<meta property="og:image:alt" content="${escAttr(en ? "DossierCanada — Canada's Parliament in plain language" : 'DossierCanada — le Parlement du Canada en clair')}">`,
    `<meta property="og:locale" content="${en ? 'en_CA' : 'fr_CA'}">`,
    `<meta property="og:locale:alternate" content="${en ? 'fr_CA' : 'en_CA'}">`,
    '<meta name="twitter:card" content="summary_large_image">',
    `<meta name="twitter:title" content="${escAttr(title)}">`,
    `<meta name="twitter:description" content="${escAttr(desc)}">`,
    `<meta name="twitter:image" content="${abs('/og-image.png')}">`,
    '<script type="application/ld+json">',
    jsonLd(ld),
    '</script>',
    '<!-- SEO:END -->',
  ];
  return L.join(NL).replace(/\r?\n/g, NL);
}

// Remplace l'attribut `attr` dans la balise ouvrante qui correspond à `tagRe`.
function setAttr(h, tagRe, attr, value) {
  let hit = false;
  h = h.replace(tagRe, (tag) => {
    hit = true;
    const a = new RegExp('(\\s' + attr + '=")[^"]*(")');
    return a.test(tag) ? tag.replace(a, (_, p, q) => p + escAttr(value) + q) : tag.replace(/\s*\/?>$/, (end) => ` ${attr}="${escAttr(value)}"` + end);
  });
  must(hit, `balise introuvable pour ${attr} (${tagRe})`);
  return h;
}

// Traduit le balisage statique (hors scripts) comme le ferait applyLanguage().
function translateMarkup(body, lang) {
  const tr = translations[lang];
  body = body.replace(/<(\w+)\b([^>]*\sdata-i18n="([^"]+)"[^>]*)>([\s\S]*?)<\/\1>/g, (all, tag, attrs, key, inner) => {
    must(!new RegExp('<' + tag + '\\b').test(inner), `data-i18n="${key}" : <${tag}> imbriqué, traduction statique impossible`);
    const v = tr[key];
    return v === undefined ? all : `<${tag}${attrs}>${v}</${tag}>`;
  });
  body = body.replace(/<input\b[^>]*\sdata-i18n-placeholder="([^"]+)"[^>]*>/g, (tag, key) => {
    const v = tr[key];
    return v === undefined ? tag : tag.replace(/(\splaceholder=")[^"]*(")/, (_, p, q) => p + escAttr(v) + q);
  });
  const t = (k) => tr[k] ?? translations.fr[k];
  body = setAttr(body, /<button id="fontMinus"[^>]*>/, 'aria-label', t('aria.fontMinus'));
  body = setAttr(body, /<button id="fontPlus"[^>]*>/, 'aria-label', t('aria.fontPlus'));
  body = setAttr(body, /<button class="hamburger" id="hamburgerBtn"[^>]*>/, 'aria-label', t('aria.menu'));
  body = setAttr(body, /<button class="cb-more" id="challengeMoreBtn"[^>]*>/, 'aria-label', t('aria.challengeMore'));
  body = setAttr(body, /<button class="cb-more" id="challengeMoreBtn"[^>]*>/, 'title', t('aria.challengeMore'));
  body = setAttr(body, /<a class="footer-gh" href="https:\/\/www\.facebook\.com[^>]*>/, 'aria-label', t('aria.fb'));
  body = setAttr(body, /<a class="footer-gh footer-coffee"[^>]*>/, 'aria-label', t('aria.coffee'));
  body = setAttr(body, /<button id="backToTop"[^>]*>/, 'aria-label', t('aria.top'));
  body = setAttr(body, /<button id="backToTop"[^>]*>/, 'title', t('aria.top'));
  body = body.replace(/(<nav class="crumbs" aria-label=")[^"]*(")/g, (_, p, q) => p + escAttr(t('aria.crumbs')) + q);
  // Boutons Communes / Sénat de l'onglet Votes (libellés posés par updateChamberLabels).
  if (lang === 'en') {
    body = body.replace(/(<button class="chamber-btn[^"]*" id="voteCommonsBtn"[^>]*>)Communes(<\/button>)/, '$1Commons$2');
    body = body.replace(/(<button class="chamber-btn[^"]*" id="voteSenateBtn"[^>]*>)Sénat(<\/button>)/, '$1Senate$2');
  }
  return body;
}

function buildPage(page, previous) {
  const { view, lang, path } = page;
  const en = lang === 'en';
  let h = raw;

  // 1) <head>
  h = h.replace(/<!-- SEO:START[\s\S]*?<!-- SEO:END -->/, () => headBlock(page));
  if (en) h = h.replace('<html lang="fr"', '<html lang="en"');

  // 2) Vue et lien de menu actifs
  if (view !== 'apercu') {
    h = h.replace('<section class="view active" id="view-apercu">', '<section class="view" id="view-apercu">');
    const secFrom = '<section class="view" id="view-' + view + '">';
    must(h.includes(secFrom), 'section #view-' + view + ' absente');
    h = h.replace(secFrom, '<section class="view active" id="view-' + view + '">');
    h = h.replace('<a class="active" data-view="apercu" href="/" aria-current="page">', '<a data-view="apercu" href="/">');
    // La page des mises à jour (« et moi ») n'a pas d'onglet : aucun lien de menu actif.
    if (view !== 'bd') {
      const navRe = new RegExp('<a data-view="' + view + '" href="([^"]*)">');
      must(navRe.test(h), 'lien de menu data-view="' + view + '" absent');
      h = h.replace(navRe, '<a class="active" data-view="' + view + '" href="$1" aria-current="page">');
    }
  }

  // 3) Un seul H1 : celui de la vue affichée
  if (view !== 'apercu') {
    h = h.replace(/<h1 class="sr-only" data-i18n="seo\.h1">([^<]*)<\/h1>/, '<h2 class="sr-only" data-i18n="seo.h1">$1</h2>');
    const id = SSR[view].h1;
    const re = new RegExp('<h2 class="band-title" id="' + id + '"([^>]*)>([^<]*)</h2>');
    must(re.test(h), 'titre de bande #' + id + ' absent');
    h = h.replace(re, '<h1 class="band-title" id="' + id + '"$1>$2</h1>');
  }
  must((h.match(/<h1\b/g) || []).length === 1, `${page.file} : doit contenir exactement un <h1>`);

  // 4) Balisage du corps (hors scripts) : langue, liens internes, bascule FR/EN
  const bodyStart = h.indexOf('<body>');
  const bodyEnd = h.indexOf('<script src="/data/site-data.js">');
  must(bodyStart > 0 && bodyEnd > bodyStart, 'balisage du corps introuvable');
  let body = h.slice(bodyStart, bodyEnd);
  if (en) {
    body = translateMarkup(body, 'en');
    body = body.replace('<body>', '<body class="lang-en">');
  }
  body = body.replace(/(data-view="(\w+)" href=")[^"]*(")/g, (all, p, v, q) => (PAGE_META[v] ? p + pathFor(v, lang) + q : all));
  const other = en ? 'fr' : 'en';
  body = body.replace(/<a class="lang-toggle" id="langToggle"[^>]*>[^<]*<\/a>/,
    `<a class="lang-toggle" id="langToggle" href="${pathFor(view, other)}" hreflang="${other}" lang="${other}">${other.toUpperCase()}</a>`);
  h = h.slice(0, bodyStart) + body + h.slice(bodyEnd);

  // 5) Zones pré-rendues : celles de la vue affichée sont reprises de la version
  //    précédente de CETTE page (le pré-rendu les rafraîchit ensuite) ; les autres
  //    sont vidées (sinon l'Aperçu pré-rendu de index.html se retrouverait partout).
  const own = new Set(regionsOf(view));
  for (const id of ALL_REGIONS) {
    const keep = own.has(id) && previous ? readRegion(previous, id) : null;
    h = writeRegion(h, id, keep ?? '');
  }
  for (const [id, fb] of Object.entries(TITLE_FALLBACK)) {
    const mine = SSR[view].title === id;
    const prevText = mine && previous ? readTitle(previous, id) : null;
    h = writeTitle(h, id, prevText || fb[lang]);
  }
  return h;
}

let count = 0;
for (const page of PAGES) {
  const previous = existsSync(page.file) ? readFileSync(page.file, 'utf8') : null;
  const html = buildPage(page, previous);
  if (page.file.includes('/')) mkdirSync(page.file.split('/')[0], { recursive: true });
  writeFileSync(page.file, html, 'utf8');
  count++;
  console.log(`ok ${page.file.padEnd(22)} ${(Buffer.byteLength(html) / 1024).toFixed(0).padStart(4)} Ko  ${page.path}`);
}

// sitemap.xml : toutes les URL publiques (FR + EN), chacune avec ses alternatives de langue.
const today = new Date().toISOString().slice(0, 10);
const urls = PAGES.map(({ view, path }) => [
  '  <url>',
  `    <loc>${abs(path)}</loc>`,
  `    <xhtml:link rel="alternate" hreflang="fr" href="${abs(pathFor(view, 'fr'))}"/>`,
  `    <xhtml:link rel="alternate" hreflang="en" href="${abs(pathFor(view, 'en'))}"/>`,
  `    <xhtml:link rel="alternate" hreflang="x-default" href="${abs(pathFor(view, 'fr'))}"/>`,
  `    <lastmod>${today}</lastmod>`,
  '  </url>',
].join('\n'));
writeFileSync('sitemap.xml', [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"',
  '        xmlns:xhtml="http://www.w3.org/1999/xhtml">',
  ...urls,
  '</urlset>',
  '',
].join('\n'), 'utf8');
console.log(`done : ${count} pages + sitemap.xml (${PAGES.length} URL)`);
