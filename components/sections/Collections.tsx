"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useLang } from "@/components/providers/LanguageProvider";
import { featuredCollections } from "@/lib/products";
import { Reveal } from "@/components/ui/Reveal";

const EASE = [0.22, 1, 0.36, 1] as const;

export function Collections() {
  const { t, lx } = useLang();
  const collections = featuredCollections();

  return (
    <section className="container-luxe py-28 md:py-40">
      <div className="mb-14 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
        <Reveal>
          <p className="eyebrow mb-6">{t.collections.eyebrow}</p>
          <h2 className="max-w-xl font-display text-[clamp(2.4rem,5.5vw,4rem)] font-normal leading-[1.02] text-ink text-balance">
            {t.collections.title}
          </h2>
        </Reveal>
        <Reveal delay={1}>
          <p className="max-w-xs text-[15px] leading-[1.75] text-stone md:pb-2">{t.collections.lede}</p>
        </Reveal>
      </div>

      {/* Editorial layout: two taller lead cards, two offset — magazine rhythm */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
        {collections.map((c, i) => {
          const tall = i === 0 || i === 3;
          const offset = i === 1 || i === 2;
          return (
            <motion.div
              key={c.slug}
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: "some" }}
              transition={{ duration: 1, ease: EASE, delay: i * 0.09 }}
              className={offset ? "md:mt-12" : ""}
            >
              <Link
                href={`/collections/${c.slug}`}
                className={`group relative block overflow-hidden rounded-[3px] bg-ivory ${
                  tall ? "aspect-[3/4]" : "aspect-[3/4] md:aspect-[3/3.4]"
                }`}
              >
                <Image
                  src={c.image}
                  alt={lx(c.name)}
                  fill
                  sizes="(max-width: 640px) 45vw, (max-width: 1024px) 45vw, 24vw"
                  className="object-cover transition-transform duration-[1600ms] ease-luxe group-hover:scale-[1.06]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/5 to-transparent transition-opacity duration-700 group-hover:from-ink/85" />

                <div className="absolute inset-x-0 bottom-0 p-5 md:p-6">
                  <p className="mb-1.5 text-[10px] uppercase tracking-luxe text-gold-light/90">{lx(c.tagline)}</p>
                  <div className="flex items-end justify-between gap-2">
                    <h3 className="font-display text-[22px] leading-none text-cream md:text-[27px]">{lx(c.name)}</h3>
                    <span className="grid h-9 w-9 shrink-0 translate-y-1.5 place-items-center rounded-full border border-cream/40 text-cream opacity-0 transition-all duration-500 ease-luxe group-hover:translate-y-0 group-hover:opacity-100">
                      <ArrowUpRight className="h-4 w-4" />
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
