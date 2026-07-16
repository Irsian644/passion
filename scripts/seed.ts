/**
 * One-time migration: moves the hardcoded products into Supabase.
 *
 *   npx tsx scripts/seed.ts          # dry run — reports, changes nothing
 *   npx tsx scripts/seed.ts --write  # uploads images and inserts rows
 *
 * Safe to re-run: products are matched by slug and skipped if present.
 * Reads real data from lib/products.ts and the real files in public/products.
 * Invents nothing.
 */

import { readFile } from "node:fs/promises";
import path from "node:path";

import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";

import { products as staticProducts } from "../lib/products";
import type { Database } from "../lib/supabase/types";

config({ path: ".env.local" });

const WRITE = process.argv.includes("--write");

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local",
  );
  process.exit(1);
}

// Service role: this runs from a terminal, with no user session, so it must
// bypass RLS. It never ships to the browser.
const supabase = createClient<Database>(url, serviceKey, {
  auth: { persistSession: false },
});

const CONTENT_TYPES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
};

/** Uploads public/products/x.jpg -> storage, returns the stored path. */
async function uploadImage(localPath: string): Promise<string | null> {
  const filename = path.basename(localPath);
  const ext = path.extname(filename).toLowerCase();
  const diskPath = path.join(process.cwd(), "public", "products", filename);

  let bytes: Buffer;
  try {
    bytes = await readFile(diskPath);
  } catch {
    console.warn(`  ! image not found on disk: ${filename}`);
    return null;
  }

  // Deterministic name keeps re-runs idempotent (upsert overwrites in place).
  const storagePath = `seed/${filename}`;

  if (!WRITE) return storagePath;

  const { error } = await supabase.storage
    .from("product-images")
    .upload(storagePath, bytes, {
      contentType: CONTENT_TYPES[ext] ?? "image/jpeg",
      upsert: true,
    });

  if (error) {
    console.warn(`  ! upload failed for ${filename}: ${error.message}`);
    return null;
  }
  return storagePath;
}

async function main() {
  console.log(
    WRITE
      ? "Seeding Supabase from lib/products.ts…\n"
      : "DRY RUN — nothing will be written. Re-run with --write to apply.\n",
  );

  const { data: existing, error: readError } = await supabase
    .from("products")
    .select("slug");

  if (readError) {
    console.error("Could not read products table:", readError.message);
    console.error("Has migration 0001_products.sql been run?");
    process.exit(1);
  }

  const existingSlugs = new Set((existing ?? []).map((r) => r.slug));
  let inserted = 0;
  let skipped = 0;

  for (const [index, product] of staticProducts.entries()) {
    if (existingSlugs.has(product.slug)) {
      console.log(`- skip   ${product.slug} (already in database)`);
      skipped++;
      continue;
    }

    const storagePath = await uploadImage(product.image);
    const images = storagePath ? [storagePath] : [];

    const row = {
      name_sq: product.name.sq,
      name_en: product.name.en,
      tagline_sq: product.tagline.sq,
      tagline_en: product.tagline.en,
      description_sq: product.description.sq,
      description_en: product.description.en,
      care_sq: product.care.sq,
      care_en: product.care.en,
      materials_sq: product.materials.sq,
      materials_en: product.materials.en,
      images,
      collections: [...product.collections],
      primary_collection: product.primaryCollection,
      best_seller: product.bestSeller ?? false,
      new_arrival: product.newArrival ?? false,
      // Preserve the existing running order.
      display_order: index,
      // Everything already live stays live.
      published: true,
      slug: product.slug,
    };

    if (!WRITE) {
      console.log(`- would insert ${product.slug} (${images.length} image)`);
      inserted++;
      continue;
    }

    const { error } = await supabase.from("products").insert(row);
    if (error) {
      console.error(`! FAILED ${product.slug}: ${error.message}`);
      continue;
    }

    console.log(`+ insert ${product.slug}`);
    inserted++;
  }

  console.log(
    `\n${WRITE ? "Done" : "Dry run complete"}: ${inserted} ${
      WRITE ? "inserted" : "to insert"
    }, ${skipped} skipped.`,
  );

  if (!WRITE) console.log("Run again with --write to apply.");
}

main().catch((err) => {
  console.error("Seed failed:", err instanceof Error ? err.message : err);
  process.exit(1);
});
