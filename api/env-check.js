// Diagnostic temporaire : indique QUELLES variables d'environnement sont
// présentes pour les fonctions Vercel — uniquement présent/absent (booléen),
// JAMAIS la valeur. Aucun secret n'est exposé. À supprimer une fois le digest
// vérifié.
export default function handler(req, res) {
  const names = [
    'SUPABASE_URL',
    'SUPABASE_SERVICE_ROLE_KEY',
    'PUBLIC_SITE_URL',
    'CRON_SECRET',
    'RESEND_API_KEY',
    'DIGEST_FROM',
  ];
  const present = {};
  for (const n of names) present[n] = Boolean(process.env[n]);
  res.status(200).json({ present });
}
