-- ── Serve406 Migration: Location, Support Preference, Considerations ──────────
-- Run this in Supabase: SQL Editor → New Query → paste → Run

-- Rename area_preference to location
alter table public.profiles rename column area_preference to location;

-- Add support_preference and considerations columns
alter table public.profiles
  add column support_preference text default 'No Preference',
  add column considerations     text default 'No Considerations';
