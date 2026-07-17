import "server-only";

import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

import { serverEnv } from "@/lib/env";
import type { Database } from "@/lib/supabase/types";

/**
 * Request-scoped client bound to the signed-in admin's session cookie.
 *
 * Auth state lives in HttpOnly cookies managed by @supabase/ssr — never in
 * localStorage — so it cannot be read by scripts on the page.
 *
 * Every query through this client is still subject to Row Level Security.
 */
export async function createSupabaseServerClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    serverEnv.supabaseUrl(),
    serverEnv.supabaseAnonKey(),
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            // "Remember me": when opted out (pd_remember=0), drop maxAge/expires
            // so the auth cookies become session cookies (cleared on browser
            // close). The action sets pd_remember before sign-in, so it is
            // readable here. Default keeps Supabase's own lifetime.
            const sessionOnly = cookieStore.get("pd_remember")?.value === "0";

            for (const { name, value, options } of cookiesToSet) {
              const opts = {
                ...options,
                httpOnly: true,
                sameSite: "lax" as const,
                secure: process.env.NODE_ENV === "production",
                path: "/",
              };
              if (sessionOnly && name !== "pd_remember") {
                delete opts.maxAge;
                delete opts.expires;
              }
              cookieStore.set(name, value, opts);
            }
          } catch {
            // Called from a Server Component, where cookies are read-only.
            // Middleware refreshes the session, so this is safe to ignore.
          }
        },
      },
    },
  );
}

/**
 * Anonymous client for public pages. Subject to RLS, so it can only ever
 * read published products. Used for static generation of the public site.
 */
export function createSupabasePublicClient() {
  return createClient<Database>(
    serverEnv.supabaseUrl(),
    serverEnv.supabaseAnonKey(),
    { auth: { persistSession: false } },
  );
}

/**
 * Service-role client — BYPASSES Row Level Security.
 *
 * Only for operations that must run without a user session (e.g. seeding).
 * Never call this in response to unauthenticated input, and never import it
 * into a client component.
 */
export function createSupabaseAdminClient() {
  return createClient<Database>(
    serverEnv.supabaseUrl(),
    serverEnv.supabaseServiceRoleKey(),
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
}
