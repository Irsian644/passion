import Link from "next/link";

/**
 * Wordmark logo. The Instagram badge logo is raster + dark-cropped, so we
 * render a refined typographic wordmark for the site chrome (crisper, scalable,
 * theme-agnostic) and reserve the photographic logo for the About page.
 */
export function Logo({ className = "", onClick }: { className?: string; onClick?: () => void }) {
  return (
    <Link
      href="/"
      onClick={onClick}
      aria-label="Passion Dream — home"
      className={`group inline-flex flex-col items-start leading-none ${className}`}
    >
      <span className="font-display text-[26px] italic tracking-tight text-ink transition-colors duration-300 group-hover:text-gold-deep md:text-[30px]">
        Passion Dream
      </span>
      <span className="mt-1 text-[9px] font-medium uppercase tracking-luxe text-stone/80">
        Jewelry &amp; Beauty
      </span>
    </Link>
  );
}
