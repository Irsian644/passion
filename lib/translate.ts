import "server-only";

import { serverEnv } from "@/lib/env";

/**
 * SQ -> EN product translation via Google Cloud Translation API (v2 REST).
 *
 * Called only from server actions, only when the Albanian text has actually
 * changed. Never called on page render: the English text is persisted in
 * Supabase and read back like any other column.
 *
 * We use the REST endpoint with an API key rather than @google-cloud/translate
 * so there is no service-account JSON to mount and no Node-only gRPC binary —
 * which keeps this working on Vercel's serverless runtime.
 */

const ENDPOINT = "https://translation.googleapis.com/language/translate/v2";
const TIMEOUT_MS = 10_000;

export type TranslationOutcome =
  | { status: "ok"; values: string[] }
  /** Nothing to do — caller should keep existing English. */
  | { status: "skipped"; values: string[] }
  /** Transient failure. Caller must still save; client can retry. */
  | { status: "failed"; reason: TranslationFailureReason };

export type TranslationFailureReason =
  | "not_configured"
  | "rate_limited"
  | "unavailable";

/** Decode the HTML entities Google returns (e.g. &#39; for an apostrophe). */
function decodeEntities(input: string): string {
  return input
    .replace(/&#(\d+);/g, (_, code: string) => String.fromCharCode(Number(code)))
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");
}

/**
 * Translates a batch of Albanian strings to English in a single request.
 *
 * Empty strings are preserved positionally without being sent to the API,
 * so an empty optional field never costs a call.
 */
export async function translateBatch(
  texts: string[],
): Promise<TranslationOutcome> {
  const apiKey = serverEnv.googleTranslationApiKey();
  if (!apiKey) return { status: "failed", reason: "not_configured" };

  // Only send non-empty strings; remember where they came from.
  const indices: number[] = [];
  const payload: string[] = [];
  texts.forEach((text, i) => {
    if (text.trim()) {
      indices.push(i);
      payload.push(text);
    }
  });

  if (payload.length === 0) {
    return { status: "skipped", values: texts.map(() => "") };
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(`${ENDPOINT}?key=${encodeURIComponent(apiKey)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        q: payload,
        source: "sq",
        target: "en",
        format: "text",
      }),
      signal: controller.signal,
      cache: "no-store",
    });

    if (!response.ok) {
      // 429 = quota; 403 can also mean quota/billing rather than a bad key.
      if (response.status === 429) {
        return { status: "failed", reason: "rate_limited" };
      }
      return { status: "failed", reason: "unavailable" };
    }

    const json = (await response.json()) as {
      data?: { translations?: { translatedText?: string }[] };
    };

    const translations = json.data?.translations;
    if (!translations || translations.length !== payload.length) {
      return { status: "failed", reason: "unavailable" };
    }

    // Re-expand into the original positions.
    const values = texts.map(() => "");
    indices.forEach((originalIndex, i) => {
      values[originalIndex] = decodeEntities(translations[i]?.translatedText ?? "");
    });

    return { status: "ok", values };
  } catch {
    // AbortError (timeout) or a network fault. Never rethrow: a failed
    // translation must not stop the product from being saved.
    return { status: "failed", reason: "unavailable" };
  } finally {
    clearTimeout(timeout);
  }
}

export interface TranslatableFields {
  nameSq: string;
  descriptionSq: string;
  taglineSq: string;
  careSq: string;
  materialsSq: string;
}

export interface TranslatedFields {
  nameEn: string;
  descriptionEn: string;
  taglineEn: string;
  careEn: string;
  materialsEn: string;
}

const FIELD_ORDER = [
  "nameSq",
  "descriptionSq",
  "taglineSq",
  "careSq",
  "materialsSq",
] as const;

const MAX_LENGTHS: Record<keyof TranslatedFields, number> = {
  nameEn: 120,
  descriptionEn: 2000,
  taglineEn: 160,
  careEn: 600,
  materialsEn: 300,
};

/**
 * Translates a product's Albanian fields. One API call for all fields.
 *
 * Returns `failed` on any error — the caller saves the Albanian regardless
 * and surfaces a retry affordance.
 */
export async function translateProduct(
  fields: TranslatableFields,
): Promise<
  | { status: "ok" | "skipped"; values: TranslatedFields }
  | { status: "failed"; reason: TranslationFailureReason }
> {
  const outcome = await translateBatch(FIELD_ORDER.map((key) => fields[key]));

  if (outcome.status === "failed") return outcome;

  const [nameEn, descriptionEn, taglineEn, careEn, materialsEn] = outcome.values;

  const values: TranslatedFields = {
    nameEn: nameEn.slice(0, MAX_LENGTHS.nameEn),
    descriptionEn: descriptionEn.slice(0, MAX_LENGTHS.descriptionEn),
    taglineEn: taglineEn.slice(0, MAX_LENGTHS.taglineEn),
    careEn: careEn.slice(0, MAX_LENGTHS.careEn),
    materialsEn: materialsEn.slice(0, MAX_LENGTHS.materialsEn),
  };

  return { status: outcome.status, values };
}
