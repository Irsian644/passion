import type { Metadata } from "next";
import { ProductListing } from "@/components/collection/ProductListing";
import { getNewArrivals } from "@/lib/queries";
import { toLegacyProduct } from "@/lib/product-mapper";
import { JsonLd, breadcrumbSchema, itemListSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Të Reja — bizhuteri të sapoardhura",
  description:
    "Pjesët më të reja të Passion Dream — bizhuteri me perla dhe sedef, të punuara me dorë në Shqipëri. Zbuloji dhe porosit në Instagram.",
  alternates: { canonical: "/new" },
};

// Rebuilt on demand; revalidated instantly when the client saves a product.
export const revalidate = 3600;

export default async function NewArrivalsPage() {
  const products = (await getNewArrivals()).map(toLegacyProduct);

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Kryefaqja", url: "/" },
            { name: "Të Reja", url: "/new" },
          ]),
          itemListSchema(
            products.map((p) => ({
              name: p.name.sq || p.name.en,
              url: `/products/${p.slug}`,
            })),
            "Të Reja",
          ),
        ]}
      />
      <ProductListing
        title={{ sq: "Të Reja", en: "New Arrivals" }}
        eyebrow={{ sq: "Sapo mbërritën", en: "Just landed" }}
        lede={{
          sq: "Pjesët tona më të fundit, të zgjedhura me kujdes. Shiko këtu dhe na shkruaj në Instagram për të porositur.",
          en: "Our latest pieces, carefully curated. Browse here and message us on Instagram to order.",
        }}
        products={products}
      />
    </>
  );
}
