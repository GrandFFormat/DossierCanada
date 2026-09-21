// Pré-rendu (SEO) : ouvre chacune des 14 pages dans Chromium sans tête, laisse le
// site se dessiner avec SES PROPRES fonctions de rendu, puis recopie dans le HTML
// statique le haut de la page affichée (titre avec le compte, filtres, premières
// fiches). Les robots qui n'exécutent pas le JavaScript voient ainsi du vrai
// contenu, et le visiteur ne voit aucun saut : au chargement, le script redessine
// exactement le même balisage par-dessus.
//
// Lancé après build-section-pages.js (npm run refresh). Tolérant : s'il échoue,
// les pages gardent le pré-rendu de la veille (build-section-pages le préserve).
// Prérequis : navigateur Playwright (npx playwright install chromium).
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { extname } from 'node:path';
import { PAGES, SSR, regionsOf, writeRegion, writeTitle } from './seo-pages.js';

const ORIGIN = 'http://prerender.local';
const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8', '.css': 'text/css', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.ico': 'image/x-icon' };
const BILLS_KEPT = 20;   // projets de loi gardés (en-têtes + résumé), ~45 Ko
const TIMEOUT = 45000;

// Sert le dépôt depuis le disque avec les URL propres de Vercel (cleanUrls).
function fileForUrl(pathname) {
  let p = decodeURIComponent(pathname);
  if (p === '/') return 'index.html';
  p = p.replace(/^\/+/, '').replace(/\/+$/, '');
  if (existsSync(p) && extname(p)) return p;
  if (existsSync(p + '.html')) return p + '.html';
  return null;
}

// Exécuté DANS la page : nettoie et renvoie le balisage des zones de la vue.
async function capture({ view, regions, title, billsKept }) {
  const out = { regions: {}, title: null };
  if (view === 'projets') {
    // Les résumés en langage clair sont chargés à la demande : on les charge ici
    // pour que les robots lisent le texte, pas « Chargement du résumé… ».
    try { await ensureBillTexts(); fillPendingSummaries(); } catch (e) { /* on garde sans résumé */ }
  }
  if (view === 'bd') {
    // Le journal des mises à jour se charge à l'affichage de la page : on l'attend.
    await ensureJournal(); renderJournal();
  }
  for (const id of regions) {
    const el = document.getElementById(id);
    if (!el) throw new Error('conteneur #' + id + ' absent');
    const c = el.cloneNode(true);
    // État d'interface qu'on ne veut pas figer (renderBills rouvre les .open qu'il trouve).
    c.querySelectorAll('.open').forEach((x) => x.classList.remove('open'));
    if (id === 'apercuBills') c.querySelectorAll('.ab-detail').forEach((d) => { d.innerHTML = ''; });
    if (id === 'billsList') {
      const rows = [...c.querySelectorAll(':scope > .ab-row')];
      rows.slice(billsKept).forEach((r) => r.remove());
      c.querySelectorAll('.ab-detail').forEach((d) => {
        const keep = [...d.querySelectorAll('.bill-sum-slot')];
        d.innerHTML = '';
        keep.forEach((k) => { k.removeAttribute('data-pending'); d.appendChild(k); });
      });
    }
    // Listes nominatives (~33 Ko par vote) : consultables en un clic, pas au pré-rendu.
    if (id === 'votesList') c.querySelectorAll('.vc-ncols').forEach((x) => x.remove());
    // La page est servie avec ses zones VIDÉES (voir main) : un marqueur ou une zone vide
    // ici veut dire que le rendu de cette vue a échoué — on ne republie pas l'ancien contenu.
    if (c.innerHTML.includes('<!--ssr-->')) throw new Error('#' + id + ' non redessiné (rendu en échec)');
    out.regions[id] = c.innerHTML.trim();
  }
  if (title) out.title = document.getElementById(title)?.textContent.trim() || null;
  return out;
}

async function main() {
  let chromium;
  try { ({ chromium } = await import('playwright')); }
  catch { throw new Error('module playwright absent (npm ci)'); }
  const browser = await chromium.launch();
  let failures = 0;
  try {
    for (const page of PAGES) {
      const { view, lang, path, file } = page;
      const ctx = await browser.newContext({
        viewport: { width: 1280, height: 900 },
        locale: lang === 'en' ? 'en-CA' : 'fr-CA',
        timezoneId: 'America/Toronto',
        serviceWorkers: 'block',
      });
      const tab = await ctx.newPage();
      const errors = [];
      tab.on('pageerror', (e) => errors.push(e.message));
      // init() et applyLanguage() attrapent les erreurs de rendu pour que le site reste
      // debout ; elles restent signalées en console avec ce préfixe — ici, c'est un échec.
      tab.on('console', (m) => { if (m.type() === 'error' && /^\[(init|applyLanguage)\]/.test(m.text())) errors.push(m.text()); });
      // Seul le site lui-même est servi ; tout le reste (CDN Supabase, polices,
      // statistiques) est coupé : rendu déterministe, visiteur anonyme.
      await tab.route('**/*', (route) => {
        const u = new URL(route.request().url());
        if (u.origin !== ORIGIN) return route.abort();
        const f = fileForUrl(u.pathname);
        if (!f) return route.fulfill({ status: 404, body: 'introuvable' });
        let body = readFileSync(f);
        // La page elle-même est servie SANS son pré-rendu précédent : ce qu'on capture
        // est forcément ce que le site vient de dessiner.
        if (f === file) body = regionsOf(view).reduce((html, id) => writeRegion(html, id, ''), body.toString('utf8'));
        return route.fulfill({ status: 200, body, headers: { 'content-type': MIME[extname(f)] || 'application/octet-stream' } });
      });
      try {
        await tab.goto(ORIGIN + path, { waitUntil: 'load', timeout: TIMEOUT });
        await tab.waitForFunction(() => window.__dcReady === true, null, { timeout: TIMEOUT });
        await tab.waitForTimeout(250);
        const res = await tab.evaluate(capture, { view, regions: regionsOf(view), title: SSR[view].title, billsKept: BILLS_KEPT });
        if (errors.length) throw new Error('erreurs de rendu');
        let html = readFileSync(file, 'utf8');
        for (const [id, markup] of Object.entries(res.regions)) {
          if (!markup) throw new Error(`#${id} vide après rendu`);
          html = writeRegion(html, id, markup);
        }
        if (SSR[view].title) {
          if (!res.title) throw new Error('titre de bande vide');
          html = writeTitle(html, SSR[view].title, res.title.replace(/&/g, '&amp;').replace(/</g, '&lt;'));
        }
        writeFileSync(file, html, 'utf8');
        const kb = Object.values(res.regions).reduce((n, s) => n + Buffer.byteLength(s), 0) / 1024;
        console.log(`ok ${file.padEnd(22)} +${kb.toFixed(0).padStart(3)} Ko pré-rendus  « ${res.title ?? '—'} »${errors.length ? '  ⚠ ' + errors.join(' | ') : ''}`);
      } catch (e) {
        failures++;
        console.error(`✖ ${file} : ${e.message}${errors.length ? ' — erreurs de page : ' + errors.join(' | ') : ''}`);
      } finally {
        await ctx.close();
      }
    }
  } finally {
    await browser.close();
  }
  if (failures) throw new Error(`${failures} page(s) non pré-rendue(s) — elles gardent leur pré-rendu précédent`);
}

main().catch((e) => { console.error('prerender-pages : ' + e.message); process.exitCode = 1; });
