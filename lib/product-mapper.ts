import type { MaybeLocalized } from "@/lib/localize";
import type { CollectionSlug } from "@/lib/products";
import type { ProductRow } from "@/lib/supabase/types";

/**
 * A product as the public site consumes it.
 *
 * Shaped like the old hardcoded `Product` so existing components keep working,
 * but every localized field is `MaybeLocalized` — either language may be empty,
 * because the admin types both by hand and may fill only one.
 */
export interface DbProduct {
  id: string;
  slug: string;
  name: MaybeLocalized;
  tagline: MaybeLocalized;
  description: MaybeLocalized;
  care: MaybeLocalized;
  materials: MaybeLocalized;
  images: string[];
  collections: CollectionSlug[];
  primaryCollection: CollectionSlug | null;
  bestSeller: boolean;
  newArrival: boolean;
  displayOrder: number;
}

/** Builds a public URL for an image stored in the product-images bucket. */
export function imageUrl(path: string): string {
  if (!path) return "";
  // Already absolute (legacy /public asset or full URL) — use as-is.
  if (path.startsWith("http") || path.startsWith("/")) return path;

  const base = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  return `${base}/storage/v1/object/public/product-images/${path}`;
}

export function toDbProduct(row: ProductRow): DbProduct {
  return {
    id: row.id,
    slug: row.slug,
    name: { sq: row.name_sq, en: row.name_en },
    tagline: { sq: row.tagline_sq, en: row.tagline_en },
    description: { sq: row.description_sq, en: row.description_en },
    care: { sq: row.care_sq, en: row.care_en },
    materials: { sq: row.materials_sq, en: row.materials_en },
    images: row.images.map(imageUrl).filter(Boolean),
    collections: row.collections as CollectionSlug[],
    primaryCollection: (row.primary_collection as CollectionSlug) ?? null,
    bestSeller: row.best_seller,
    newArrival: row.new_arrival,
    displayOrder: row.display_order,
  };
}
