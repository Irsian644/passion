"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { DASHBOARD_PATH, LOGIN_PATH, requireAdmin } from "@/lib/auth";
import { checkLoginRateLimit, clearLoginRateLimit } from "@/lib/rate-limit";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  emailSchema,
  idSchema,
  passwordSchema,
  productInputSchema,
  reorderSchema,
  slugify,
} from "@/lib/validation";

/**
 * Every action here re-checks the session with requireAdmin(). Middleware is
 * not sufficient: server actions are POST endpoints that can be invoked
 * directly, independently of any page render.
 */

export interface ActionResult {
  ok: boolean;
  message?: string;
  fieldErrors?: Record<string, string>;
}

/** Public pages that show product data. Revalidated after every mutation. */
function revalidatePublic(slug?: string) {
  revalidatePath("/", "layout");
  revalidatePath("/best-sellers");
  revalidatePath("/new");
  revalidatePath("/collections/[slug]", "page");
  revalidatePath("/products/[slug]", "page");
  if (slug) revalidatePath(`/products/${slug}`);
  revalidatePath(DASHBOARD_PATH);
}

// ---------------------------------------------------------------------------
// Auth
// ---------------------------------------------------------------------------

export async function signIn(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const email = emailSchema.safeParse(formData.get("email"));
  const password = String(formData.get("password") ?? "");

  // Deliberately generic: never reveal whether the email exists.
  const GENERIC = "Email ose fjalëkalim i pasaktë.";

  if (!email.success || !password) {
    return { ok: false, message: GENERIC };
  }

  if (!(await checkLoginRateLimit(email.data))) {
    return {
      ok: false,
      message: "Shumë përpjekje. Provo përsëri pas 15 minutash.",
    };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: email.data,
    password,
  });

  if (error) return { ok: false, message: GENERIC };

  await clearLoginRateLimit(email.data);
  redirect(DASHBOARD_PATH);
}

export async function signOut(): Promise<void> {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect(LOGIN_PATH);
}

export async function changePassword(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  await requireAdmin();

  const parsed = passwordSchema.safeParse(formData.get("password"));
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message };
  }

  if (parsed.data !== String(formData.get("confirm") ?? "")) {
    return { ok: false, message: "Fjalëkalimet nuk përputhen." };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.updateUser({ password: parsed.data });

  if (error) return { ok: false, message: "Nuk u ndryshua. Provo përsëri." };
  return { ok: true, message: "Fjalëkalimi u ndryshua." };
}

export async function requestPasswordReset(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const email = emailSchema.safeParse(formData.get("email"));

  // Always report success — never disclose which emails are registered.
  const DONE = {
    ok: true,
    message: "Nëse ky email ekziston, do të marrësh një lidhje brenda pak minutash.",
  };

  if (!email.success) return DONE;
  if (!(await checkLoginRateLimit(email.data))) return DONE;

  const supabase = await createSupabaseServerClient();
  const origin =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "http://localhost:3000";

  await supabase.auth.resetPasswordForEmail(email.data, {
    redirectTo: `${origin}/studio/reset-password`,
  });

  return DONE;
}

// ---------------------------------------------------------------------------
// Products
// ---------------------------------------------------------------------------

function parseProductForm(formData: FormData) {
  return productInputSchema.safeParse({
    nameSq: formData.get("nameSq") ?? "",
    nameEn: formData.get("nameEn") ?? "",
    taglineSq: formData.get("taglineSq") ?? "",
    taglineEn: formData.get("taglineEn") ?? "",
    descriptionSq: formData.get("descriptionSq") ?? "",
    descriptionEn: formData.get("descriptionEn") ?? "",
    careSq: formData.get("careSq") ?? "",
    careEn: formData.get("careEn") ?? "",
    materialsSq: formData.get("materialsSq") ?? "",
    materialsEn: formData.get("materialsEn") ?? "",
    images: formData.getAll("images").map(String).filter(Boolean),
    collections: formData.getAll("collections").map(String),
    primaryCollection: (formData.get("primaryCollection") as string) || null,
    bestSeller: formData.get("bestSeller") === "on",
    newArrival: formData.get("newArrival") === "on",
    published: formData.get("published") === "on",
  });
}

function toFieldErrors(
  issues: { path: PropertyKey[]; message: string }[],
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of issues) {
    const key = String(issue.path[0] ?? "form");
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}

/** Ensures the slug is unique, appending -2, -3, ... when taken. */
async function uniqueSlug(base: string, excludeId?: string): Promise<string> {
  const supabase = await createSupabaseServerClient();
  const root = base || "produkt";

  for (let attempt = 0; attempt < 50; attempt++) {
    const candidate = attempt === 0 ? root : `${root}-${attempt + 1}`;
    let query = supabase.from("products").select("id").eq("slug", candidate);
    if (excludeId) query = query.neq("id", excludeId);

    const { data } = await query.maybeSingle();
    if (!data) return candidate;
  }
  return `${root}-${Date.now()}`;
}

export async function createProduct(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  await requireAdmin();

  const parsed = parseProductForm(formData);
  if (!parsed.success) {
    return {
      ok: false,
      message: "Kontrollo fushat e shënuara.",
      fieldErrors: toFieldErrors(parsed.error.issues),
    };
  }

  const v = parsed.data;
  const supabase = await createSupabaseServerClient();

  // New products go to the top of the list.
  const { data: first } = await supabase
    .from("products")
    .select("display_order")
    .order("display_order", { ascending: true })
    .limit(1)
    .maybeSingle();

  const slug = await uniqueSlug(slugify(v.nameSq || v.nameEn));

  const { error } = await supabase.from("products").insert({
    name_sq: v.nameSq,
    name_en: v.nameEn,
    tagline_sq: v.taglineSq,
    tagline_en: v.taglineEn,
    description_sq: v.descriptionSq,
    description_en: v.descriptionEn,
    care_sq: v.careSq,
    care_en: v.careEn,
    materials_sq: v.materialsSq,
    materials_en: v.materialsEn,
    images: v.images,
    collections: v.collections,
    primary_collection: v.primaryCollection,
    best_seller: v.bestSeller,
    new_arrival: v.newArrival,
    published: v.published,
    display_order: (first?.display_order ?? 0) - 1,
    slug,
  });

  // Never surface the raw Postgres error to the client.
  if (error) return { ok: false, message: "Produkti nuk u ruajt. Provo përsëri." };

  revalidatePublic(slug);
  redirect(DASHBOARD_PATH);
}

export async function updateProduct(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  await requireAdmin();

  const id = idSchema.safeParse({ id: formData.get("id") });
  if (!id.success) return { ok: false, message: "Produkt i panjohur." };

  const parsed = parseProductForm(formData);
  if (!parsed.success) {
    return {
      ok: false,
      message: "Kontrollo fushat e shënuara.",
      fieldErrors: toFieldErrors(parsed.error.issues),
    };
  }

  const v = parsed.data;
  const supabase = await createSupabaseServerClient();

  const { error } = await supabase
    .from("products")
    .update({
      name_sq: v.nameSq,
      name_en: v.nameEn,
      tagline_sq: v.taglineSq,
      tagline_en: v.taglineEn,
      description_sq: v.descriptionSq,
      description_en: v.descriptionEn,
      care_sq: v.careSq,
      care_en: v.careEn,
      materials_sq: v.materialsSq,
      materials_en: v.materialsEn,
      images: v.images,
      collections: v.collections,
      primary_collection: v.primaryCollection,
      best_seller: v.bestSeller,
      new_arrival: v.newArrival,
      published: v.published,
    })
    .eq("id", id.data.id);

  if (error) return { ok: false, message: "Ndryshimet nuk u ruajtën. Provo përsëri." };

  revalidatePublic();
  return { ok: true, message: "Ndryshimet u ruajtën." };
}

export async function setPublished(id: string, published: boolean): Promise<ActionResult> {
  await requireAdmin();

  const parsed = idSchema.safeParse({ id });
  if (!parsed.success) return { ok: false, message: "Produkt i panjohur." };

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("products")
    .update({ published })
    .eq("id", parsed.data.id);

  if (error) return { ok: false, message: "Nuk u ndryshua. Provo përsëri." };

  revalidatePublic();
  return { ok: true };
}

/**
 * Soft-ish delete: the row goes, but the images stay in storage so an
 * accidental delete can be undone by re-creating the product. Storage is
 * cheap; an unrecoverable mistake is not.
 */
export async function deleteProduct(id: string): Promise<ActionResult> {
  await requireAdmin();

  const parsed = idSchema.safeParse({ id });
  if (!parsed.success) return { ok: false, message: "Produkt i panjohur." };

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("products").delete().eq("id", parsed.data.id);

  if (error) return { ok: false, message: "Produkti nuk u fshi. Provo përsëri." };

  revalidatePublic();
  return { ok: true, message: "Produkti u fshi." };
}

export async function reorderProducts(ids: string[]): Promise<ActionResult> {
  await requireAdmin();

  const parsed = reorderSchema.safeParse({ ids });
  if (!parsed.success) return { ok: false, message: "Rendi nuk u ruajt." };

  const supabase = await createSupabaseServerClient();

  const updates = parsed.data.ids.map((id, index) =>
    supabase.from("products").update({ display_order: index }).eq("id", id),
  );
  const results = await Promise.all(updates);

  if (results.some((r) => r.error)) {
    return { ok: false, message: "Rendi nuk u ruajt plotësisht." };
  }

  revalidatePublic();
  return { ok: true };
}
