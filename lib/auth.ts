import "server-only";

import { redirect } from "next/navigation";

import { createSupabaseServerClient } from "@/lib/supabase/server";

/** Where the dashboard lives. Not linked publicly; reached via the footer link. */
export const DASHBOARD_PATH = "/studio";
export const LOGIN_PATH = "/studio/login";

/**
 * Returns the signed-in admin, or null.
 *
 * Uses getUser() — which verifies the JWT against Supabase — rather than
 * getSession(), which only decodes the cookie and can be spoofed.
 */
export async function getAdminUser() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) return null;
  return user;
}

/**
 * Gate for every protected page and every mutation.
 *
 * Call this at the top of each server action — middleware alone is not a
 * sufficient authorization boundary, since server actions are POST endpoints
 * addressable independently of any page.
 */
export async function requireAdmin() {
  const user = await getAdminUser();
  if (!user) redirect(LOGIN_PATH);
  return user;
}
