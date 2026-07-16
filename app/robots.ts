import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    // The dashboard is not secret — it is protected by auth — but it has no
    // business in search results.
    rules: { userAgent: "*", allow: "/", disallow: "/studio" },
    sitemap: `${SITE.domain}/sitemap.xml`,
    host: SITE.domain,
  };
}
