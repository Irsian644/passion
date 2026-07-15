"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useLang } from "@/components/providers/LanguageProvider";
import { bestSellers } from "@/lib/products";
import { ProductCard } from "@/components/product/ProductCard";
import { Reveal } from "@/components/ui/Reveal";

export function BestSellers() {
  const { t } = useLang();
  const items = bestSellers().slice(0, 4);

  return (
    <section className="bg-ivory py-28 md:py-40">
      <div className="container-luxe">
        <div className="mb-14 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <Reveal>
            <p className="eyebrow mb-6">{t.best.eyebrow}</p>
            <h2 className="max-w-xl font-display text-[clamp(2.4rem,5.5vw,4rem)] font-normal leading-[1.02] text-ink text-balance">
              {t.best.title}
            </h2>
          </Reveal>
          <Reveal delay={1}>
            <Link
              href="/best-sellers"
              className="group inline-flex items-center gap-2 text-[12px] font-medium uppercase tracking-wide2 text-ink"
            >
              {t.nav.viewAll}
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </Reveal>
        </div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-12 md:gap-x-6 lg:grid-cols-4">
          {items.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
