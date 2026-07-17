import type { Metadata } from "next";
import { Contact } from "@/components/sections/Contact";
import { JsonLd, breadcrumbSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Message the Passion Dream atelier on Instagram — real people, real care. Find our Instagram, Messenger, phone, location and hours.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: "/" },
          { name: "Contact", url: "/contact" },
        ])}
      />
      <Contact />
    </>
  );
}
