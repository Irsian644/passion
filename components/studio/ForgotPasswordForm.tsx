"use client";

import { useActionState } from "react";

import { requestPasswordReset, type ActionResult } from "@/app/studio/actions";
import { Banner, Field, Input, SubmitButton } from "@/components/studio/ui";

export function ForgotPasswordForm() {
  const [state, formAction] = useActionState<ActionResult | null, FormData>(
    requestPasswordReset,
    null,
  );

  // Deliberately identical whether or not the email exists.
  if (state?.ok) {
    return <Banner tone="success">{state.message}</Banner>;
  }

  return (
    <form action={formAction} className="space-y-4">
      {state?.message && !state.ok ? (
        <Banner tone="error">{state.message}</Banner>
      ) : null}

      <Field label="Email">
        <Input
          name="email"
          type="email"
          autoComplete="username"
          required
          autoFocus
          placeholder="ti@example.com"
        />
      </Field>

      <SubmitButton pendingLabel="Duke dërguar…" className="w-full">
        Dërgo lidhjen
      </SubmitButton>
    </form>
  );
}
