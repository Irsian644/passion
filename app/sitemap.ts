import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";
import { collections } from "@/lib/products";
import { getPublishedProducts } from "@/lib/queries";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  // Only published products — never advertise a hidden or deleted URL.
  const products = await getPublishedProducts();
  const staticRoutes = ["", "/new", "/best-sellers", "/about", "/contact", "/shipping", "/faq", "/privacy", "/terms"].map((path) => ({
    url: `${SITE.domain}${path}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: path === "" ? 1 : 0.5,
  }));

  const collectionRoutes = collections.map((c) => ({
    url: `${SITE.domain}/collections/${c.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const productRoutes = products.map((p) => ({
    url: `${SITE.domain}/products/${p.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...collectionRoutes, ...productRoutes];
}
