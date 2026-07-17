import type { Metadata } from "next";
import { ContentPage } from "@/components/ui/ContentPage";

export const metadata: Metadata = {
  title: "Packaging & Delivery",
  description: "Every Passion Dream order is hand-wrapped in signature packaging. Delivery is arranged personally on Instagram.",
  alternates: { canonical: "/shipping" },
};

export default function ShippingPage() {
  return (
    <ContentPage
      title={{ sq: "Paketim & Dërgesë", en: "Packaging & Delivery" }}
      blocks={[
        {
          heading: { sq: "Paketimi ynë", en: "Our packaging" },
          body: {
            sq: "Çdo porosi kontrollohet dhe paketohet me dorë në paketimin tonë të veçantë — e menduar që momenti i hapjes të jetë si të marrësh një dhuratë.",
            en: "Every order is checked and hand-wrapped in our signature packaging — considered so that opening it feels like receiving a gift.",
          },
        },
        {
          heading: { sq: "Si të porositësh", en: "How to order" },
          body: {
            sq: "Porositë bëhen përmes mesazhit në Instagram. Na shkruaj për pjesën që të pëlqen dhe të udhëzojmë hap pas hapi.",
            en: "Orders are placed by message on Instagram. Write to us about the piece you love and we'll guide you step by step.",
          },
        },
        {
          heading: { sq: "Detajet e dërgesës", en: "Delivery details" },
          body: {
            sq: "Mënyrat dhe kohët e dërgesës i rregullojmë personalisht me ty në Instagram, sipas vendndodhjes.",
            en: "Delivery methods and timing are arranged personally with you on Instagram, based on your location.",
          },
        },
      ]}
    />
  );
}
