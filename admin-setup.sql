-- ── Serve406 Admin Setup ─────────────────────────────────────────────────────
-- Run this in Supabase: SQL Editor → New Query → paste → Run

-- 1. Add is_admin column to profiles
alter table public.profiles add column is_admin boolean default false;

-- 2. Helper function to check if current user is admin (avoids recursive RLS)
create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
as $$
  select coalesce(
    (select is_admin from public.profiles where id = auth.uid()),
    false
  );
$$;

-- 3. Drop old read policy and replace with one that lets admins read all rows
drop policy "Users can read own profile" on public.profiles;

create policy "Users can read profiles"
  on public.profiles for select
  using (auth.uid() = id or public.is_admin());

-- 4. Make yourself an admin (replace with your actual email)
update public.profiles
set is_admin = true
where id = (select id from auth.users where email = 'jmcourtney07@gmail.com');
