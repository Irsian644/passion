"use client";

import { ImageOff, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { deleteProduct } from "@/lib/studio-actions";
import { Button } from "@/components/studio/ui";
import type { DbProduct } from "@/lib/product-mapper";

/**
 * Confirms before deleting. Shows the product's name and image so the client
 * can see exactly what is about to go — never a bare "Are you sure?".
 */
export function DeleteDialog({
  product,
  onClose,
  onError,
}: {
  product: DbProduct;
  onClose: () => void;
  onError: (message: string) => void;
}) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const cancelRef = useRef<HTMLButtonElement>(null);

  const name = product.name.sq.trim() || product.name.en.trim() || "Pa emër";

  // Focus the safe action, and let Escape back out.
  useEffect(() => {
    cancelRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !pending) onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose, pending]);

  async function confirm() {
    setPending(true);
    const result = await deleteProduct(product.id);

    if (!result.ok) {
      onError(result.message ?? "Produkti nuk u fshi.");
      setPending(false);
      onClose();
      return;
    }

    onClose();
    router.refresh();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#1c1917]/40 p-5"
      onClick={(e) => {
        if (e.target === e.currentTarget && !pending) onClose();
      }}
    >
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="delete-title"
        className="w-full max-w-[380px] rounded-2xl bg-white p-6 shadow-xl"
      >
        <h2
          id="delete-title"
          className="font-playfair text-[20px] tracking-tight text-[#1c1917]"
        >
          Të fshihet ky produkt?
        </h2>

        <div className="mt-4 flex items-center gap-3 rounded-xl bg-[#fafaf9] p-3">
          <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-[#f5f5f4]">
            {product.images[0] ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={product.images[0]}
                alt=""
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="flex h-full w-full items-center justify-center text-[#d6d3d1]">
                <ImageOff size={15} aria-hidden />
              </span>
            )}
          </div>
          <p className="min-w-0 flex-1 truncate text-[14px] font-medium text-[#1c1917]">
            {name}
          </p>
        </div>

        <p className="mt-4 text-[13px] leading-[1.6] text-[#78716c]">
          Do të hiqet nga faqja menjëherë. Ky veprim nuk kthehet mbrapsht.
        </p>

        <div className="mt-6 flex gap-2">
          <Button
            ref={cancelRef}
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={pending}
            className="flex-1"
          >
            Anulo
          </Button>
          <Button
            type="button"
            variant="danger"
            onClick={confirm}
            disabled={pending}
            className="flex-1"
          >
            {pending ? (
              <>
                <Loader2 size={15} className="animate-spin" aria-hidden />
                Duke fshirë…
              </>
            ) : (
              "Fshi"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
