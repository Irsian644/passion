import type { Metadata } from "next";
import { ProductListing } from "@/components/collection/ProductListing";
import { newArrivals } from "@/lib/products";
import { JsonLd, breadcrumbSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "New Arrivals",
  description: "The newest pieces at Passion Dream — discover them here, then order on Instagram.",
  alternates: { canonical: "/new" },
};

export default function NewArrivalsPage() {
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
        products={newArrivals()}
      />
    </>
  );
}
