// « Cette semaine aux Communes » (14 nov. 2026), copie fédérale de dossierquebec/scrapers/debats.js :
// les réunions de comité de la Chambre des communes qui portent sur un projet de loi, résumées à partir
// des Témoignages (transcription officielle, « Evidence »).
//
//   node --env-file=api.env scrapers/debats.js              les réunions des 35 derniers jours
//   node --env-file=api.env scrapers/debats.js --dry-run    liste ce qui serait résumé, n'appelle rien
//   DEBATS_JOURS=60 DEBATS_MAX=4 node … scrapers/debats.js
//
// Source : le calendrier des réunions de comité (ourcommons.ca/Committees/fr/Meetings?meetingDate=…),
// puis les Témoignages de chaque réunion (DocumentViewer/fr/<session>/<comité>/meeting-<n>/evidence).
// Les Communes publient les Témoignages une à trois semaines après la réunion : le bloc dit « cette
// semaine », jamais « aujourd'hui ». Une réunion dont les Témoignages ne sont pas encore en ligne est
// retentée aux passages suivants.
//
// Le résumé : Haiku lit la transcription française, rend des puces de faits en français ET en anglais,
// les votes, ce qui suit. Mêmes garde-fous qu'à Québec (mot de jugement, numéro de projet de loi absent).
//
// Écrit data/debats.json (tout) et data/debats-site.json (le bloc de l'accueil et des fiches).

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import Anthropic from '@anthropic-ai/sdk';

if (!process.env.ANTHROPIC_API_KEY && existsSync('api.env')) {
  for (const l of readFileSync('api.env', 'utf8').split(String.fromCharCode(10))) {
    const m = l.trim().match(/^([A-Z_]+)\s*=\s*(.*)$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
}

const DRY = process.argv.includes('--dry-run');
const MAX = Number(process.env.DEBATS_MAX || 10);
const JOURS = Number(process.env.DEBATS_JOURS || 35);
const MODELE = 'claude-haiku-4-5';
const TARIF = { entree: 1, sortie: 5 };
const BASE = 'https://www.ourcommons.ca';
const UA = { 'User-Agent': 'Mozilla/5.0 (compatible; DossierCanada/1.0; +https://dossiercanada.ca/)' };
const SORTIE = 'data/debats.json';
const SORTIE_SITE = 'data/debats-site.json';
// Toutes les réunions résumées, sans limite de jours : la page Archives les montre jour par jour.
const SORTIE_ARCHIVES = 'data/debats-archives.json';
const attendre = (ms) => new Promise((r) => setTimeout(r, ms));

const decoder = (s) => String(s ?? '').replace(/[‐‑‒–]/g, '-').replace(/&nbsp;/g, ' ').replace(/&#0?39;|&rsquo;|&#8217;/g, '’').replace(/&laquo;|&#171;/g, '«').replace(/&raquo;|&#187;/g, '»')
  .replace(/&#(\d+);/g, (m, n) => String.fromCodePoint(Number(n))).replace(/&#x([0-9a-f]+);/gi, (m, n) => String.fromCodePoint(parseInt(n, 16)))
  .replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/\s+/g, ' ').trim();

async function page(url) {
  const r = await fetch(url, { headers: UA });
  if (!r.ok) throw new Error(`${r.status} ${url}`);
  return r.text();
}

// Les projets de loi connus (data/bills.json) : numéro, titres courts FR et EN, session.
const BILLS = (() => {
  const b = existsSync('data/bills.json') ? JSON.parse(readFileSync('data/bills.json', 'utf8')) : {};
  return (b.bills ?? b ?? []).filter((x) => x?.num);
})();
const norm = (s) => String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[’']/g, "'").replace(/\s+/g, ' ').trim();
const parTitre = new Map();
for (const b of BILLS) for (const t of [b.shortTitle?.fr, b.shortTitle?.en, b.title?.fr, b.title?.en]) if (t && t.length > 12) parTitre.set(norm(t), b);
// « Projet de loi C-40, Loi sur… » ou « Loi sur l’Agence des crimes financiers » (titre court seul).
function projetsDe(sujet) {
  const nums = [...String(sujet).matchAll(/\b(?:Bill|Projet de loi)\s+([CS]-\d+)/gi)].map((m) => m[1].toUpperCase());
  if (nums.length) return [...new Set(nums)];
  const n = norm(sujet).replace(/^(projet de loi |bill )/, '');
  for (const [t, b] of parTitre) if (n === t || (n.length > 20 && (t.startsWith(n) || n.startsWith(t)))) return [b.num];
  return [];
}
const billDe = (num) => BILLS.find((b) => b.num === num) ?? null;

// Les réunions d'un jour : comité, sujets, lien des Témoignages s'il existe déjà.
async function reunionsDu(date) {
  const html = (await page(`${BASE}/Committees/fr/Meetings?meetingDate=${date}`)).replace(/\s+/g, ' ');
  const out = [];
  for (const bloc of html.split('<div class="accordion-item meeting-item-').slice(1)) {
    if (!bloc.startsWith(date)) continue;
    const comite = (bloc.match(/meeting-acronym">([A-Z]+)/) ?? [])[1];
    const nom = decoder((bloc.match(/meeting-card-committee-details-name">\s*<a[^>]*>([^<]+)</) ?? [])[1] ?? '');
    const sujets = [...new Set([...bloc.matchAll(/studies-activities-item">([^<]+)/g)].map((m) => decoder(m[1])))];
    const temoignages = (bloc.match(/href="(\/\/www\.ourcommons\.ca\/DocumentViewer\/fr\/[^"]+\/temoignages)"/) ?? [])[1];
    const heures = (bloc.match(/<div class="the-time">([^<]+)<\/div>/) ?? [])[1];
    const pls = [...new Set(sujets.flatMap(projetsDe))];
    if (!comite || !pls.length) continue;
    const m = (temoignages ?? bloc.match(/DocumentViewer\/fr\/[^"]+\/reunion-\d+\/avis-convocation/)?.[0] ?? '').match(/\/(\d+-\d+)\/([A-Z]+)\/reunion-(\d+)/);
    out.push({
      id: m ? `${m[2]}-${m[1]}-${m[3]}` : `${comite}-${date}`, date, comite, comiteNom: nom.replace(/\s*\([A-Z]+\)\s*$/, ''), sujets, pls,
      session: m?.[1] ?? null, reunion: m ? Number(m[3]) : null, heures: heures ? decoder(heures) : null,
      url: temoignages ? `https:${temoignages}` : null,
    });
  }
  return out;
}

// La transcription : le texte entre « Le président » (ou « La présidente ») et la fin.
function texteDe(html) {
  const t = decoder(html.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/g, '').replace(/<\/p>|<br\s*\/?>|<\/h\d>/gi, ' \n').replace(/<[^>]+>/g, ' '));
  const debut = t.search(/(?:Le président|La présidente|The Chair)\s*\(/);
  return debut >= 0 ? t.slice(debut) : t;
}

const CONSIGNE = `Tu résumes une réunion d'un comité permanent de la Chambre des communes du Canada pour un site d'information citoyenne, neutre, en langage clair.

Tu reçois les Témoignages (transcription officielle) d'une réunion consacrée à un projet de loi. Tu rends :
- puces : 3 à 5 phrases courtes de FAITS (une idée par puce, 60 mots au plus), EN FRANÇAIS SEULEMENT, dans l'ordre de la réunion. Qui a témoigné et ce que chaque témoin demandait (une proposition chacun) ; à l'étude article par article, quels articles et amendements ont été adoptés, rejetés ou reportés, et de qui venaient les amendements ; les motions et leur sort. Nomme les députés comme la transcription (nom, circonscription, parti abrégé tel qu'écrit).
- pucesEn : la traduction anglaise fidèle, mêmes nombres.
- votes : chaque vote tenu, avec son objet en une phrase (objet en français, objetEn en anglais), le nombre de voix pour, contre, les abstentions (0 si non dit) et le résultat tel qu'annoncé. Un vote « avec dissidence » ou à l'unanimité sans décompte : pour et contre à 0, appelNominal false, et dis-le dans l'objet.
- aSuivre / aSuivreEn : une phrase sur ce qui reprend à la prochaine réunion, ou null.

Règles absolues : rien qui ne soit dans la transcription ; aucun jugement, aucun adjectif d'appréciation (important, historique, controversé, vif…) ; les nombres recopiés tels quels. Français du Québec, sans virgule avant « et ».`;
const OUTIL = {
  name: 'resume_reunion',
  description: 'Enregistre le résumé factuel de la réunion.',
  strict: true,
  input_schema: {
    type: 'object',
    properties: {
      puces: { type: 'array', items: { type: 'string' } },
      pucesEn: { type: 'array', items: { type: 'string' } },
      votes: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            objet: { type: 'string' }, objetEn: { type: 'string' },
            pour: { type: 'integer' }, contre: { type: 'integer' }, abstentions: { type: 'integer' },
            resultat: { type: 'string', enum: ['adopte', 'rejete', 'autre'] },
            appelNominal: { type: 'boolean' },
          },
          required: ['objet', 'objetEn', 'pour', 'contre', 'abstentions', 'resultat', 'appelNominal'],
          additionalProperties: false,
        },
      },
      aSuivre: { type: ['string', 'null'] },
      aSuivreEn: { type: ['string', 'null'] },
    },
    required: ['puces', 'pucesEn', 'votes', 'aSuivre', 'aSuivreEn'],
    additionalProperties: false,
  },
};
const JUGEMENT = /\b(important|importante|importants|importantes|majeur|majeure|historique|controvers|vif|vive|houleu|ambitieu|significant|major|historic|controversial|heated)\b/i;

async function resumer(client, r, texte) {
  const corps = texte.length > 160000 ? `${texte.slice(0, 110000)}\n[…]\n${texte.slice(-50000)}` : texte;
  const rep = await client.messages.create({
    model: MODELE, max_tokens: 1800, system: CONSIGNE, tools: [OUTIL], tool_choice: { type: 'tool', name: OUTIL.name },
    messages: [{ role: 'user', content: `${r.comiteNom} (${r.comite}), réunion du ${r.date}. Sujet : ${r.sujets.join(' ; ')}.\n\nTÉMOIGNAGES :\n${corps}` }],
  });
  const res = rep.content.find((c) => c.type === 'tool_use')?.input;
  const usage = { entree: rep.usage.input_tokens, sortie: rep.usage.output_tokens };
  if (!res?.puces || res.puces.length < 3) return { erreur: 'moins de trois puces', usage };
  if (res.puces.some((p) => p.length > 480)) return { erreur: 'puce trop longue (plusieurs faits collés)', usage };
  if (/"[a-zA-Z]+"s*:/.test(`${res.aSuivre ?? ''}${res.aSuivreEn ?? ''}`)) return { erreur: 'champ mal formé', usage };
  if (res.puces.some((p) => /(the|and|was|were|committee)/i.test(p))) return { erreur: 'anglais dans les puces françaises', usage };
  res.votes ??= []; res.pucesEn ??= [];
  const tout = [...res.puces, ...(res.aSuivre ? [res.aSuivre] : [])].join(' ');
  const jug = tout.match(JUGEMENT);
  if (jug) return { erreur: `mot de jugement « ${jug[0]} »`, usage };
  const cites = [...tout.matchAll(/\b([CS]-\d+)\b/g)].map((m) => m[1]);
  const absents = cites.filter((n) => !texte.includes(n));
  if (absents.length) return { erreur: `numéros absents de la source : ${absents.join(', ')}`, usage };
  return { resume: res, usage };
}

async function main() {
  const ancien = existsSync(SORTIE) ? JSON.parse(readFileSync(SORTIE, 'utf8')) : { seances: [] };
  const connues = new Map(ancien.seances.map((s) => [s.id, s]));
  const jours = [];
  for (let i = 1; i <= JOURS; i++) {
    const d = new Date(Date.now() - i * 864e5);
    if (d.getUTCDay() !== 0 && d.getUTCDay() !== 6) jours.push(d.toISOString().slice(0, 10));
  }
  const trouvees = [];
  for (const date of jours) {
    try { trouvees.push(...await reunionsDu(date)); } catch (e) { console.warn(`  ${date} : calendrier illisible (${e.message})`); }
    await attendre(400);
  }
  const aFaire = trouvees.filter((r) => r.url && !connues.get(r.id)?.resume && (connues.get(r.id)?.rejets ?? 0) < 2).sort((a, b) => b.date.localeCompare(a.date)).slice(0, MAX);
  console.log(`Débats (Communes) : ${trouvees.length} réunions de comité sur un projet de loi en ${jours.length} jours, ${trouvees.filter((r) => r.url).length} avec Témoignages, ${aFaire.length} à résumer.`);

  const client = DRY || !process.env.ANTHROPIC_API_KEY ? null : new Anthropic();
  if (!client && !DRY) console.warn('  ANTHROPIC_API_KEY absente : les réunions sont repérées, pas résumées.');
  let appels = 0, entree = 0, sortie = 0;
  for (const r of trouvees) if (!connues.has(r.id) || !connues.get(r.id).resume) connues.set(r.id, { ...connues.get(r.id), ...r });
  for (const r of aFaire) {
    const vieux = connues.get(r.id) ?? {};
    if (DRY) { console.log(`  ${r.date} ${r.comite} — ${r.sujets[0]}`); continue; }
    let html;
    try { html = await page(r.url); } catch (e) { console.warn(`  ${r.id} : Témoignages illisibles (${e.message})`); continue; }
    const texte = texteDe(html);
    const mots = texte.split(/\s+/).length;
    let fiche = { ...vieux, ...r, mots };
    if (!client || mots < 300) { connues.set(r.id, fiche); continue; }
    try {
      const { resume, erreur, usage } = await resumer(client, r, texte);
      appels++; entree += usage.entree; sortie += usage.sortie;
      if (erreur) { console.log(`  ${r.id} : résumé rejeté (${erreur})`); fiche.rejets = (vieux.rejets ?? 0) + 1; }
      else { fiche = { ...fiche, resume, modele: MODELE, genereLe: new Date().toISOString(), rejets: 0 }; console.log(`  ${r.id} : ${r.date}, ${mots} mots, ${resume.puces.length} puces, ${resume.votes.length} vote(s)`); }
    } catch (e) { console.log(`  ${r.id} : échec (${e.message})`); }
    connues.set(r.id, fiche);
    await attendre(600);
  }
  const seances = [...connues.values()].sort((a, b) => b.date.localeCompare(a.date) || a.comite.localeCompare(b.comite));
  const cout = (entree * TARIF.entree + sortie * TARIF.sortie) / 1e6;
  if (!DRY) {
    writeFileSync(SORTIE, JSON.stringify({ generatedAt: new Date().toISOString(), source: `${BASE}/Committees/fr/Meetings`, modele: MODELE, dernierPassage: { appels, entree, sortie, coutUSD: Number(cout.toFixed(4)) }, seances }, null, 1), 'utf8');
    const resumees = seances.filter((s) => s.resume);
    const joursSite = [...new Set(resumees.map((s) => s.date))].slice(0, 12);
    const pourSite = (s) => {
      const b = billDe(s.pls[0]);
      return {
        id: s.id, date: s.date, url: s.url, commissionNom: /^projet de loi/i.test(s.comiteNom ?? '') || !s.comiteNom ? `Comité législatif (${s.comite})` : `${s.comiteNom} (${s.comite})`, commissionNomEn: /^projet de loi/i.test(s.comiteNom ?? '') || !s.comiteNom ? `Legislative committee (${s.comite})` : `${s.comite} committee`,
        comite: s.comite, typeNom: 'Comité', typeNomEn: 'Committee', sujets: s.sujets, pls: s.pls, titreLoi: b?.shortTitle?.fr || b?.title?.fr || null, titreLoiEn: b?.shortTitle?.en || b?.title?.en || null,
        heures: s.heures ? { debut: null, fin: null, texte: s.heures } : null, resume: s.resume,
      };
    };
    writeFileSync(SORTIE_SITE, JSON.stringify({ generatedAt: new Date().toISOString(), seances: resumees.filter((s) => joursSite.includes(s.date)).slice(0, 80).map(pourSite) }), 'utf8');
    writeFileSync(SORTIE_ARCHIVES, JSON.stringify({ generatedAt: new Date().toISOString(), seances: resumees.map(pourSite) }), 'utf8');
  }
  console.log(`Débats (Communes) : ${seances.filter((s) => s.resume).length} résumées · ce passage : ${appels} appel(s), ${entree} + ${sortie} jetons ≈ ${cout.toFixed(3)} $ US.`);
}

main().catch((e) => { console.error(e); process.exit(1); });
