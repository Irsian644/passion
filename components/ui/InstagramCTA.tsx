"use client";

import { Instagram } from "lucide-react";
import { instagramUrl, instagramOrderUrl } from "@/lib/site";

type Variant = "primary" | "ghost" | "light" | "onDark";

const base =
  "group/ig relative inline-flex items-center justify-center gap-2.5 rounded-full px-9 py-[15px] text-[11px] font-medium uppercase tracking-wide2 transition-[background-color,color,border-color,transform,box-shadow] duration-500 ease-luxe will-change-transform hover:-translate-y-[2px] active:translate-y-0 active:duration-150";

const variants: Record<Variant, string> = {
  primary: "bg-ink text-cream hover:bg-gold-deep hover:shadow-soft",
  ghost: "border border-ink/15 text-ink hover:border-ink/35 hover:bg-ink/[0.02]",
  light: "bg-cream text-ink hover:bg-gold-deep hover:text-cream hover:shadow-lift",
  onDark: "border border-cream/25 text-cream hover:border-cream/55 hover:bg-cream/[0.05]",
};

/**
 * The single conversion action across the whole site. Always opens the official
 * Instagram profile in a new tab. Use `order` for buying intent (adds UTM).
 */
export function InstagramCTA({
  label,
  variant = "primary",
  order = false,
  productName,
  className = "",
  showIcon = true,
}: {
  label: string;
  variant?: Variant;
  order?: boolean;
  productName?: string;
  className?: string;
  showIcon?: boolean;
}) {
  const href = order ? instagramOrderUrl(productName) : instagramUrl();
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`${base} ${variants[variant]} ${className}`}
    >
      {showIcon && (
        <Instagram className="h-4 w-4 transition-transform duration-500 ease-luxe group-hover/ig:rotate-[8deg] group-hover/ig:scale-110" />
      )}
      <span>{label}</span>
    </a>
  );
}
