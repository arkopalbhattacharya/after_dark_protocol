-- ==============================================================================
-- AFTER DARK PROTOCOL // SUPABASE POSTGRESQL SCHEMA & ROW LEVEL SECURITY (RLS)
-- Paste this script into your Supabase SQL Editor (https://supabase.com/dashboard)
-- ==============================================================================

-- 1. Create table for user mission protocol logs
create table if not exists public.protocol_logs (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references auth.users(id) on delete cascade not null,
    timestamp timestamptz not null default now(),
    category text not null,
    title text not null,
    payload jsonb not null default '{}'::jsonb,
    created_at timestamptz not null default now()
);

-- Index for fast user queries ordered by timestamp
create index if not exists idx_protocol_logs_user_timestamp 
    on public.protocol_logs(user_id, timestamp desc);

-- Enable Row Level Security
alter table public.protocol_logs enable row level security;

-- RLS Policies for protocol_logs
create policy "Users can select own logs"
    on public.protocol_logs for select
    using (auth.uid() = user_id);

create policy "Users can insert own logs"
    on public.protocol_logs for insert
    with check (auth.uid() = user_id);

create policy "Users can update own logs"
    on public.protocol_logs for update
    using (auth.uid() = user_id);

create policy "Users can delete own logs"
    on public.protocol_logs for delete
    using (auth.uid() = user_id);


-- 2. Create table for SYNTHO_TRON 5000 persistent chat history per user
create table if not exists public.protocol_tty_history (
    user_id uuid primary key references auth.users(id) on delete cascade,
    messages jsonb not null default '[]'::jsonb,
    last_query_timestamp bigint not null default 0,
    updated_at timestamptz not null default now()
);

-- Enable Row Level Security
alter table public.protocol_tty_history enable row level security;

-- RLS Policies for protocol_tty_history
create policy "Users can select own tty history"
    on public.protocol_tty_history for select
    using (auth.uid() = user_id);

create policy "Users can insert own tty history"
    on public.protocol_tty_history for insert
    with check (auth.uid() = user_id);

create policy "Users can update own tty history"
    on public.protocol_tty_history for update
    using (auth.uid() = user_id);

create policy "Users can delete own tty history"
    on public.protocol_tty_history for delete
    using (auth.uid() = user_id);
