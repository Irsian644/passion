"use client";

import Image from "next/image";
import Link from "next/link";
import { Gift, Sparkles, HandHeart } from "lucide-react";
import { useLang } from "@/components/providers/LanguageProvider";
import { InstagramCTA } from "@/components/ui/InstagramCTA";
import { Reveal } from "@/components/ui/Reveal";

const PACKAGING = {
    sq: {
      title: "Paketimi ynë është pjesë e dhuratës",
      body: "Çdo pjesë vjen e mbështjellë me dorë në letër mëndafshi, e lidhur me fjongo dhe e vendosur në kutinë tonë të nënshkruar, me një shënim brenda. Nga ne te dera jote, gjithçka është menduar që momenti i hapjes të jetë i paharrueshëm.",
      points: ["Kuti të nënshkruara", "Letër mëndafshi & fjongo", "Shënim me dorë në çdo porosi"],
    },
    en: {
      title: "Our packaging is part of the gift",
      body: "Every piece arrives hand-wrapped in tissue, tied with ribbon and set in our signature box with a note inside. From us to your door, everything is considered so the moment you open it is unforgettable.",
      points: ["Signature gift boxes", "Tissue & ribbon", "A handwritten note in every order"],
    },
  } as const;

export function About() {
  const { t, lang } = useLang();
  const pk = PACKAGING[lang];

  return (
    <div>
      {/* Hero */}
      <section className="relative flex min-h-[70vh] items-center overflow-hidden bg-ink">
        <Image
          src="/products/clover-necklace.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-60"
        />
        <div className="grain absolute inset-0" aria-hidden />
        <div className="container-luxe relative z-10 py-24 text-center">
          <Reveal>
            <p className="eyebrow justify-center mb-6 text-gold-light before:bg-gold-light/40">{t.story.eyebrow}</p>
            <h1 className="mx-auto max-w-3xl font-display text-[clamp(2.6rem,7vw,5.5rem)] leading-[1] text-cream text-balance">
              {t.story.title}
            </h1>
          </Reveal>
        </div>
      </section>

      {/* Logo + story */}
      <section id="craft" className="container-luxe scroll-mt-28 py-24 md:py-32">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <Reveal>
            <div className="relative mx-auto aspect-square w-full max-w-md overflow-hidden rounded-full bg-cream shadow-soft">
              <Image src="/brand/logo.png" alt="Passion Dream logo" fill sizes="480px" className="object-cover" />
            </div>
          </Reveal>
          <div>
            <Reveal>
              <p className="text-[17px] leading-relaxed text-stone">{t.story.body1}</p>
            </Reveal>
            <Reveal delay={1}>
              <p className="mt-5 text-[17px] leading-relaxed text-stone">{t.story.body2}</p>
            </Reveal>
            <Reveal delay={2}>
              <p className="mt-8 font-display text-2xl italic text-gold-deep">{t.story.signature}</p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Packaging highlight */}
      <section id="packaging" className="scroll-mt-28 bg-ink py-24 text-cream md:py-32">
        <div className="container-luxe grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <Reveal>
            <p className="eyebrow mb-6 text-gold-light before:bg-gold-light/40">{t.footer.links.packaging}</p>
            <h2 className="font-display text-[clamp(2.2rem,5vw,3.6rem)] leading-[1.05] text-balance">{pk.title}</h2>
            <p className="mt-8 max-w-md text-[16px] leading-relaxed text-cream/75">{pk.body}</p>
            <ul className="mt-8 space-y-4">
              {pk.points.map((p, i) => {
                const Icon = [Gift, Sparkles, HandHeart][i] ?? Gift;
                return (
                  <li key={p} className="flex items-center gap-4">
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-gold/20 text-gold-light">
                      <Icon className="h-5 w-5" strokeWidth={1.4} />
                    </span>
                    <span className="text-[16px] text-cream/90">{p}</span>
                  </li>
                );
              })}
            </ul>
          </Reveal>
          <Reveal delay={1}>
            <div className="relative aspect-[4/5] overflow-hidden rounded-[3px]">
              <Image
                src="/products/cherry-drop-earrings.jpg"
                alt="Passion Dream signature gift packaging"
                fill
                sizes="(max-width: 1024px) 90vw, 45vw"
                className="object-cover"
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* CTA */}
      <section className="container-luxe py-24 text-center md:py-32">
        <Reveal>
          <h2 className="mx-auto max-w-2xl font-display text-[clamp(2rem,5vw,3.4rem)] leading-[1.05] text-ink text-balance">
            {t.hero.title}
          </h2>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link href="/collections/jewelry" className="btn-ghost">
              {t.hero.cta}
            </Link>
            <InstagramCTA label={t.product.messageUs} order />
          </div>
        </Reveal>
      </section>
    </div>
  );
}
