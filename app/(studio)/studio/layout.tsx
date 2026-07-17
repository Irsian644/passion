import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Menaxho Produktet",
};

/** Chrome and the noindex directive live in app/(studio)/layout.tsx. */
export default function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
