import { Hero } from "@/components/sections/Hero";
import { Collections } from "@/components/sections/Collections";
import { BestSellers } from "@/components/sections/BestSellers";
import { BrandStory } from "@/components/sections/BrandStory";
import { Trust } from "@/components/sections/Trust";
import { Marquee } from "@/components/sections/Marquee";
import { InstagramGallery } from "@/components/sections/InstagramGallery";
import { Newsletter } from "@/components/sections/Newsletter";
import { JsonLd, organizationSchema, websiteSchema } from "@/lib/schema";
import { getBestSellers } from "@/lib/queries";
import { toLegacyProduct } from "@/lib/product-mapper";

export const revalidate = 3600;

export default async function HomePage() {
  const bestSellers = (await getBestSellers()).slice(0, 4).map(toLegacyProduct);

  return (
    <>
      <JsonLd data={[organizationSchema(), websiteSchema()]} />
      <Hero />
      <Collections />
      <BestSellers items={bestSellers} />
      <BrandStory />
      <Marquee />
      <Trust />
      <InstagramGallery />
      <Newsletter />
    </>
  );
}
