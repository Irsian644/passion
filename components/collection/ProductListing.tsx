"use client";

import Link from "next/link";
import type { Product, Localized } from "@/lib/products";
import { useLang } from "@/components/providers/LanguageProvider";
import { ProductCard } from "@/components/product/ProductCard";
import { InstagramBand } from "@/components/ui/InstagramBand";
import { Reveal } from "@/components/ui/Reveal";

export function ProductListing({
  title,
  eyebrow,
  lede,
  products,
}: {
  title: Localized;
  eyebrow: Localized;
  lede: Localized;
  products: Product[];
}) {
  const { t, lx } = useLang();

  return (
    <div className="pb-8">
      <header className="border-b border-ink/[0.06] bg-ivory pb-20 pt-14 md:pb-24 md:pt-20">
        <div className="container-luxe">
          <Reveal>
            <nav className="mb-10 flex items-center gap-2 text-[11px] uppercase tracking-wide2 text-stone">
              <Link href="/" className="link-underline">
                {t.product.breadcrumbHome}
              </Link>
              <span className="text-mist">/</span>
              <span className="text-ink">{lx(title)}</span>
            </nav>
            <p className="eyebrow mb-6">{lx(eyebrow)}</p>
            <h1 className="max-w-3xl font-display text-[clamp(2.8rem,7vw,5.25rem)] font-normal leading-[0.98] text-ink">{lx(title)}</h1>
            <p className="mt-7 max-w-xl text-[16.5px] leading-[1.75] text-stone">{lx(lede)}</p>
          </Reveal>
        </div>
      </header>

      <div className="container-luxe pt-16 md:pt-20">
        <div className="grid grid-cols-2 gap-x-4 gap-y-14 md:gap-x-6 lg:grid-cols-4">
          {products.map((p, i) => (
            <ProductCard key={p.slug} product={p} priority={i < 4} />
          ))}
        </div>

        <div className="mt-24 md:mt-28">
          <InstagramBand
            title={t.collections.seeOnInstagram}
            primaryLabel={t.instagram.cta}
            secondaryLabel={t.best.order}
            image={products[0]?.image}
          />
        </div>
      </div>
    </div>
  );
}
