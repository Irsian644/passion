"use client";

import { createBrowserClient } from "@supabase/ssr";

import type { Database } from "@/lib/supabase/types";

/**
 * Browser client. Uses only the anon key, which is safe to expose — every
 * query it makes is constrained by Row Level Security.
 *
 * Used for image uploads (which stream straight to Supabase Storage rather
 * than through a Vercel function) and for reading the current session.
 *
 * This client is NEVER the authority on whether an action is allowed:
 * all mutations go through server actions that re-check the session.
 */
export function createSupabaseBrowserClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
