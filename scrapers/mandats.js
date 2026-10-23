// Nombre de mandats de chaque député·e (23 oct. 2026, Martin : « tu marqueras si c'est un deuxième
// ou troisième mandat »). La Chambre publie la liste des député·e·s de chaque législature
// (ourcommons.ca/Members/en/search/xml?parliament=N) : un mandat = une législature où la personne
// a siégé, par élection générale ou partielle. On lit les législatures 25 à aujourd'hui, une
// requête chacune, et on écrit data/mandats.json { PersonId: { n, legislatures: [...] } }.
//
// Les mandats ne changent qu'aux élections : ce script se relance à la main après une élection
// (node scrapers/mandats.js), il ne fait pas partie de la tournée quotidienne.
//
// Usage : node scrapers/mandats.js
import { writeFileSync, readFileSync } from 'node:fs';

const DEBUT = 25;
const OUT = 'data/mandats.json';
const UA = 'Mozilla/5.0 (DossierCanada; +https://www.dossiercanada.ca)';
const session = (() => { try { return JSON.parse(readFileSync('data/deputes.json', 'utf-8')).parliament; } catch { return null; } })();

async function legislature(n) {
  const url = `https://www.ourcommons.ca/Members/en/search/xml?parliament=${n}&caucusId=all&province=all&gender=all`;
  const res = await fetch(url, { headers: { 'User-Agent': UA } });
  if (!res.ok) throw new Error(`législature ${n} : HTTP ${res.status}`);
  const xml = await res.text();
  return new Set([...xml.matchAll(/<PersonId>(\d+)<\/PersonId>/g)].map((m) => m[1]));
}

async function main() {
  // La législature en cours : la plus haute qui répond avec des député·e·s.
  let fin = Number(session) || 45;
  const parPersonne = {};
  for (let n = DEBUT; n <= fin + 1; n++) {
    const ids = await legislature(n);
    if (!ids.size) { if (n > fin) break; continue; }
    if (n > fin) fin = n;
    for (const id of ids) (parPersonne[id] ??= []).push(n);
    console.log(`  législature ${n} : ${ids.size} député·e·s`);
    await new Promise((r) => setTimeout(r, 400));
  }
  const out = {};
  for (const [id, legs] of Object.entries(parPersonne)) out[id] = { n: legs.length, legislatures: legs };
  writeFileSync(OUT, JSON.stringify({ source: 'ourcommons.ca/Members/en/search/xml', lu: new Date().toISOString().slice(0, 10), deLegislature: DEBUT, aLegislature: fin, mandats: out }, null, 2) + '\n');
  console.log(`${Object.keys(out).length} personnes écrites dans ${OUT}`);
}

main().catch((e) => { console.error(e.message); process.exit(1); });
