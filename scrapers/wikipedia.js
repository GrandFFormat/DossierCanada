// La page Wikipédia de chaque député·e, pour le bouton « W » des fiches (Martin, 23 oct. 2026, comme
// sur DossierQuébec). Par lots de 50 titres (API publique de Wikipédia en français) : le titre nu,
// puis les titres d'homonymie usuels. Une page n'est retenue que si sa description parle d'une
// personne politique canadienne ; la page anglaise vient du lien interlangue de la page française.
// Écrit data/wikipedia.json { PersonId: { fr, en } }.
//
// Se relance à la main après une élection (node scrapers/wikipedia.js, puis npm run build:frontend).
import { readFileSync, writeFileSync } from 'node:fs';

const UA = 'DossierCanada/1.0 (https://www.dossiercanada.ca)';
const OUT = 'data/wikipedia.json';
const SUFFIXES = ['', ' (homme politique)', ' (femme politique)', ' (homme politique canadien)', ' (femme politique canadienne)', ' (politicien)', ' (personnalité politique)'];
const CANADA = /canadien|canadienne|Canada|qu[ée]b[ée]cois|ontarien|albertain|Chambre des communes/i;
const POLITIQUE = /politi|d[ée]put[ée]|ministre|homme d'[ÉE]tat|femme d'[ÉE]tat/i;

async function lot(titres) {
  const url = 'https://fr.wikipedia.org/w/api.php?' + new URLSearchParams({
    action: 'query', format: 'json', redirects: '1', prop: 'description|pageprops|langlinks|info',
    inprop: 'url', lllang: 'en', lllimit: 'max', ppprop: 'disambiguation', titles: titres.join('|'), formatversion: '2',
  });
  const r = await fetch(url, { headers: { 'User-Agent': UA } });
  if (!r.ok) throw new Error(`Wikipédia : HTTP ${r.status}`);
  const j = await r.json();
  // Titre demandé → titre final (normalisation et redirections), puis page.
  const vers = new Map();
  for (const n of j.query?.normalized ?? []) vers.set(n.from, n.to);
  for (const n of j.query?.redirects ?? []) vers.set(n.from, n.to);
  const pages = new Map((j.query?.pages ?? []).map((p) => [p.title, p]));
  const final = (t) => { let x = t; for (let i = 0; i < 3 && vers.has(x); i++) x = vers.get(x); return x; };
  return (t) => pages.get(final(t));
}

async function main() {
  const { deputes } = JSON.parse(readFileSync('data/deputes.json', 'utf-8'));
  const liste = deputes.members ?? deputes;
  const liens = {};
  let restants = liste.slice();
  for (const s of SUFFIXES) {
    const suivants = [];
    for (let i = 0; i < restants.length; i += 50) {
      const groupe = restants.slice(i, i + 50);
      const trouver = await lot(groupe.map((d) => d.name + s));
      for (const d of groupe) {
        const p = trouver(d.name + s);
        const bon = p && !p.missing && !p.pageprops?.disambiguation && CANADA.test(p.description ?? '') && POLITIQUE.test(p.description ?? '');
        if (bon) {
          const en = p.langlinks?.[0]?.title;
          liens[d.id] = { fr: p.fullurl, en: en ? `https://en.wikipedia.org/wiki/${encodeURIComponent(en.replace(/ /g, '_'))}` : null };
        } else suivants.push(d);
      }
      await new Promise((r) => setTimeout(r, 300));
    }
    restants = suivants;
    if (!restants.length) break;
  }
  writeFileSync(OUT, JSON.stringify({ source: 'fr.wikipedia.org (API publique)', lu: new Date().toISOString().slice(0, 10), liens }, null, 2) + '\n');
  console.log(`${Object.keys(liens).length} pages trouvées sur ${liste.length}`);
  if (restants.length) console.log(`  sans page sûre (${restants.length}) : ${restants.slice(0, 30).map((d) => d.name).join(', ')}${restants.length > 30 ? '…' : ''}`);
}

main().catch((e) => { console.error(e.message); process.exit(1); });
