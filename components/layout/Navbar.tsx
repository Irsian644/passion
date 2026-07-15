"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, Instagram } from "lucide-react";
import { useLang } from "@/components/providers/LanguageProvider";
import { Logo } from "@/components/ui/Logo";
import { featuredCollections } from "@/lib/products";
import { SITE, instagramUrl } from "@/lib/site";

const EASE = [0.22, 1, 0.36, 1] as const;

export function Navbar() {
  const { t, lx, lang, toggle } = useLang();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const jewelryLinks = [
    { href: "/collections/necklaces", label: t.nav.necklaces },
    { href: "/collections/earrings", label: t.nav.earrings },
    { href: "/collections/bracelets", label: t.nav.bracelets },
    { href: "/collections/skincare", label: t.nav.skincare },
    { href: "/collections/beauty", label: t.nav.beauty },
    { href: "/collections/accessories", label: t.nav.accessories },
  ];

  const navLinks = [
    { href: "/new", label: t.nav.newArrivals },
    { href: "/best-sellers", label: t.nav.bestSellers },
    { href: "/about", label: t.nav.story },
    { href: "/contact", label: t.nav.contact },
  ];

  return (
    <>
      {/* Announcement bar */}
      <div className="relative z-[60] bg-ink text-cream">
        <div className="container-luxe flex items-center justify-center py-2.5">
          <p className="text-center text-[11px] font-light tracking-wide2 text-cream/90">{t.announce}</p>
        </div>
      </div>

      <header
        className={`sticky top-0 z-50 transition-all duration-500 ease-luxe ${
          scrolled ? "bg-cream/80 shadow-[0_1px_0_rgba(28,26,23,0.06)] backdrop-blur-xl" : "bg-transparent"
        }`}
        onMouseLeave={() => setMegaOpen(false)}
      >
        <div className="container-luxe flex items-center justify-between py-4">
          {/* Left: mobile menu + desktop nav */}
          <div className="flex flex-1 items-center gap-8">
            <button
              type="button"
              className="lg:hidden"
              aria-label="Open menu"
              onClick={() => setMobileOpen(true)}
            >
              <Menu className="h-6 w-6 text-ink" />
            </button>

            <nav className="hidden items-center gap-8 lg:flex" aria-label="Primary">
              <button
                type="button"
                className="link-underline text-[13px] font-medium uppercase tracking-wide2 text-ink"
                onMouseEnter={() => setMegaOpen(true)}
                onFocus={() => setMegaOpen(true)}
              >
                {t.nav.collections}
              </button>
              {navLinks.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="link-underline text-[13px] font-medium uppercase tracking-wide2 text-ink"
                  onMouseEnter={() => setMegaOpen(false)}
                >
                  {l.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Center: logo */}
          <div className="flex flex-1 justify-center">
            <Logo />
          </div>

          {/* Right: language + Instagram */}
          <div className="flex flex-1 items-center justify-end gap-5">
            <button
              type="button"
              onClick={toggle}
              className="hidden items-center gap-1 text-[12px] font-medium uppercase tracking-wide2 text-ink sm:inline-flex"
              aria-label="Toggle language"
            >
              <span className={lang === "sq" ? "text-gold-deep" : "text-mist"}>SQ</span>
              <span className="text-mist">/</span>
              <span className={lang === "en" ? "text-gold-deep" : "text-mist"}>EN</span>
            </button>
            <a
              href={instagramUrl()}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t.nav.instagram}
              className="group inline-flex items-center gap-2 rounded-full border border-ink/20 px-4 py-2 text-[12px] font-medium uppercase tracking-wide2 text-ink transition-colors duration-300 hover:border-ink/40 hover:bg-ink hover:text-cream"
            >
              <Instagram className="h-4 w-4 transition-transform duration-500 group-hover:rotate-[8deg]" />
              <span className="hidden sm:inline">{t.nav.instagram}</span>
            </a>
          </div>
        </div>

        {/* Mega menu */}
        <AnimatePresence>
          {megaOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35, ease: EASE }}
              className="absolute inset-x-0 top-full hidden border-t border-ink/[0.06] bg-cream/95 backdrop-blur-xl lg:block"
              onMouseEnter={() => setMegaOpen(true)}
            >
              <div className="container-luxe grid grid-cols-[1fr_1.4fr] gap-12 py-10">
                <div>
                  <p className="eyebrow mb-6">{t.nav.collections}</p>
                  <ul className="grid grid-cols-2 gap-x-8 gap-y-3">
                    {jewelryLinks.map((l) => (
                      <li key={l.href}>
                        <Link
                          href={l.href}
                          onClick={() => setMegaOpen(false)}
                          className="font-serif text-xl text-ink transition-colors hover:text-gold-deep"
                        >
                          {l.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {featuredCollections()
                    .slice(0, 2)
                    .map((c) => (
                      <Link
                        key={c.slug}
                        href={`/collections/${c.slug}`}
                        onClick={() => setMegaOpen(false)}
                        className="group relative aspect-[4/3] overflow-hidden rounded-[2px]"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={c.image}
                          alt={lx(c.name)}
                          className="h-full w-full object-cover transition-transform duration-700 ease-luxe group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-ink/50 to-transparent" />
                        <span className="absolute bottom-4 left-4 font-serif text-xl text-cream">{lx(c.name)}</span>
                      </Link>
                    ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-[70] bg-ink/40 backdrop-blur-sm lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              className="fixed inset-y-0 left-0 z-[80] flex w-[86%] max-w-sm flex-col bg-cream lg:hidden"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.5, ease: EASE }}
            >
              <div className="flex items-center justify-between border-b border-ink/[0.08] px-6 py-5">
                <Logo onClick={() => setMobileOpen(false)} />
                <button type="button" aria-label="Close menu" onClick={() => setMobileOpen(false)}>
                  <X className="h-6 w-6 text-ink" />
                </button>
              </div>
              <nav className="flex-1 overflow-y-auto px-6 py-8" aria-label="Mobile">
                <p className="eyebrow mb-4">{t.nav.collections}</p>
                <ul className="mb-8 space-y-3">
                  {jewelryLinks.map((l) => (
                    <li key={l.href}>
                      <Link
                        href={l.href}
                        onClick={() => setMobileOpen(false)}
                        className="font-serif text-xl text-ink"
                      >
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
                <ul className="space-y-3">
                  {navLinks.map((l) => (
                    <li key={l.href}>
                      <Link
                        href={l.href}
                        onClick={() => setMobileOpen(false)}
                        className="font-serif text-xl text-ink"
                      >
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
              <div className="border-t border-ink/[0.08] px-6 py-5">
                <a
                  href={instagramUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mb-5 flex items-center gap-2 font-serif text-xl text-gold-deep"
                >
                  <Instagram className="h-5 w-5" /> {SITE.handle}
                </a>
                <button
                  type="button"
                  onClick={toggle}
                  className="text-[13px] font-medium uppercase tracking-wide2 text-ink"
                >
                  <span className={lang === "sq" ? "text-gold-deep" : "text-mist"}>Shqip</span>
                  <span className="mx-2 text-mist">/</span>
                  <span className={lang === "en" ? "text-gold-deep" : "text-mist"}>English</span>
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
