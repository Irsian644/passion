import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Menaxho Produktet",
  // The dashboard must never appear in search results.
  robots: { index: false, follow: false, nocache: true },
};

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="min-h-screen bg-[#faf9f7] text-[#1c1917]">{children}</div>;
}
