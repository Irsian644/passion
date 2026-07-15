import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductView } from "@/components/product/ProductView";
import { getProduct, products, getCollection } from "@/lib/products";
import { JsonLd, productSchema, breadcrumbSchema } from "@/lib/schema";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return {};
  return {
    title: product.name.en,
    description: product.description.en,
    alternates: { canonical: `/products/${slug}` },
    openGraph: {
      type: "website",
      title: `${product.name.en} · Passion Dream`,
      description: product.description.en,
      images: [{ url: product.image, width: 1200, height: 1500, alt: product.name.en }],
    },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const collection = getCollection(product.primaryCollection);

  return (
    <>
      <JsonLd
        data={[
          productSchema(product, product.name.en, product.description.en),
          breadcrumbSchema([
            { name: "Home", url: "/" },
            ...(collection ? [{ name: collection.name.en, url: `/collections/${collection.slug}` }] : []),
            { name: product.name.en, url: `/products/${slug}` },
          ]),
        ]}
      />
      <ProductView product={product} />
    </>
  );
}
