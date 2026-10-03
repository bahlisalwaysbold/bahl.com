create extension if not exists pgcrypto;

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  reference text not null unique,
  division text not null,
  niche text not null,
  name text not null,
  phone text not null,
  email text,
  role text not null,
  organization text,
  project_type text not null,
  floors integer not null,
  drawing_needs jsonb not null default '[]'::jsonb,
  deadline text not null,
  location text not null,
  has_files boolean not null default false,
  file_path text,
  budget text,
  notes text not null,
  source text not null default 'direct',
  referrer text,
  lead_score integer not null default 0,
  status text not null default 'new',
  service_consent boolean not null default false,
  marketing_opt_in boolean not null default false,
  contacted_at timestamptz,
  quoted_at timestamptz,
  won_at timestamptz,
  lost_at timestamptz,
  revenue numeric(14,2),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.lead_events (
  id bigint generated always as identity primary key,
  lead_id uuid references public.leads(id) on delete cascade,
  event_type text not null,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.followups (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid references public.leads(id) on delete cascade,
  kind text not null,
  due_at timestamptz not null,
  status text not null default 'pending',
  sent_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.quotes (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.leads(id) on delete cascade,
  amount numeric(14,2),
  currency text not null default 'NGN',
  status text not null default 'draft',
  sent_at timestamptz,
  accepted_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists leads_created_at_idx on public.leads(created_at desc);
create index if not exists leads_source_idx on public.leads(source);
create index if not exists leads_status_idx on public.leads(status);
create index if not exists leads_score_idx on public.leads(lead_score desc);
create index if not exists lead_events_lead_idx on public.lead_events(lead_id, created_at desc);
create index if not exists followups_due_idx on public.followups(status, due_at);

create or replace function public.touch_lead_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists leads_touch_updated_at on public.leads;
create trigger leads_touch_updated_at before update on public.leads for each row execute function public.touch_lead_updated_at();

alter table public.leads enable row level security;
alter table public.lead_events enable row level security;
alter table public.followups enable row level security;
alter table public.quotes enable row level security;

insert into storage.buckets (id, name, public)
values ('lead-files', 'lead-files', false)
on conflict (id) do nothing;

-- No anonymous/authenticated policies are created intentionally.
-- The Next.js server accesses these tables with the service-role key.
