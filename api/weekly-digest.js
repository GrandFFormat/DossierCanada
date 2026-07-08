// Fonction planifiée (Vercel Cron) — digest hebdomadaire par courriel (fédéral).
//
// Une fois par semaine : relit les projets de loi fédéraux depuis data/bills.json
// (regénéré chaque jour par le rafraîchissement automatique), détecte ceux qui
// ont eu une nouvelle activité datée depuis la dernière exécution, puis envoie UN
// seul courriel résumé à chaque personne concernée — soit parce qu'elle suit ce
// projet (bouton « Suivre »), soit parce qu'elle a demandé des explications
// dessus (bill_flags). Un courriel par personne, jamais un par changement.
//
// Tous les secrets viennent des variables d'environnement Vercel — RIEN n'est
// codé en dur ici, et ce fichier ne contient aucune clé.
//
// Variables d'environnement attendues (Vercel > Settings > Environment Variables) :
//   SUPABASE_URL                 ex. https://vbxhwckbnanhuvrotnwo.supabase.co
//   SUPABASE_SERVICE_ROLE_KEY    clé secrète service_role (contourne RLS)
//   RESEND_API_KEY               clé API Resend
//   DIGEST_FROM                  ex. "DossierCanada <digest@dossiercanada.ca>"
//   CRON_SECRET                  fourni par Vercel pour sécuriser le cron
//   PUBLIC_SITE_URL              ex. https://dossiercanada.ca (liens du courriel)

import crypto from 'node:crypto';
import { readFileSync } from 'node:fs';

// Données fédérales embarquées au déploiement (data/bills.json est regénéré et
// redéployé chaque jour). Lues une fois au démarrage à froid de la fonction.
const bills = (() => {
  const raw = JSON.parse(readFileSync(new URL('../data/bills.json', import.meta.url), 'utf8'));
  return Array.isArray(raw) ? raw : (raw.bills || []);
})();

// Jeton signé pour le lien « Se désabonner » — voir api/unsubscribe.js, qui le
// vérifie avec le même secret. Impossible à forger sans CRON_SECRET.
function unsubscribeToken(userId) {
  const sig = crypto.createHmac('sha256', process.env.CRON_SECRET).update(userId).digest('hex');
  return `${userId}.${sig}`;
}

// Repère de progression = date de dernière activité au format AAAAMMJJ (un entier
// monotone : il ne fait qu'augmenter à mesure que le projet avance). On l'utilise
// pour détecter « il s'est passé quelque chose de nouveau » sans dépendre du rang
// des étapes, qui diffère selon la chambre d'origine (Communes vs Sénat).
function activityKey(lastActivity) {
  if (!lastActivity) return 0;
  const n = Number(String(lastActivity).replace(/-/g, ''));
  return Number.isFinite(n) ? n : 0;
}

// État courant de chaque projet : sa dernière activité datée + le texte bilingue
// déjà sourcé (latestActivity) pour l'afficher tel quel dans le courriel.
function computeCurrent() {
  const result = new Map(); // billId -> { key, num, title, latest }
  for (const b of bills) {
    const key = activityKey(b.lastActivity);
    if (!key) continue;
    result.set(Number(b.id), {
      key,
      num: b.num,
      title: b.title || { fr: '', en: '' },
      latest: b.latestActivity || { fr: '', en: '' },
    });
  }
  return result;
}

async function supaFetch(path, { method = 'GET', body, headers = {} } = {}) {
  const url = `${process.env.SUPABASE_URL}${path}`;
  const res = await fetch(url, {
    method,
    headers: {
      apikey: process.env.SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
      'Content-Type': 'application/json',
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) throw new Error(`Supabase ${method} ${path} -> ${res.status} ${await res.text()}`);
  // Certaines écritures (return=minimal) renvoient un corps vide — res.json()
  // planterait dessus. On lit le texte et on ne parse que s'il y en a.
  const text = await res.text();
  return text ? JSON.parse(text) : null;
}

async function getAllUserEmails() {
  // Auth Admin API — associe user_id -> courriel. Première page suffit pour une
  // base d'utilisateurs de départ (per_page max 1000).
  const data = await supaFetch('/auth/v1/admin/users?per_page=1000');
  const map = new Map();
  for (const u of data.users || []) map.set(u.id, u.email);
  return map;
}

async function sendEmail(to, subject, html) {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ from: process.env.DIGEST_FROM, to, subject, html }),
  });
  if (!res.ok) throw new Error(`Resend -> ${res.status} ${await res.text()}`);
  return res.json();
}

// Courriel bilingue (français puis anglais) — on ne connaît pas la langue de
// préférence de chaque personne, et le contenu parlementaire est officiellement
// bilingue. Chaque ligne réutilise le texte latestActivity déjà sourcé.
function digestHtml(changes, siteUrl, unsubUrl) {
  const row = (c, lang) => {
    const title = (c.title && (c.title[lang] || c.title.fr || c.title.en)) || '';
    const latest = (c.latest && (c.latest[lang] || c.latest.fr || c.latest.en)) || '';
    return `<li style="margin-bottom:10px;"><b>${c.num}</b> — ${title}<br>` +
      `<span style="color:#5C6270;">${latest}</span></li>`;
  };
  const frRows = changes.map((c) => row(c, 'fr')).join('');
  const enRows = changes.map((c) => row(c, 'en')).join('');
  return `
    <div style="font-family:Arial,sans-serif; max-width:560px; color:#16213E; line-height:1.5;">
      <h2 style="font-size:18px; color:#D80621;">DossierCanada — résumé de la semaine</h2>
      <p>Voici les projets de loi que vous suivez (ou sur lesquels vous avez demandé des explications) qui ont eu du nouveau cette semaine :</p>
      <ul style="padding-left:18px;">${frRows}</ul>
      <p style="font-size:13px; color:#5C6270;">Vous recevez ce courriel parce que vous suivez ces projets de loi sur DossierCanada.
      Gérez vos suivis sur <a href="${siteUrl}" style="color:#D80621;">${siteUrl}</a>.</p>
      <hr style="border:none; border-top:1px solid #e0e0da; margin:20px 0;">
      <h2 style="font-size:18px; color:#D80621;">DossierCanada — this week's summary</h2>
      <p>Here are the bills you follow (or asked for explanations on) that had activity this week:</p>
      <ul style="padding-left:18px;">${enRows}</ul>
      <p style="font-size:13px; color:#5C6270;">You're receiving this because you follow these bills on DossierCanada.
      Manage your follows at <a href="${siteUrl}" style="color:#D80621;">${siteUrl}</a>.</p>
      <p style="font-size:12px; color:#8891A8;"><a href="${unsubUrl}" style="color:#8891A8;">Se désabonner / Unsubscribe</a></p>
    </div>`;
}

export default async function handler(req, res) {
  // Sécurité : seul le cron Vercel (qui envoie CRON_SECRET) peut déclencher ça.
  const auth = req.headers['authorization'];
  if (process.env.CRON_SECRET && auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'unauthorized' });
  }

  try {
    // 1. État courant des projets de loi (dernière activité datée).
    const current = computeCurrent();

    // 2. État précédent mémorisé.
    const stored = await supaFetch('/rest/v1/bill_state?select=bill_id,step');
    const prevKey = new Map(stored.map((r) => [Number(r.bill_id), r.step]));

    // 3. Projets dont l'activité a avancé (jamais d'alerte au premier passage sur
    //    un projet inconnu : on enregistre son état sans alerter).
    const changed = new Map(); // billId -> { num, title, latest }
    for (const [billId, info] of current) {
      const before = prevKey.get(billId);
      if (before !== undefined && info.key > before) changed.set(billId, info);
    }

    // 4. Toujours mettre à jour la mémoire (même sans changement) pour la
    //    prochaine comparaison.
    const upsertRows = [...current].map(([billId, info]) => ({ bill_id: billId, step: info.key, updated_at: new Date().toISOString() }));
    if (upsertRows.length) {
      await supaFetch('/rest/v1/bill_state?on_conflict=bill_id', {
        method: 'POST',
        headers: { Prefer: 'resolution=merge-duplicates,return=minimal' },
        body: upsertRows,
      });
    }

    if (changed.size === 0) {
      return res.status(200).json({ ok: true, changed: 0, emailsSent: 0 });
    }

    const changedIds = [...changed.keys()];
    const inList = `(${changedIds.join(',')})`;

    // 5. Qui suit ces projets de loi + qui a demandé des explications.
    const follows = await supaFetch(`/rest/v1/follows?select=user_id,person_key&person_type=eq.bill&person_key=in.(${changedIds.map((id) => `"${id}"`).join(',')})`);
    const flags = await supaFetch(`/rest/v1/bill_flags?select=user_id,bill_id&bill_id=in.${inList}`);

    const userBills = new Map(); // user_id -> Set(billId)
    const add = (uid, billId) => {
      if (!userBills.has(uid)) userBills.set(uid, new Set());
      userBills.get(uid).add(billId);
    };
    for (const f of follows) add(f.user_id, Number(f.person_key));
    for (const f of flags) add(f.user_id, Number(f.bill_id));

    if (userBills.size === 0) {
      return res.status(200).json({ ok: true, changed: changed.size, emailsSent: 0 });
    }

    // 6. Retirer les personnes désabonnées (voir api/unsubscribe.js).
    const optedOut = new Set((await supaFetch('/rest/v1/email_optout?select=user_id')).map((r) => r.user_id));

    // 7. Courriels des utilisateurs.
    const emailById = await getAllUserEmails();
    const siteUrl = process.env.PUBLIC_SITE_URL || 'https://dossiercanada.ca';

    // 8. Un courriel par personne (sauf désabonnées), avec lien de désabonnement.
    let sent = 0;
    for (const [uid, billIdSet] of userBills) {
      if (optedOut.has(uid)) continue;
      const email = emailById.get(uid);
      if (!email) continue;
      const list = [...billIdSet].map((id) => changed.get(id)).filter(Boolean);
      if (list.length === 0) continue;
      const unsubUrl = `${siteUrl}/api/unsubscribe?token=${encodeURIComponent(unsubscribeToken(uid))}`;
      await sendEmail(email, 'DossierCanada — résumé de la semaine / weekly summary', digestHtml(list, siteUrl, unsubUrl));
      sent++;
    }

    return res.status(200).json({ ok: true, changed: changed.size, emailsSent: sent });
  } catch (err) {
    console.error('weekly-digest failed:', err);
    return res.status(500).json({ error: String(err) });
  }
}
