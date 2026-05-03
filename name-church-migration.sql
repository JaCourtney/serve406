-- ── Serve406 Migration: Split name, add church ───────────────────────────────
-- Run this in Supabase: SQL Editor → New Query → paste → Run

alter table public.profiles
  add column first_name text,
  add column last_name  text,
  add column church     text;

-- Move any existing name data into first_name
update public.profiles set first_name = name where first_name is null;

-- Remove old name column
alter table public.profiles drop column name;
