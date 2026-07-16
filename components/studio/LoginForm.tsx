"use client";

import { useActionState } from "react";

import { signIn, type ActionResult } from "@/app/studio/actions";
import { Banner, Field, Input, SubmitButton } from "@/components/studio/ui";

export function LoginForm() {
  const [state, formAction] = useActionState<ActionResult | null, FormData>(
    signIn,
    null,
  );

  return (
    <form action={formAction} className="space-y-4">
      {state?.message ? <Banner tone="error">{state.message}</Banner> : null}

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

      <Field label="Fjalëkalimi">
        <Input
          name="password"
          type="password"
          autoComplete="current-password"
          required
          placeholder="••••••••"
        />
      </Field>

      <SubmitButton pendingLabel="Duke hyrë…" className="w-full">
        Hyr
      </SubmitButton>
    </form>
  );
}
