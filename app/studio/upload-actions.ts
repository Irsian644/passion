"use server";

import { requireAdmin } from "@/lib/auth";
import { createSupabaseAdminClient } from "@/lib/supabase/server";

/**
 * Issues a one-shot signed URL the browser can upload a single file to.
 *
 * Why this exists: our auth cookie is httpOnly, so the browser's Supabase
 * client cannot read the session and every direct upload it attempts arrives
 * anonymous — which Storage RLS rightly rejects. Making the cookie readable
 * would trade a real XSS protection for convenience, so instead the server
 * (which can read the session) authorises each upload individually.
 *
 * The file itself still streams browser -> Supabase, never through a Vercel
 * function, so the ~4.5MB serverless body limit does not apply.
 */

const MAX_BYTES = 8 * 1024 * 1024;
const ACCEPTED = ["image/jpeg", "image/png", "image/webp", "image/avif"] as const;

const EXTENSION: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
};

export interface SignedUpload {
  ok: boolean;
  message?: string;
  path?: string;
  token?: string;
}

export async function createSignedUpload(
  contentType: string,
  size: number,
): Promise<SignedUpload> {
  // Only a signed-in, onboarded admin may ever obtain an upload URL.
  await requireAdmin();

  // Server-side validation — the client's own checks are only for fast
  // feedback and cannot be trusted.
  if (!ACCEPTED.includes(contentType as (typeof ACCEPTED)[number])) {
    return { ok: false, message: "Vetëm JPG, PNG, WebP ose AVIF." };
  }
  if (!Number.isFinite(size) || size <= 0 || size > MAX_BYTES) {
    return { ok: false, message: "Fotografia duhet të jetë nën 8 MB." };
  }

  // We name the file, never the client — a client-supplied name is a path
  // traversal waiting to happen.
  const path = `${crypto.randomUUID()}.${EXTENSION[contentType]}`;

  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase.storage
    .from("product-images")
    .createSignedUploadUrl(path);

  if (error || !data) {
    return { ok: false, message: "Ngarkimi dështoi. Provo përsëri." };
  }

  return { ok: true, path: data.path, token: data.token };
}

/** Removes an image the admin discarded. */
export async function removeImage(path: string): Promise<{ ok: boolean }> {
  await requireAdmin();

  // Reject anything that isn't one of our own generated names.
  if (!/^[0-9a-f-]{36}\.(jpg|png|webp|avif)$/i.test(path)) {
    return { ok: false };
  }

  const supabase = createSupabaseAdminClient();
  const { error } = await supabase.storage.from("product-images").remove([path]);

  return { ok: !error };
}
