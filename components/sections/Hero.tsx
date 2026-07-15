"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useLang } from "@/components/providers/LanguageProvider";
import { InstagramCTA } from "@/components/ui/InstagramCTA";

const EASE = [0.22, 1, 0.36, 1] as const;

export function Hero() {
  const { t } = useLang();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 140]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);
  const overlay = useTransform(scrollYProgress, [0, 1], [0.28, 0.5]);

  const words = t.hero.title.split(" ");

  return (
    <section ref={ref} className="relative h-[100svh] min-h-[640px] w-full overflow-hidden bg-ink">
      <motion.div style={{ y, scale }} className="absolute inset-0">
        <Image
          src="/products/clover-necklace.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
      </motion.div>

      {/* Single, editorial scrim — reads the image, keeps text legible bottom-left */}
      <motion.div
        style={{ opacity: overlay }}
        className="absolute inset-0 bg-gradient-to-tr from-ink/80 via-ink/25 to-transparent"
        aria-hidden
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/55 via-transparent to-ink/20" aria-hidden />
      <div className="grain absolute inset-0" aria-hidden />

      <div className="container-luxe relative z-10 flex h-full flex-col justify-end pb-28 md:justify-center md:pb-0">
        <div className="max-w-2xl">
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, ease: EASE, delay: 0.25 }}
            className="mb-7 flex items-center gap-3 text-[11px] font-medium uppercase tracking-luxe text-gold-light"
          >
            <span className="h-px w-8 bg-gold-light/50" />
            {t.hero.eyebrow}
          </motion.p>

          <h1 className="font-display text-[clamp(3rem,9vw,7rem)] font-normal leading-[0.95] text-cream">
            {words.map((word, i) => (
              <span key={i} className="mr-[0.25em] inline-block overflow-hidden pb-[0.08em] align-top">
                <motion.span
                  className="inline-block"
                  initial={{ y: "110%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 1.1, ease: EASE, delay: 0.35 + i * 0.12 }}
                >
                  {word}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, ease: EASE, delay: 0.8 }}
            className="mt-8 max-w-[30rem] text-[15px] leading-[1.75] text-cream/85"
          >
            {t.hero.lede}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, ease: EASE, delay: 0.95 }}
            className="mt-11 flex flex-wrap items-center gap-3"
          >
            <Link
              href="/collections/jewelry"
              className="btn-luxe bg-cream text-ink transition-[background-color,color,transform,box-shadow] duration-500 ease-luxe will-change-transform hover:-translate-y-[2px] hover:bg-gold-deep hover:text-cream hover:shadow-lift"
            >
              <span>{t.hero.cta}</span>
            </Link>
            <InstagramCTA label={t.hero.cta2} order variant="onDark" />
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 1 }}
        className="absolute bottom-8 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-3 md:flex"
      >
        <span className="text-[10px] uppercase tracking-luxe text-cream/60">{t.hero.scroll}</span>
        <span className="relative h-12 w-px overflow-hidden bg-cream/20">
          <motion.span
            className="absolute inset-x-0 top-0 h-4 bg-gold-light"
            animate={{ y: [-16, 48] }}
            transition={{ duration: 2, ease: "easeInOut", repeat: Infinity }}
          />
        </span>
      </motion.div>
    </section>
  );
}
