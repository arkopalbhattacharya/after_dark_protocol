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

-- Index for fast user queries ordered by timestamp and category
create index if not exists idx_protocol_logs_user_timestamp 
    on public.protocol_logs(user_id, timestamp desc);

create index if not exists idx_protocol_logs_category
    on public.protocol_logs(category);

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


-- 3. Create table for Operator Settings & Enabled Log Types ([NEURAL_JACK])
create table if not exists public.user_preferences (
    user_id uuid primary key references auth.users(id) on delete cascade,
    enabled_categories jsonb not null default '[]'::jsonb,
    theme text default 'MIDNIGHT_V1.5',
    crt_flicker boolean default true,
    speech_synth boolean default false,
    updated_at timestamptz not null default now()
);

-- Enable Row Level Security
alter table public.user_preferences enable row level security;

-- RLS Policies for user_preferences
create policy "Users can select own preferences"
    on public.user_preferences for select
    using (auth.uid() = user_id);

create policy "Users can insert own preferences"
    on public.user_preferences for insert
    with check (auth.uid() = user_id);

create policy "Users can update own preferences"
    on public.user_preferences for update
    using (auth.uid() = user_id);


-- 4. Create table for Universal Cyberpunk News Dispatches ([THE_SOCIAL_JETWORKS])
create table if not exists public.universal_news (
    id text primary key,
    source_id text not null,
    headline text not null,
    content text not null,
    planet_or_sector text not null,
    timestamp timestamptz not null default now(),
    tag text not null,
    urgency text not null,
    author_or_wire text,
    created_at timestamptz not null default now()
);

-- Index for fast queries ordered by timestamp
create index if not exists idx_universal_news_timestamp on public.universal_news(timestamp desc);

-- Enable Row Level Security
alter table public.universal_news enable row level security;

-- Policies: Anyone can select, insert, and delete old items for universal wire broadcast
create policy "Public can read universal news"
    on public.universal_news for select
    using (true);

create policy "Public can insert universal news"
    on public.universal_news for insert
    with check (true);

create policy "Public can update universal news"
    on public.universal_news for update
    using (true);

create policy "Public can delete purged universal news"
    on public.universal_news for delete
    using (true);
