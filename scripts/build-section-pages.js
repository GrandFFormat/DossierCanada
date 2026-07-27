// Génère des pages HTML PRÉ-RENDUES, une par section (SEO — option A).
// Artefacts de build : régénérés à chaque rafraîchissement (npm run refresh),
// JAMAIS édités à la main. Chaque page part de index.html et n'en change que :
//   - le <title> / la meta description / le canonical / les balises OG+Twitter
//   - la vue rendue « active » (et le bouton de nav correspondant)
// pour que Googlebot et les scrapers sociaux voient le bon contenu sans JS.
import { readFileSync, writeFileSync } from 'node:fs';

const BASE = 'https://dossiercanada.ca';
const SRC = 'index.html';

// slug = nom de fichier (= l'URL via cleanUrls) ; view = id de #view-…
// ⚠️ data-view "ministres" est l'onglet DÉPUTÉS ; "cabinet" est l'onglet MINISTRES.
const SECTIONS = [
  { slug:'deputes',        view:'ministres', title:'Députés de la Chambre des communes — DossierCanada',
    desc:"Les 343 sièges de la Chambre des communes : nom, circonscription, parti et taux de présence de chaque député·e. Données officielles, en clair." },
  { slug:'ministres',      view:'cabinet',   title:'Le Cabinet fédéral — DossierCanada',
    desc:"Le Conseil des ministres du Canada : qui décide quoi, depuis quand, et comment iel vote. Sourcé de pm.gc.ca." },
  { slug:'projets-de-loi', view:'projets',   title:'Projets de loi du Parlement du Canada — DossierCanada',
    desc:"Tous les projets de loi au Parlement du Canada, résumés en langage clair : étape, statut, parrain et votes. Sans jugement." },
  { slug:'votes',          view:'votes',     title:'Registre des votes de la Chambre des communes — DossierCanada',
    desc:"Chaque vote nominatif à la Chambre des communes : qui a voté pour, contre ou s'est fait pairer, et par quelle marge. Le registre officiel, tel quel." },
  { slug:'lexique',        view:'lexique',   title:'Lexique parlementaire — DossierCanada',
    desc:"Le jargon du Parlement du Canada traduit en français de tous les jours, plus les personnes et institutions qui gravitent autour." }
];

// Le dépôt stocke index.html en CRLF ; on préserve le style de fin de ligne source.
const raw = readFileSync(SRC, 'utf8');
const NL = raw.includes('\r\n') ? '\r\n' : '\n';
const src = raw;

function must(cond, msg){ if(!cond){ console.error('✖ build-section-pages : ' + msg); process.exit(1); } }
must(src.includes('<section class="view active" id="view-apercu">'), "vue d'accueil active introuvable");
must(/<button class="active" data-view="apercu"/.test(src), "bouton nav d'accueil actif introuvable");

const esc = s => s.replace(/"/g, '&quot;');

function buildPage(sec){
  const url = BASE + '/' + sec.slug;
  let h = src;
  h = h.replace(/<title>[^<]*<\/title>/, '<title>' + sec.title + '</title>');
  h = h.replace(/(<meta name="description" content=")[^"]*(">)/, '$1' + esc(sec.desc) + '$2');
  h = h.replace(/(<link rel="canonical" href=")[^"]*(">)/, '$1' + url + '$2');
  h = h.replace(/(<meta property="og:title" content=")[^"]*(">)/, '$1' + esc(sec.title) + '$2');
  h = h.replace(/(<meta property="og:description" content=")[^"]*(">)/, '$1' + esc(sec.desc) + '$2');
  h = h.replace(/(<meta property="og:url" content=")[^"]*(">)/, '$1' + url + '$2');
  h = h.replace(/(<meta name="twitter:title" content=")[^"]*(">)/, '$1' + esc(sec.title) + '$2');
  h = h.replace(/(<meta name="twitter:description" content=")[^"]*(">)/, '$1' + esc(sec.desc) + '$2');

  // Vue active : accueil -> off, cible -> on
  h = h.replace('<section class="view active" id="view-apercu">', '<section class="view" id="view-apercu">');
  const secFrom = '<section class="view" id="view-' + sec.view + '">';
  must(h.includes(secFrom), 'section #view-' + sec.view + ' introuvable');
  h = h.replace(secFrom, '<section class="view active" id="view-' + sec.view + '">');

  // Bouton de nav actif : accueil -> off, cible -> on (tolère un attribut style=…)
  h = h.replace('<button class="active" data-view="apercu"', '<button data-view="apercu"');
  const navRe = new RegExp('<button data-view="' + sec.view + '"');
  must(navRe.test(h), 'bouton nav data-view="' + sec.view + '" introuvable');
  h = h.replace(navRe, '<button class="active" data-view="' + sec.view + '"');

  writeFileSync(sec.slug + '.html', h, 'utf8');
  console.log('✓ ' + sec.slug + '.html  (vue ' + sec.view + ')');
}

SECTIONS.forEach(buildPage);
console.log('\n✓ ' + SECTIONS.length + ' pages de section générées.');
