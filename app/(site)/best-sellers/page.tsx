import type { Metadata } from "next";
import { ProductListing } from "@/components/collection/ProductListing";
import { getBestSellers } from "@/lib/queries";
import { toLegacyProduct } from "@/lib/product-mapper";
import { JsonLd, breadcrumbSchema, itemListSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Më të Shiturat — bizhuteri të preferuara",
  description:
    "Bizhuteritë më të shitura të Passion Dream — gjerdanë, vathë dhe byzylykë me perla, të punuar me dorë në Shqipëri. Porosit në Instagram.",
  alternates: { canonical: "/best-sellers" },
};

// Rebuilt on demand; revalidated instantly when the client saves a product.
export const revalidate = 3600;

export default async function BestSellersPage() {
  const products = (await getBestSellers()).map(toLegacyProduct);

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Kryefaqja", url: "/" },
            { name: "Më të Shiturat", url: "/best-sellers" },
          ]),
          itemListSchema(
            products.map((p) => ({
              name: p.name.sq || p.name.en,
              url: `/products/${p.slug}`,
            })),
            "Më të Shiturat",
          ),
        ]}
      />
      <ProductListing
        title={{ sq: "Më të Shiturat", en: "Best Sellers" }}
        eyebrow={{ sq: "Më të dashurat", en: "Most loved" }}
        lede={{
          sq: "Pjesët që klientet tona i kthehen gjithmonë. Zbuloji këtu dhe porosit me një DM.",
          en: "The pieces our customers keep reaching for. Discover them here and order in a DM.",
        }}
        products={products}
      />
    </>
  );
}
