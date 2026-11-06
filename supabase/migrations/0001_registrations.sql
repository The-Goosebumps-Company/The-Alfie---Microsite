-- The Bench: registrations for The Alfie's opening night reserves list.
create type public.fan_type as enum ('analyst', 'superfan', 'host', 'guest');

create table public.registrations (
  id uuid primary key default gen_random_uuid(),
  squad_number integer generated always as identity (start with 1) unique not null,
  first_name text not null check (char_length(first_name) between 1 and 60),
  surname text not null check (char_length(surname) between 1 and 60),
  email text not null unique check (email = lower(email)),
  mobile text check (mobile ~ '^\+[1-9][0-9]{6,14}$'),
  date_of_birth date not null,
  sports text[] not null default '{}',
  fan_type public.fan_type,
  fan_audience text,
  email_opt_in boolean not null default false,
  whatsapp_opt_in boolean not null default false,
  consent_text_version text not null,
  consent_at timestamptz not null default now(),
  source text not null default 'direct',
  box text,
  user_agent text,
  created_at timestamptz not null default now()
);

create index registrations_source_idx on public.registrations (source);

-- RLS on with no policies: only the server (service-role key) can read or write.
alter table public.registrations enable row level security;
