// VÉRIFICATEUR DES PROMESSES — le garde-fou de data/promises.json.
//
// Les promesses sont saisies à la main (choisir une promesse est un acte
// éditorial). Une saisie à la main se trompe : un mot sauté, une citation
// recollée de deux phrases, une preuve attribuée au mauvais projet de loi. Sur
// une page qui met un parti en regard de ses lois, une citation inexacte coûte
// tout — et c'est exactement le reproche qu'on nous ferait en premier.
//
// Ce script relit donc chaque entrée contre ses sources, sans rien croire :
//   1. chaque citation (FR et EN) doit exister LITTÉRALEMENT dans la plateforme
//      publiée par le parti, dans la langue correspondante ;
//   2. chaque projet de loi cité doit exister dans data/bills.json ;
//   3. chaque preuve (FR et EN) doit exister LITTÉRALEMENT dans le sommaire
//      officiel de CE projet de loi.
//
// La comparaison ignore espaces, ponctuation, casse et accents : les apostrophes
// typographiques, les insécables et les césures de PDF diffèrent d'une copie à
// l'autre sans que le texte change. Elle n'ignore AUCUN mot.
//
// Lancer : node scripts/verifier-promesses.mjs
// Sortie 1 si une seule vérification échoue.
import { readFileSync } from 'node:fs';

const UA = 'dossiercanada-verificateur/0.1 (projet citoyen independant, usage non commercial)';
const data = JSON.parse(readFileSync('data/promises.json', 'utf-8'));
const bills = JSON.parse(readFileSync('data/bills.json', 'utf-8')).bills;

// On compare le SENS des caractères, pas leur typographie : apostrophe droite ou
// courbe, espace insécable, trait d'union ou tiret cadratin, accent ou non.
const normaliser = (s) => String(s)
  .normalize('NFD').replace(/[̀-ͯ]/g, '')
  .toLowerCase()
  .replace(/[^a-z0-9]/g, '');

// Les entités HTML redeviennent des caractères. Les numériques couvrent tout
// l'Unicode ; les nommées utiles ici se comptent sur les doigts (la normalisation
// retire ensuite accents et ponctuation, donc une entité inconnue qui tombe ne
// peut plus avaler une lettre).
const NOMMEES = {
  amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ',
  rsquo: '’', lsquo: '‘', ldquo: '“', rdquo: '”', laquo: '«', raquo: '»',
  eacute: 'é', egrave: 'è', ecirc: 'ê', agrave: 'à', acirc: 'â',
  ccedil: 'ç', ocirc: 'ô', ugrave: 'ù', ucirc: 'û', icirc: 'î', iuml: 'ï',
  hellip: '…', ndash: '–', mdash: '—', deg: '°', euro: '€',
};
const decoder = (s) => String(s)
  .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
  .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
  .replace(/&([a-z]+);/gi, (m, nom) => NOMMEES[nom.toLowerCase()] ?? ' ');

const pages = new Map();
async function page(url) {
  if (pages.has(url)) return pages.get(url);
  const res = await fetch(url, { headers: { 'User-Agent': UA } });
  if (!res.ok) throw new Error(`HTTP ${res.status} — ${url}`);
  // On retire le balisage et les blocs qui ne sont pas du texte lisible, puis on
  // DÉCODE les entités HTML.
  // ⚠️ Décoder, pas supprimer. La page française écrit « &#233;conomiser » : en
  // remplaçant l'entité par une espace, le « é » DISPARAÎT, le texte devient
  // « conomiser », et la citation la plus exacte du monde ne se retrouve plus.
  // C'est ce qui a fait échouer toutes les vérifications françaises d'un coup.
  const texte = decoder((await res.text())
    .replace(/<(script|style|noscript)[\s\S]*?<\/\1>/gi, ' ')
    .replace(/<[^>]+>/g, ' '));
  const norm = normaliser(texte);
  pages.set(url, norm);
  return norm;
}

const sommaire = (num, lang) => {
  const b = bills.find((x) => String(x.num).toUpperCase() === String(num).toUpperCase());
  if (!b) return null;
  const s = b.summary;
  return normaliser(typeof s === 'string' ? s : (s && s[lang]) || '');
};

let ko = 0;
const echec = (id, quoi) => { ko++; console.error(`  ✗ ${id} — ${quoi}`); };

for (const p of data.promises) {
  // 1. Les deux citations, chacune dans la plateforme de SA langue.
  for (const [lang, quote, url] of [
    ['fr', p.quote, p.sourceUrl],
    ['en', p.quoteEn, p.sourceUrlEn],
  ]) {
    if (!quote) { echec(p.id, `citation ${lang.toUpperCase()} absente`); continue; }
    let src;
    try { src = await page(url); }
    catch (e) { echec(p.id, `source ${lang.toUpperCase()} illisible : ${e.message}`); continue; }
    if (!src.includes(normaliser(quote))) {
      echec(p.id, `citation ${lang.toUpperCase()} INTROUVABLE dans ${url}`);
    }
  }

  // 2 et 3. Les projets de loi cités, et la preuve dans leur sommaire officiel.
  for (const a of p.actions || []) {
    const fr = sommaire(a.num, 'fr');
    if (fr === null) { echec(p.id, `projet ${a.num} absent de data/bills.json`); continue; }
    if (a.preuve && !fr.includes(normaliser(a.preuve))) {
      echec(p.id, `preuve FR introuvable dans le sommaire officiel de ${a.num}`);
    }
    const en = sommaire(a.num, 'en');
    if (a.preuveEn && en && !en.includes(normaliser(a.preuveEn))) {
      echec(p.id, `preuve EN introuvable dans le sommaire officiel de ${a.num}`);
    }
  }

  // Cohérence de l'étiquette : « aucune » ne peut pas citer un projet de loi, et
  // « loi »/« partiel » doivent en citer au moins un.
  const n = (p.actions || []).length;
  if (p.etat === 'aucune' && n) echec(p.id, `étiquette « aucune » mais ${n} projet(s) cité(s)`);
  if (p.etat !== 'aucune' && !n) echec(p.id, `étiquette « ${p.etat} » sans aucun projet cité`);
}

console.log(`\n${data.promises.length} promesse(s) vérifiée(s) · ${ko} problème(s).`);
if (ko) process.exitCode = 1;
