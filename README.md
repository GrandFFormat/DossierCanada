# DossierCanada

Site citoyen **indépendant** qui suit le **Parlement du Canada** — députés, projets de loi,
votes, ministres — bilingue FR/EN, dans l'esprit de [nosdeputes.fr](https://www.nosdeputes.fr)
et [datan.fr](https://datan.fr).

C'est la version fédérale de **DossierQuébec** (qui suit l'Assemblée nationale du Québec).

## Principes

- **Uniquement de vraies données publiques vérifiées** — jamais inventées.
- **Aucun verdict** sur de vraies personnes : on organise et on clarifie, on ne juge pas.
- **Bilingue FR/EN** — un avantage au fédéral, où le contenu parlementaire est *nativement*
  bilingue officiel (pas de traduction « maison » à vérifier).
- Le site officiel du Parlement reste la source la plus fiable ; ce site ne cherche jamais
  à le remplacer, seulement à le rendre plus facile à suivre.

## État du projet

Coquille **forkée depuis DossierQuébec** : toute l'infrastructure citoyenne (interface,
i18n, comptes, alertes courriel) est réutilisée. Le travail restant = brancher les
**sources de données fédérales** et enrichir le **modèle** (bicaméral, étapes des projets
de loi).

**Plan par phases :**

1. **MVP Chambre des communes** — députés + projets de loi + votes
2. Sénat, pétitions fédérales, comités
3. Digest courriel hebdomadaire rebranché sur l'état LEGISinfo

## Sources de données (fédéral)

| Domaine | Source |
|---|---|
| Projets de loi (C-xx / S-xx) | **LEGISinfo** — `parl.ca/legisinfo` (exports XML/JSON par session) |
| Députés, votes, débats | **OpenParliament API** — `api.openparliament.ca` (REST JSON documentée) |
| Membres / votes / comités | **Chambre des communes** — `ourcommons.ca` (exports XML) |
| « Trouve ton député » | **Represent API** (OpenNorth) — code postal → élus |
| Pétitions | `petitions.ourcommons.ca` |
| Sénateurs, votes du Sénat | `sencanada.ca` (phase 2, peu d'API — un peu de scraping) |

## Différences vs DossierQuébec (modèle à adapter)

- **Bicaméral** : Chambre des communes (338 sièges) **+ Sénat** (~105).
- **Cycle des projets de loi plus long** : 1re/2e/3e lecture + comité + rapport, **dans
  chaque chambre**, puis **sanction royale** → le « stepper » doit être enrichi.
- **Partis** : Libéral (rouge), Conservateur (bleu), NPD (orange), Bloc (cyan), Vert.
  Souvent gouvernement **minoritaire** (votes de confiance).
- **Cabinet** plus gros (~38 ministres) ; sanction royale par le gouverneur général.

## Structure du dépôt

```
index.html                     Application (coquille + i18n FR/EN + JS)  — template à adapter
api/
  weekly-digest.js             Cron hebdo : détecte les changements d'étape, envoie le digest
  unsubscribe.js               Désabonnement CASL en un clic (jeton HMAC)
scripts/
  static-server.js             Serveur statique local (dev / preview)
  supabase-schema*.sql         Schémas Supabase (suivis, demandes d'explication, état, optout)
scrapers/                      Patron QC (build-*-data.js) — RÉFÉRENCE à réécrire pour le fédéral
data/                          Données générées (JSON) — à produire depuis les sources fédérales
vercel.json                    Config Vercel (cron)
```

## Développement local

```bash
npm install
```

Puis, dans Claude Code, lance le serveur de preview **`dossiercanada`** (défini dans
`.claude/launch.json`, port 8080). Ou directement :

```bash
node scripts/static-server.js
```

## Pile de déploiement (comme DossierQuébec)

- **Vercel** — hébergement statique + fonctions `api/*` + Cron hebdomadaire
- **Supabase** — auth (magic link), suivis, demandes d'explication
- **Resend** — envoi du digest courriel
- **Cloudflare** — DNS du domaine

## Contraintes

- **Secrets** (clés Supabase service_role, Resend, `CRON_SECRET`) : **uniquement** dans les
  variables d'environnement Vercel. Jamais dans le code, jamais commités.
  - La clé Supabase *publishable* et l'URL du projet sont publiques par design (protégées
    par RLS) et peuvent vivre dans le code.
- **Licences** : attribuer les sources — Licence du gouvernement ouvert – Canada
  (ourcommons / LEGISinfo) et les conditions d'OpenParliament.
