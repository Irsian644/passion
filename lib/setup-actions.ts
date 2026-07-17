"use server";

import { redirect } from "next/navigation";

import { DASHBOARD_PATH, requireSession } from "@/lib/auth";
import { ONBOARDING_FLAG } from "@/lib/onboarding";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { passwordSchema } from "@/lib/validation";

export interface SetupResult {
  ok: boolean;
  message?: string;
}

/**
 * Completes onboarding: the invited user chooses their own password.
 *
 * The password is submitted by the client, validated, and handed straight to
 * Supabase Auth, which hashes it. It is never logged, never stored by us, and
 * never known to anyone but the client.
 */
export async function completeSetup(
  _prev: SetupResult | null,
  formData: FormData,
): Promise<SetupResult> {
  // Session required, but onboarding deliberately not required — this action
  // is what completes it.
  await requireSession();

  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirm") ?? "");

  const parsed = passwordSchema.safeParse(password);
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message };
  }

  if (password !== confirm) {
    return { ok: false, message: "Fjalëkalimet nuk përputhen." };
  }

  const supabase = await createSupabaseServerClient();

  // Set the password and mark onboarding done in one call, so the two can
  // never disagree.
  const { error } = await supabase.auth.updateUser({
    password: parsed.data,
    data: { [ONBOARDING_FLAG]: true },
  });

  if (error) {
    // Most likely an expired invite session.
    return {
      ok: false,
      message:
        "Nuk u ruajt. Lidhja mund të ketë skaduar — kërko një ftesë të re.",
    };
  }

  redirect(DASHBOARD_PATH);
}
