-- Schéma Supabase du portfolio.
-- À exécuter une seule fois dans le SQL Editor de ton projet Supabase
-- (Dashboard → SQL Editor → New query → coller → Run).

-- 1) Table du contenu : une seule ligne JSONB contient tout le portfolio.
create table if not exists public.portfolio (
  id integer primary key,
  content jsonb not null,
  updated_at timestamptz not null default now()
);

-- RLS activé sans policy publique : la table n'est accessible qu'avec la clé
-- service role, utilisée uniquement côté serveur par le site.
alter table public.portfolio enable row level security;

-- 2) Bucket de stockage public pour les images de projets.
insert into storage.buckets (id, name, public)
values ('portfolio', 'portfolio', true)
on conflict (id) do nothing;
