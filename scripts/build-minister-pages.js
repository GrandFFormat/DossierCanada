// UNE FICHE PAR MINISTRE — /ministres/<prénom-nom> et /en/ministers/<first-last>.
// Même mécanique que DossierQuébec (scripts/build-minister-pages.js) : rôle, parti,
// circonscription, projets de loi parrainés, présence aux votes, réseaux officiels,
// Person + sameAs en données structurées, sitemap.
//
// Réseaux : data/ministresReseaux.json, relevés sur le site officiel de chaque
// ministre (lien donné par sa fiche ourcommons.ca). Source de chaque lien dans
// data/ministresReseaux-sources.json. Jamais deviné.
// Pas de photo : celles de la Chambre ne sont pas sous licence ouverte (initiales, comme la grille).
//
// Page autonome : l'ossature (en-tête, menu, pied de page) vient de ministres.html et
// en/ministers.html, sans le script de l'application. Lancé après build-bill-pages.js.
import { readFileSync, writeFileSync, mkdirSync, existsSync, rmSync, readdirSync } from 'node:fs';
import { readSiteConfig, billPathFor } from './seo-pages.js';

const { SITE_ORIGIN } = readSiteConfig();
const abs = (p) => SITE_ORIGIN + p;
const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
const lire = (f, d) => (existsSync(f) ? JSON.parse(readFileSync(f, 'utf8')) : d);
export const slugMinistre = (nom) => String(nom).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const norm = (s) => String(s).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z]/g, '');
// Petites icônes carrées sous l'avatar, reprises de DossierQuébec.
const svg = (d) => `<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path fill="currentColor" d="${d}"/></svg>`;
export const ICONES_RESEAUX = {
  Facebook: svg('M14 8h3V4h-3c-2.8 0-4 1.7-4 4.3V10H7v4h3v8h4v-8h3l1-4h-4V8.6c0-.4.3-.6.6-.6z'),
  LinkedIn: svg('M4 9h4v12H4zM6 3a2 2 0 110 4 2 2 0 010-4zm4 6h3.8v1.7c.6-1 1.9-2 3.9-2 4 0 4.3 2.6 4.3 6V21h-4v-5.6c0-1.4 0-3.1-1.9-3.1S12 13.8 12 15.3V21h-2z'),
  X: svg('M17.7 3h3.1l-6.8 7.7L22 21h-6.2l-4.9-6.4L5.3 21H2.2l7.3-8.3L2 3h6.4l4.4 5.8zm-1.1 16.2h1.7L7.5 4.7H5.7z'),
  Instagram: svg('M12 7.3a4.7 4.7 0 100 9.4 4.7 4.7 0 000-9.4zm0 7.7a3 3 0 110-6 3 3 0 010 6zm4.9-8.9a1.1 1.1 0 100 2.2 1.1 1.1 0 000-2.2zM12 2c-2.7 0-3 0-4.1.1C4.3 2.3 2.3 4.3 2.1 7.9 2 9 2 9.3 2 12s0 3 .1 4.1c.2 3.6 2.2 5.6 5.8 5.8 1.1.1 1.4.1 4.1.1s3 0 4.1-.1c3.6-.2 5.6-2.2 5.8-5.8.1-1.1.1-1.4.1-4.1s0-3-.1-4.1c-.2-3.6-2.2-5.6-5.8-5.8C15 2 14.7 2 12 2zm0 1.8c2.7 0 3 0 4 .1 2.7.1 3.9 1.4 4 4 .1 1 .1 1.3.1 4s0 3-.1 4c-.1 2.6-1.3 3.9-4 4-1 .1-1.3.1-4 .1s-3 0-4-.1c-2.7-.1-3.9-1.4-4-4-.1-1-.1-1.3-.1-4s0-3 .1-4c.1-2.6 1.3-3.9 4-4 1-.1 1.3-.1 4-.1z'),
  YouTube: svg('M23 7.2a3 3 0 00-2.1-2.1C19 4.6 12 4.6 12 4.6s-7 0-8.9.5A3 3 0 001 7.2 31 31 0 00.5 12a31 31 0 00.5 4.8 3 3 0 002.1 2.1c1.9.5 8.9.5 8.9.5s7 0 8.9-.5a3 3 0 002.1-2.1 31 31 0 00.5-4.8 31 31 0 00-.5-4.8zM9.7 15.1V8.9L15.5 12z'),
  TikTok: svg('M16.5 2h-3.4v13.4a2.9 2.9 0 11-2.9-2.9c.3 0 .6 0 .9.1V9.1a6.3 6.3 0 105.4 6.3V8.6a7.9 7.9 0 004.5 1.4V6.6a4.5 4.5 0 01-4.5-4.6z'),
};
export const nomReseau = (u) => [[/\/\/x\.com|twitter/, 'X'], [/facebook/, 'Facebook'], [/instagram/, 'Instagram'], [/linkedin/, 'LinkedIn'], [/youtube/, 'YouTube'], [/tiktok/, 'TikTok']].find(([r]) => r.test(u))?.[1] || 'Web';

const ministres = lire('data/ministers.json', { ministers: [] }).ministers;
// frontend.json porte la présence (votingRecord) ; deputes.json ne l'a pas.
const deputes = lire('data/frontend.json', { deputes: [] });
const listeDep = Array.isArray(deputes) ? deputes : (deputes.deputes || deputes.members || Object.values(deputes).find(Array.isArray) || []);
const depParId = new Map(listeDep.map((d) => [d.id, d]));
const billsBrut = lire('data/bills.json', { bills: [] });
const bills = Array.isArray(billsBrut) ? billsBrut : billsBrut.bills;
const reseaux = lire('data/ministresReseaux.json', {});
const sources = lire('data/ministresReseaux-sources.json', {});
const PARTIS = {
  LPC: { fr: 'Parti libéral du Canada', en: 'Liberal Party of Canada' },
  CPC: { fr: 'Parti conservateur du Canada', en: 'Conservative Party of Canada' },
  NDP: { fr: 'Nouveau Parti démocratique', en: 'New Democratic Party' },
  BQ: { fr: 'Bloc Québécois', en: 'Bloc Québécois' },
  GP: { fr: 'Parti vert du Canada', en: 'Green Party of Canada' },
};
const T = {
  fr: { liste: 'Ministres', dossier: '/ministres', role: 'Rôle', parti: 'Parti', circ: 'Circonscription', prov: 'Province ou territoire',
    pres: 'Présence aux votes nominaux', projets: 'Projets de loi parrainés', aucun: 'Aucun projet de loi parrainé dans la session en cours.',
    liens: 'Liens officiels', profil: 'Fiche sur ourcommons.ca', site: 'Site officiel', courriel: 'Courriel',
    reseaux: 'Réseaux sociaux officiels', srcRes: 'Liens relevés sur le site officiel du ou de la ministre.', retour: '← Tout le Cabinet',
    desc: (m, r) => `${m.name}, ${r}. Rôle, circonscription, projets de loi parrainés, présence aux votes et réseaux sociaux officiels.` },
  en: { liste: 'Ministers', dossier: '/en/ministers', role: 'Role', parti: 'Party', circ: 'Riding', prov: 'Province or territory',
    pres: 'Recorded-vote attendance', projets: 'Bills sponsored', aucun: 'No bill sponsored in the current session.',
    liens: 'Official links', profil: 'Profile on ourcommons.ca', site: 'Official website', courriel: 'Email',
    reseaux: 'Official social media', srcRes: "Links taken from the minister's official website.", retour: '← The whole Cabinet',
    desc: (m, r) => `${m.name}, ${r}. Role, riding, bills sponsored, voting attendance and official social media.` },
};
// Chef·fe·s de parti (data/chefs.json) : même fiche, sous /chefs/<slug> et /en/leaders/<slug>.
const chefsData = lire('data/chefs.json', { chefs: [], gouvernement: {} });
const TC = {
  fr: { srcRes: 'Liens relevés sur une page officielle (parti ou site du chef).', dossier: '/chefs', liste: 'Députés', listeUrl: '/deputes', retour: '← Tous les députés', profil: 'Fiche sur ourcommons.ca' },
  en: { srcRes: 'Links taken from an official page (party or leader website).', dossier: '/en/leaders', liste: 'MPs', listeUrl: '/en/mps', retour: '← All MPs', profil: 'Profile on ourcommons.ca' },
};
const pick = (o, l) => (o && typeof o === 'object' ? o[l] || o.fr || o.en : o) || '';

function fiche(m, lang) {
  const t = m.chef ? { ...T[lang], ...TC[lang] } : { ...T[lang], listeUrl: T[lang].dossier }; const en = lang === 'en';
  const chefGouv = chefsData.gouvernement?.[slugMinistre(m.name)];
  const slug = slugMinistre(m.name);
  const d = depParId.get(m.personId) || {};
  const role = pick(m.role, lang);
  const parti = PARTIS[m.party]?.[lang] || m.party;
  const parraines = bills.filter((b) => b.sponsor && norm(pick(b.sponsor, 'fr')).endsWith(norm(m.name)));
  const vr = d.votingRecord;
  const pres = vr && vr.participationRate != null ? `${Math.round(vr.participationRate * 100)}${en ? '%' : ' %'} (${vr.cast}/${vr.eligible})` : (en ? 'not available' : 'non disponible');
  const res = m.chef ? (m.reseaux || []) : (reseaux[slug] || []);
  const site = m.chef ? null : sources[slug]?.site;
  const ini = m.name.split(/\s+/).filter((w) => /^[A-ZÉÈ]/.test(w)).map((w) => w[0]).slice(0, 2).join('');
  const lignes = [
    [t.role, esc(role)], [t.parti, esc(parti)],
    d.constituency ? [t.circ, esc(pick(d.constituency, lang))] : null,
    d.province ? [t.prov, esc(pick(d.province, lang))] : null,
    m.chef && !m.personId ? null : [t.pres, esc(pres)],
  ].filter(Boolean).map(([k, v]) => `<dt>${k}</dt><dd>${v}</dd>`).join('');
  const liens = [
    m.url ? `<li><a href="${esc(pick(m.url, lang))}" rel="noopener">${t.profil}</a></li>` : '',
    m.source ? `<li><a href="${esc(m.source)}" rel="noopener">${en ? 'Party page' : 'Page du parti'}</a></li>` : '',
    site ? `<li><a href="${esc(site)}" rel="noopener">${t.site}</a></li>` : '',
    d.email ? `<li>${t.courriel} : <a href="mailto:${esc(d.email)}">${esc(d.email)}</a></li>` : '',
  ].join('');
  const html = `
  <section class="view active min-fiche" id="view-ministre">
    <div class="page-band"><div>
      <nav class="crumbs" aria-label="${en ? 'Breadcrumb' : "Fil d'Ariane"}"><a href="${en ? '/en' : '/'}">DossierCanada</a> <span aria-hidden="true">›</span> <a href="${t.listeUrl}">${t.liste}</a> <span aria-hidden="true">›</span> <span aria-current="page">${esc(m.name)}</span></nav>
      <h1 class="band-title">${esc(m.name)}</h1>
      <div class="sub">${esc(role)}${chefGouv ? ` · ${esc(chefGouv[lang])}` : ''}</div>
    </div></div>
    <div class="min-corps">
      <div class="min-colphoto"><span class="min-avatar" aria-hidden="true">${esc(ini)}</span>${res.length ? `<p class="min-reseaux" aria-label="${t.reseaux}">${res.map((u) => `<a href="${esc(u)}" target="_blank" rel="noopener" title="${nomReseau(u)}" aria-label="${nomReseau(u)}">${ICONES_RESEAUX[nomReseau(u)] || nomReseau(u)}</a>`).join('')}</p><p class="min-src">${t.srcRes}</p>` : ''}</div>
      <div class="min-texte">
        <dl class="min-dl">${lignes}</dl>
        <h2>${t.projets}</h2>
        ${parraines.length ? `<ul class="min-liste">${parraines.map((b) => `<li><a href="${billPathFor(b.num, lang)}">${esc(b.num)}</a> — ${esc(pick(b.shortTitle, lang) || pick(b.title, lang))} <span class="min-etat">(${esc(pick(b.status, lang))})</span></li>`).join('')}</ul>` : `<p>${t.aucun}</p>`}
        <h2>${t.liens}</h2>
        <ul class="min-liste">${liens}</ul>
        <p><a href="${t.listeUrl}">${t.retour}</a></p>
      </div>
    </div>
  </section>`;
  const url = abs(`${t.dossier}/${slug}`);
  const titre = `${m.name} — ${role.length > 60 ? role.slice(0, 57).replace(/\s+\S*$/, '') + '…' : role} — DossierCanada`;
  const desc = t.desc(m, role).slice(0, 300);
  const sameAs = [...(m.url ? [pick(m.url, lang)] : []), ...(site ? [site] : []), ...res];
  const ld = { '@context': 'https://schema.org', '@graph': [
    { '@type': 'Person', name: m.name, jobTitle: role, url, affiliation: { '@type': 'PoliticalParty', name: parti }, sameAs },
    { '@type': 'BreadcrumbList', itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'DossierCanada', item: abs(en ? '/en' : '/') },
      { '@type': 'ListItem', position: 2, name: t.liste, item: abs(t.listeUrl) },
      { '@type': 'ListItem', position: 3, name: m.name, item: url } ] } ] };
  const autre = (l) => abs(`${(m.chef ? TC : T)[l].dossier}/${slug}`);
  const head = [
    '<!-- SEO:START — fiche de ministre, GÉNÉRÉE par scripts/build-minister-pages.js. Ne pas éditer à la main. -->',
    `<title>${esc(titre)}</title>`, `<meta name="description" content="${esc(desc)}">`,
    '<meta name="robots" content="index, follow, max-image-preview:large">', `<link rel="canonical" href="${url}">`,
    `<link rel="alternate" hreflang="fr" href="${autre('fr')}">`, `<link rel="alternate" hreflang="en" href="${autre('en')}">`,
    `<link rel="alternate" hreflang="x-default" href="${autre('fr')}">`,
    '<meta property="og:type" content="profile">', '<meta property="og:site_name" content="DossierCanada">',
    `<meta property="og:title" content="${esc(titre)}">`, `<meta property="og:description" content="${esc(desc)}">`,
    `<meta property="og:url" content="${url}">`, `<meta property="og:image" content="${abs('/og-image.png')}">`,
    `<meta property="og:locale" content="${en ? 'en_CA' : 'fr_CA'}">`, '<meta name="twitter:card" content="summary_large_image">',
    '<script type="application/ld+json">', JSON.stringify(ld, null, 2).replace(/</g, '\\u003c'), '</script>', '<!-- SEO:END -->',
  ].join('\n');
  return { slug, head, html };
}

const DEBUT = '  <!-- MINISTRES:START -->', FIN = '  <!-- MINISTRES:END -->';
// Un·e chef·fe a la même forme qu'un ministre pour fiche() : rôle, parti, fiche ourcommons (si élu·e).
const chefs = (chefsData.chefs || []).map((c) => ({ ...c, chef: true, url: c.personId ? { fr: `https://www.ourcommons.ca/members/fr/${c.personId}`, en: `https://www.ourcommons.ca/members/en/${c.personId}` } : null }));
let n = 0;
for (const lang of ['fr', 'en']) {
  const base = readFileSync(lang === 'en' ? 'en/ministers.html' : 'ministres.html', 'utf8');
  const dossier = lang === 'en' ? 'en/ministers' : 'ministres';
  mkdirSync(dossier, { recursive: true });
  const attendus = new Set();
  for (const m of ministres) {
    const { slug, head, html } = fiche(m, lang);
    let h = base.replace(/<!-- SEO:START[\s\S]*?<!-- SEO:END -->/, () => head);
    const i = h.indexOf('<div class="app">'); const j = h.indexOf('<footer>');
    h = h.slice(0, i) + '<div class="app">' + html + '\n</div>\n\n' + h.slice(j);
    // Page sans le script de l'application : retirer ce qui en dépend.
    h = h.replace(/<script defer src="\/data\/site-data\.js"><\/script>\r?\n?/, '')
      .replace(/<script defer src="https:\/\/cdn\.jsdelivr\.net\/npm\/@supabase[^"]*"><\/script>\r?\n?/, '')
      .replace(/<script defer src="\/assets\/app\.js[^"]*"><\/script>\r?\n?/, '')
      .replace(/\s*<button type="button" class="footer-temoins"[^>]*>[^<]*<\/button>/, '')
      .replace(/<div class="font-size-ctrl" id="fontSizeCtrl">[\s\S]*?<\/div>\s*/, '')
      .replace(/<a class="active" data-view="cabinet" href="[^"]*" aria-current="page">/, (x) => x.replace(' aria-current="page"', ''))
      .replace(/(id="langToggle" href=")[^"]*"/, `$1${T[lang === 'en' ? 'fr' : 'en'].dossier}/${slug}"`);
    writeFileSync(`${dossier}/${slug}.html`, h, 'utf8'); attendus.add(slug + '.html'); n++;
  }
  for (const f of readdirSync(dossier)) if (!attendus.has(f)) rmSync(`${dossier}/${f}`);
  // Fiches des chef·fe·s de parti (data/chefs.json).
  const dossierC = lang === 'en' ? 'en/leaders' : 'chefs';
  mkdirSync(dossierC, { recursive: true });
  const attendusC = new Set();
  for (const c of chefs) {
    const { slug, head, html } = fiche(c, lang);
    let h = base.replace(/<!-- SEO:START[\s\S]*?<!-- SEO:END -->/, () => head);
    const i = h.indexOf('<div class="app">'); const j = h.indexOf('<footer>');
    h = h.slice(0, i) + '<div class="app">' + html + '\n</div>\n\n' + h.slice(j);
    h = h.replace(/<script defer src="\/data\/site-data\.js"><\/script>\r?\n?/, '')
      .replace(/<script defer src="https:\/\/cdn\.jsdelivr\.net\/npm\/@supabase[^"]*"><\/script>\r?\n?/, '')
      .replace(/<script defer src="\/assets\/app\.js[^"]*"><\/script>\r?\n?/, '')
      .replace(/\s*<button type="button" class="footer-temoins"[^>]*>[^<]*<\/button>/, '')
      .replace(/<div class="font-size-ctrl" id="fontSizeCtrl">[\s\S]*?<\/div>\s*/, '')
      .replace(/<a class="active" data-view="cabinet" href="[^"]*" aria-current="page">/, (x) => x.replace(' class="active"', '').replace(' aria-current="page"', ''))
      .replace(/(id="langToggle" href=")[^"]*"/, `$1${TC[lang === 'en' ? 'fr' : 'en'].dossier}/${slug}"`);
    writeFileSync(`${dossierC}/${slug}.html`, h, 'utf8'); attendusC.add(slug + '.html'); n++;
  }
  for (const f of readdirSync(dossierC)) if (!attendusC.has(f)) rmSync(`${dossierC}/${f}`);
}
const today = new Date().toISOString().slice(0, 10);
const blocC = chefs.flatMap((m) => ['fr', 'en'].map((lang) => { const s = slugMinistre(m.name); return [
  '  <url>', `    <loc>${abs(`${TC[lang].dossier}/${s}`)}</loc>`,
  `    <xhtml:link rel="alternate" hreflang="fr" href="${abs(`/chefs/${s}`)}"/>`,
  `    <xhtml:link rel="alternate" hreflang="en" href="${abs(`/en/leaders/${s}`)}"/>`,
  `    <xhtml:link rel="alternate" hreflang="x-default" href="${abs(`/chefs/${s}`)}"/>`,
  `    <lastmod>${new Date().toISOString().slice(0, 10)}</lastmod>`, '  </url>'].join('\n'); }));
const bloc = ministres.flatMap((m) => ['fr', 'en'].map((lang) => { const s = slugMinistre(m.name); return [
  '  <url>', `    <loc>${abs(`${T[lang].dossier}/${s}`)}</loc>`,
  `    <xhtml:link rel="alternate" hreflang="fr" href="${abs(`/ministres/${s}`)}"/>`,
  `    <xhtml:link rel="alternate" hreflang="en" href="${abs(`/en/ministers/${s}`)}"/>`,
  `    <xhtml:link rel="alternate" hreflang="x-default" href="${abs(`/ministres/${s}`)}"/>`,
  `    <lastmod>${today}</lastmod>`, '  </url>'].join('\n'); }));
let sm = readFileSync('sitemap.xml', 'utf8');
const a = sm.indexOf(DEBUT), b = sm.indexOf(FIN);
if (a >= 0 && b > a) sm = sm.slice(0, a) + sm.slice(b + FIN.length + 1);
sm = sm.replace('</urlset>', [DEBUT, ...bloc, ...blocC, FIN, '</urlset>'].join('\n'));
writeFileSync('sitemap.xml', sm, 'utf8');
console.log(`ok ${n} fiches de ministres · ${Object.keys(reseaux).length} avec réseaux · sitemap +${bloc.length}`);
