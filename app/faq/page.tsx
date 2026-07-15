import type { Metadata } from "next";
import { ContentPage } from "@/components/ui/ContentPage";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Answers about materials, care, shipping and packaging at Passion Dream.",
  alternates: { canonical: "/faq" },
};

export default function FaqPage() {
  return (
    <ContentPage
      title={{ sq: "Pyetje të shpeshta", en: "Frequently asked questions" }}
      blocks={[
        {
          heading: { sq: "A janë bizhuteritë hipoalergjike?", en: "Are the pieces hypoallergenic?" },
          body: {
            sq: "Shumica e pjesëve tona janë të veshura me ar mbi tunxh dhe të përshtatshme për përdorim të përditshëm. Për lëkurë shumë të ndjeshme, na shkruaj për këshilla.",
            en: "Most of our pieces are gold-plated over brass and suitable for everyday wear. For very sensitive skin, message us for guidance.",
          },
        },
        {
          heading: { sq: "Si t'i ruaj bizhuteritë?", en: "How do I care for my jewelry?" },
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
      ]}
    />
  );
}
