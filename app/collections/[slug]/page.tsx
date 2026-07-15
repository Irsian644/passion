import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CollectionView } from "@/components/collection/CollectionView";
import { collections, getCollection, type CollectionSlug } from "@/lib/products";
import { JsonLd, breadcrumbSchema } from "@/lib/schema";

export function generateStaticParams() {
  return collections.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const collection = getCollection(slug);
  if (!collection) return {};
  return {
    title: collection.name.en,
    description: collection.description.en,
    alternates: { canonical: `/collections/${slug}` },
    openGraph: {
      title: `${collection.name.en} · Passion Dream`,
      description: collection.description.en,
      images: [{ url: collection.image, width: 1200, height: 1500 }],
    },
  };
}

export default async function CollectionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const collection = getCollection(slug);
  if (!collection) notFound();

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: "/" },
          { name: collection.name.en, url: `/collections/${slug}` },
        ])}
      />
      <CollectionView slug={slug as CollectionSlug} />
    </>
  );
}
