"use client";

import Link from "next/link";
import { useLang } from "@/components/providers/LanguageProvider";
import { Reveal } from "@/components/ui/Reveal";
import type { Localized } from "@/lib/products";

export interface ContentBlock {
  heading: Localized;
  body: Localized;
}

export function ContentPage({ title, blocks }: { title: Localized; blocks: ContentBlock[] }) {
  const { t, lx } = useLang();
  return (
    <div className="pb-8">
      <header className="border-b border-ink/[0.07] bg-ivory pt-16 pb-16 md:pt-24">
        <div className="container-luxe">
          <Reveal>
            <nav className="mb-8 flex items-center gap-2 text-[12px] uppercase tracking-wide2 text-stone">
              <Link href="/" className="link-underline">
                {t.product.breadcrumbHome}
              </Link>
              <span className="text-mist">/</span>
              <span className="text-ink">{lx(title)}</span>
            </nav>
            <h1 className="font-display text-[clamp(2.6rem,7vw,5rem)] leading-[1] text-ink">{lx(title)}</h1>
          </Reveal>
        </div>
      </header>

      <div className="container-luxe max-w-3xl py-16">
        <div className="space-y-12">
          {blocks.map((b, i) => (
            <Reveal key={i} delay={i % 3}>
              <h2 className="font-serif text-2xl text-ink">{lx(b.heading)}</h2>
              <p className="mt-4 text-[16px] leading-relaxed text-stone text-pretty">{lx(b.body)}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  );
}
