"use client";

import { useEffect } from "react";

import { createSupabaseBrowserClient } from "@/lib/supabase/client";

/**
 * Catches Supabase's implicit-flow auth fragment.
 *
 * Supabase's default email templates use `{{ .ConfirmationURL }}`, which sends
 * the user to the Site URL with the session in a URL *fragment*:
 *
 *   https://example.com/#access_token=...&type=recovery
 *
 * A fragment is never transmitted to the server, so our /auth/confirm route
 * cannot see it. Only the browser can.
 *
 * Race note: @supabase/ssr's browser client has detectSessionInUrl:true and
 * consumes+clears the fragment as soon as it is created. If we read
 * window.location.hash inside an effect, Supabase may have already wiped it,
 * so we would lose the `type` and misroute (e.g. a recovery link silently
 * lands in the dashboard instead of the reset page). We therefore snapshot the
 * fragment ONCE at module evaluation — before any Supabase client exists — and
 * route from that snapshot.
 */

interface FragmentAuth {
  accessToken: string;
  refreshToken: string;
  type: string | null;
}

/** Snapshot taken at import time, before Supabase can clear the hash. */
const snapshot: FragmentAuth | null = (() => {
  if (typeof window === "undefined") return null;
  const hash = window.location.hash;
  if (!hash || !hash.includes("access_token")) return null;

  const params = new URLSearchParams(hash.slice(1));
  const accessToken = params.get("access_token");
  const refreshToken = params.get("refresh_token");
  if (!accessToken || !refreshToken) return null;

  return { accessToken, refreshToken, type: params.get("type") };
})();

function destinationFor(type: string | null): string {
  if (type === "invite" || type === "signup") return "/setup-account";
  if (type === "recovery") return "/studio/reset-password";
  return "/studio";
}

export function AuthFragmentHandler() {
  useEffect(() => {
    if (!snapshot) return;

    const supabase = createSupabaseBrowserClient();

    // Ensure the session cookie is established (Supabase may already have done
    // this via detectSessionInUrl; setSession is idempotent).
    supabase.auth
      .setSession({
        access_token: snapshot.accessToken,
        refresh_token: snapshot.refreshToken,
      })
      .finally(() => {
        // Strip the tokens from the URL — they must not linger in history, be
        // copy-pasted, or leak via a Referer header.
        window.history.replaceState(null, "", window.location.pathname);

        // Full navigation (not router.push) so the server re-reads the session
        // cookie and applies the onboarding gate. Route from the snapshot, so
        // it is correct even if Supabase already cleared the fragment.
        window.location.assign(destinationFor(snapshot.type));
      });
  }, []);

  return null;
}
