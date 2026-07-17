import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { LanguageProvider } from "@/components/providers/LanguageProvider";

/**
 * The public storefront shell.
 *
 * Scoped to the (site) route group so the dashboard does not inherit the
 * marketing navbar, Instagram bar and footer.
 */
export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LanguageProvider>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-full focus:bg-ink focus:px-5 focus:py-2 focus:text-sm focus:text-cream"
      >
        Skip to content
      </a>
      <Navbar />
      <main id="main">{children}</main>
      <Footer />
    </LanguageProvider>
  );
}
