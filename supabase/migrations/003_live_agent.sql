-- QualifyChat — Live agent handover (run after 001 + 002)

create table if not exists public.chat_sessions (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses (id) on delete cascade,
  session_id text not null,
  mode text not null default 'ai',
  last_preview text default '',
  live_requested_at timestamptz,
  live_started_at timestamptz,
  owner_user_id uuid references auth.users (id) on delete set null,
  alert_seen_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint chat_sessions_mode_check check (
    mode in ('ai', 'waiting_agent', 'live', 'closed')
  ),
  constraint chat_sessions_business_session_unique unique (business_id, session_id)
);

create index if not exists chat_sessions_business_id_idx
  on public.chat_sessions (business_id);

create index if not exists chat_sessions_mode_idx
  on public.chat_sessions (business_id, mode);

create table if not exists public.live_messages (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses (id) on delete cascade,
  session_id text not null,
  sender text not null,
  content text not null,
  created_at timestamptz not null default now(),
  constraint live_messages_sender_check check (
    sender in ('visitor', 'owner', 'system')
  )
);

create index if not exists live_messages_session_idx
  on public.live_messages (business_id, session_id, created_at);

drop trigger if exists chat_sessions_updated_at on public.chat_sessions;
create trigger chat_sessions_updated_at
  before update on public.chat_sessions
  for each row execute function public.set_updated_at();

alter table public.chat_sessions enable row level security;
alter table public.live_messages enable row level security;

create policy "chat_sessions_select_own"
  on public.chat_sessions for select
  using (
    exists (
      select 1 from public.businesses b
      where b.id = chat_sessions.business_id and b.user_id = auth.uid()
    )
  );

create policy "chat_sessions_update_own"
  on public.chat_sessions for update
  using (
    exists (
      select 1 from public.businesses b
      where b.id = chat_sessions.business_id and b.user_id = auth.uid()
    )
  );

create policy "live_messages_select_own"
  on public.live_messages for select
  using (
    exists (
      select 1 from public.businesses b
      where b.id = live_messages.business_id and b.user_id = auth.uid()
    )
  );

-- Public visitor + server APIs use service role for inserts.
