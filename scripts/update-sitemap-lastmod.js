// Met à jour la date <lastmod> de TOUTES les URL du sitemap.
// Usage : node scripts/update-sitemap-lastmod.js 2026-07-27
// Appelé par le workflow uniquement les jours où les données changent.
import { readFileSync, writeFileSync } from 'node:fs';

const date = process.argv[2] || new Date().toISOString().slice(0, 10);
if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) { console.error('✖ date attendue AAAA-MM-JJ'); process.exit(1); }

const PATH = 'sitemap.xml';
let xml = readFileSync(PATH, 'utf8');
if (/<lastmod>[^<]*<\/lastmod>/.test(xml)) {
  // Le /g est le point clé : dater TOUTES les URL, pas seulement la première.
  xml = xml.replace(/<lastmod>[^<]*<\/lastmod>/g, `<lastmod>${date}</lastmod>`);
} else {
  xml = xml.replace(/(<loc>[^<]*<\/loc>)/g, `$1\n    <lastmod>${date}</lastmod>`);
}
writeFileSync(PATH, xml, 'utf8');
console.log(`✓ sitemap.xml daté au ${date} (toutes les URL).`);
