import type { Metadata } from "next";

import { ContentPage } from "@/components/ui/ContentPage";
import { JsonLd, breadcrumbSchema, faqSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Pyetje të shpeshta — kujdesi, porositë dhe paketimi",
  description:
    "Përgjigje për materialet, kujdesin ndaj bizhuterive, si të porositësh në Instagram dhe paketimin e Passion Dream — bizhuteri të punuara me dorë në Shqipëri.",
  alternates: { canonical: "/faq" },
};

/**
 * FAQ content defined once and used for BOTH the rendered page and the
 * FAQPage structured data. Google requires the markup to match visible
 * content; sharing one source makes drift impossible.
 */
const FAQS = [
  {
    heading: {
      sq: "A janë bizhuteritë hipoalergjike?",
      en: "Are the pieces hypoallergenic?",
    },
    body: {
      sq: "Shumica e pjesëve tona janë të veshura me ar mbi tunxh dhe të përshtatshme për përdorim të përditshëm. Për lëkurë shumë të ndjeshme, na shkruaj për këshilla.",
      en: "Most of our pieces are gold-plated over brass and suitable for everyday wear. For very sensitive skin, message us for guidance.",
    },
  },
  {
    heading: {
      sq: "Si t'i ruaj bizhuteritë?",
      en: "How do I care for my jewelry?",
    },
    body: {
      sq: "Ruaji thatë, larg parfumit dhe ujit, dhe fshiji me leckë të butë. Kështu shkëlqimi zgjat më shumë.",
      en: "Keep them dry, away from perfume and water, and wipe with a soft cloth. This keeps the shine lasting longer.",
    },
  },
  {
    heading: { sq: "Si mund të porosis?", en: "How do I order?" },
    body: {
      sq: "Porositë bëhen përmes mesazhit në Instagram te @passion_dream17. Na shkruaj për pjesën që të pëlqen dhe të ndihmojmë me kënaqësi.",
      en: "Orders are placed by message on Instagram at @passion_dream17. Write to us about the piece you love and we'll be glad to help.",
    },
  },
];

export default function FaqPage() {
  return (
    <>
      <JsonLd
        data={[
          faqSchema(
            FAQS.map((f) => ({ question: f.heading.sq, answer: f.body.sq })),
          ),
          breadcrumbSchema([
            { name: "Kryefaqja", url: "/" },
            { name: "Pyetje të shpeshta", url: "/faq" },
          ]),
        ]}
      />
      <ContentPage
        title={{ sq: "Pyetje të shpeshta", en: "Frequently asked questions" }}
        blocks={FAQS}
      />
    </>
  );
}
