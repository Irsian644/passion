"use client";

import Image from "next/image";
import { InstagramCTA } from "@/components/ui/InstagramCTA";
import { Reveal } from "@/components/ui/Reveal";
import { SITE } from "@/lib/site";

/**
 * The recurring dark "continue on Instagram" call-to-action band.
 * Shared across collection, listing and product pages for a unified rhythm.
 */
export function InstagramBand({
  title,
  primaryLabel,
  secondaryLabel,
  image,
  className = "",
}: {
  title: string;
  primaryLabel: string;
  secondaryLabel?: string;
  image?: string;
  className?: string;
}) {

  return (
    <Reveal>
      <div
        className={`relative isolate flex flex-col items-center gap-7 overflow-hidden rounded-[4px] bg-ink px-6 py-20 text-center md:py-24 ${className}`}
      >
        {image && (
          <>
            <Image
              src={image}
              alt=""
              fill
              sizes="(max-width: 1024px) 100vw, 1200px"
              className="-z-10 object-cover opacity-[0.16]"
            />
            <div className="grain absolute inset-0 -z-10" aria-hidden />
          </>
        )}
        <p className="eyebrow justify-center text-gold-light before:bg-gold-light/40">{SITE.handle}</p>
        <h2 className="max-w-xl font-display text-[clamp(1.9rem,4vw,3.2rem)] font-normal leading-[1.06] text-cream text-balance">
          {title}
        </h2>
        <div className="mt-1 flex flex-wrap items-center justify-center gap-3">
          <InstagramCTA label={primaryLabel} variant="light" />
          {secondaryLabel && <InstagramCTA label={secondaryLabel} order variant="onDark" showIcon={false} />}
        </div>
      </div>
    </Reveal>
  );
}
