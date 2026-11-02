-- DossierCanada dans le projet Supabase de DossierQuébec (regroupement du 2 nov. 2026, pour passer au forfait gratuit).
--
-- À exécuter UNE FOIS dans le projet Supabase de DossierQuébec (wfgcqftgtmptfutrbujz), SQL editor.
-- Même principe que l'Ontario (on_) et la Saskatchewan (sk_) : le préfixe ca_ est le « dossier » du Canada.
-- Les tables reprennent celles de l'ancien projet (scripts/supabase-schema-canada.sql et
-- supabase-schema-campaign.sql). La table des admins est celle de DQ (public.admins).
-- Re-exécutable sans erreur.

-- 1. Suivis (ministre, député·e, projet de loi)
create table if not exists public.ca_follows (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  person_type text not null check (person_type in ('minister', 'depute', 'bill')),
  person_key text not null,
  created_at timestamptz not null default now(),
  unique (user_id, person_type, person_key)
);
alter table public.ca_follows enable row level security;
drop policy if exists "ca select own follows" on public.ca_follows;
drop policy if exists "ca insert own follows" on public.ca_follows;
drop policy if exists "ca delete own follows" on public.ca_follows;
create policy "ca select own follows" on public.ca_follows for select using (auth.uid() = user_id);
create policy "ca insert own follows" on public.ca_follows for insert with check (auth.uid() = user_id);
create policy "ca delete own follows" on public.ca_follows for delete using (auth.uid() = user_id);
grant select, insert, delete on public.ca_follows to authenticated;
grant select, insert, update, delete on public.ca_follows to service_role;

-- 2. Demandes d'explications (le « challenge »), 10 par compte par 30 jours
create table if not exists public.ca_bill_flags (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  bill_id bigint not null,
  created_at timestamptz not null default now(),
  unique (user_id, bill_id)
);
alter table public.ca_bill_flags enable row level security;

create or replace function public.ca_my_recent_flag_count()
returns integer
language sql stable security definer set search_path = public as $$
  select count(*)::int from public.ca_bill_flags
  where user_id = auth.uid() and created_at > now() - interval '30 days';
$$;
revoke execute on function public.ca_my_recent_flag_count() from public, anon;
grant execute on function public.ca_my_recent_flag_count() to authenticated;

drop policy if exists "ca insert own flag" on public.ca_bill_flags;
drop policy if exists "ca select own flag" on public.ca_bill_flags;
drop policy if exists "ca delete own flag" on public.ca_bill_flags;
drop policy if exists "ca admins view all flags" on public.ca_bill_flags;
create policy "ca insert own flag" on public.ca_bill_flags for insert
  with check (auth.uid() = user_id and public.ca_my_recent_flag_count() < 10);
create policy "ca select own flag" on public.ca_bill_flags for select using (auth.uid() = user_id);
create policy "ca delete own flag" on public.ca_bill_flags for delete using (auth.uid() = user_id);
create policy "ca admins view all flags" on public.ca_bill_flags for select
  using (exists (select 1 from public.admins a where a.user_id = auth.uid()));
grant select, insert, delete on public.ca_bill_flags to authenticated;
grant select, insert, update, delete on public.ca_bill_flags to service_role;

-- Totaux publics, jamais d'identité
create or replace function public.ca_flag_counts()
returns table (bill_id bigint, cnt bigint)
language sql stable security definer set search_path = public as $$
  select bill_id, count(*)::bigint as cnt from public.ca_bill_flags
  group by bill_id having count(*) >= 1 order by count(*) desc;
$$;
grant execute on function public.ca_flag_counts() to anon, authenticated;

create or replace function public.ca_flag_counts_all()
returns table (bill_id bigint, cnt bigint)
language sql stable security definer set search_path = public as $$
  select bill_id, count(*)::bigint as cnt from public.ca_bill_flags group by bill_id;
$$;
revoke execute on function public.ca_flag_counts_all() from public, anon, authenticated;
grant execute on function public.ca_flag_counts_all() to service_role;

-- 3. État de campagne par projet (digest aux 2 semaines, boutons admin)
create table if not exists public.ca_bill_campaign (
  bill_id bigint primary key,
  last_count int not null default 0,
  threshold int not null default 1000,
  escalation_pending boolean not null default false,
  terminal_notified boolean not null default false,
  updated_at timestamptz not null default now()
);
alter table public.ca_bill_campaign enable row level security;
drop policy if exists "ca admins read campaign" on public.ca_bill_campaign;
drop policy if exists "ca admins write campaign" on public.ca_bill_campaign;
drop policy if exists "ca admins update campaign" on public.ca_bill_campaign;
drop policy if exists "ca admins delete campaign" on public.ca_bill_campaign;
create policy "ca admins read campaign" on public.ca_bill_campaign for select
  using (exists (select 1 from public.admins a where a.user_id = auth.uid()));
create policy "ca admins write campaign" on public.ca_bill_campaign for insert
  with check (exists (select 1 from public.admins a where a.user_id = auth.uid()));
create policy "ca admins update campaign" on public.ca_bill_campaign for update
  using (exists (select 1 from public.admins a where a.user_id = auth.uid()));
create policy "ca admins delete campaign" on public.ca_bill_campaign for delete
  using (exists (select 1 from public.admins a where a.user_id = auth.uid()));
grant select, insert, update, delete on public.ca_bill_campaign to authenticated;
grant select, insert, update, delete on public.ca_bill_campaign to service_role;

-- 4. Mémoire de la dernière activité de chaque projet (fonction planifiée seulement)
create table if not exists public.ca_bill_state (
  bill_id bigint primary key,
  step int not null,
  updated_at timestamptz not null default now()
);
alter table public.ca_bill_state enable row level security;
grant select, insert, update, delete on public.ca_bill_state to service_role;

-- 5. Désabonnements du digest
create table if not exists public.ca_email_optout (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);
alter table public.ca_email_optout enable row level security;
grant select, insert, update, delete on public.ca_email_optout to service_role;

-- 6. Un compte de consultation (bibliothèque) ne peut rien écrire : même déclencheur que DQ
drop trigger if exists refus_lecture_seule_ca_follows on public.ca_follows;
create trigger refus_lecture_seule_ca_follows before insert or update or delete on public.ca_follows
  for each row execute function public.refus_lecture_seule();
drop trigger if exists refus_lecture_seule_ca_bill_flags on public.ca_bill_flags;
create trigger refus_lecture_seule_ca_bill_flags before insert or update or delete on public.ca_bill_flags
  for each row execute function public.refus_lecture_seule();

-- 7. Le script de transfert lit la liste des admins avec la clé serveur
grant select on public.admins to service_role;
