"use client";

import Link from "next/link";
import { useActionState, useEffect, useRef, useState } from "react";

import {
  createProduct,
  updateProduct,
  type ActionResult,
} from "@/lib/studio-actions";
import { ImageUploader } from "@/components/studio/ImageUploader";
import {
  Banner,
  Field,
  Input,
  SubmitButton,
  Textarea,
  Toggle,
} from "@/components/studio/ui";
import { collections as allCollections } from "@/lib/products";
import type { DbProduct } from "@/lib/product-mapper";

/**
 * Bilingual product editor.
 *
 * Both languages are typed by hand — nothing is auto-translated. Either side
 * may be left blank; the public site shows whichever is filled.
 */
export function ProductForm({ product }: { product?: DbProduct }) {
  const isEdit = Boolean(product);
  const action = isEdit ? updateProduct : createProduct;

  const [state, formAction] = useActionState<ActionResult | null, FormData>(
    action,
    null,
  );

  const [images, setImages] = useState<string[]>(product?.imagePaths ?? []);
  const [dirty, setDirty] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  // Warn before losing unsaved edits.
  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  // A successful save means nothing is pending any more.
  useEffect(() => {
    if (state?.ok) setDirty(false);
  }, [state]);

  const err = (field: string) => state?.fieldErrors?.[field];

  return (
    <form
      ref={formRef}
      action={formAction}
      onChange={() => setDirty(true)}
      className="space-y-8"
    >
      {product ? <input type="hidden" name="id" value={product.id} /> : null}
      {images.map((path) => (
        <input key={path} type="hidden" name="images" value={path} />
      ))}

      {state?.message ? (
        <Banner tone={state.ok ? "success" : "error"}>{state.message}</Banner>
      ) : null}

      {/* --- Images ------------------------------------------------------ */}
      <section className="rounded-xl border border-[#e7e5e4] bg-white p-5">
        <h2 className="text-[15px] font-medium text-[#1c1917]">Fotografitë</h2>
        <p className="mt-1 text-[13px] text-[#a8a29e]">
          E para shfaqet si kryesorja. Deri në 8 fotografi.
        </p>
        <div className="mt-4">
          <ImageUploader
            images={images}
            onChange={(next) => {
              setImages(next);
              setDirty(true);
            }}
          />
        </div>
        {err("images") ? (
          <p role="alert" className="mt-2 text-[12px] text-[#b91c1c]">
            {err("images")}
          </p>
        ) : null}
      </section>

      {/* --- Albanian ---------------------------------------------------- */}
      <section className="rounded-xl border border-[#e7e5e4] bg-white p-5">
        <h2 className="text-[15px] font-medium text-[#1c1917]">Shqip</h2>
        <div className="mt-4 space-y-4">
          <Field label="Emri i produktit" error={err("nameSq")}>
            <Input
              name="nameSq"
              defaultValue={product?.name.sq}
              placeholder="Gjerdan me Qershi"
              maxLength={120}
            />
          </Field>

          <Field label="Përshkrimi" error={err("descriptionSq")}>
            <Textarea
              name="descriptionSq"
              defaultValue={product?.description.sq}
              placeholder="Një gjerdan veror me perla të vogla të bardha…"
              maxLength={2000}
            />
          </Field>

          <Field label="Nëntitulli" hint="Opsionale" error={err("taglineSq")}>
            <Input
              name="taglineSq"
              defaultValue={product?.tagline.sq}
              placeholder="Perla qelqi · qershi e emaluar"
              maxLength={160}
            />
          </Field>

          <Field label="Materialet" hint="Opsionale" error={err("materialsSq")}>
            <Input
              name="materialsSq"
              defaultValue={product?.materials.sq}
              placeholder="Perla qelqi, emal"
              maxLength={300}
            />
          </Field>

          <Field label="Kujdesi" hint="Opsionale" error={err("careSq")}>
            <Textarea
              name="careSq"
              defaultValue={product?.care.sq}
              placeholder="Shmang kontaktin me kremra dhe parfume."
              maxLength={600}
              className="min-h-[72px]"
            />
          </Field>
        </div>
      </section>

      {/* --- English ----------------------------------------------------- */}
      <section className="rounded-xl border border-[#e7e5e4] bg-white p-5">
        <h2 className="text-[15px] font-medium text-[#1c1917]">English</h2>
        <p className="mt-1 text-[13px] text-[#a8a29e]">
          Opsionale. Nëse e lë bosh, vizitorët anglishtfolës shohin tekstin
          shqip.
        </p>
        <div className="mt-4 space-y-4">
          <Field label="Product name" error={err("nameEn")}>
            <Input
              name="nameEn"
              defaultValue={product?.name.en}
              placeholder="Cherry Beaded Necklace"
              maxLength={120}
            />
          </Field>

          <Field label="Description" error={err("descriptionEn")}>
            <Textarea
              name="descriptionEn"
              defaultValue={product?.description.en}
              placeholder="A summer necklace of tiny white seed pearls…"
              maxLength={2000}
            />
          </Field>

          <Field label="Tagline" hint="Opsionale" error={err("taglineEn")}>
            <Input
              name="taglineEn"
              defaultValue={product?.tagline.en}
              placeholder="Seed pearls · enamel cherries"
              maxLength={160}
            />
          </Field>

          <Field label="Materials" hint="Opsionale" error={err("materialsEn")}>
            <Input
              name="materialsEn"
              defaultValue={product?.materials.en}
              placeholder="Glass seed pearls, enamel"
              maxLength={300}
            />
          </Field>

          <Field label="Care" hint="Opsionale" error={err("careEn")}>
            <Textarea
              name="careEn"
              defaultValue={product?.care.en}
              placeholder="Avoid contact with creams and perfumes."
              maxLength={600}
              className="min-h-[72px]"
            />
          </Field>
        </div>
      </section>

      {/* --- Placement --------------------------------------------------- */}
      <section className="rounded-xl border border-[#e7e5e4] bg-white p-5">
        <h2 className="text-[15px] font-medium text-[#1c1917]">Kategoritë</h2>
        <p className="mt-1 text-[13px] text-[#a8a29e]">
          Ku shfaqet ky produkt në faqe.
        </p>

        <div className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
          {allCollections.map((c) => (
            <label
              key={c.slug}
              className="flex cursor-pointer items-center gap-2 rounded-lg border border-[#e7e5e4] px-3 py-2.5 transition-colors hover:border-[#d6d3d1]"
            >
              <input
                type="checkbox"
                name="collections"
                value={c.slug}
                defaultChecked={product?.collections.includes(c.slug)}
                className="h-4 w-4 cursor-pointer rounded border-[#d6d3d1] text-[#1c1917] focus:ring-2 focus:ring-[#1c1917]/20"
              />
              <span className="text-[13px] text-[#44403c]">{c.name.sq}</span>
            </label>
          ))}
        </div>

        <div className="mt-4">
          <Field
            label="Kategoria kryesore"
            hint="Përdoret për lidhjen e produktit"
            error={err("primaryCollection")}
          >
            <select
              name="primaryCollection"
              defaultValue={product?.primaryCollection ?? ""}
              className="w-full rounded-lg border border-[#e7e5e4] bg-white px-3 py-2.5 text-[14px] text-[#1c1917] outline-none transition-colors focus:border-[#1c1917] focus:ring-2 focus:ring-[#1c1917]/10"
            >
              <option value="">— Asnjë —</option>
              {allCollections.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.name.sq}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <div className="mt-5 space-y-3 border-t border-[#f5f5f4] pt-5">
          <Toggle
            name="bestSeller"
            label="Më e shitur"
            hint="Shfaqet te faqja “Më të Shiturat”"
            defaultChecked={product?.bestSeller}
          />
          <Toggle
            name="newArrival"
            label="E re"
            hint="Shfaqet te faqja “Të Reja”"
            defaultChecked={product?.newArrival}
          />
        </div>
      </section>

      {/* --- Publish ----------------------------------------------------- */}
      <section className="rounded-xl border border-[#e7e5e4] bg-white p-5">
        <Toggle
          name="published"
          label="Shfaq në faqe"
          hint="Kur është e fikur, produkti është i dukshëm vetëm për ty."
          defaultChecked={product?.published}
        />
      </section>

      {/* --- Actions ----------------------------------------------------- */}
      {/* Opaque, not translucent: the fields scrolling underneath were showing
          through and colliding with the buttons. */}
      <div className="sticky bottom-0 z-10 -mx-5 flex items-center gap-2 border-t border-[#e7e5e4] bg-[#faf9f7] px-5 py-4 shadow-[0_-8px_16px_-8px_rgba(28,25,23,0.12)] sm:mx-0 sm:rounded-xl sm:border">
        <SubmitButton pendingLabel="Duke ruajtur…">
          {isEdit ? "Ruaj Ndryshimet" : "Shto Produktin"}
        </SubmitButton>

        {isEdit && product ? (
          <Link
            href={`/products/${product.slug}`}
            target="_blank"
            rel="noreferrer"
            className="rounded-lg border border-[#e7e5e4] bg-white px-4 py-2.5 text-[14px] font-medium text-[#44403c] transition-colors hover:border-[#d6d3d1]"
          >
            Shiko
          </Link>
        ) : null}

        <Link
          href="/studio"
          className="ml-auto rounded-lg px-3 py-2.5 text-[14px] text-[#78716c] transition-colors hover:text-[#1c1917]"
        >
          Anulo
        </Link>
      </div>
    </form>
  );
}
