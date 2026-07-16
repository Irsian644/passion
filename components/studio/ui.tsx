"use client";

import { Loader2 } from "lucide-react";
import { useFormStatus } from "react-dom";

/**
 * Shared studio primitives. Deliberately plain: the dashboard should feel
 * quiet and obvious, not like the marketing site.
 */

export function Field({
  label,
  hint,
  error,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="block text-[13px] font-medium text-[#44403c]">{label}</span>
      {hint ? (
        <span className="mt-0.5 block text-[12px] text-[#a8a29e]">{hint}</span>
      ) : null}
      <div className="mt-1.5">{children}</div>
      {error ? (
        <span role="alert" className="mt-1.5 block text-[12px] text-[#b91c1c]">
          {error}
        </span>
      ) : null}
    </label>
  );
}

const inputBase =
  "w-full rounded-lg border border-[#e7e5e4] bg-white px-3 py-2.5 text-[14px] text-[#1c1917] " +
  "placeholder:text-[#d6d3d1] outline-none transition-colors " +
  "focus:border-[#1c1917] focus:ring-2 focus:ring-[#1c1917]/10 " +
  "disabled:cursor-not-allowed disabled:bg-[#f5f5f4]";

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`${inputBase} ${props.className ?? ""}`} />;
}

export function Textarea(
  props: React.TextareaHTMLAttributes<HTMLTextAreaElement>,
) {
  return (
    <textarea
      {...props}
      className={`${inputBase} min-h-[96px] resize-y leading-[1.6] ${props.className ?? ""}`}
    />
  );
}

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  /** React 19 passes ref straight through props — no forwardRef needed. */
  ref?: React.Ref<HTMLButtonElement>;
};

export function Button({ variant = "primary", className = "", ...props }: ButtonProps) {
  const variants = {
    primary: "bg-[#1c1917] text-white hover:bg-[#292524] disabled:bg-[#a8a29e]",
    secondary:
      "border border-[#e7e5e4] bg-white text-[#44403c] hover:border-[#d6d3d1] hover:bg-[#fafaf9]",
    danger: "bg-[#b91c1c] text-white hover:bg-[#991b1b] disabled:bg-[#fca5a5]",
    ghost: "text-[#78716c] hover:bg-[#f5f5f4] hover:text-[#1c1917]",
  };

  return (
    <button
      {...props}
      className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-[14px] font-medium transition-colors disabled:cursor-not-allowed ${variants[variant]} ${className}`}
    />
  );
}

/** Submit button that reports pending state from the enclosing form. */
export function SubmitButton({
  children,
  pendingLabel,
  variant = "primary",
  className = "",
}: {
  children: React.ReactNode;
  pendingLabel?: string;
  variant?: "primary" | "secondary" | "danger";
  className?: string;
}) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" variant={variant} disabled={pending} className={className}>
      {pending ? (
        <>
          <Loader2 size={15} className="animate-spin" aria-hidden />
          {pendingLabel ?? "Duke ruajtur…"}
        </>
      ) : (
        children
      )}
    </Button>
  );
}

export function Toggle({
  name,
  defaultChecked,
  label,
  hint,
}: {
  name: string;
  defaultChecked?: boolean;
  label: string;
  hint?: string;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-3">
      <input
        type="checkbox"
        name={name}
        defaultChecked={defaultChecked}
        className="mt-0.5 h-[18px] w-[18px] shrink-0 cursor-pointer rounded border-[#d6d3d1] text-[#1c1917] focus:ring-2 focus:ring-[#1c1917]/20"
      />
      <span>
        <span className="block text-[14px] text-[#1c1917]">{label}</span>
        {hint ? (
          <span className="block text-[12px] text-[#a8a29e]">{hint}</span>
        ) : null}
      </span>
    </label>
  );
}

export function Banner({
  tone,
  children,
}: {
  tone: "error" | "success";
  children: React.ReactNode;
}) {
  const tones = {
    error: "border-[#fecaca] bg-[#fef2f2] text-[#991b1b]",
    success: "border-[#bbf7d0] bg-[#f0fdf4] text-[#166534]",
  };

  return (
    <div
      role={tone === "error" ? "alert" : "status"}
      className={`rounded-lg border px-3.5 py-2.5 text-[13px] ${tones[tone]}`}
    >
      {children}
    </div>
  );
}
