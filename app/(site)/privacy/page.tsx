import type { Metadata } from "next";
import { ContentPage } from "@/components/ui/ContentPage";

export const metadata: Metadata = { title: "Privacy", alternates: { canonical: "/privacy" } };

export default function PrivacyPage() {
  return (
    <ContentPage
      title={{ sq: "Privatësia", en: "Privacy" }}
      blocks={[
        {
          heading: { sq: "Të dhënat e tua", en: "Your data" },
          body: {
            sq: "Ne mbledhim vetëm të dhënat e nevojshme për të përpunuar porosinë tënde dhe nuk i ndajmë kurrë me palë të treta për qëllime marketingu.",
            en: "We collect only the data needed to process your order and never share it with third parties for marketing.",
          },
        },
        {
          heading: { sq: "Email", en: "Email" },
          body: {
            sq: "Nëse bashkohesh me listën tonë, mund të çregjistrohesh në çdo kohë me një klik.",
            en: "If you join our list, you can unsubscribe at any time with one click.",
          },
        },
      ]}
    />
  );
}
