import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/components/providers/LanguageProvider";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SITE } from "@/lib/site";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-cormorant",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-playfair",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.domain),
  title: {
    default: "Passion Dream — Luxury Jewelry & Beauty, Made in Albania",
    template: "%s · Passion Dream",
  },
  description: SITE.tagline.en,
  keywords: [
    "Passion Dream",
    "Albanian jewelry",
    "pearl necklace",
    "handmade jewelry Albania",
    "bizhuteri",
    "gjerdanë perla",
    "beauty",
    "skincare",
  ],
  authors: [{ name: SITE.name }],
  alternates: {
    canonical: "/",
    languages: { sq: "/", en: "/?lang=en" },
  },
  openGraph: {
    type: "website",
    siteName: SITE.name,
    title: "Passion Dream — Luxury Jewelry & Beauty",
    description: SITE.tagline.en,
    url: SITE.domain,
    images: [{ url: "/products/clover-necklace.jpg", width: 1200, height: 1200, alt: "Passion Dream jewelry" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Passion Dream — Luxury Jewelry & Beauty",
    description: SITE.tagline.en,
    images: ["/products/clover-necklace.jpg"],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#FAF8F5",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="sq" className={`${cormorant.variable} ${playfair.variable} ${inter.variable}`}>
      <body className="font-sans antialiased">
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
      </body>
    </html>
  );
}
