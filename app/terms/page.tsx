import type { Metadata } from "next";
import { ContentPage } from "@/components/ui/ContentPage";

export const metadata: Metadata = { title: "Terms", alternates: { canonical: "/terms" } };

export default function TermsPage() {
  return (
    <ContentPage
      title={{ sq: "Kushtet", en: "Terms" }}
      blocks={[
        {
          heading: { sq: "Përdorimi", en: "Use" },
          body: {
            sq: "Duke përdorur këtë faqe dhe duke bërë porosi, ti pranon kushtet tona të shitjes dhe dërgesës.",
            en: "By using this site and placing orders, you agree to our terms of sale and delivery.",
          },
        },
        {
          heading: { sq: "Çmimet", en: "Pricing" },
          body: {
            sq: "Çmimet janë në Lekë (L) dhe mund të ndryshojnë. Të gjitha porositë konfirmohen para dërgesës.",
            en: "Prices are in Albanian Lekë (L) and may change. All orders are confirmed before dispatch.",
          },
        },
      ]}
    />
  );
}
