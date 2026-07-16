"use client";

import Link from "next/link";
import { Instagram, Mail } from "lucide-react";
import { useLang } from "@/components/providers/LanguageProvider";
import { SITE } from "@/lib/site";

export function Footer() {
  const { t, lang } = useLang();
  const year = new Date().getFullYear();

  const cols = [
    {
      title: t.footer.shop,
      links: [
        { href: "/collections/necklaces", label: t.nav.necklaces },
        { href: "/collections/earrings", label: t.nav.earrings },
        { href: "/collections/bracelets", label: t.nav.bracelets },
        { href: "/collections/skincare", label: t.nav.skincare },
        { href: "/collections/beauty", label: t.nav.beauty },
      ],
    },
    {
      title: t.footer.about,
      links: [
        { href: "/about", label: t.footer.links.ourStory },
        { href: "/about#packaging", label: t.footer.links.packaging },
        { href: "/about#craft", label: t.footer.links.sustainability },
      ],
    },
    {
      title: t.footer.help,
      links: [
        { href: "/shipping", label: t.footer.links.shipping },
        { href: "/faq", label: t.footer.links.faq },
        { href: "/contact", label: t.footer.links.contactUs },
      ],
    },
  ];

  return (
    <footer className="relative bg-ink text-cream">
      <div className="container-luxe grid grid-cols-1 gap-12 py-24 md:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1fr] lg:gap-16">
        <div className="max-w-sm">
          <p className="font-display text-[2rem] italic leading-none">Passion Dream</p>
          <p className="mt-5 text-[15px] leading-[1.75] text-cream/65">{SITE.tagline[lang]}</p>
          <div className="mt-7 flex items-center gap-4">
            <a
              href={SITE.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="grid h-11 w-11 place-items-center rounded-full border border-cream/20 transition-colors duration-300 hover:border-gold hover:text-gold"
            >
              <Instagram className="h-5 w-5" />
            </a>
            <a
              href={`mailto:${SITE.email}`}
              aria-label="Email"
              className="grid h-11 w-11 place-items-center rounded-full border border-cream/20 transition-colors duration-300 hover:border-gold hover:text-gold"
            >
              <Mail className="h-5 w-5" />
            </a>
          </div>
        </div>

        {cols.map((col) => (
          <nav key={col.title} aria-label={col.title}>
            <h3 className="text-[11px] font-medium uppercase tracking-luxe text-gold-soft">{col.title}</h3>
            <ul className="mt-5 space-y-3">
              {col.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-[15px] text-cream/70 transition-colors duration-300 hover:text-cream link-underline">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      <div className="border-t border-cream/10">
        <div className="container-luxe flex flex-col items-center justify-between gap-4 py-6 text-[12px] text-cream/50 sm:flex-row">
          <p>
            © {year} {SITE.name}. {t.footer.rights}
          </p>
          <p className="flex items-center gap-4">
            <Link href="/privacy" className="hover:text-cream">
              {t.footer.links.privacy}
            </Link>
            <Link href="/terms" className="hover:text-cream">
              {t.footer.links.terms}
            </Link>
            {/* The client's only way in. Deliberately quiet, and rel=nofollow
                so it is never followed into search results. */}
            <Link
              href="/studio"
              rel="nofollow"
              className="text-cream/35 transition-colors hover:text-cream"
            >
              {lang === "sq" ? "Menaxho Produktet" : "Manage Products"}
            </Link>
            <span className="text-gold-soft">{t.footer.made}</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
