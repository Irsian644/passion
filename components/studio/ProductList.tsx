"use client";

import { GripVertical, ImageOff, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useOptimistic, useRef, useState, useTransition } from "react";

import { reorderProducts, setPublished } from "@/lib/studio-actions";
import { DeleteDialog } from "@/components/studio/DeleteDialog";
import { Banner } from "@/components/studio/ui";
import type { DbProduct } from "@/lib/product-mapper";

/** Shows the Albanian name, falling back to English. */
function displayName(p: DbProduct): string {
  return p.name.sq.trim() || p.name.en.trim() || "Pa emër";
}

export function ProductList({ products }: { products: DbProduct[] }) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [toDelete, setToDelete] = useState<DbProduct | null>(null);

  // Order is optimistic so dragging feels instant; the server call follows.
  const [order, setOrder] = useState(products);
  useEffect(() => setOrder(products), [products]);

  const [optimisticOrder, applyOptimistic] = useOptimistic(
    order,
    (_current, next: DbProduct[]) => next,
  );

  const dragIndex = useRef<number | null>(null);

  function move(from: number, to: number) {
    if (from === to) return;
    const next = [...order];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);

    setOrder(next);
    startTransition(async () => {
      applyOptimistic(next);
      const result = await reorderProducts(next.map((p) => p.id));
      if (!result.ok) {
        setError(result.message ?? "Rendi nuk u ruajt.");
        router.refresh();
      }
    });
  }

  function togglePublished(product: DbProduct) {
    startTransition(async () => {
      const result = await setPublished(product.id, !product.published);
      if (!result.ok) setError(result.message ?? "Nuk u ndryshua.");
      router.refresh();
    });
  }

  if (products.length === 0) {
    return (
      <div className="rounded-xl border border-[#e7e5e4] bg-white px-6 py-16 text-center">
        <p className="font-playfair text-[19px] text-[#1c1917]">
          Ende asnjë produkt
        </p>
        <p className="mx-auto mt-2 max-w-[320px] text-[14px] leading-[1.6] text-[#78716c]">
          Shto produktin e parë dhe do të shfaqet në faqe sapo ta publikosh.
        </p>
      </div>
    );
  }

  return (
    <>
      {error ? (
        <div className="mb-4">
          <Banner tone="error">{error}</Banner>
        </div>
      ) : null}

      <ul className="space-y-2">
        {optimisticOrder.map((product, index) => (
          <li
            key={product.id}
            draggable
            onDragStart={() => (dragIndex.current = index)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              if (dragIndex.current !== null) move(dragIndex.current, index);
              dragIndex.current = null;
            }}
            className="group flex items-center gap-3 rounded-xl border border-[#e7e5e4] bg-white p-2.5 transition-colors hover:border-[#d6d3d1] sm:gap-4 sm:p-3"
          >
            <span
              aria-hidden
              className="hidden cursor-grab text-[#d6d3d1] transition-colors group-hover:text-[#a8a29e] active:cursor-grabbing sm:block"
            >
              <GripVertical size={17} />
            </span>

            <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-[#f5f5f4] sm:h-16 sm:w-16">
              {product.images[0] ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={product.images[0]}
                  alt=""
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              ) : (
                <span className="flex h-full w-full items-center justify-center text-[#d6d3d1]">
                  <ImageOff size={17} aria-hidden />
                </span>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-[14px] font-medium text-[#1c1917]">
                {displayName(product)}
              </p>
              <p className="mt-0.5 text-[12px] text-[#a8a29e]">
                {product.published ? "Në faqe" : "E fshehur"}
                {product.bestSeller ? " · Më e shitur" : ""}
                {product.newArrival ? " · E re" : ""}
              </p>
            </div>

            {/* Reorder for touch/keyboard — dragging is mouse-only. */}
            <div className="flex shrink-0 flex-col sm:hidden">
              <button
                type="button"
                onClick={() => move(index, Math.max(0, index - 1))}
                disabled={index === 0}
                aria-label="Lëviz lart"
                className="px-2 py-0.5 text-[13px] text-[#a8a29e] disabled:opacity-30"
              >
                ↑
              </button>
              <button
                type="button"
                onClick={() =>
                  move(index, Math.min(optimisticOrder.length - 1, index + 1))
                }
                disabled={index === optimisticOrder.length - 1}
                aria-label="Lëviz poshtë"
                className="px-2 py-0.5 text-[13px] text-[#a8a29e] disabled:opacity-30"
              >
                ↓
              </button>
            </div>

            <div className="flex shrink-0 items-center gap-1">
              {/* "Hiq nga faqja" / "Shfaq në faqe" rather than "Fshih": the
                  latter sits one letter from "Fshi" (delete) and invites a
                  misclick on an irreversible action. */}
              <button
                type="button"
                onClick={() => togglePublished(product)}
                className="rounded-lg px-2.5 py-1.5 text-[12px] font-medium text-[#78716c] transition-colors hover:bg-[#f5f5f4] hover:text-[#1c1917]"
              >
                {product.published ? "Hiq nga faqja" : "Shfaq në faqe"}
              </button>

              <Link
                href={`/studio/products/${product.id}`}
                aria-label={`Ndrysho ${displayName(product)}`}
                className="rounded-lg p-2 text-[#78716c] transition-colors hover:bg-[#f5f5f4] hover:text-[#1c1917]"
              >
                <Pencil size={15} aria-hidden />
              </Link>

              {/* Separated and icon-only so deleting cannot be confused with
                  the neighbouring reversible action. */}
              <button
                type="button"
                onClick={() => setToDelete(product)}
                aria-label={`Fshi ${displayName(product)}`}
                title="Fshi produktin"
                className="ml-1 rounded-lg border-l border-[#f5f5f4] p-2 pl-3 text-[#a8a29e] transition-colors hover:bg-[#fef2f2] hover:text-[#b91c1c]"
              >
                <Trash2 size={15} aria-hidden />
              </button>
            </div>
          </li>
        ))}
      </ul>

      {toDelete ? (
        <DeleteDialog
          product={toDelete}
          onClose={() => setToDelete(null)}
          onError={setError}
        />
      ) : null}
    </>
  );
}
