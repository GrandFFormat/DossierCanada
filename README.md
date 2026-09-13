# DossierCanada

Site citoyen **indépendant** qui suit le **Parlement du Canada** — députés, projets de loi,
votes, cabinet — bilingue FR/EN, dans l'esprit de [nosdeputes.fr](https://www.nosdeputes.fr)
et [datan.fr](https://datan.fr).

C'est la version fédérale de **DossierQuébec** (qui suit l'Assemblée nationale du Québec).

## Principes

- **Uniquement de vraies données publiques vérifiées** — jamais inventées. Quand une donnée
  manque ou ne peut être rapprochée de façon sûre, on l'affiche comme telle plutôt que de deviner.
- **Aucun verdict** sur de vraies personnes : on organise et on clarifie, on ne juge pas.
- **Bilingue FR/EN** — un avantage au fédéral, où le contenu parlementaire est *nativement*
  bilingue officiel (pas de traduction « maison » à vérifier).
- Les sites officiels du Parlement restent la source la plus fiable ; ce site ne cherche jamais
  à les remplacer, seulement à les rendre plus faciles à suivre.

## État du projet

Le **MVP Chambre des communes est construit** — données *et* interface — sur de vraies données
fédérales bilingues et reliées entre elles. Les 6 onglets sont fédéraux (aucune donnée QC visible).

**Fait :**

- **Projets de loi** — 185 projets de la session courante, avec la **timeline bicamérale** datée
  (1re/2e/3e lecture aux Communes + au Sénat + sanction royale) et les votes rattachés.
- **Députés** — les ~341 député·e·s en fonction (circonscription, province, parti), avec un
  **taux de participation** aux votes, un filtre par parti, et **« Trouver mon député » par code
  postal** (API Represent, côté navigateur).
- **Votes** — les scrutins par appel nominal avec le **détail nominatif « qui a voté quoi »**
  (par parti + noms), décomptes validés contre l'officiel.
- **Cabinet** — le Conseil des ministres actuel (portefeuilles bilingues), rapproché du roster.
- **Lexique** fédéral, **sources** exactes, comptes/abonnements (Supabase) réutilisés de la coquille.

**Phases suivantes :** Sénat (sénateur·rice·s + votes du Sénat, `sencanada.ca`) ; comités ;
digest courriel hebdomadaire rebranché sur l'état LEGISinfo.

## Sources de données

| Domaine | Source | Rôle |
|---|---|---|
| Projets de loi (C-xx / S-xx) | **LEGISinfo** — `parl.ca/legisinfo` (JSON par session) | **primaire** — bilingue natif, jalons des deux chambres |
| Députés (roster) | **Chambre des communes** — `ourcommons.ca` (export XML EN+FR) | **primaire** — clé `PersonId`, bilingue |
| Votes par appel nominal | **Chambre des communes** — `ourcommons.ca` (XML, par vote) | **primaire** — ballots par `PersonId` |
| Cabinet | **Cabinet du PM** — `pm.gc.ca/{en,fr}/cabinet` (HTML) | **primaire** — portefeuilles bilingues |
| « Trouver mon député » | **Represent** (OpenNorth) — code postal → circonscription | runtime (fetch navigateur, CORS ouvert) |
| Recoupement projets de loi | **OpenParliament** — `api.openparliament.ca` | vérification (`legisinfo_id == BillId`) |
| Sénateurs, votes du Sénat | `sencanada.ca` | **phase 2** |

> **Pourquoi ourcommons plutôt qu'OpenParliament** pour les députés/votes ? OpenParliament ne
> donne parti et circonscription qu'en **anglais** ; l'export de la Chambre est nativement
> bilingue et clé par `PersonId` (le pivot naturel entre député·e·s et ballots).

**Écartés délibérément :**

- **Pétitions** (`petitions.ourcommons.ca`) — l'export XML/CSV est protégé par **reCAPTCHA**
  (anti-automatisation). Le contourner ne serait pas une pratique honnête — abandonné.
- **Photos de député·e·s** — choix éditorial : on s'en tient à la fonction et aux faits, pas de
  personnalisation. Les fiches utilisent les initiales + un lien vers la fiche officielle.

## Clés de jointure (modèle de données)

- Projet de loi : **`BillId`** de LEGISinfo (= `legisinfo_id` d'OpenParliament, vérifié). Le
  numéro seul (« C-1 ») n'est **pas** une clé — il est réutilisé à chaque session.
- Député·e : **`PersonId`** de la Chambre des communes (= `parl_mp_id` d'OpenParliament).
- Vote ↔ projet : par **(session, numéro)**. Vote ↔ député : par **`PersonId`** (les ballots).

## Régénérer les données

**Tout d'un coup :**

```bash
npm install
npm run refresh   # tous les scrapers + build, dans le bon ordre (~3 min)
```

**Ou étape par étape :**

```bash
npm run explore            # reconnaissance : à quoi ressemblent les sources (data/samples/)

npm run scrape:bills       # LEGISinfo   -> data/bills.json
npm run scrape:bill-summaries # LEGISinfo/texte de loi -> ajoute le sommaire officiel aux bills
npm run scrape:deputes     # ourcommons  -> data/deputes.json
npm run scrape:votes       # ourcommons  -> data/votes.json   (~1 min, un fetch par scrutin)
npm run scrape:ministers   # pm.gc.ca    -> data/ministers.json (nécessite data/deputes.json)
npm run scrape:petitions   # ourcommons  -> data/petitions.json (liste publique, pas l'export reCAPTCHA)

npm run build:frontend     # fusionne le tout -> data/frontend.json ET injecte
                           # projets/députés/votes/ministres/pétitions dans index.html
```

Chaque scraper tape **une** source et n'invente rien. `build:frontend` résout les jointures,
calcule les agrégats (bilan de votes des député·e·s, divisions par projet) et injecte les
données directement dans `index.html` (le site reste un fichier autonome, sans fetch au chargement,
sauf la recherche optionnelle par code postal).

## Rafraîchissement automatique

Le workflow [`.github/workflows/refresh.yml`](.github/workflows/refresh.yml) lance `npm run refresh`
**chaque jour** (cron, 08:00 UTC ; ou manuellement via « Run workflow »), puis committe et pousse les
données mises à jour. Si le dépôt est connecté à Vercel, ce push **redéploie le site automatiquement**.
Les scrapers re-téléchargent tout à neuf à chaque exécution (rafraîchissement complet, pas incrémental) ;
le workflow ne committe que s'il y a un changement.

## Développement local

Dans Claude Code, lance le serveur de preview **`dossiercanada`** (défini dans
`.claude/launch.json`, port 8080). Ou directement :

```bash
node scripts/static-server.js   # http://localhost:8080
```

## Structure du dépôt

```
index.html                     Application complète (i18n FR/EN + JS + données injectées)
scrapers/
  bills.js                     LEGISinfo   -> data/bills.json
  deputes.js                   ourcommons  -> data/deputes.json
  votes.js                     ourcommons  -> data/votes.json
  ministers.js                 pm.gc.ca    -> data/ministers.json
  build-frontend-data.js       Fusion + injection dans index.html
  (bill-details.js, bill-summaries.js, … : patrons QC laissés en RÉFÉRENCE)
scripts/
  explore-sources.js           Reconnaissance des sources fédérales (npm run explore)
  static-server.js             Serveur statique local (dev / preview)
  supabase-schema*.sql         Schémas Supabase (suivis, demandes d'explication, état, optout)
api/
  weekly-digest.js             Cron hebdo : détecte les changements d'étape, envoie le digest
  unsubscribe.js               Désabonnement CASL en un clic (jeton HMAC)
data/                          Données générées (JSON). data/samples/ = reconnaissance (gitignore)
vercel.json                    Config Vercel (cron)
```

## Différences vs DossierQuébec (modèle)

- **Bicaméral** : Chambre des communes (**343 sièges**, redécoupage 2023) **+ Sénat** (~105,
  nommés) — le Sénat est en phase 2.
- **Cycle des projets de loi plus long** : 1re/2e/3e lecture + comité + rapport **dans chaque
  chambre**, puis **sanction royale** (gouverneur général) → timeline bicamérale, pas un stepper
  linéaire à 5 cases.
- **Partis** : Libéral (rouge), Conservateur (bleu), NPD (orange), Bloc (cyan), Vert. Gouvernement
  possiblement **minoritaire** (votes de confiance).
- **Cabinet** : le Conseil des ministres actuel (source `pm.gc.ca`).

## Pile de déploiement (comme DossierQuébec)

- **Vercel** — hébergement statique + fonctions `api/*` + Cron hebdomadaire
- **Supabase** — auth (magic link), suivis, demandes d'explication
- **Resend** — envoi du digest courriel
- **Cloudflare** — DNS du domaine

## Contraintes

- **Secrets** (clés Supabase service_role, Resend, `CRON_SECRET`) : **uniquement** dans les
  variables d'environnement Vercel. Jamais dans le code, jamais commités.
  - La clé Supabase *publishable* et l'URL du projet sont publiques par design (protégées par RLS)
    et peuvent vivre dans le code.
- **Licences** : attribuer les sources — **Licence du gouvernement ouvert – Canada** (LEGISinfo,
  Chambre des communes, pm.gc.ca) et les **conditions d'OpenParliament** pour les recoupements.
