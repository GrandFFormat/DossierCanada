// Rafraîchissement TOLÉRANT des données fédérales.
//
// Remplace l'ancienne chaîne « scrape:a && scrape:b && … » qui s'arrêtait au
// PREMIER échec (un seul scraper bloqué faisait rater toute la mise à jour — cf.
// le 403 de LEGISinfo du 2026-08-09). Ici, chaque scraper est lancé à tour de
// rôle : s'il échoue (source bloquée, panne réseau…), on le note et on CONTINUE.
// Le scraper en échec garde simplement ses données de la veille (son data/*.json
// n'est pas réécrit), et le build assemble le site avec les données disponibles.
//
// Politique de sortie :
//   - Un scraper qui échoue N'ARRÊTE PAS la chaîne (données partielles = publiables).
//   - Un build qui échoue EST fatal : on ne publie pas un index.html cassé (exit 1).
//   - En CI, on écrit deux sorties dans $GITHUB_OUTPUT (builds_ok, failed) : le
//     workflow committe les données fraîches si builds_ok, PUIS échoue le run si
//     « failed » n'est pas vide, pour envoyer l'alerte courriel (voir refresh.yml).
//
// Lancé par « npm run refresh » (en local comme dans GitHub Actions).
import { execSync } from 'node:child_process';
import { appendFileSync } from 'node:fs';

// Ordre d'exécution des scrapers. Chacun écrit son propre data/*.json à la fin ;
// ils sont indépendants (bill-summaries / bill-ai-summaries lisent bills.json, qui
// existe toujours — au pire dans sa version de la veille).
const SCRAPERS = [
  'scrape:bills',
  'scrape:bill-summaries',
  'scrape:bill-ai-summaries',
  'scrape:deputes',
  'scrape:depute-emails',
  'scrape:votes',
  'scrape:ministers',
  'scrape:petitions',
  'scrape:senators',
  'scrape:senate-votes',
  'scrape:house-calendar',
  'scrape:officeholders',
];
// Assemblage du site à partir des data/*.json — critique : un échec ici est fatal.
const BUILDS = ['build:frontend', 'build:pages'];

function run(script) {
  console.log(`\n=== ${script} ===`);
  execSync(`npm run ${script}`, { stdio: 'inherit' });
}

const failedScrapers = [];
for (const s of SCRAPERS) {
  try {
    run(s);
  } catch {
    failedScrapers.push(s.replace(/^scrape:/, ''));
    console.error(`⚠ ${s} a échoué — on garde ses données précédentes et on continue.`);
  }
}

let buildsOk = true;
for (const b of BUILDS) {
  try {
    run(b);
  } catch {
    buildsOk = false;
    console.error(`✖ ${b} a échoué — build interrompu, rien ne sera publié.`);
    break; // si build:frontend casse, inutile de tenter build:pages
  }
}

console.log('\n──────── Résumé du rafraîchissement ────────');
console.log(`  scrapers en échec : ${failedScrapers.length ? failedScrapers.join(', ') : 'aucun'}`);
console.log(`  build            : ${buildsOk ? 'OK' : 'ÉCHEC'}`);

// Sorties pour GitHub Actions (ignorées en local, où $GITHUB_OUTPUT n'existe pas).
if (process.env.GITHUB_OUTPUT) {
  appendFileSync(process.env.GITHUB_OUTPUT, `builds_ok=${buildsOk}\n`);
  appendFileSync(process.env.GITHUB_OUTPUT, `failed=${failedScrapers.join(',')}\n`);
}

// Fatal UNIQUEMENT si le build a cassé. Un scraper raté ne fait pas échouer ce
// process (sinon l'étape de commit serait sautée et on ne publierait pas les
// données fraîches des autres) : c'est le workflow qui transforme « failed » en
// échec de run pour l'alerte.
process.exit(buildsOk ? 0 : 1);
