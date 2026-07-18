"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { passwordSchema } from "@/lib/validation";

export interface ResetResult {
  ok: boolean;
  message?: string;
}

/**
 * Completes a password reset from a recovery session.
 *
 * Deliberately server-side. The previous implementation checked the session in
 * the browser with supabase.auth.getSession(), which races against the SDK
 * rehydrating from cookies after a full-page navigation — a valid recovery link
 * would render "this link is invalid" simply because the check ran too early.
 *
 * On the server the session cookie is read synchronously and authoritatively,
 * so there is no race and no client session detection at all.
 *
 * Note: this does NOT call requireAdmin(). A recovery session is a legitimate
 * authenticated session whose whole purpose is to set a password; requiring a
 * completed onboarding here would lock out the very user who is recovering.
 */
export async function completePasswordReset(
  _prev: ResetResult | null,
  formData: FormData,
): Promise<ResetResult> {
  const supabase = await createSupabaseServerClient();

  // Verified against Supabase, not merely decoded from the cookie.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      ok: false,
      message: "Kjo lidhje nuk është më e vlefshme. Kërko një lidhje të re.",
    };
  }

  const parsed = passwordSchema.safeParse(formData.get("password"));
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message };
  }

  if (parsed.data !== String(formData.get("confirm") ?? "")) {
    return { ok: false, message: "Fjalëkalimet nuk përputhen." };
  }

  const { error } = await supabase.auth.updateUser({ password: parsed.data });
  if (error) {
    // Surface the one case the user can act on; keep everything else generic.
    const samePassword =
      error.message.toLowerCase().includes("should be different") ||
      error.message.toLowerCase().includes("same as the old");

    console.error("[reset] updateUser failed:", error.message);

    return {
      ok: false,
      message: samePassword
        ? "Zgjidh një fjalëkalim të ndryshëm nga i mëparshmi."
        : "Nuk u ruajt. Provo përsëri.",
    };
  }

  // NOTE: deliberately do NOT sign out here. Signing out inside this action
  // makes the page re-render with no session, so the server component would
  // show "this link expired" immediately after a SUCCESSFUL reset. The client
  // shows the success state, then calls finishResetAndSignOut() before it
  // sends the user to the login page.
  return { ok: true, message: "Fjalëkalimi u ndryshua." };
}

/** Signs out after a successful reset so the user logs in with the new password. */
export async function finishResetAndSignOut(): Promise<void> {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
}
