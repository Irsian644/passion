import { cache } from "react";

import { toDbProduct, type DbProduct } from "@/lib/product-mapper";
import type { CollectionSlug } from "@/lib/products";
import { createSupabasePublicClient } from "@/lib/supabase/server";

/**
 * Public product reads.
 *
 * Uses the anon client, so Row Level Security guarantees only published
 * products can ever come back — the `published` filter below is belt and
 * braces, not the actual boundary.
 *
 * `cache()` dedupes within a single render pass (a page that needs products
 * in three components makes one query, not three).
 */

export const getPublishedProducts = cache(async (): Promise<DbProduct[]> => {
  const supabase = createSupabasePublicClient();

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("published", true)
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: false });

  // Never throw on a read: a database blip should degrade the page, not 500 it.
  if (error || !data) return [];
  return data.map(toDbProduct);
});

export const getProductBySlug = cache(
  async (slug: string): Promise<DbProduct | null> => {
    const supabase = createSupabasePublicClient();

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("slug", slug)
      .eq("published", true)
      .maybeSingle();

    if (error || !data) return null;
    return toDbProduct(data);
  },
);

export const getProductsByCollection = cache(
  async (collection: CollectionSlug): Promise<DbProduct[]> => {
    const all = await getPublishedProducts();
    return all.filter((p) => p.collections.includes(collection));
  },
);

export const getBestSellers = cache(async (): Promise<DbProduct[]> => {
  const all = await getPublishedProducts();
  return all.filter((p) => p.bestSeller);
});

export const getNewArrivals = cache(async (): Promise<DbProduct[]> => {
  const all = await getPublishedProducts();
  return all.filter((p) => p.newArrival);
});

/** Related products: same primary collection, excluding the current one. */
export const getRelatedProducts = cache(
  async (product: DbProduct, limit = 4): Promise<DbProduct[]> => {
    const all = await getPublishedProducts();

    return all
      .filter(
        (p) =>
          p.id !== product.id &&
          (product.primaryCollection
            ? p.collections.includes(product.primaryCollection)
            : false),
      )
      .slice(0, limit);
  },
);
