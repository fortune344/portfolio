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

-- 2) Bucket de stockage public pour les images de projets et le CV (PDF).
insert into storage.buckets (id, name, public)
values ('portfolio', 'portfolio', true)
on conflict (id) do nothing;

-- 3) Messages du formulaire de contact (lisibles dans /admin → Messages).
--    Comme `portfolio` : RLS activé sans policy, accès serveur uniquement.
create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null check (char_length(name) between 2 and 100),
  email text not null check (char_length(email) <= 200),
  company text check (char_length(company) <= 120),
  service text not null,
  budget text,
  message text not null check (char_length(message) between 20 and 4000),
  read boolean not null default false
);

alter table public.contact_messages enable row level security;

create index if not exists contact_messages_created_at_idx
  on public.contact_messages (created_at desc);
