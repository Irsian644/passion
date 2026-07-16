import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductView } from "@/components/product/ProductView";
import { getCollection, localize } from "@/lib/products";
import { getProductBySlug, getPublishedProducts, getRelatedProducts } from "@/lib/queries";
import { toLegacyProduct } from "@/lib/product-mapper";
import { JsonLd, productSchema, breadcrumbSchema } from "@/lib/schema";

export const revalidate = 3600;

/** Pre-render the products that exist at build time; anything added later is
 *  rendered on first request and then cached. */
export async function generateStaticParams() {
  const products = await getPublishedProducts();
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const dbProduct = await getProductBySlug(slug);
  if (!dbProduct) return {};
  const product = toLegacyProduct(dbProduct);

  // Metadata is language-neutral, so prefer English but fall back to Albanian
  // when the client only filled one language — otherwise the tag is empty.
  const name = localize(product.name, "en");
  const description = localize(product.description, "en");

  return {
    title: name,
    description,
    alternates: { canonical: `/products/${slug}` },
    openGraph: {
      type: "website",
      title: `${name} · Passion Dream`,
      description,
      images: [{ url: product.image, width: 1200, height: 1500, alt: name }],
    },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const dbProduct = await getProductBySlug(slug);
  if (!dbProduct) notFound();

  const product = toLegacyProduct(dbProduct);
  const related = (await getRelatedProducts(dbProduct)).map(toLegacyProduct);
  const collection = getCollection(product.primaryCollection);
  const name = localize(product.name, "en");
  const description = localize(product.description, "en");

  return (
    <>
      <JsonLd
        data={[
          productSchema(product, name, description),
          breadcrumbSchema([
            { name: "Home", url: "/" },
            ...(collection ? [{ name: collection.name.en, url: `/collections/${collection.slug}` }] : []),
            { name, url: `/products/${slug}` },
          ]),
        ]}
      />
      <ProductView product={product} related={related} />
    </>
  );
}
