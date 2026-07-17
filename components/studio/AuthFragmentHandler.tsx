"use client";

import { useEffect } from "react";

import { createSupabaseBrowserClient } from "@/lib/supabase/client";

/**
 * Catches Supabase's implicit-flow auth fragment.
 *
 * Supabase's default email templates use `{{ .ConfirmationURL }}`, which sends
 * the user to the Site URL with the session in a URL *fragment*:
 *
 *   https://example.com/#access_token=...&type=invite
 *
 * A fragment is never transmitted to the server, so our /auth/confirm route
 * cannot see it. Only the browser can. This component reads the fragment, lets
 * the SDK persist the session into cookies, then hands control back to the
 * server by navigating — at which point middleware and requireAdmin() can see
 * the user and route them correctly (invited -> /setup-account).
 *
 * The PKCE path through /auth/confirm remains the preferred flow; this exists
 * so a default email template still lands the client in the right place.
 */
export function AuthFragmentHandler() {
  useEffect(() => {
    const hash = window.location.hash;
    if (!hash || !hash.includes("access_token")) return;

    const params = new URLSearchParams(hash.slice(1));
    const accessToken = params.get("access_token");
    const refreshToken = params.get("refresh_token");
    if (!accessToken || !refreshToken) return;

    const type = params.get("type");
    const supabase = createSupabaseBrowserClient();

    supabase.auth
      .setSession({ access_token: accessToken, refresh_token: refreshToken })
      .then(({ error }) => {
        // Strip the tokens from the URL either way — they must not linger in
        // history, be copy-pasted, or leak via a Referer header.
        window.history.replaceState(null, "", window.location.pathname);

        if (error) return;

        // Full navigation (not router.push) so the server re-reads the session
        // cookie and applies the onboarding gate.
        window.location.assign(
          type === "invite" || type === "signup" ? "/setup-account" : "/studio",
        );
      });
  }, []);

  return null;
}
