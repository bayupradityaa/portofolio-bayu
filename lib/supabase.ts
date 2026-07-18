import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Server-side Supabase client. Reads keys from env; returns null when unconfigured
 * so the contact route can degrade gracefully instead of throwing at import time.
 *
 * Add to .env.local:
 *   NEXT_PUBLIC_SUPABASE_URL=...
 *   SUPABASE_SERVICE_ROLE_KEY=...   (server only — never expose to the client)
 *
 * Expected table `contact_messages`:
 *   id uuid primary key default gen_random_uuid()
 *   name text not null
 *   email text not null
 *   message text not null
 *   created_at timestamptz default now()
 */
export function getSupabaseAdmin(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: { persistSession: false },
  });
}
