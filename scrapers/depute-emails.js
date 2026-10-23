// Scraper — Courriels officiels des député·e·s (Chambre des communes)
//
// Source : la fiche officielle de chaque député·e sur ourcommons.ca
// (https://www.ourcommons.ca/members/en/{PersonId}), qui expose UN lien mailto:
// avec le courriel parlementaire officiel (@parl.gc.ca). Ni le feed XML du roster
// ni l'export CSV ne contiennent le courriel — il faut visiter la fiche. Depuis le
// 2026-10-23, seules les fiches SANS adresse connue sont visitées chaque nuit (voir
// main) ; la relecture complète n'a lieu qu'une fois par mois.
// On LIT le courriel affiché — on ne devine JAMAIS un format d'adresse.
//
// Volontairement PAS de réseaux sociaux (LinkedIn/FB/Instagram) : ils ne sont pas
// listés de façon fiable sur les pages officielles, et les chercher par nom
// risquerait de confondre des homonymes ou de pointer un faux compte. Courriel
// officiel seulement.
//
// Modèle produit (data/depute-emails.json → emails{}) : { "<PersonId>": "prenom.nom@parl.gc.ca", ... }

import { writeFileSync, readFileSync, mkdirSync, existsSync } from 'node:fs';

const DEPUTES_PATH = 'data/deputes.json';
const OUT_PATH = 'data/depute-emails.json';
const USER_AGENT = 'DossierCanada/0.1 (veille citoyenne; mart.archambault@gmail.com)';

async function fetchEmail(id) {
  const url = `https://www.ourcommons.ca/members/en/${id}`;
  const res = await fetch(url, { headers: { 'User-Agent': USER_AGENT, Accept: 'text/html' } });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const html = await res.text();
  // La fiche contient un unique lien mailto: — le courriel parlementaire officiel.
  const m = html.match(/mailto:([^"'?]+@parl\.gc\.ca)/i);
  return m ? m[1].trim().toLowerCase() : null;
}

/* SEULS LES NOUVEAUX ÉLU·E·S SONT VISITÉ·E·S (2026-10-23).
   Avant, le script ouvrait chaque nuit les 337 fiches de député·e·s, huit à la
   fois et sans pause, pour relire une adresse courriel qui ne change presque
   jamais. C'était le gros des requêtes qui ont fait bloquer le site par
   ourcommons.ca ; on a écrit à la Chambre en s'engageant à ne prendre que le neuf.

   On garde donc l'adresse déjà connue de chaque député·e encore en poste, et on
   ne visite que les fiches sans adresse connue (nouvel·le élu·e, ou fiche ratée la
   dernière fois) — une à la fois, une seconde d'écart.
   Une fois par mois (le 1er), on relit tout de même l'ensemble, toujours une fiche
   à la fois : une adresse peut changer, et on ne veut pas garder une adresse fausse
   indéfiniment. EMAILS_FULL=1 force cette relecture complète. */
const DELAI_MS = 1000;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function main() {
  const deputes = JSON.parse(readFileSync(DEPUTES_PATH, 'utf8')).deputes;
  const avant = existsSync(OUT_PATH) ? JSON.parse(readFileSync(OUT_PATH, 'utf8')).emails || {} : {};
  const complet = process.env.EMAILS_FULL === '1' || new Date().getUTCDate() === 1;
  const emails = {};
  let missing = 0;
  let failures = 0;
  let visites = 0;

  for (const d of deputes) {
    // Adresse connue, et pas de relecture complète aujourd'hui : on la garde.
    if (!complet && avant[d.id]) { emails[d.id] = avant[d.id]; continue; }
    try {
      const email = await fetchEmail(d.id);
      if (email) emails[d.id] = email;
      else missing++;
    } catch (err) {
      failures++;
      // Fiche injoignable : on garde l'ancienne adresse plutôt que d'en perdre une.
      if (avant[d.id]) emails[d.id] = avant[d.id];
    }
    visites++;
    await sleep(DELAI_MS);
  }
  console.log(`  fiches visitées : ${visites}${complet ? ' (relecture complète mensuelle)' : ''} · adresses reprises telles quelles : ${deputes.length - visites}`);

  // GARDE-FOU : quand ourcommons.ca bloque le run, CHAQUE fiche échoue. Le script
  // écrivait alors une liste vide par-dessus la bonne, et les courriels des
  // député·e·s disparaissaient du site (constaté le 2026-10-23 : 0 adresse). Si
  // plus de la moitié des fiches visitées ont échoué, on n'écrit rien et on sort
  // en échec : le fichier de la veille reste, et l'alerte du run le signale.
  if (visites && failures > visites / 2) {
    throw new Error(`${failures}/${visites} fiches en échec (blocage probable) — fichier précédent conservé.`);
  }

  mkdirSync('data', { recursive: true });
  writeFileSync(
    OUT_PATH,
    JSON.stringify(
      { source: 'https://www.ourcommons.ca/members/en/{PersonId}', scrapedAt: new Date().toISOString(), count: Object.keys(emails).length, emails },
      null,
      2
    )
  );

  console.log(`${Object.keys(emails).length}/${deputes.length} courriels officiels écrits dans ${OUT_PATH}`);
  if (missing) console.log(`  ⚠ ${missing} fiche(s) sans mailto (aucune adresse devinée)`);
  if (failures) console.log(`  ⚠ ${failures} fiche(s) en échec de téléchargement`);
}

main().catch((err) => {
  console.error('Échec du scraper depute-emails.js :', err);
  process.exitCode = 1;
});
