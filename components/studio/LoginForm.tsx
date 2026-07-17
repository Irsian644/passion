"use client";

import { useActionState } from "react";

import { signIn, type ActionResult } from "@/lib/studio-actions";
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

      <label className="flex cursor-pointer items-center gap-2.5 text-[14px] text-[#44403c]">
        <input
          type="checkbox"
          name="remember"
          defaultChecked
          className="h-[18px] w-[18px] cursor-pointer rounded border-[#d6d3d1] text-[#1c1917] focus:ring-2 focus:ring-[#1c1917]/20"
        />
        Më mbaj të kyçur
      </label>

      <SubmitButton pendingLabel="Duke hyrë…" className="w-full">
        Hyr
      </SubmitButton>
    </form>
  );
}
