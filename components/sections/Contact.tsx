"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Instagram, MessageCircle, MapPin, Clock } from "lucide-react";
import { useLang } from "@/components/providers/LanguageProvider";
import { InstagramCTA } from "@/components/ui/InstagramCTA";
import { Reveal } from "@/components/ui/Reveal";
import { SITE, instagramUrl } from "@/lib/site";

const EASE = [0.22, 1, 0.36, 1] as const;

export function Contact() {
  const { t, lx } = useLang();

  const methods = [
    { icon: Instagram, label: t.contact.instagram, value: SITE.handle, href: instagramUrl(), highlight: true },
    { icon: MessageCircle, label: t.contact.messenger, value: t.contact.messengerValue, href: instagramUrl() },
    { icon: MapPin, label: t.contact.location, value: `${SITE.city}, Shqipëri`, href: undefined },
    { icon: Clock, label: t.contact.hoursLabel, value: lx(SITE.hours), href: undefined },
  ];

  return (
    <div className="pb-8">
      {/* Hero band */}
      <section className="relative flex min-h-[52vh] items-center overflow-hidden bg-ink">
        <Image src="/products/clover-necklace.jpg" alt="" fill priority sizes="100vw" className="object-cover opacity-40" />
        <div className="grain absolute inset-0" aria-hidden />
        <div className="container-luxe relative z-10 py-20 text-center">
          <Reveal>
            <p className="eyebrow justify-center mb-6 text-gold-light before:bg-gold-light/40">{t.contact.eyebrow}</p>
            <h1 className="mx-auto max-w-3xl font-display text-[clamp(2.6rem,7vw,5rem)] leading-[1] text-cream text-balance">
              {t.contact.title}
            </h1>
            <p className="mx-auto mt-6 max-w-md text-[15px] leading-relaxed text-cream/75">{t.contact.lede}</p>
            <div className="mt-9 flex justify-center">
              <InstagramCTA label={t.contact.primaryCta} order variant="light" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Contact methods */}
      <section className="container-luxe py-20 md:py-28">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {methods.map((m, i) => {
            const Icon = m.icon;
            const inner = (
              <>
                <span
                  className={`grid h-12 w-12 shrink-0 place-items-center rounded-full transition-colors duration-500 ${
                    m.highlight ? "bg-gold text-cream" : "bg-gold/12 text-gold-deep group-hover:bg-gold group-hover:text-cream"
                  }`}
                >
                  <Icon className="h-5 w-5" strokeWidth={1.5} />
                </span>
                <div>
                  <p className="text-[11px] uppercase tracking-wide2 text-stone">{m.label}</p>
                  <p className="mt-1 font-serif text-xl text-ink">{m.value}</p>
                </div>
              </>
            );
            return (
              <motion.div
                key={m.label}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.7, ease: EASE, delay: (i % 3) * 0.08 }}
              >
                {m.href ? (
                  <a
                    href={m.href}
                    target={m.href.startsWith("http") ? "_blank" : undefined}
                    rel={m.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className={`group flex h-full items-center gap-5 rounded-[2px] p-7 shadow-soft transition-shadow duration-500 hover:shadow-lift ${
                      m.highlight ? "bg-ink text-cream" : "bg-cream"
                    }`}
                  >
                    {m.highlight ? (
                      <>
                        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-gold text-cream">
                          <Icon className="h-5 w-5" strokeWidth={1.5} />
                        </span>
                        <div>
                          <p className="text-[11px] uppercase tracking-wide2 text-cream/60">{m.label}</p>
                          <p className="mt-1 font-serif text-xl text-cream">{m.value}</p>
                        </div>
                      </>
                    ) : (
                      inner
                    )}
                  </a>
                ) : (
                  <div className="flex h-full items-center gap-5 rounded-[2px] bg-cream p-7 shadow-soft">{inner}</div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Instagram profile embed-style card */}
        <Reveal>
          <div className="mt-8 overflow-hidden rounded-[3px] border border-ink/[0.08] bg-cream">
            <div className="grid grid-cols-1 md:grid-cols-[1.2fr_1fr]">
              <div className="flex flex-col justify-center p-9 md:p-12">
                <div className="flex items-center gap-4">
                  <span className="relative grid h-16 w-16 place-items-center rounded-full bg-gradient-to-tr from-gold via-rose to-gold-light p-[2px]">
                    <span className="relative h-full w-full overflow-hidden rounded-full border-2 border-cream">
                      <Image src="/brand/logo.png" alt="Passion Dream" fill sizes="64px" className="object-cover" />
                    </span>
                  </span>
                  <div>
                    <p className="font-serif text-2xl text-ink">{SITE.handle}</p>
                    <p className="text-[13px] tracking-wide2 text-stone">{SITE.city}, Shqipëri</p>
                  </div>
                </div>
                <p className="mt-6 max-w-sm text-[15px] leading-relaxed text-stone">{lx(SITE.tagline)}</p>
                <div className="mt-7">
                  <InstagramCTA label={t.contact.primaryCta} order />
                </div>
              </div>
              <div className="relative grid grid-cols-2 gap-1 p-1 md:p-1.5">
                {["/products/cherry-drop-earrings.jpg", "/products/sea-cuff-bracelets.jpg", "/products/starfish-pearl-necklace.jpg", "/products/pearl-bow-earrings.jpg"].map(
                  (src) => (
                    <a key={src} href={instagramUrl()} target="_blank" rel="noopener noreferrer" className="group relative aspect-square overflow-hidden">
                      <Image src={src} alt="Passion Dream on Instagram" fill sizes="200px" className="object-cover transition-transform duration-700 group-hover:scale-110" />
                    </a>
                  ),
                )}
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
