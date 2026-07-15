"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useLang } from "@/components/providers/LanguageProvider";
import { Reveal } from "@/components/ui/Reveal";

export function BrandStory() {
  const { t } = useLang();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);

  return (
    <section className="container-luxe py-28 md:py-40">
      <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-24">
        <div ref={ref} className="relative order-2 aspect-[4/5] overflow-hidden rounded-[3px] bg-ivory lg:order-1">
          <motion.div style={{ y }} className="absolute inset-[-8%]">
            <Image
              src="/products/starfish-pearl-necklace.jpg"
              alt="A Passion Dream starfish pearl necklace styled on rich red velvet"
              fill
              sizes="(max-width: 1024px) 90vw, 45vw"
              className="object-cover"
            />
          </motion.div>
        </div>

        <div className="order-1 lg:order-2 lg:pr-8">
          <Reveal>
            <p className="eyebrow mb-6">{t.story.eyebrow}</p>
            <h2 className="font-display text-[clamp(2.4rem,5vw,3.8rem)] font-normal leading-[1.05] text-ink text-balance">
              {t.story.title}
            </h2>
          </Reveal>
          <Reveal delay={1}>
            <p className="mt-9 max-w-[46ch] text-[16.5px] leading-[1.8] text-stone">{t.story.body1}</p>
          </Reveal>
          <Reveal delay={2}>
            <p className="mt-6 max-w-[46ch] text-[16.5px] leading-[1.8] text-stone">{t.story.body2}</p>
          </Reveal>
          <Reveal delay={3}>
            <p className="mt-10 font-display text-2xl italic text-gold-deep">{t.story.signature}</p>
            <Link href="/about" className="btn-ghost mt-10">
              {t.nav.story}
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
