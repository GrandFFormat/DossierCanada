// Fonction planifiée (Vercel Cron) — digest « demandes d'explications » aux 2 semaines.
//
// Toutes les 2 semaines, envoie UN courriel (bilingue FR + EN) par personne qui
// récapitule les projets de loi qu'elle a « challengés » (bouton « Demander une
// explication » → bill_flags), avec, pour chacun : le nombre actuel de demandes et une
// note quand un CAP a été franchi depuis le dernier envoi (500, 1000, 2500, 5000,
// 25000), quand le parrain a été jugé insuffisant (escalade admin), ou quand le projet
// est devenu loi (sanction royale) sous le seuil de pétition. On n'expose JAMAIS qui a
// demandé quoi — seulement des totaux.
//
// Le cron tourne chaque semaine (vercel.json) ; on n'envoie qu'une semaine sur deux
// (semaines ISO paires), sauf déclenchement manuel avec ?force=1.
//
// Secrets via variables d'environnement Vercel — rien codé en dur :
//   SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, RESEND_API_KEY, DIGEST_FROM,
//   CRON_SECRET, PUBLIC_SITE_URL

import crypto from 'node:crypto';
import { readFileSync } from 'node:fs';

const CHALLENGE_TIERS = [500, 1000, 2500, 5000, 25000];
const PETITION_THRESHOLD = 1000;

// Données fédérales embarquées au déploiement (data/bills.json, inclus via vercel.json).
const bills = (() => {
  const raw = JSON.parse(readFileSync(new URL('../data/bills.json', import.meta.url), 'utf8'));
  return Array.isArray(raw) ? raw : (raw.bills || []);
})();

// Info par projet : numéro, titre bilingue, et « devenu loi » (sanction royale).
// Au fédéral, state === 'loi' signifie sanctionné (equivalent du step 5 québécois).
const billInfo = new Map(
  bills.map((b) => [Number(b.id), {
    num: b.num,
    title: b.title || { fr: '', en: '' },
    becameLaw: b.state === 'loi',
  }])
);

// Jeton signé pour le lien « Se désabonner » — voir api/unsubscribe.js.
function unsubscribeToken(userId) {
  const sig = crypto.createHmac('sha256', process.env.CRON_SECRET).update(userId).digest('hex');
  return `${userId}.${sig}`;
}

async function supaFetch(path, { method = 'GET', body, headers = {} } = {}) {
  const res = await fetch(`${process.env.SUPABASE_URL}${path}`, {
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
  const text = await res.text();
  return text ? JSON.parse(text) : null;
}

async function getAllUserEmails() {
  const data = await supaFetch('/auth/v1/admin/users?per_page=1000');
  const map = new Map();
  for (const u of data.users || []) map.set(u.id, u.email);
  return map;
}

async function sendEmail(to, subject, html) {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: process.env.DIGEST_FROM, to, subject, html }),
  });
  if (!res.ok) throw new Error(`Resend -> ${res.status} ${await res.text()}`);
  return res.json();
}

const fr = (n) => n.toLocaleString('fr-CA');
const en = (n) => n.toLocaleString('en-CA');

// Note affichée pour un projet dans le digest, selon ce qui a changé (bilingue).
function billNote(r, isEn) {
  const N = isEn ? en : fr;
  if (r.becameLaw) {
    return isEn
      ? `This bill received <b>royal assent</b> (became law), below the petition threshold of ${N(PETITION_THRESHOLD)} requests.`
      : `Ce projet a reçu la <b>sanction royale</b> (devenu loi), sous le seuil de pétition de ${N(PETITION_THRESHOLD)} demandes.`;
  }
  if (r.escalation) {
    return isEn
      ? `The sponsor replied, but it was judged <b>insufficient</b>: the campaign continues — new threshold of <b>${N(r.threshold)}</b> requests. Keep sharing!`
      : `Le parrain a répondu, mais c'est jugé <b>insuffisant</b> : la campagne continue — nouveau seuil de <b>${N(r.threshold)}</b> demandes. Continuez de partager !`;
  }
  if (r.crossed === 500) {
    return isEn
      ? `🔥 We passed <b>500</b> — now at <b>${N(r.count)}</b> requests. At ${N(PETITION_THRESHOLD)}, we push for a petition.`
      : `🔥 On a passé le <b>cap des 500</b> — on est rendu à <b>${N(r.count)}</b> demandes. À ${N(PETITION_THRESHOLD)}, on lance une pétition.`;
  }
  if (r.crossed === PETITION_THRESHOLD) {
    return isEn
      ? `🔥 <b>${N(PETITION_THRESHOLD)} passed</b> — ${N(r.count)} requests! Time to act: pushing for a <b>petition</b> to the House of Commons.`
      : `🔥 <b>Cap des ${N(PETITION_THRESHOLD)} franchi</b> — ${N(r.count)} demandes ! On passe à l'action : démarche pour une <b>pétition</b> à la Chambre des communes.`;
  }
  if (r.crossed) {
    return isEn
      ? `🔥 <b>${N(r.crossed)} passed</b> — ${N(r.count)} requests. The pressure builds!`
      : `🔥 <b>Cap des ${N(r.crossed)} franchi</b> — ${N(r.count)} demandes. La pression monte !`;
  }
  return isEn ? `${N(r.count)} requests.` : `${N(r.count)} demandes.`;
}

function digestHtml(reports, siteUrl, unsubUrl) {
  const list = (isEn) => reports.map((r) => {
    const title = (r.title && (isEn ? (r.title.en || r.title.fr) : (r.title.fr || r.title.en))) || '';
    const numLabel = isEn ? `Bill ${r.num}` : `Projet de loi ${r.num}`;
    return `<li style="margin-bottom:12px;"><b>${numLabel}</b> — ${title}<br>` +
      `<span style="color:#5C6270;">${billNote(r, isEn)}</span></li>`;
  }).join('');
  return `
    <div style="font-family:Arial,sans-serif; max-width:560px; color:#16213E; line-height:1.5;">
      <h2 style="font-size:18px; color:#D80621;">DossierCanada — des nouvelles de vos demandes</h2>
      <p>Voici où en sont les projets de loi sur lesquels vous avez demandé une explication :</p>
      <ul style="padding-left:18px;">${list(false)}</ul>
      <p style="font-size:13px; color:#5C6270;">Vous recevez ce courriel parce que vous avez demandé des explications sur ces projets de loi.
      Consultez le palmarès sur <a href="${siteUrl}" style="color:#D80621;">${siteUrl}</a>.</p>
      <hr style="border:none; border-top:1px solid #e0e0da; margin:20px 0;">
      <h2 style="font-size:18px; color:#D80621;">DossierCanada — news on your requests</h2>
      <p>Here's where the bills you asked for an explanation on stand:</p>
      <ul style="padding-left:18px;">${list(true)}</ul>
      <p style="font-size:13px; color:#5C6270;">You're receiving this because you asked for explanations on these bills.
      See the leaderboard at <a href="${siteUrl}" style="color:#D80621;">${siteUrl}</a>.</p>
      <p style="font-size:12px; color:#8891A8;"><a href="${unsubUrl}" style="color:#8891A8;">Se désabonner / Unsubscribe</a></p>
    </div>`;
}

// Numéro de semaine ISO (pour n'envoyer qu'une semaine sur deux).
function isoWeek(d) {
  const date = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  const dayNum = (date.getUTCDay() + 6) % 7;
  date.setUTCDate(date.getUTCDate() - dayNum + 3);
  const firstThursday = new Date(Date.UTC(date.getUTCFullYear(), 0, 4));
  const fdDay = (firstThursday.getUTCDay() + 6) % 7;
  firstThursday.setUTCDate(firstThursday.getUTCDate() - fdDay + 3);
  return 1 + Math.round((date - firstThursday) / (7 * 24 * 3600 * 1000));
}

export default async function handler(req, res) {
  const auth = req.headers['authorization'];
  if (process.env.CRON_SECRET && auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'unauthorized' });
  }

  // Aux 2 semaines : on n'envoie que les semaines ISO paires (sauf ?force=1).
  const force = req.query && (req.query.force === '1' || req.query.force === 'true');
  if (!force && isoWeek(new Date()) % 2 !== 0) {
    return res.status(200).json({ ok: true, skipped: 'off-week', emailsSent: 0 });
  }

  try {
    // 1. Comptes actuels par projet (RPC service_role) + état de campagne.
    const counts = new Map(
      (await supaFetch('/rest/v1/rpc/flag_counts_all', { method: 'POST', body: {} }))
        .map((r) => [Number(r.bill_id), Number(r.cnt)])
    );
    if (counts.size === 0) return res.status(200).json({ ok: true, emailsSent: 0, reason: 'no flags' });

    const campaignRows = await supaFetch('/rest/v1/bill_campaign?select=bill_id,last_count,threshold,escalation_pending,terminal_notified');
    const campaign = new Map(campaignRows.map((r) => [Number(r.bill_id), r]));

    // 2. Pour chaque projet flaggé : y a-t-il une « nouvelle » depuis le dernier digest ?
    const reportByBill = new Map();
    for (const [billId, count] of counts) {
      const info = billInfo.get(billId);
      const c = campaign.get(billId) || { last_count: 0, threshold: PETITION_THRESHOLD, escalation_pending: false, terminal_notified: false };
      const last = c.last_count ?? 0;
      const crossed = [...CHALLENGE_TIERS].reverse().find((t) => last < t && t <= count) ?? null;
      const becameLaw = !!info && info.becameLaw && count < (c.threshold ?? PETITION_THRESHOLD) && !c.terminal_notified;
      const escalation = !!c.escalation_pending;
      if (crossed || becameLaw || escalation) {
        reportByBill.set(billId, {
          num: info ? info.num : billId,
          title: info ? info.title : { fr: `#${billId}`, en: `#${billId}` },
          count, crossed, becameLaw, escalation,
          threshold: c.threshold ?? PETITION_THRESHOLD,
        });
      }
    }

    // 3. Toujours mémoriser le compte courant (et solder escalade/terminal notifiés),
    //    même si personne n'est notifié, pour la prochaine comparaison.
    const upsert = [...counts].map(([billId, count]) => {
      const r = reportByBill.get(billId);
      const c = campaign.get(billId);
      return {
        bill_id: billId,
        last_count: count,
        threshold: c ? c.threshold : PETITION_THRESHOLD,
        escalation_pending: false,
        terminal_notified: (c && c.terminal_notified) || (r ? r.becameLaw : false),
        updated_at: new Date().toISOString(),
      };
    });
    if (upsert.length) {
      await supaFetch('/rest/v1/bill_campaign?on_conflict=bill_id', {
        method: 'POST',
        headers: { Prefer: 'resolution=merge-duplicates,return=minimal' },
        body: upsert,
      });
    }

    if (reportByBill.size === 0) return res.status(200).json({ ok: true, emailsSent: 0, reason: 'no news' });

    // 4. Qui a demandé quoi (bill_flags) — seulement les projets avec une nouvelle.
    const newsIds = [...reportByBill.keys()];
    const flags = await supaFetch(`/rest/v1/bill_flags?select=user_id,bill_id&bill_id=in.(${newsIds.join(',')})`);
    const userBills = new Map();
    for (const f of flags) {
      if (!userBills.has(f.user_id)) userBills.set(f.user_id, []);
      userBills.get(f.user_id).push(Number(f.bill_id));
    }
    if (userBills.size === 0) return res.status(200).json({ ok: true, emailsSent: 0 });

    // 5. Désabonnées + courriels.
    const optedOut = new Set((await supaFetch('/rest/v1/email_optout?select=user_id')).map((r) => r.user_id));
    const emailById = await getAllUserEmails();
    const siteUrl = process.env.PUBLIC_SITE_URL || 'https://dossiercanada.ca';

    let sent = 0;
    for (const [uid, billIds] of userBills) {
      if (optedOut.has(uid)) continue;
      const email = emailById.get(uid);
      if (!email) continue;
      const reports = billIds.map((id) => reportByBill.get(id)).filter(Boolean);
      if (reports.length === 0) continue;
      const unsubUrl = `${siteUrl}/api/unsubscribe?token=${encodeURIComponent(unsubscribeToken(uid))}`;
      await sendEmail(email, 'DossierCanada — des nouvelles de vos demandes / news on your requests', digestHtml(reports, siteUrl, unsubUrl));
      sent++;
    }

    return res.status(200).json({ ok: true, billsWithNews: reportByBill.size, emailsSent: sent });
  } catch (err) {
    console.error('weekly-digest failed:', err);
    return res.status(500).json({ error: String(err) });
  }
}
