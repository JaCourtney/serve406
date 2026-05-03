// ── Supabase credentials ──────────────────────────────────────────────────────
// After creating your Supabase project, replace these two values.
// Project Settings → API → Project URL and anon/public key.
const SUPABASE_URL = 'https://uqqeraygepnpsebkvazs.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVxcWVyYXlnZXBucHNlYmt2YXpzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc3ODM2NzgsImV4cCI6MjA5MzM1OTY3OH0.hPuuDI7WCqGg1xu-GaT_yRV3JC6Y6XpyFsP4YBJi8VA';

const db = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
