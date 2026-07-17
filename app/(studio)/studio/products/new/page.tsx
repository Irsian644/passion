import Link from "next/link";

import { ProductForm } from "@/components/studio/ProductForm";
import { requireAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function NewProductPage() {
  await requireAdmin();

  return (
    <main className="mx-auto max-w-[720px] px-5 py-10 sm:px-6 sm:py-14">
      <Link
        href="/studio"
        className="text-[13px] text-[#78716c] underline-offset-4 transition-colors hover:text-[#1c1917] hover:underline"
      >
        ← Produktet
      </Link>

      <h1 className="mt-4 font-playfair text-[28px] tracking-tight">
        Shto Produkt
      </h1>

      <div className="mt-8">
        <ProductForm />
      </div>
    </main>
  );
}
