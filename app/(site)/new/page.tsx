import type { Metadata } from "next";
import { ProductListing } from "@/components/collection/ProductListing";
import { getNewArrivals } from "@/lib/queries";
import { toLegacyProduct } from "@/lib/product-mapper";
import { JsonLd, breadcrumbSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "New Arrivals",
  description: "The newest pieces at Passion Dream — discover them here, then order on Instagram.",
  alternates: { canonical: "/new" },
};

// Rebuilt on demand; revalidated instantly when the client saves a product.
export const revalidate = 3600;

export default async function NewArrivalsPage() {
  const products = (await getNewArrivals()).map(toLegacyProduct);

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: "/" },
          { name: "New Arrivals", url: "/new" },
        ])}
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
