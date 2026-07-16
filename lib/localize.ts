import type { Lang } from "@/lib/i18n";

/**
 * A field the admin may fill in one language, both, or neither.
 * Unlike `Localized` (static site copy, always both), either side may be "".
 */
export interface MaybeLocalized {
  sq: string;
  en: string;
}

/**
 * Resolves a product field for display.
 *
 * Rule: show the requested language; if it is empty, fall back to the other
 * one. This is what makes "fill in only Albanian" work — an English visitor
 * sees the Albanian text rather than a blank space.
 *
 * Returns "" only when the admin filled in neither.
 */
export function pick(field: MaybeLocalized, lang: Lang): string {
  const wanted = field[lang]?.trim();
  if (wanted) return wanted;

  const other = lang === "sq" ? field.en : field.sq;
  return other?.trim() ?? "";
}

/**
 * True when a field has text in at least one language.
 *
 * Use this to decide whether to render an optional section at all — an
 * unfilled "Care" field should omit its heading, not print an empty one.
 */
export function hasText(field: MaybeLocalized): boolean {
  return Boolean(field.sq?.trim() || field.en?.trim());
}

/**
 * The language a field will actually render in, or null if it is empty.
 * Lets a caller mark text that falls back (e.g. `lang="sq"` on an English
 * page) so screen readers and search engines are told the truth.
 */
export function resolvedLang(
  field: MaybeLocalized,
  lang: Lang,
): Lang | null {
  if (field[lang]?.trim()) return lang;
  const other: Lang = lang === "sq" ? "en" : "sq";
  if (field[other]?.trim()) return other;
  return null;
}
