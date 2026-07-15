"use client";

import Image from "next/image";
import { useLang } from "@/components/providers/LanguageProvider";
import { InstagramCTA } from "@/components/ui/InstagramCTA";
import { Reveal } from "@/components/ui/Reveal";
import { SITE } from "@/lib/site";

export function Newsletter() {
  const { t } = useLang();

  return (
    <section className="container-luxe pb-28 md:pb-40">
      <Reveal>
        <div className="relative isolate overflow-hidden rounded-[4px] bg-ink px-6 py-24 text-center md:px-16 md:py-32">
          {/* Editorial background image, deeply subdued */}
          <Image
            src="/products/starfish-pearl-necklace.jpg"
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, 1360px"
            className="-z-10 object-cover object-center opacity-[0.14]"
          />
          <div className="grain absolute inset-0 -z-10" aria-hidden />

          <div className="mx-auto max-w-xl">
            <p className="eyebrow justify-center mb-7 text-gold-light before:bg-gold-light/40">{SITE.handle}</p>
            <h2 className="font-display text-[clamp(2rem,4.5vw,3.4rem)] font-normal leading-[1.08] text-cream text-balance">
              {t.newsletter.title}
            </h2>
            <p className="mx-auto mt-6 max-w-md text-[15px] leading-[1.75] text-cream/65">{t.newsletter.lede}</p>
            <div className="mt-11 flex justify-center">
              <InstagramCTA label={t.newsletter.cta} variant="light" />
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
