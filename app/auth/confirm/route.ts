import { type EmailOtpType } from "@supabase/supabase-js";
import { type NextRequest, NextResponse } from "next/server";

import { DASHBOARD_PATH, LOGIN_PATH } from "@/lib/auth";
import { needsOnboarding, SETUP_PATH } from "@/lib/onboarding";
import { createSupabaseServerClient } from "@/lib/supabase/server";

/**
 * Landing point for every link Supabase emails: invite, recovery, magic link.
 *
 * Supabase sends either a PKCE `code` or a `token_hash` + `type` depending on
 * the template. We handle both, exchange it for a real session cookie here on
 * the server, then route by *state* rather than by link type:
 *
 *   - no password yet  -> /setup-account
 *   - password set     -> the dashboard
 *
 * Routing on state (not on `type=invite`) means a user who abandons setup and
 * clicks the link again still lands on the setup page rather than a dashboard
 * they cannot get back into.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);

  const code = searchParams.get("code");
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const next = searchParams.get("next");

  const supabase = await createSupabaseServerClient();

  let exchangeFailed = false;

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    exchangeFailed = Boolean(error);
  } else if (tokenHash && type) {
    const { error } = await supabase.auth.verifyOtp({ type, token_hash: tokenHash });
    exchangeFailed = Boolean(error);
  } else {
    exchangeFailed = true;
  }

  // Expired or already-used link. Send them somewhere that explains it in
  // plain language — never surface the raw Supabase error.
  if (exchangeFailed) {
    const url = new URL(SETUP_PATH, origin);
    url.searchParams.set("error", "link");
    return NextResponse.redirect(url);
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(new URL(LOGIN_PATH, origin));
  }

  // A recovery link for an established account goes to the normal reset page.
  if (type === "recovery" && !needsOnboarding(user)) {
    return NextResponse.redirect(new URL("/studio/reset-password", origin));
  }

  if (needsOnboarding(user)) {
    return NextResponse.redirect(new URL(SETUP_PATH, origin));
  }

  // `next` is attacker-controllable, so only ever honour a local path.
  const destination =
    next && next.startsWith("/") && !next.startsWith("//") ? next : DASHBOARD_PATH;

  return NextResponse.redirect(new URL(destination, origin));
}
