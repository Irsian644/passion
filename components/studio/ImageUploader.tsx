"use client";

import { ImagePlus, Loader2, Star, X } from "lucide-react";
import { useRef, useState } from "react";

import { createSignedUpload, removeImage } from "@/app/studio/upload-actions";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { imageUrl } from "@/lib/product-mapper";

const MAX_IMAGES = 8;
const MAX_BYTES = 8 * 1024 * 1024; // 8 MB
const MIN_DIMENSION = 400;
const ACCEPTED = ["image/jpeg", "image/png", "image/webp", "image/avif"];

/**
 * Two-step upload: the server signs, the browser sends.
 *
 * The auth cookie is httpOnly, so this client cannot read the session and any
 * upload it attempted on its own authority would arrive anonymous and be
 * rejected by Storage RLS. So a server action authorises each file and returns
 * a one-shot signed URL, which this component then uploads to directly.
 *
 * The bytes still go browser -> Supabase, never through a Vercel function, so
 * the ~4.5MB serverless request-body cap does not apply.
 *
 * Client-side checks here are for fast feedback only — createSignedUpload
 * re-validates type and size on the server.
 */

/** Reads real pixel dimensions; a lying Content-Type can't fake this. */
function readDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("not-an-image"));
    };
    img.src = url;
  });
}

export function ImageUploader({
  images,
  onChange,
}: {
  images: string[];
  onChange: (next: string[]) => void;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function upload(files: FileList | File[]) {
    setError(null);

    const list = Array.from(files);
    if (images.length + list.length > MAX_IMAGES) {
      setError(`Maksimumi ${MAX_IMAGES} fotografi.`);
      return;
    }

    setBusy(true);
    const supabase = createSupabaseBrowserClient();
    const added: string[] = [];

    try {
      for (const file of list) {
        if (!ACCEPTED.includes(file.type)) {
          setError("Vetëm JPG, PNG, WebP ose AVIF.");
          continue;
        }
        if (file.size > MAX_BYTES) {
          setError("Fotografia duhet të jetë nën 8 MB.");
          continue;
        }

        try {
          const { width, height } = await readDimensions(file);
          if (width < MIN_DIMENSION || height < MIN_DIMENSION) {
            setError(`Fotografia duhet të jetë të paktën ${MIN_DIMENSION}px.`);
            continue;
          }
        } catch {
          setError("Skedari nuk është fotografi e vlefshme.");
          continue;
        }

        // Ask the server to authorise this file and name it.
        const signed = await createSignedUpload(file.type, file.size);
        if (!signed.ok || !signed.path || !signed.token) {
          setError(signed.message ?? "Ngarkimi dështoi. Provo përsëri.");
          continue;
        }

        const { error: uploadError } = await supabase.storage
          .from("product-images")
          .uploadToSignedUrl(signed.path, signed.token, file, {
            contentType: file.type,
          });

        if (uploadError) {
          setError("Ngarkimi dështoi. Provo përsëri.");
          continue;
        }
        added.push(signed.path);
      }

      if (added.length) onChange([...images, ...added]);
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  async function remove(path: string) {
    onChange(images.filter((p) => p !== path));
    // Best-effort storage cleanup; the row no longer references it either way.
    // Goes through a server action for the same reason uploads do.
    try {
      await removeImage(path);
    } catch {
      /* ignore */
    }
  }

  function makePrimary(path: string) {
    onChange([path, ...images.filter((p) => p !== path)]);
  }

  return (
    <div>
      {images.length > 0 ? (
        <ul className="mb-3 grid grid-cols-3 gap-2.5 sm:grid-cols-4">
          {images.map((path, i) => (
            <li
              key={path}
              className="group relative aspect-square overflow-hidden rounded-lg border border-[#e7e5e4] bg-[#f5f5f4]"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imageUrl(path)}
                alt=""
                className="h-full w-full object-cover"
                loading="lazy"
              />

              {i === 0 ? (
                <span className="absolute left-1.5 top-1.5 rounded bg-[#1c1917]/85 px-1.5 py-0.5 text-[10px] font-medium text-white">
                  Kryesorja
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => makePrimary(path)}
                  aria-label="Bëje kryesore"
                  className="absolute left-1.5 top-1.5 rounded bg-white/90 p-1 text-[#78716c] opacity-0 transition-opacity hover:text-[#1c1917] focus:opacity-100 group-hover:opacity-100"
                >
                  <Star size={12} aria-hidden />
                </button>
              )}

              <button
                type="button"
                onClick={() => remove(path)}
                aria-label="Hiq fotografinë"
                className="absolute right-1.5 top-1.5 rounded bg-white/90 p-1 text-[#78716c] opacity-0 transition-opacity hover:text-[#b91c1c] focus:opacity-100 group-hover:opacity-100"
              >
                <X size={12} aria-hidden />
              </button>
            </li>
          ))}
        </ul>
      ) : null}

      {images.length < MAX_IMAGES ? (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            if (e.dataTransfer.files.length) upload(e.dataTransfer.files);
          }}
          className={`rounded-xl border border-dashed px-4 py-7 text-center transition-colors ${
            dragOver ? "border-[#1c1917] bg-[#fafaf9]" : "border-[#d6d3d1]"
          }`}
        >
          <input
            ref={inputRef}
            type="file"
            accept={ACCEPTED.join(",")}
            multiple
            className="sr-only"
            id="image-input"
            onChange={(e) => e.target.files && upload(e.target.files)}
            disabled={busy}
          />

          <label
            htmlFor="image-input"
            className="inline-flex cursor-pointer items-center gap-2 text-[14px] font-medium text-[#44403c] hover:text-[#1c1917]"
          >
            {busy ? (
              <>
                <Loader2 size={15} className="animate-spin" aria-hidden />
                Duke ngarkuar…
              </>
            ) : (
              <>
                <ImagePlus size={15} aria-hidden />
                Zgjidh fotografi
              </>
            )}
          </label>

          <p className="mt-1.5 text-[12px] text-[#a8a29e]">
            ose tërhiqi këtu · JPG, PNG, WebP · deri 8 MB
          </p>
        </div>
      ) : null}

      {error ? (
        <p role="alert" className="mt-2 text-[12px] text-[#b91c1c]">
          {error}
        </p>
      ) : null}
    </div>
  );
}
