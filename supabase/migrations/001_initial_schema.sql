-- QualifyChat — initial schema with RLS
-- Run this in Supabase SQL Editor or via CLI migrations.

-- Extensions
create extension if not exists "uuid-ossp";

-- Profiles (extends auth.users)
create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade unique,
  full_name text,
  email text,
  created_at timestamptz not null default now()
);

-- Businesses
create table if not exists public.businesses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  business_name text not null default '',
  industry text default '',
  business_description text default '',
  services_offered text default '',
  pricing_details text default '',
  faqs text default '',
  working_hours text default '',
  location text default '',
  contact_email text default '',
  contact_phone text default '',
  website_url text default '',
  tone_of_voice text default 'Professional',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Chatbot settings per business
create table if not exists public.chatbot_settings (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses (id) on delete cascade unique,
  chatbot_name text not null default 'AI Assistant',
  greeting_message text not null default 'Hi! How can I help you today?',
  chatbot_color text not null default '#2563eb',
  lead_capture_fields jsonb not null default '["name","phone","email","service_required","preferred_datetime","message"]'::jsonb,
  human_handover_message text not null default 'Thanks for sharing the details. Our team will review your request and contact you shortly.',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Leads
create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses (id) on delete cascade,
  visitor_session_id text,
  name text default '',
  phone text default '',
  email text default '',
  service_required text default '',
  preferred_datetime text default '',
  message text default '',
  lead_status text not null default 'NEW',
  conversation_summary text default '',
  ai_summary text default '',
  notes text default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint leads_status_check check (
    lead_status in ('NEW', 'QUALIFIED', 'NOT_QUALIFIED', 'NEEDS_HUMAN_FOLLOW_UP')
  )
);

create unique index if not exists leads_business_session_uidx
  on public.leads (business_id, visitor_session_id)
  where visitor_session_id is not null and visitor_session_id <> '';

-- Conversations (each row = one turn)
create table if not exists public.conversations (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses (id) on delete cascade,
  lead_id uuid references public.leads (id) on delete set null,
  session_id text not null default '',
  user_message text not null default '',
  ai_response text not null default '',
  conversation_summary text default '',
  created_at timestamptz not null default now()
);

create index if not exists conversations_business_id_idx on public.conversations (business_id);
create index if not exists conversations_lead_id_idx on public.conversations (lead_id);
create index if not exists conversations_session_id_idx on public.conversations (session_id);

-- updated_at triggers
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists businesses_updated_at on public.businesses;
create trigger businesses_updated_at
  before update on public.businesses
  for each row execute function public.set_updated_at();

drop trigger if exists chatbot_settings_updated_at on public.chatbot_settings;
create trigger chatbot_settings_updated_at
  before update on public.chatbot_settings
  for each row execute function public.set_updated_at();

drop trigger if exists leads_updated_at on public.leads;
create trigger leads_updated_at
  before update on public.leads
  for each row execute function public.set_updated_at();

-- Row Level Security
alter table public.profiles enable row level security;
alter table public.businesses enable row level security;
alter table public.chatbot_settings enable row level security;
alter table public.leads enable row level security;
alter table public.conversations enable row level security;

-- Profiles policies
create policy "profiles_select_own"
  on public.profiles for select
  using (auth.uid() = user_id);

create policy "profiles_insert_own"
  on public.profiles for insert
  with check (auth.uid() = user_id);

create policy "profiles_update_own"
  on public.profiles for update
  using (auth.uid() = user_id);

-- Businesses: owners only
create policy "businesses_select_own"
  on public.businesses for select
  using (auth.uid() = user_id);

create policy "businesses_insert_own"
  on public.businesses for insert
  with check (auth.uid() = user_id);

create policy "businesses_update_own"
  on public.businesses for update
  using (auth.uid() = user_id);

create policy "businesses_delete_own"
  on public.businesses for delete
  using (auth.uid() = user_id);

-- Chatbot settings via business ownership
create policy "chatbot_settings_select_own"
  on public.chatbot_settings for select
  using (
    exists (
      select 1 from public.businesses b
      where b.id = chatbot_settings.business_id and b.user_id = auth.uid()
    )
  );

create policy "chatbot_settings_insert_own"
  on public.chatbot_settings for insert
  with check (
    exists (
      select 1 from public.businesses b
      where b.id = chatbot_settings.business_id and b.user_id = auth.uid()
    )
  );

create policy "chatbot_settings_update_own"
  on public.chatbot_settings for update
  using (
    exists (
      select 1 from public.businesses b
      where b.id = chatbot_settings.business_id and b.user_id = auth.uid()
    )
  );

create policy "chatbot_settings_delete_own"
  on public.chatbot_settings for delete
  using (
    exists (
      select 1 from public.businesses b
      where b.id = chatbot_settings.business_id and b.user_id = auth.uid()
    )
  );

-- Leads via business ownership
create policy "leads_select_own"
  on public.leads for select
  using (
    exists (
      select 1 from public.businesses b
      where b.id = leads.business_id and b.user_id = auth.uid()
    )
  );

create policy "leads_insert_own"
  on public.leads for insert
  with check (
    exists (
      select 1 from public.businesses b
      where b.id = leads.business_id and b.user_id = auth.uid()
    )
  );

create policy "leads_update_own"
  on public.leads for update
  using (
    exists (
      select 1 from public.businesses b
      where b.id = leads.business_id and b.user_id = auth.uid()
    )
  );

create policy "leads_delete_own"
  on public.leads for delete
  using (
    exists (
      select 1 from public.businesses b
      where b.id = leads.business_id and b.user_id = auth.uid()
    )
  );

-- Conversations via business ownership
create policy "conversations_select_own"
  on public.conversations for select
  using (
    exists (
      select 1 from public.businesses b
      where b.id = conversations.business_id and b.user_id = auth.uid()
    )
  );

create policy "conversations_insert_own"
  on public.conversations for insert
  with check (
    exists (
      select 1 from public.businesses b
      where b.id = conversations.business_id and b.user_id = auth.uid()
    )
  );

create policy "conversations_update_own"
  on public.conversations for update
  using (
    exists (
      select 1 from public.businesses b
      where b.id = conversations.business_id and b.user_id = auth.uid()
    )
  );

create policy "conversations_delete_own"
  on public.conversations for delete
  using (
    exists (
      select 1 from public.businesses b
      where b.id = conversations.business_id and b.user_id = auth.uid()
    )
  );

-- Public chatbot/embed uses Next.js API routes with SUPABASE_SERVICE_ROLE_KEY only (never expose service role to the browser).

-- Auto-create profile row when a user signs up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (user_id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1))
  );
  return new;
end;
$$ language plpgsql security definer set search_path = public;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
