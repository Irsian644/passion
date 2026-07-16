"use client";

import { useActionState } from "react";

import { changePassword, type ActionResult } from "@/app/studio/actions";
import { Banner, Field, Input, SubmitButton } from "@/components/studio/ui";

export function PasswordForm() {
  const [state, formAction] = useActionState<ActionResult | null, FormData>(
    changePassword,
    null,
  );

  return (
    <form action={formAction} className="space-y-4">
      {state?.message ? (
        <Banner tone={state.ok ? "success" : "error"}>{state.message}</Banner>
      ) : null}

      <Field label="Fjalëkalimi i ri" hint="Të paktën 10 karaktere">
        <Input
          name="password"
          type="password"
          autoComplete="new-password"
          required
          minLength={10}
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

      <SubmitButton pendingLabel="Duke ndryshuar…">Ndrysho</SubmitButton>
    </form>
  );
}
