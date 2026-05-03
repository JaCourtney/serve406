-- ── Serve406 Database Setup ───────────────────────────────────────────────────
-- Run this in your Supabase project: SQL Editor → New Query → paste → Run

-- 1. Profiles table (extends the built-in auth.users table)
create table public.profiles (
  id               uuid references auth.users(id) on delete cascade primary key,
  name             text not null,
  phone            text,
  area_preference  text,
  created_at       timestamptz default now()
);

-- 2. Row-Level Security (each user can only see and edit their own row)
alter table public.profiles enable row level security;

create policy "Users can read own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);
