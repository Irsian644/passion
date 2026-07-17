"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Gift, Truck, ShieldCheck } from "lucide-react";
import type { Product } from "@/lib/products";
import { getCollection } from "@/lib/products";
import { useLang } from "@/components/providers/LanguageProvider";
import { ProductCard } from "@/components/product/ProductCard";
import { InstagramCTA } from "@/components/ui/InstagramCTA";
import { Reveal } from "@/components/ui/Reveal";
import { SITE } from "@/lib/site";

const EASE = [0.22, 1, 0.36, 1] as const;

function Accordion({ title, children, open = false }: { title: string; children: React.ReactNode; open?: boolean }) {
  const [isOpen, setIsOpen] = useState(open);
  return (
    <div className="border-b border-ink/[0.09]">
      <button
        type="button"
        onClick={() => setIsOpen((o) => !o)}
        aria-expanded={isOpen}
        className="flex w-full items-center justify-between py-5 text-left"
      >
        <span className="text-[13px] font-medium uppercase tracking-wide2 text-ink">{title}</span>
        <ChevronDown className={`h-4 w-4 text-stone transition-transform duration-400 ${isOpen ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: EASE }}
            className="overflow-hidden"
          >
            <div className="pb-6 text-[15px] leading-relaxed text-stone">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/** `related` is resolved on the server and passed in. */
export function ProductView({
  product,
  related = [],
}: {
  product: Product;
  related?: Product[];
}) {
  const { t, lx } = useLang();
  const name = lx(product.name);
  const collection = getCollection(product.primaryCollection);
  const isSkincareOrBeauty = product.primaryCollection === "skincare" || product.primaryCollection === "beauty";

  return (
    <div className="pb-8">
      <div className="container-luxe pt-10 md:pt-14">
        {/* Breadcrumb */}
        <nav className="mb-8 flex items-center gap-2 text-[12px] uppercase tracking-wide2 text-stone">
          <Link href="/" className="link-underline">
            {t.product.breadcrumbHome}
          </Link>
          <span className="text-mist">/</span>
          {collection && (
            <>
              <Link href={`/collections/${collection.slug}`} className="link-underline">
                {lx(collection.name)}
              </Link>
              <span className="text-mist">/</span>
            </>
          )}
          <span className="truncate text-ink">{name}</span>
        </nav>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Editorial imagery */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.9, ease: EASE }}
              className="group relative aspect-[4/5] overflow-hidden rounded-[3px] bg-ivory"
            >
              <Image
                src={product.image}
                alt={`${name} — ${lx(product.tagline)}`}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover transition-transform duration-[1600ms] ease-luxe group-hover:scale-105"
              />
              {product.badge ? (
                <span className="absolute left-4 top-4 rounded-full bg-cream/90 px-4 py-1.5 text-[11px] font-medium uppercase tracking-wide2 text-gold-deep backdrop-blur-sm">
                  {lx(product.badge)}
                </span>
              ) : null}
            </motion.div>
          </div>

          {/* Storytelling */}
          <div className="lg:py-6">
            <Reveal>
              <p className="eyebrow mb-4">{lx(product.tagline)}</p>
              <h1 className="font-display text-[clamp(2.2rem,5vw,3.4rem)] leading-[1.05] text-ink">{name}</h1>

              <p className="mt-7 max-w-md text-[16px] leading-relaxed text-stone">{lx(product.description)}</p>

              {/* Primary order action */}
              <div className="mt-9">
                <InstagramCTA label={t.product.orderCta} order productName={name} className="w-full sm:w-auto" />
                <p className="mt-4 text-[13px] leading-relaxed text-stone">{t.product.deliveryNote}</p>
              </div>

              {/* Trust row */}
              <div className="mt-8 grid grid-cols-3 gap-3 rounded-[3px] bg-ivory p-5">
                {[
                  { icon: Gift, label: t.footer.links.packaging },
                  { icon: Truck, label: t.product.delivery },
                  { icon: ShieldCheck, label: t.trust.items[0].t },
                ].map(({ icon: Icon, label }, i) => (
                  <div key={i} className="flex flex-col items-center gap-2 text-center">
                    <Icon className="h-5 w-5 text-gold-deep" strokeWidth={1.4} />
                    <span className="text-[11px] leading-tight text-stone">{label}</span>
                  </div>
                ))}
              </div>

              {/* Accordions */}
              <div className="mt-8">
                <Accordion title={t.product.details} open>
                  <p>{lx(product.description)}</p>
                </Accordion>
                <Accordion title={isSkincareOrBeauty ? t.product.usage : t.product.materials}>
                  {isSkincareOrBeauty && product.usage ? lx(product.usage) : lx(product.materials)}
                </Accordion>
                <Accordion title={t.product.care}>{lx(product.care)}</Accordion>
                <Accordion title={t.product.delivery}>{t.product.deliveryNote}</Accordion>
              </div>
            </Reveal>
          </div>
        </div>
      </div>

      {/* Lifestyle / interested band */}
      <section className="relative mt-24 overflow-hidden bg-ink py-20 text-cream md:mt-32 md:py-28">
        <Image
          src={related[0]?.image ?? product.image}
          alt=""
          fill
          sizes="100vw"
          className="object-cover opacity-25"
        />
        <div className="grain absolute inset-0" aria-hidden />
        <div className="container-luxe relative z-10 mx-auto max-w-2xl text-center">
          <Reveal>
            <p className="eyebrow justify-center mb-7 text-gold-light before:bg-gold-light/40">{SITE.handle}</p>
            <h2 className="font-display text-[clamp(2.1rem,5vw,3.6rem)] font-normal leading-[1.04] text-balance">
              {t.product.interested}
            </h2>
            <p className="mx-auto mt-7 max-w-md text-[16px] leading-[1.75] text-cream/70">
              {t.product.interestedLede}
            </p>
            <div className="mt-10 flex justify-center">
              <InstagramCTA label={t.product.messageUs} order productName={name} variant="light" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Related */}
      {related.length > 0 && (
        <section className="container-luxe mt-28 md:mt-36">
          <Reveal>
            <h2 className="mb-14 max-w-xl font-display text-[clamp(1.9rem,4vw,2.9rem)] font-normal leading-[1.04] text-ink">
              {t.product.related}
            </h2>
          </Reveal>
          <div className="grid grid-cols-2 gap-x-4 gap-y-14 md:gap-x-6 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
