import "server-only";

import { createHash } from "node:crypto";

import { createSupabaseAdminClient } from "@/lib/supabase/server";
import type { TranslatableFields, TranslatedFields } from "@/lib/translate";

/**
 * Decides *whether* to call the translation API. The API call itself is in
 * lib/translate.ts; this module is the policy around it.
 */

export interface ExistingEnglish {
  name_en: string;
  description_en: string;
  tagline_en: string;
  care_en: string;
  materials_en: string;
}

export interface PreviousAlbanian {
  name_sq: string;
  description_sq: string;
  tagline_sq: string;
  care_sq: string;
  materials_sq: string;
}

/**
 * True when any Albanian field differs from what is already stored.
 *
 * This is what stops us from paying for a translation on every save — editing
 * only the display order, or toggling Published, changes no Albanian text and
 * therefore triggers no API call.
 */
export function albanianChanged(
  next: TranslatableFields,
  previous: PreviousAlbanian | null,
): boolean {
  if (!previous) return true; // New product: always translate.

  return (
    next.nameSq.trim() !== previous.name_sq.trim() ||
    next.descriptionSq.trim() !== previous.description_sq.trim() ||
    next.taglineSq.trim() !== previous.tagline_sq.trim() ||
    next.careSq.trim() !== previous.care_sq.trim() ||
    next.materialsSq.trim() !== previous.materials_sq.trim()
  );
}

/**
 * True when the admin has hand-edited the English away from what we last
 * produced. We must not silently overwrite their edit on the next save.
 */
export function englishWasEdited(
  submitted: TranslatedFields,
  stored: ExistingEnglish | null,
): boolean {
  if (!stored) return false;

  return (
    submitted.nameEn.trim() !== stored.name_en.trim() ||
    submitted.descriptionEn.trim() !== stored.description_en.trim() ||
    submitted.taglineEn.trim() !== stored.tagline_en.trim() ||
    submitted.careEn.trim() !== stored.care_en.trim() ||
    submitted.materialsEn.trim() !== stored.materials_en.trim()
  );
}

const TRANSLATE_MAX_CALLS = 60;
const TRANSLATE_WINDOW_SECONDS = 60 * 60;

/**
 * Caps translation calls per admin per hour.
 *
 * Guards against a runaway loop or a stuck retry button quietly burning
 * through the Google Cloud quota (and its billing).
 *
 * Fails OPEN: an infrastructure blip must not block translation.
 */
export async function checkTranslationRateLimit(
  userId: string,
): Promise<boolean> {
  try {
    const supabase = createSupabaseAdminClient();
    const bucket = createHash("sha256").update(`translate|${userId}`).digest("hex");

    const { data, error } = await supabase.rpc("record_auth_attempt", {
      p_bucket: bucket,
      p_window_secs: TRANSLATE_WINDOW_SECONDS,
    });

    if (error) return true;
    return (data as number) <= TRANSLATE_MAX_CALLS;
  } catch {
    return true;
  }
}
