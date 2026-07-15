"use client";

import Link from "next/link";
import { useLang } from "@/components/providers/LanguageProvider";
import { getCollection, productsInCollection, type CollectionSlug } from "@/lib/products";
import { ProductCard } from "@/components/product/ProductCard";
import { InstagramBand } from "@/components/ui/InstagramBand";
import { Reveal } from "@/components/ui/Reveal";

export function CollectionView({ slug }: { slug: CollectionSlug }) {
  const { t, lx } = useLang();
  const collection = getCollection(slug);
  const items = productsInCollection(slug);
  if (!collection) return null;

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
              <span className="text-ink">{lx(collection.name)}</span>
            </nav>
            <p className="eyebrow mb-6">{lx(collection.tagline)}</p>
            <h1 className="max-w-3xl font-display text-[clamp(2.8rem,7vw,5.25rem)] font-normal leading-[0.98] text-ink">
              {lx(collection.name)}
            </h1>
            <p className="mt-7 max-w-xl text-[16.5px] leading-[1.75] text-stone">{lx(collection.description)}</p>
          </Reveal>
        </div>
      </header>

      <div className="container-luxe pt-16 md:pt-20">
        <div className="grid grid-cols-2 gap-x-4 gap-y-12 md:gap-x-6 lg:grid-cols-4">
          {items.map((p, i) => (
            <ProductCard key={p.slug} product={p} priority={i < 4} />
          ))}
        </div>

        <div className="mt-24 md:mt-28">
          <InstagramBand
            title={t.collections.seeOnInstagram}
            primaryLabel={t.instagram.cta}
            secondaryLabel={t.best.order}
            image={collection.image}
          />
        </div>
      </div>
    </div>
  );
}
