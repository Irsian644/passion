"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Instagram, Play, ArrowUpRight } from "lucide-react";
import { useLang } from "@/components/providers/LanguageProvider";
import { SITE, instagramUrl } from "@/lib/site";
import { InstagramCTA } from "@/components/ui/InstagramCTA";
import { Reveal } from "@/components/ui/Reveal";

const EASE = [0.22, 1, 0.36, 1] as const;

const highlights = [
  { src: "/products/clover-necklace.jpg", label: { sq: "Të reja", en: "New" } },
  { src: "/products/cerave-spf50.jpg", label: { sq: "Lëkura", en: "Skin" } },
  { src: "/products/cherry-drop-earrings.jpg", label: { sq: "Vathë", en: "Earrings" } },
  { src: "/products/sea-cuff-bracelets.jpg", label: { sq: "Deti", en: "Sea" } },
  { src: "/products/ck-wax-stick.jpg", label: { sq: "Bukuri", en: "Beauty" } },
];

// Feed tiles — deliberately uneven heights for an editorial, non-grid rhythm.
const feed = [
  { src: "/products/cherry-choker.jpg", span: "row-span-2", reel: false },
  { src: "/products/pearl-bow-earrings.jpg", span: "", reel: false },
  { src: "/products/sea-cuff-bracelets.jpg", span: "", reel: true },
  { src: "/products/starfish-pearl-necklace.jpg", span: "row-span-2", reel: false },
  { src: "/products/starfish-pearl-earrings.jpg", span: "", reel: false },
  { src: "/products/clover-necklace.jpg", span: "", reel: true },
  { src: "/products/cerave-spf50.jpg", span: "", reel: false },
  { src: "/products/cherry-drop-earrings.jpg", span: "", reel: false },
];

export function InstagramGallery() {
  const { t, lx } = useLang();

  return (
    <section className="container-luxe py-28 md:py-40">
      {/* Header — editorial, asymmetric */}
      <div className="mb-16 grid grid-cols-1 gap-8 md:grid-cols-12 md:items-end">
        <Reveal className="md:col-span-8">
          <p className="eyebrow mb-6">{t.instagram.eyebrow}</p>
          <h2 className="max-w-2xl font-display text-[clamp(2.4rem,5.5vw,4rem)] font-normal leading-[1.02] text-ink text-balance">
            {t.instagram.title}
          </h2>
        </Reveal>
        <Reveal delay={1} className="md:col-span-4">
          <p className="max-w-sm text-[15px] leading-[1.75] text-stone">{t.instagram.lede}</p>
          <a
            href={instagramUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="group mt-5 inline-flex items-center gap-1.5 text-[13px] font-medium uppercase tracking-wide2 text-ink"
          >
            {SITE.handle}
            <ArrowUpRight className="h-4 w-4 text-gold-deep transition-transform duration-500 ease-luxe group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </Reveal>
      </div>

      {/* Stories highlights */}
      <div className="mb-12 flex gap-6 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {highlights.map((h, i) => (
          <motion.a
            key={i}
            href={instagramUrl()}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: "some" }}
            transition={{ duration: 0.7, ease: EASE, delay: i * 0.05 }}
            className="group flex shrink-0 flex-col items-center gap-2.5"
          >
            <span className="relative grid h-[76px] w-[76px] place-items-center rounded-full bg-[conic-gradient(from_140deg,#C6A87C,#D8A0A0,#E4D2B4,#C6A87C)] p-[2px] transition-transform duration-500 ease-luxe group-hover:scale-[1.04] md:h-[88px] md:w-[88px]">
              <span className="relative h-full w-full overflow-hidden rounded-full border-[3px] border-cream">
                <Image src={h.src} alt="" fill sizes="88px" className="object-cover transition-transform duration-[900ms] ease-luxe group-hover:scale-105" />
              </span>
            </span>
            <span className="text-[11px] uppercase tracking-wide2 text-stone transition-colors duration-300 group-hover:text-ink">
              {lx(h.label)}
            </span>
          </motion.a>
        ))}
      </div>

      {/* Feed grid */}
      <div className="grid auto-rows-[46vw] grid-cols-2 gap-2.5 sm:auto-rows-[220px] md:auto-rows-[240px] md:grid-cols-4 md:gap-3">
        {feed.map((shot, i) => (
          <motion.a
            key={i}
            href={instagramUrl()}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, scale: 0.985 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: "some" }}
            transition={{ duration: 0.9, ease: EASE, delay: (i % 4) * 0.07 }}
            className={`group relative overflow-hidden rounded-[3px] bg-ivory ${shot.span}`}
          >
            <Image
              src={shot.src}
              alt="Passion Dream on Instagram"
              fill
              sizes="(max-width: 768px) 45vw, 24vw"
              className="object-cover transition-transform duration-[1400ms] ease-luxe group-hover:scale-[1.07]"
            />
            {shot.reel && (
              <span className="absolute right-3 top-3 text-cream/90 drop-shadow">
                <Play className="h-4 w-4 fill-cream/90" />
              </span>
            )}
            <div className="absolute inset-0 flex items-center justify-center bg-ink/0 transition-colors duration-500 group-hover:bg-ink/35">
              <Instagram className="h-6 w-6 translate-y-1 text-cream opacity-0 transition-all duration-500 ease-luxe group-hover:translate-y-0 group-hover:opacity-100" />
            </div>
          </motion.a>
        ))}
      </div>

      {/* CTA */}
      <Reveal delay={1}>
        <div className="mt-16 flex flex-col items-center gap-6 text-center">
          <p className="max-w-md font-display text-[clamp(1.5rem,3vw,2rem)] italic leading-snug text-ink">
            {t.instagram.community}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <InstagramCTA label={t.instagram.cta} />
            <InstagramCTA label={t.instagram.order} order variant="ghost" showIcon={false} />
          </div>
        </div>
      </Reveal>
    </section>
  );
}
