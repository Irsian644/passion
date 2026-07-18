"use client";

import { useActionState, useEffect, useState } from "react";

import {
  completePasswordReset,
  finishResetAndSignOut,
  type ResetResult,
} from "@/lib/reset-actions";
import { Banner, Field, Input, SubmitButton } from "@/components/studio/ui";

/**
 * New-password form for a recovery session.
 *
 * Contains NO client-side session detection. The page server-renders only when
 * a valid recovery session exists, and completePasswordReset re-verifies it on
 * the server. Checking the session in the browser is what previously made valid
 * links look expired: supabase.auth.getSession() could run before the SDK had
 * rehydrated from cookies after the fragment handler's navigation.
 */
export function ResetPasswordForm() {
  const [state, formAction] = useActionState<ResetResult | null, FormData>(
    completePasswordReset,
    null,
  );
  const [seconds, setSeconds] = useState(3);

  // After a successful change, end the recovery session and send the user to
  // log in with their new password. The sign-out happens here (not inside the
  // action) so the success state is visible first — signing out server-side
  // would re-render the page as "link expired" right after a successful reset.
  useEffect(() => {
    if (!state?.ok) return;
    if (seconds <= 0) {
      finishResetAndSignOut().finally(() => {
        window.location.assign("/studio/login");
      });
      return;
    }
    const t = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [state?.ok, seconds]);

  if (state?.ok) {
    return (
      <div className="space-y-4">
        <Banner tone="success">
          Fjalëkalimi u ndryshua. Po të dërgojmë te hyrja…
        </Banner>
        <button
          type="button"
          onClick={() =>
            finishResetAndSignOut().finally(() =>
              window.location.assign("/studio/login"),
            )
          }
          className="block w-full rounded-lg bg-[#1c1917] px-4 py-2.5 text-center text-[14px] font-medium text-white transition-colors hover:bg-[#292524]"
        >
          Hyr tani
        </button>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      {state?.message ? <Banner tone="error">{state.message}</Banner> : null}

      <Field label="Fjalëkalimi i ri" hint="Të paktën 10 karaktere">
        <Input
          name="password"
          type="password"
          autoComplete="new-password"
          required
          minLength={10}
          autoFocus
        />
      </Field>

      <Field label="Përsërite fjalëkalimin">
        <Input
          name="confirm"
          type="password"
          autoComplete="new-password"
          required
          minLength={10}
        />
      </Field>

      <SubmitButton pendingLabel="Duke ruajtur…" className="w-full">
        Ruaj fjalëkalimin
      </SubmitButton>
    </form>
  );
}
