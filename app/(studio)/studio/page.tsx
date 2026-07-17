import Link from "next/link";
import { Plus } from "lucide-react";

import { signOut } from "@/lib/studio-actions";
import { ProductList } from "@/components/studio/ProductList";
import { requireAdmin } from "@/lib/auth";
import { toDbProduct } from "@/lib/product-mapper";
import { createSupabaseServerClient } from "@/lib/supabase/server";

// Always read fresh: the admin must see their own edits immediately.
export const dynamic = "force-dynamic";

/** "5 produkte · 3 në faqe" — plain counts, correct Albanian plurals. */
function summary(products: { published: boolean }[]): string {
  if (products.length === 0) return "Ende asnjë produkt";

  const live = products.filter((p) => p.published).length;
  const total =
    products.length === 1 ? "1 produkt" : `${products.length} produkte`;

  return `${total} · ${live} në faqe`;
}

export default async function StudioPage() {
  const user = await requireAdmin();

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: false });

  const products = (data ?? []).map(toDbProduct);

  return (
    <main className="mx-auto max-w-[880px] px-5 py-10 sm:px-6 sm:py-14">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-playfair text-[28px] tracking-tight">Produktet</h1>
          <p className="mt-1 text-[14px] text-[#78716c]">{summary(products)}</p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/studio/settings"
            className="rounded-lg px-3 py-2 text-[13px] text-[#78716c] transition-colors hover:bg-[#f5f5f4] hover:text-[#1c1917]"
          >
            Cilësimet
          </Link>
          <form action={signOut}>
            <button
              type="submit"
              className="rounded-lg px-3 py-2 text-[13px] text-[#78716c] transition-colors hover:bg-[#f5f5f4] hover:text-[#1c1917]"
            >
              Dil
            </button>
          </form>
        </div>
      </header>

      <div className="mt-8">
        <Link
          href="/studio/products/new"
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-[#d6d3d1] bg-white px-4 py-3.5 text-[14px] font-medium text-[#44403c] transition-colors hover:border-[#1c1917] hover:text-[#1c1917] sm:w-auto sm:px-5"
        >
          <Plus size={16} aria-hidden />
          Shto Produkt
        </Link>
      </div>

      {error ? (
        <p className="mt-8 rounded-lg border border-[#fecaca] bg-[#fef2f2] px-4 py-3 text-[13px] text-[#991b1b]">
          Produktet nuk u ngarkuan. Rifresko faqen për të provuar përsëri.
        </p>
      ) : (
        <div className="mt-6">
          <ProductList products={products} />
        </div>
      )}

      <p className="mt-12 text-[12px] text-[#a8a29e]">
        I identifikuar si {user.email}
      </p>
    </main>
  );
}
