import Link from "next/link";
import { notFound } from "next/navigation";

import { ProductForm } from "@/components/studio/ProductForm";
import { requireAdmin } from "@/lib/auth";
import { toDbProduct } from "@/lib/product-mapper";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;

  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (!data) notFound();

  const product = toDbProduct(data);
  const heading = product.name.sq.trim() || product.name.en.trim() || "Pa emër";

  return (
    <main className="mx-auto max-w-[720px] px-5 py-10 sm:px-6 sm:py-14">
      <Link
        href="/studio"
        className="text-[13px] text-[#78716c] underline-offset-4 transition-colors hover:text-[#1c1917] hover:underline"
      >
        ← Produktet
      </Link>

      <h1 className="mt-4 truncate font-playfair text-[28px] tracking-tight">
        {heading}
      </h1>

      <div className="mt-8">
        <ProductForm product={product} />
      </div>
    </main>
  );
}
