"use client";

import { useLang } from "@/components/providers/LanguageProvider";

export function Marquee() {
  const { t } = useLang();
  const phrase = t.marquee;

  return (
    <section className="overflow-hidden border-y border-cream/10 bg-ink py-10 md:py-14" aria-hidden>
      <div className="flex w-max animate-marquee whitespace-nowrap will-change-transform">
        {[0, 1].map((k) => (
          <span key={k} className="flex items-center">
            {Array.from({ length: 4 }).map((_, i) => (
              <span key={i} className="font-display text-2xl italic text-cream/85 md:text-[2.4rem]">
                {phrase}
              </span>
            ))}
          </span>
        ))}
      </div>
    </section>
  );
}
