-- ============================================================================
-- DossierCanada — agrégat public des « demandes d'explications » par projet de loi
-- À coller dans Supabase → SQL Editor (une fois). Active la section « Projets
-- challengés par les citoyen·ne·s » de la page d'accueil.
--
-- CONFIDENTIALITÉ : cette fonction ne renvoie QUE le TOTAL par projet — jamais
-- l'identité des personnes qui ont demandé. La table bill_flags reste protégée
-- par RLS (chacun ne voit que ses propres lignes) ; seule cette fonction, en
-- SECURITY DEFINER, calcule l'agrégat, et elle n'expose que les projets ayant
-- atteint le seuil de 1000 demandes.
-- ============================================================================

create or replace function public.flag_counts()
returns table (bill_id bigint, cnt bigint)
language sql
stable
security definer
set search_path = public
as $$
  select bill_id, count(*)::bigint as cnt
  from public.bill_flags
  group by bill_id
  having count(*) >= 1000
  order by cnt desc;
$$;

-- Lisible par tout le monde (visiteurs non connectés compris), en lecture seule.
grant execute on function public.flag_counts() to anon, authenticated;
