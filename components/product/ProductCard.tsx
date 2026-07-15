"use client";

import Image from "next/image";
import Link from "next/link";
import { Instagram } from "lucide-react";
import { motion } from "framer-motion";
import type { Product } from "@/lib/products";
import { useLang } from "@/components/providers/LanguageProvider";
import { instagramOrderUrl } from "@/lib/site";

export function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  const { lx, t } = useLang();
  const name = lx(product.name);
  const href = `/products/${product.slug}`;

  return (
    <motion.article
      className="group relative flex flex-col"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[2px] bg-ivory">
        {/* Whole image is a link to the showcase page (stretched via ::after) */}
        <Link href={href} aria-label={name} className="group/link absolute inset-0 z-10">
          <Image
            src={product.image}
            alt={`${name} — ${lx(product.tagline)}`}
            fill
            priority={priority}
            sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 22vw"
            className="object-cover transition-transform duration-[1200ms] ease-luxe group-hover:scale-[1.06]"
          />
          <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/50 via-transparent to-transparent opacity-0 transition-opacity duration-700 group-hover:opacity-100" />
        </Link>

        {product.badge ? (
          <span className="pointer-events-none absolute left-3 top-3 z-20 rounded-full bg-cream/85 px-3 py-[5px] text-[9.5px] font-medium uppercase tracking-luxe text-gold-deep backdrop-blur-md">
            {lx(product.badge)}
          </span>
        ) : null}

        {/* Order via Instagram — sibling of the link, not nested */}
        <div className="absolute inset-x-3 bottom-3 z-20 translate-y-0 opacity-100 transition-all duration-[600ms] ease-luxe md:translate-y-3 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100">
          <a
            href={instagramOrderUrl(name)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center justify-center gap-2 rounded-full bg-cream/95 py-3 text-[11px] font-medium uppercase tracking-wide2 text-ink backdrop-blur-md transition-colors duration-300 hover:bg-ink hover:text-cream"
          >
            <Instagram className="h-3.5 w-3.5" /> {t.product.orderCta}
          </a>
        </div>
      </div>

      <div className="mt-5">
        <h3 className="font-serif text-[19px] leading-snug text-ink">
          <Link href={href} className="link-underline">
            {name}
          </Link>
        </h3>
        <p className="mt-1.5 text-[13px] leading-relaxed tracking-wide text-stone line-clamp-1">{lx(product.tagline)}</p>
      </div>
    </motion.article>
  );
}
