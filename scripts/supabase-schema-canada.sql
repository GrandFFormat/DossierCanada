-- ============================================================================
-- DossierCanada — schéma Supabase complet (à coller dans SQL Editor, une fois).
-- Projet fédéral. Diffère du QC sur un point clé : on peut SUIVRE un projet de
-- loi (person_type 'bill'), ce qui alimente le digest hebdomadaire.
-- Tout est protégé par RLS (Row Level Security) : rien n'est lisible tant qu'une
-- policy ne l'autorise pas explicitement.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. Suivis ("Suivre" un·e ministre, un·e député·e, ou un projet de loi), liés
--    à un vrai compte plutôt qu'au navigateur. Une ligne = une chose suivie.
-- ----------------------------------------------------------------------------
create table if not exists public.follows (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  person_type text not null check (person_type in ('minister', 'depute', 'bill')),
  person_key text not null, -- ministre: nom ; député·e: clé ; projet: id LEGISinfo
  created_at timestamptz not null default now(),
  unique (user_id, person_type, person_key)
);

alter table public.follows enable row level security;

-- Chaque personne ne voit et ne modifie que ses propres suivis — jamais ceux de
-- quelqu'un d'autre, même si la clé publique (publishable) est dans le navigateur.
create policy "select own follows"
  on public.follows for select using (auth.uid() = user_id);
create policy "insert own follows"
  on public.follows for insert with check (auth.uid() = user_id);
create policy "delete own follows"
  on public.follows for delete using (auth.uid() = user_id);

-- ----------------------------------------------------------------------------
-- 2. Demandes d'explications par projet de loi ("ce projet mérite des
--    explications"). Une ligne = une personne, un projet.
-- ----------------------------------------------------------------------------
create table if not exists public.bill_flags (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  bill_id bigint not null, -- id LEGISinfo (bills[].id)
  created_at timestamptz not null default now(),
  unique (user_id, bill_id)
);

alter table public.bill_flags enable row level security;

-- Limite anti-troll : max 10 demandes par compte par 30 jours, appliquée côté
-- serveur pour ne pas pouvoir être contournée depuis le navigateur.
create policy "insert own flag"
  on public.bill_flags for insert with check (
    auth.uid() = user_id
    and (
      select count(*) from public.bill_flags
      where user_id = auth.uid() and created_at > now() - interval '30 days'
    ) < 10
  );
create policy "select own flag"
  on public.bill_flags for select using (auth.uid() = user_id);
create policy "delete own flag"
  on public.bill_flags for delete using (auth.uid() = user_id);

grant select, insert, delete on public.bill_flags to authenticated;

-- ----------------------------------------------------------------------------
-- 3. Admins : comptes autorisés à voir les VRAIS totaux par projet (rien d'autre).
--    Pour ajouter quelqu'un : insérer son user_id (Authentication > Users).
-- ----------------------------------------------------------------------------
create table if not exists public.admins (
  user_id uuid primary key references auth.users(id) on delete cascade
);

alter table public.admins enable row level security;

create policy "see own admin row"
  on public.admins for select using (auth.uid() = user_id);

grant select on public.admins to authenticated;

-- Les admins (et eux seuls) voient TOUTES les lignes de bill_flags, pour compter
-- les demandes par projet.
create policy "admins view all flags"
  on public.bill_flags for select
  using (exists (select 1 from public.admins where admins.user_id = auth.uid()));

-- ----------------------------------------------------------------------------
-- 4. Mémoire de la dernière activité connue de chaque projet (AAAAMMJJ), pour
--    détecter le nouveau d'une semaine à l'autre. Écrite/lue uniquement par la
--    fonction planifiée (service_role) — aucun accès public, RLS sans policy.
-- ----------------------------------------------------------------------------
create table if not exists public.bill_state (
  bill_id bigint primary key,
  step int not null, -- date de dernière activité au format AAAAMMJJ
  updated_at timestamptz not null default now()
);

alter table public.bill_state enable row level security;

-- ----------------------------------------------------------------------------
-- 5. Désabonnements du digest hebdomadaire (lien "Se désabonner" des courriels).
--    On n'efface pas les suivis — on note juste "plus de courriels".
-- ----------------------------------------------------------------------------
create table if not exists public.email_optout (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.email_optout enable row level security;

-- ----------------------------------------------------------------------------
-- 6. Privilèges du rôle service_role (clé secrète, côté serveur). "Contourner
--    RLS" ne donne pas les privilèges de base : il faut les accorder explicitement,
--    sinon 403 "permission denied". La fonction du digest lit/écrit bill_state,
--    lit follows + bill_flags, lit/écrit email_optout.
-- ----------------------------------------------------------------------------
grant select, insert, update, delete on public.bill_state to service_role;
grant select on public.follows to service_role;
grant select on public.bill_flags to service_role;
grant select, insert on public.email_optout to service_role;
