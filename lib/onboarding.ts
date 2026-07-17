import "server-only";

import type { User } from "@supabase/supabase-js";

/**
 * Onboarding state for invited administrators.
 *
 * An invited user is *already authenticated* the moment they click the invite
 * link — Supabase establishes a real session before any password exists. So a
 * session alone cannot mean "may use the dashboard". This flag is the second
 * half of that check, and it is read server-side only.
 *
 * It lives in `user_metadata`, which the user could in principle write via the
 * client SDK. That is acceptable *only* because the flag grants nothing on its
 * own: the real protection is that a user who never set a password cannot sign
 * in again once the invite session expires. The flag exists to route people to
 * the right page, not to hold the security boundary.
 */

export const SETUP_PATH = "/setup-account";

/** Set once the user has chosen their own password. */
export const ONBOARDING_FLAG = "onboarding_complete";

/**
 * True when this user still needs to create a password.
 *
 * Supabase does not expose "has a password" directly, so we combine two
 * signals:
 *   - our explicit flag, set when they complete setup, and
 *   - Supabase's own invited_at/confirmation heuristics, which cover a user
 *     who was invited before this flag existed.
 */
export function needsOnboarding(user: User): boolean {
  // The flag is the authoritative "done" signal, set when setup completes.
  if (user.user_metadata?.[ONBOARDING_FLAG] === true) return false;

  // Invited users carry invited_at. Supabase exposes it top-level on the full
  // user record (getUser / admin API); we also check user_metadata because the
  // implicit-flow JWT carries only that. Either presence means the account was
  // created by invitation and has never chosen a password.
  const wasInvited = Boolean(user.invited_at ?? user.user_metadata?.invited_at);
  if (wasInvited) return true;

  // Anyone created by other means (e.g. the first admin, made in the Supabase
  // dashboard with a password) is not mid-onboarding.
  return false;
}
