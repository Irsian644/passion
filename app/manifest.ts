import type { MetadataRoute } from "next";

import { SITE } from "@/lib/site";

/**
 * Web app manifest.
 *
 * Served at /manifest.webmanifest and linked automatically by Next.js. Gives
 * the site an installable identity and supplies the branding signals (name,
 * icons, theme colour) that browsers and search surfaces read.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${SITE.name} — Bizhuteri & Bukuri`,
    short_name: SITE.name,
    description: SITE.tagline.sq,
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#faf9f7",
    theme_color: "#1c1917",
    lang: "sq",
    dir: "ltr",
    categories: ["shopping", "lifestyle"],
    icons: [
      {
        src: "/brand/logo.png",
        sizes: "227x208",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
