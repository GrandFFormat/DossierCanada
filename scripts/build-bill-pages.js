// UNE PAGE PAR PROJET DE LOI — /projets-de-loi/c-39 et /en/bills/c-39.
//
// Sans elles, « c-39 c'est quoi » ne mène nulle part : le lien profond ?pl=C-39
// n'est ni dans le sitemap, ni lisible sans JavaScript, et son <head> annonce la
// liste entière, pas le projet. Chaque page porte donc son titre, sa description
// (tirée du résumé en langage clair), son canonical, ses hreflang et son fil
// d'Ariane. Le reste de la page est celle de la vue « Projets de loi », à
// l'identique : le site s'y comporte normalement.
//
// Lancé APRÈS scripts/build-section-pages.js (il lit les pages qu'il génère), et
// AVANT scripts/prerender-pages.js, qui y mettra la fiche du projet, ouverte.
import { readFileSync, writeFileSync, mkdirSync, existsSync, rmSync, readdirSync } from 'node:fs';
import { pathFor, readSiteConfig, writeTitle, writeRegion, readBills, billPathFor, billFileFor, billSlug } from './seo-pages.js';

const { PAGE_META, translations, SITE_ORIGIN } = readSiteConfig();
const abs = (p) => SITE_ORIGIN + p;
const escAttr = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
const escText = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
const jsonLd = (obj) => JSON.stringify(obj, null, 2).replace(/</g, '\\u003c');

const bills = readBills();
const billTexts = existsSync('data/bill-texts.json') ? JSON.parse(readFileSync('data/bill-texts.json', 'utf8')) : {};
const pick = (o, lang) => (o && typeof o === 'object' ? (lang === 'en' ? o.en || o.fr : o.fr || o.en) : o) || '';

// Description : les premières phrases du résumé en clair, sinon le sommaire
// officiel, sinon le titre. ~155 caractères, coupés sur un mot.
function description(b, lang) {
  const t = billTexts[b.id] || {};
  const texte = (pick(t.ai, lang) || pick(t.s, lang) || '').replace(/^[-•]\s*/gm, '').replace(/\s+/g, ' ').trim();
  const base = texte || pick(b.title, lang);
  if (!base) {
    return lang === 'en'
      ? `${b.num}: what this federal bill changes, in plain language — stage, sponsor, votes and declared lobbying.`
      : `${b.num} : ce que ce projet de loi fédéral change, en langage clair — étape, parrain, votes et lobbying déclaré.`;
  }
  const court = base.length <= 155 ? base : base.slice(0, 152).replace(/\s+\S*$/, '') + '…';
  return `${b.num} — ${court}`;
}

function headBlock(b, lang, NL) {
  const en = lang === 'en';
  const titre = pick(b.title, lang) || b.num;
  const url = abs(billPathFor(b.num, lang));
  const desc = description(b, lang);
  // Un titre de projet peut faire 150 caractères ; Google en garde une soixantaine.
  const titreCourt = titre.length > 70 ? titre.slice(0, 67).replace(/\s+\S*$/, '') + '…' : titre;
  const t = `${b.num} — ${titreCourt} — DossierCanada`;
  const ld = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'DossierCanada', item: abs(pathFor('apercu', lang)) },
      { '@type': 'ListItem', position: 2, name: translations[lang]['nav.projets'], item: abs(pathFor('projets', lang)) },
      { '@type': 'ListItem', position: 3, name: b.num, item: url },
    ],
  };
  return [
    '<!-- SEO:START — page de projet de loi, GÉNÉRÉE par scripts/build-bill-pages.js.',
    '     Les textes viennent du projet lui-même (titre, résumé). Ne pas éditer à la main. -->',
    `<title>${escText(t)}</title>`,
    `<meta name="description" content="${escAttr(desc)}">`,
    '<meta name="robots" content="index, follow, max-image-preview:large">',
    `<link rel="canonical" href="${url}">`,
    `<link rel="alternate" hreflang="fr" href="${abs(billPathFor(b.num, 'fr'))}">`,
    `<link rel="alternate" hreflang="en" href="${abs(billPathFor(b.num, 'en'))}">`,
    `<link rel="alternate" hreflang="x-default" href="${abs(billPathFor(b.num, 'fr'))}">`,
    '<meta property="og:type" content="article">',
    '<meta property="og:site_name" content="DossierCanada">',
    `<meta property="og:title" content="${escAttr(t)}">`,
    `<meta property="og:description" content="${escAttr(desc)}">`,
    `<meta property="og:url" content="${url}">`,
    `<meta property="og:image" content="${abs('/og-image.png')}">`,
    '<meta property="og:image:width" content="1200">',
    '<meta property="og:image:height" content="630">',
    `<meta property="og:locale" content="${en ? 'en_CA' : 'fr_CA'}">`,
    '<meta name="twitter:card" content="summary_large_image">',
    `<meta name="twitter:title" content="${escAttr(t)}">`,
    `<meta name="twitter:description" content="${escAttr(desc)}">`,
    `<meta name="twitter:image" content="${abs('/og-image.png')}">`,
    '<script type="application/ld+json">',
    jsonLd(ld),
    '</script>',
    '<!-- SEO:END -->',
  ].join(NL);
}

// Les anciennes pages d'un projet disparu ne doivent pas rester en ligne.
function nettoyer(dossier, attendus) {
  if (!existsSync(dossier)) return 0;
  let n = 0;
  for (const f of readdirSync(dossier)) if (!attendus.has(f)) { rmSync(`${dossier}/${f}`); n++; }
  return n;
}

let ecrites = 0;
for (const lang of ['fr', 'en']) {
  const source = lang === 'en' ? 'en/bills.html' : 'projets-de-loi.html';
  const base = readFileSync(source, 'utf8');
  const NL = base.includes('\r\n') ? '\r\n' : '\n';
  const dossier = lang === 'en' ? 'en/bills' : 'projets-de-loi';
  mkdirSync(dossier, { recursive: true });
  for (const b of bills) {
    const file = billFileFor(b.num, lang);
    let h = base.replace(/<!-- SEO:START[\s\S]*?<!-- SEO:END -->/, () => headBlock(b, lang, NL));
    // Le H1 nomme le projet, pas le compte de la liste (le site fait pareil au rendu).
    h = writeTitle(h, 'projetsCountTitle', escText(`${b.num} — ${pick(b.title, lang)}`));
    // La zone pré-rendue repart à vide : prerender-pages.js y mettra la fiche de CE
    // projet, et rien d'autre — une page de projet qui embarque les dix premiers de
    // la liste changerait toutes les nuits pour rien.
    h = writeRegion(h, 'billsList', '');
    writeFileSync(file, h, 'utf8');
    ecrites++;
  }
  const attendus = new Set(bills.map((b) => billSlug(b.num) + '.html'));
  const retirees = nettoyer(dossier, attendus);
  if (retirees) console.log(`  ${retirees} page(s) retirée(s) de ${dossier}/ (projet disparu de la source)`);
}

/* Sitemap : les pages de projets s'ajoutent entre deux marqueurs, pour pouvoir
   être remplacées au prochain passage sans toucher aux 14 pages de vues. */
const DEBUT = '  <!-- PROJETS:START -->';
const FIN = '  <!-- PROJETS:END -->';
const today = new Date().toISOString().slice(0, 10);
const bloc = bills.flatMap((b) => ['fr', 'en'].map((lang) => [
  '  <url>',
  `    <loc>${abs(billPathFor(b.num, lang))}</loc>`,
  `    <xhtml:link rel="alternate" hreflang="fr" href="${abs(billPathFor(b.num, 'fr'))}"/>`,
  `    <xhtml:link rel="alternate" hreflang="en" href="${abs(billPathFor(b.num, 'en'))}"/>`,
  `    <xhtml:link rel="alternate" hreflang="x-default" href="${abs(billPathFor(b.num, 'fr'))}"/>`,
  `    <lastmod>${b.lastActivity || today}</lastmod>`,
  '  </url>',
].join('\n')));
let sitemap = readFileSync('sitemap.xml', 'utf8');
const i = sitemap.indexOf(DEBUT);
const j = sitemap.indexOf(FIN);
if (i >= 0 && j > i) sitemap = sitemap.slice(0, i) + sitemap.slice(j + FIN.length + 1);
sitemap = sitemap.replace('</urlset>', [DEBUT, ...bloc, FIN, '</urlset>'].join('\n'));
writeFileSync('sitemap.xml', sitemap, 'utf8');

console.log(`ok ${ecrites} pages de projets (${bills.length} × 2) · sitemap : +${bloc.length} URL`);
