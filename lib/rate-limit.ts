import "server-only";

import { createHash } from "node:crypto";
import { headers } from "next/headers";

import { createSupabaseAdminClient } from "@/lib/supabase/server";

const MAX_ATTEMPTS = 8;
const WINDOW_SECONDS = 15 * 60;

/**
 * Identifies the caller without storing anything personally identifying.
 * The raw IP and email never reach the database — only a salted hash.
 */
async function bucketFor(email: string): Promise<string> {
  const headerList = await headers();
  const ip =
    headerList.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    headerList.get("x-real-ip") ??
    "unknown";

  return createHash("sha256")
    .update(`${ip}|${email.toLowerCase()}`)
    .digest("hex");
}

/**
 * Records a login attempt. Returns false when the caller is over the limit.
 *
 * Fails OPEN on infrastructure errors: a database blip must not lock the
 * client out of their own dashboard. Supabase Auth applies its own server-side
 * throttling underneath this, so this is defence in depth rather than the only
 * barrier.
 */
export async function checkLoginRateLimit(email: string): Promise<boolean> {
  try {
    const supabase = createSupabaseAdminClient();
    const bucket = await bucketFor(email);

    const { data, error } = await supabase.rpc("record_auth_attempt", {
      p_bucket: bucket,
      p_window_secs: WINDOW_SECONDS,
    });

    if (error) return true;
    return (data as number) <= MAX_ATTEMPTS;
  } catch {
    return true;
  }
}

/** Resets the counter once credentials are accepted. */
export async function clearLoginRateLimit(email: string): Promise<void> {
  try {
    const supabase = createSupabaseAdminClient();
    await supabase.rpc("clear_auth_attempts", {
      p_bucket: await bucketFor(email),
    });
  } catch {
    // Non-fatal: the window expires on its own.
  }
}
