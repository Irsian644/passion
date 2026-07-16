import "server-only";

import { requireAdmin } from "@/lib/auth";
import {
  translateProduct,
  type TranslatableFields,
  type TranslatedFields,
  type TranslationFailureReason,
} from "@/lib/translate";
import {
  albanianChanged,
  checkTranslationRateLimit,
  englishWasEdited,
  type ExistingEnglish,
  type PreviousAlbanian,
} from "@/lib/translation-policy";

/** What the caller should tell the client after a save. */
export type TranslationStatus =
  | { state: "translated" }
  | { state: "unchanged" }
  | { state: "kept_manual_edit" }
  | { state: "failed"; reason: TranslationFailureReason };

export interface ResolveArgs {
  albanian: TranslatableFields;
  /** English currently in the form (may be a manual edit). */
  submittedEnglish: TranslatedFields;
  /** Row as it exists in the DB. Null for a new product. */
  previous:
    | (PreviousAlbanian & ExistingEnglish)
    | null;
  /** Set when the admin explicitly pressed "Translate again". */
  forceRetranslate?: boolean;
}

export interface ResolveResult {
  english: TranslatedFields;
  status: TranslationStatus;
}

/**
 * Works out the English to persist.
 *
 * Contract: this function never throws and never rejects a save. When
 * translation is impossible it returns the best English available (the
 * admin's own text, or the previous value, or empty) plus a `failed` status
 * so the UI can offer a retry.
 */
export async function resolveEnglish({
  albanian,
  submittedEnglish,
  previous,
  forceRetranslate = false,
}: ResolveArgs): Promise<ResolveResult> {
  const user = await requireAdmin();

  const existingEnglish: ExistingEnglish | null = previous
    ? {
        name_en: previous.name_en,
        description_en: previous.description_en,
        tagline_en: previous.tagline_en,
        care_en: previous.care_en,
        materials_en: previous.materials_en,
      }
    : null;

  const sqChanged = albanianChanged(albanian, previous);
  const manualEdit = englishWasEdited(submittedEnglish, existingEnglish);

  // 1. The admin hand-edited the English. Respect it — never clobber their
  //    wording — unless they explicitly asked to re-translate.
  if (manualEdit && !forceRetranslate) {
    return { english: submittedEnglish, status: { state: "kept_manual_edit" } };
  }

  // 2. Albanian is untouched and no retry was requested: nothing to do.
  //    This is the common path for reorder / publish / hide, and it is why a
  //    page load or a trivial edit costs nothing.
  if (!sqChanged && !forceRetranslate) {
    return { english: submittedEnglish, status: { state: "unchanged" } };
  }

  // 3. Guard the quota.
  if (!(await checkTranslationRateLimit(user.id))) {
    return {
      english: submittedEnglish,
      status: { state: "failed", reason: "rate_limited" },
    };
  }

  // 4. Translate. A failure here still returns a saveable result.
  const outcome = await translateProduct(albanian);

  if (outcome.status === "failed") {
    return {
      english: submittedEnglish,
      status: { state: "failed", reason: outcome.reason },
    };
  }

  return { english: outcome.values, status: { state: "translated" } };
}
