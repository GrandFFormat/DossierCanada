// LOIS ET RÈGLEMENTS TOUCHÉS — 7 nov. 2026, portée de DossierQuébec (case bill-lois).
//
// Source : le texte de PREMIÈRE LECTURE de chaque projet, en XML, sur parl.ca. Le chemin
// du XML varie (Government/Private, C/S…) : on ne le devine pas, on le lit sur la page
// https://www.parl.ca/DocumentViewer/en/45-1/bill/C-5/first-reading (lien « …_E.xml »).
// La version française est le même chemin en _F.xml, quand elle existe.
//
// PIÈGE : les balises <XRefExternal reference-type="act"> listent TOUTES les lois citées.
// On ne garde que les lois et règlements MODIFIÉS :
//   - une phrase d'amorce (élément <Text> hors du texte inséré) qui dit « is amended /
//     replaced / repealed » (« est modifié / remplacé / abrogé ») : on retient les lois et
//     règlements qu'elle nomme ;
//   - si elle dit seulement « the Act » / « la même loi », on retient la loi du dernier
//     intertitre qui porte un titre de loi (structure des parties de modification et des
//     « Consequential/Related Amendments »).
// Une loi édictée par le projet (ex. C-5) ou seulement citée n'est donc pas comptée.
//
// robots.txt de parl.ca (relu le 7 nov. 2026) : n'interdit que /diplomacy/…/search et
// /ErrorPage/. Politesse : 1,2 s entre requêtes, User-Agent identifié. CACHE : un texte de
// première lecture ne change plus ; un projet déjà lu n'est jamais redemandé (sauf
// version du parseur relevée). Sans IA, sans coût.
//
// Sortie : data/bill-laws.json → { bills: { <id>: { num, xml, en:[…], fr:[…] } } }.
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import * as cheerio from 'cheerio';

const BILLS_PATH = 'data/bills.json';
const OUT_PATH = 'data/bill-laws.json';
const PARSER = 2; // relever pour forcer une relecture de tous les XML
const USER_AGENT = 'DossierCanada/1.0 (+https://dossiercanada.ca; site citoyen; contact mart.archambault@gmail.com)';
const DELAI = 1200;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let derniere = 0;
async function get(url, { soft404 = false } = {}) {
  const attente = derniere + DELAI - Date.now();
  if (attente > 0) await sleep(attente);
  derniere = Date.now();
  const res = await fetch(url, { headers: { 'User-Agent': USER_AGENT } });
  if (soft404 && res.status === 404) return null;
  if (!res.ok) throw new Error(`HTTP ${res.status} — ${url}`);
  return res.text();
}

const AMEND = {
  en: /\b(is|are)\s+(further\s+)?(amended|replaced|repealed|renumbered)\b/i,
  fr: /\b(est|sont)\s+(de nouveau\s+)?(modifi|remplac|abrog|renuméroté)/i,
};
const MEME = {
  en: /\b(the|that) (Act|Regulations?)\b/,
  fr: /\b(la même loi|la même règlement|le même règlement|cette loi|ce règlement|la loi|le règlement)\b/i,
};
const propre = (s) => s.replace(/\s+/g, ' ').replace(/[\s,;.:]+$/, '').trim();

export function lawsFromXml(xml, lang) {
  const $ = cheerio.load(xml, { xmlMode: true });
  const vus = new Map();
  const ajouter = (t) => { t = propre(t).replace(/^(la|le|les)\s+(?=(Loi|Règlement|Code|Décret|Arrêté))|^l[’'](?=Loi)/, ''); const k = t.toLowerCase().replace(/[^\p{L}\p{N}]/gu, ''); if (t && !vus.has(k)) vus.set(k, t); };
  let loiCourante = null;
  // Lois ÉDICTÉES par le projet (ou titre abrégé donné à une loi existante) : « Short title /
  // Titre abrégé ». Elles ne sont pas « touchées » au sens de la case, même si le projet les
  // modifie plus loin (dispositions de coordination).
  const cle = (t) => propre(t).replace(/^(la|le|les)\s+|^l[’']/i, '').toLowerCase().replace(/[^\p{L}\p{N}]/gu, '');
  const edictees = new Set();
  $('MarginalNote').each((_, m) => {
    if (!/^(Short title|Titre abrégé)$/i.test(propre($(m).text()))) return;
    const t = $(m).nextAll('Text').first();
    const refs = t.find('XRefExternal');
    if (refs.length) refs.each((_, r) => edictees.add(cle($(r).text())));
    else edictees.add(cle(t.text().replace(/^.*(cited as the|sous le titre)\s*/i, '')));
  });
  // Parcours dans l'ordre du document, des intertitres et des phrases d'amorce du CORPS
  // (on saute la table des dispositions, le texte inséré et les notes).
  $('Body').find('Heading, Text').each((_, el) => {
    if ($(el).parents('AmendedText, AmendedContent, ReadAsText, Footnote, HistoricalNote, TableOfProvisions, Schedule, FormGroup').length) return;
    if (el.tagName === 'Heading') {
      const refs = $(el).find('XRefExternal[reference-type="act"], XRefExternal[reference-type="regulation"]');
      const titre = propre($(el).find('TitleText').text());
      if (refs.length) loiCourante = propre(refs.first().text());
      else if (/^(Amendments?|Consequential|Related|Coordinating|Transitional|Modifications?|Dispositions)\b/i.test(titre)) { /* intertitre générique : la loi courante reste */ }
      else if (/\b(Act|Regulations?|Rules|Order)$/.test(titre) || /^(Loi|Règlement|Décret|Code)\b/.test(titre)) loiCourante = titre;
      else if (/^PART\b|^PARTIE\b/i.test(propre($(el).text()))) loiCourante = null;
      return;
    }
    // Amorce : le texte de l'élément sans ses sous-éléments de texte inséré.
    const c = $(el).clone();
    c.find('AmendedText, AmendedContent, ReadAsText, Footnote').remove();
    const txt = c.text();
    if (!AMEND[lang].test(txt)) return;
    // « … is replaced by a reference to the X Act » : X est un nouveau titre, pas une loi touchée.
    const avant = cheerio.load(`<r>${(c.html() || '').split(/replaced by a reference|remplac\S* par (la mention|le renvoi)/i)[0]}</r>`, { xmlMode: true });
    const refs = avant('XRefExternal[reference-type="act"], XRefExternal[reference-type="regulation"]').map((_, r) => avant(r).text()).get();
    if (refs.length) refs.forEach((t) => { if (!edictees.has(cle(t))) ajouter(t); });
    else if (loiCourante && MEME[lang].test(txt) && !edictees.has(cle(loiCourante))) ajouter(loiCourante);
  });
  return [...vus.values()];
}

async function xmlUrl(b, session) {
  const html = await get(`https://www.parl.ca/DocumentViewer/en/${b.session || session}/bill/${b.num}/first-reading`, { soft404: true });
  if (!html) return null;
  const m = html.match(/href="([^"]+_E\.xml)"/i);
  return m ? new URL(m[1], 'https://www.parl.ca').href : null;
}

async function main() {
  const { bills, session } = JSON.parse(readFileSync(BILLS_PATH, 'utf-8'));
  const prev = existsSync(OUT_PATH) ? JSON.parse(readFileSync(OUT_PATH, 'utf-8')) : { bills: {} };
  const out = { source: 'https://www.parl.ca/DocumentViewer (XML de première lecture)', session, parser: PARSER, scrapedAt: new Date().toISOString(), bills: {} };
  let lus = 0, erreurs = 0;
  for (const b of bills) {
    const old = prev.bills?.[b.id];
    if (old && old.xml && prev.parser === PARSER) { out.bills[b.id] = old; continue; }
    try {
      const xml = old?.xml || await xmlUrl(b, session);
      if (!xml) { out.bills[b.id] = { num: b.num, xml: null, en: [], fr: [] }; continue; }
      const en = lawsFromXml(await get(xml), 'en');
      const xf = await get(xml.replace(/_E\.xml$/i, '_F.xml'), { soft404: true });
      const fr = xf ? lawsFromXml(xf, 'fr') : [];
      out.bills[b.id] = { num: b.num, xml, en, fr };
      lus++;
    } catch (e) {
      erreurs++;
      console.error(`  ⚠ ${b.num} : ${e.message} — données précédentes gardées`);
      out.bills[b.id] = old ?? { num: b.num, xml: null, en: [], fr: [] };
    }
  }
  const v = Object.values(out.bills);
  console.log(`${v.filter((x) => x.en.length >= 2 || x.fr.length >= 2).length} projets avec 2 textes touchés ou plus ; ${lus} XML lus, ${erreurs} erreurs`);
  if (erreurs && erreurs === bills.length) throw new Error('Toutes les requêtes ont échoué');
  writeFileSync(OUT_PATH, JSON.stringify(out, null, 1) + '\n');
}

if (process.argv[1] && process.argv[1].endsWith('bill-laws.js')) main().catch((e) => { console.error(e); process.exit(1); });
