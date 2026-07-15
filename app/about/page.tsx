import type { Metadata } from "next";
import { About } from "@/components/sections/About";
import { JsonLd, breadcrumbSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Our Story",
  description:
    "Passion Dream is a small Albanian atelier crafting pearl and sea-charm jewelry, beauty and skincare — each order hand-wrapped in signature packaging.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: "/" },
          { name: "Our Story", url: "/about" },
        ])}
      />
      <About />
    </>
  );
}
