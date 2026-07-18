import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { AuthFragmentHandler } from "@/components/studio/AuthFragmentHandler";
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

/** Origin of the Supabase project, for preconnect. Empty when unset. */
const supabaseOrigin = (() => {
  try {
    return new URL(process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").origin;
  } catch {
    return "";
  }
})();

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="sq" className={`${cormorant.variable} ${playfair.variable} ${inter.variable}`}>
      <head>
        {/* Product images stream from Supabase Storage. Warming DNS + TLS here
            removes a full round-trip from the first image request. */}
        {supabaseOrigin ? (
          <>
            <link rel="preconnect" href={supabaseOrigin} crossOrigin="" />
            <link rel="dns-prefetch" href={supabaseOrigin} />
          </>
        ) : null}
      </head>
      <body className="font-sans antialiased">
        {/* Redeems a Supabase auth fragment (#access_token=…) if the email
            template dropped the client here instead of /auth/confirm. */}
        <AuthFragmentHandler />
        {/* The public chrome (navbar/footer) lives in app/(site)/layout.tsx;
            the dashboard has its own shell. This layout owns only <html>. */}
        {children}
      </body>
    </html>
  );
}
