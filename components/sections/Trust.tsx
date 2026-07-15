"use client";

import { motion } from "framer-motion";
import { BadgeCheck, Zap, Heart, Sparkles, ShieldCheck, Gift } from "lucide-react";
import { useLang } from "@/components/providers/LanguageProvider";
import { Reveal } from "@/components/ui/Reveal";

const EASE = [0.22, 1, 0.36, 1] as const;
const icons = [BadgeCheck, Zap, Heart, Sparkles, ShieldCheck, Gift];

export function Trust() {
  const { t } = useLang();

  return (
    <section className="bg-ivory py-28 md:py-40">
      <div className="container-luxe">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <p className="eyebrow justify-center mb-6">{t.trust.eyebrow}</p>
            <h2 className="font-display text-[clamp(2.4rem,5.5vw,4rem)] font-normal leading-[1.02] text-ink text-balance">
              {t.trust.title}
            </h2>
          </div>
        </Reveal>

        <div className="mx-auto mt-20 grid max-w-5xl grid-cols-1 gap-x-14 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {t.trust.items.map((item, i) => {
            const Icon = icons[i] ?? BadgeCheck;
            return (
              <motion.div
                key={item.t}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.9, ease: EASE, delay: (i % 3) * 0.09 }}
                className="group"
              >
                <span className="mb-5 inline-flex text-gold-deep transition-transform duration-500 ease-luxe group-hover:-translate-y-0.5">
                  <Icon className="h-[26px] w-[26px]" strokeWidth={1.25} />
                </span>
                <h3 className="font-serif text-[22px] leading-snug text-ink">{item.t}</h3>
                <p className="mt-2.5 max-w-[24ch] text-[14.5px] leading-[1.7] text-stone">{item.d}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
