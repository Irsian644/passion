import { Hero } from "@/components/sections/Hero";
import { Collections } from "@/components/sections/Collections";
import { BestSellers } from "@/components/sections/BestSellers";
import { BrandStory } from "@/components/sections/BrandStory";
import { Trust } from "@/components/sections/Trust";
import { Marquee } from "@/components/sections/Marquee";
import { InstagramGallery } from "@/components/sections/InstagramGallery";
import { Newsletter } from "@/components/sections/Newsletter";
import { JsonLd, organizationSchema, websiteSchema } from "@/lib/schema";

export default function HomePage() {
  return (
    <>
      <JsonLd data={[organizationSchema(), websiteSchema()]} />
      <Hero />
      <Collections />
      <BestSellers />
      <BrandStory />
      <Marquee />
      <Trust />
      <InstagramGallery />
      <Newsletter />
    </>
  );
}
