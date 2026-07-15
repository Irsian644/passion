import type { Metadata } from "next";
import { ProductListing } from "@/components/collection/ProductListing";
import { bestSellers } from "@/lib/products";
import { JsonLd, breadcrumbSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Best Sellers",
  description: "The most-loved pieces at Passion Dream — discover them here, then order on Instagram.",
  alternates: { canonical: "/best-sellers" },
};

export default function BestSellersPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: "/" },
          { name: "Best Sellers", url: "/best-sellers" },
        ])}
      />
      <ProductListing
        title={{ sq: "Më të Shiturat", en: "Best Sellers" }}
        eyebrow={{ sq: "Më të dashurat", en: "Most loved" }}
        lede={{
          sq: "Pjesët që klientet tona i kthehen gjithmonë. Zbuloji këtu dhe porosit me një DM.",
          en: "The pieces our customers keep reaching for. Discover them here and order in a DM.",
        }}
        products={bestSellers()}
      />
    </>
  );
}
