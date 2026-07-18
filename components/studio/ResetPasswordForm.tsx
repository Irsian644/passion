"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Banner, Field, Input, Button } from "@/components/studio/ui";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

/**
 * Supabase puts the recovery token in the URL *fragment* (#access_token=...),
 * which is never sent to the server — so this exchange has to happen in the
 * browser. The SDK reads the fragment and establishes a recovery session;
 * we then update the password against that session.
 */
export function ResetPasswordForm() {
  const router = useRouter();
  const [ready, setReady] = useState<"checking" | "ok" | "invalid">("checking");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();
    let settled = false;

    const markReady = () => {
      settled = true;
      setReady("ok");
    };

    // Fires once the SDK has consumed the recovery fragment (or restored a
    // session from cookies).
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") markReady();
    });

    // The session may arrive via the fragment, or already exist in cookies
    // after AuthFragmentHandler navigated here. Poll briefly rather than
    // declaring the link invalid on the first miss — getSession() can resolve
    // before the SDK has finished restoring the session, which previously
    // showed "this link is invalid" on a perfectly good link.
    let attempts = 0;
    const poll = async () => {
      if (settled) return;
      const { data } = await supabase.auth.getSession();
      if (data.session) return markReady();
      if (++attempts >= 12) {
        // ~6s with no session: the link really is spent or invalid.
        if (!settled) setReady("invalid");
        return;
      }
      setTimeout(poll, 500);
    };
    poll();

    return () => sub.subscription.unsubscribe();
  }, []);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const form = new FormData(e.currentTarget);
    const password = String(form.get("password") ?? "");
    const confirm = String(form.get("confirm") ?? "");

    if (password.length < 10) {
      setError("Fjalëkalimi duhet të ketë të paktën 10 karaktere.");
      return;
    }
    if (password !== confirm) {
      setError("Fjalëkalimet nuk përputhen.");
      return;
    }

    setPending(true);
    const supabase = createSupabaseBrowserClient();
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setPending(false);

    if (updateError) {
      setError("Nuk u ndryshua. Lidhja mund të ketë skaduar.");
      return;
    }

    setDone(true);
    router.refresh();
  }

  if (done) {
    return (
      <div className="space-y-4">
        <Banner tone="success">Fjalëkalimi u ndryshua.</Banner>
        <Link
          href="/studio"
          className="block w-full rounded-lg bg-[#1c1917] px-4 py-2.5 text-center text-[14px] font-medium text-white transition-colors hover:bg-[#292524]"
        >
          Vazhdo te produktet
        </Link>
      </div>
    );
  }

  if (ready === "checking") {
    return <p className="text-center text-[14px] text-[#a8a29e]">Duke kontrolluar…</p>;
  }

  if (ready === "invalid") {
    return (
      <div className="space-y-4">
        <Banner tone="error">
          Kjo lidhje nuk është e vlefshme ose ka skaduar.
        </Banner>
        <Link
          href="/studio/forgot-password"
          className="block text-center text-[13px] text-[#78716c] underline-offset-4 hover:text-[#1c1917] hover:underline"
        >
          Kërko një lidhje të re
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {error ? <Banner tone="error">{error}</Banner> : null}

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
        <Input name="confirm" type="password" autoComplete="new-password" required />
      </Field>

      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Duke ruajtur…" : "Ruaj fjalëkalimin"}
      </Button>
    </form>
  );
}
