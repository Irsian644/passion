"use client";

import { Check, Eye, EyeOff, X } from "lucide-react";
import { useActionState, useState } from "react";

import { completeSetup, type SetupResult } from "@/lib/setup-actions";
import { Banner, Field, Input, SubmitButton } from "@/components/studio/ui";

/**
 * Password rules, shown live rather than only on submit — the client should
 * never have to guess why a password was rejected.
 *
 * `min` mirrors passwordSchema (10 chars) and is the only hard requirement;
 * the rest are guidance that strengthens the password without blocking a
 * long passphrase.
 */
const RULES = [
  {
    id: "length",
    label: "Të paktën 10 karaktere",
    required: true,
    test: (p: string) => p.length >= 10,
  },
  {
    id: "letter",
    label: "Një shkronjë",
    required: false,
    test: (p: string) => /\p{L}/u.test(p),
  },
  {
    id: "number",
    label: "Një numër ose simbol",
    required: false,
    test: (p: string) => /[\d\p{P}\p{S}]/u.test(p),
  },
] as const;

function PasswordInput({
  name,
  label,
  value,
  onChange,
  autoFocus,
}: {
  name: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  autoFocus?: boolean;
}) {
  const [visible, setVisible] = useState(false);

  return (
    <Field label={label}>
      <div className="relative">
        <Input
          name={name}
          type={visible ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoComplete="new-password"
          required
          autoFocus={autoFocus}
          className="pr-11"
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Fshih fjalëkalimin" : "Shfaq fjalëkalimin"}
          aria-pressed={visible}
          className="absolute right-1 top-1/2 -translate-y-1/2 rounded-md p-2 text-[#a8a29e] transition-colors hover:text-[#44403c]"
        >
          {visible ? <EyeOff size={16} aria-hidden /> : <Eye size={16} aria-hidden />}
        </button>
      </div>
    </Field>
  );
}

export function SetupForm() {
  const [state, formAction] = useActionState<SetupResult | null, FormData>(
    completeSetup,
    null,
  );

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const results = RULES.map((r) => ({ ...r, pass: r.test(password) }));
  const meetsRequired = results.every((r) => !r.required || r.pass);
  const mismatch = confirm.length > 0 && password !== confirm;

  return (
    <form action={formAction} className="space-y-5">
      {state?.message ? <Banner tone="error">{state.message}</Banner> : null}

      <PasswordInput
        name="password"
        label="Fjalëkalimi i ri"
        value={password}
        onChange={setPassword}
        autoFocus
      />

      <ul className="space-y-1.5" aria-label="Kërkesat e fjalëkalimit">
        {results.map((r) => (
          <li
            key={r.id}
            className={`flex items-center gap-2 text-[12px] transition-colors ${
              r.pass ? "text-[#166534]" : "text-[#a8a29e]"
            }`}
          >
            <span aria-hidden className="shrink-0">
              {r.pass ? <Check size={13} /> : <X size={13} />}
            </span>
            {r.label}
            {!r.required ? (
              <span className="text-[#d6d3d1]">(e rekomanduar)</span>
            ) : null}
          </li>
        ))}
      </ul>

      <PasswordInput
        name="confirm"
        label="Përsërite fjalëkalimin"
        value={confirm}
        onChange={setConfirm}
      />

      {mismatch ? (
        <p role="alert" className="-mt-2 text-[12px] text-[#b91c1c]">
          Fjalëkalimet nuk përputhen.
        </p>
      ) : null}

      <SubmitButton
        pendingLabel="Duke ruajtur…"
        className="w-full"
        disabled={!meetsRequired || mismatch || confirm.length === 0}
      >
        Krijo fjalëkalimin
      </SubmitButton>
    </form>
  );
}
