import "server-only";

/**
 * Server-side environment access.
 *
 * Importing this module from a client component is a build error (`server-only`),
 * which is the guardrail that keeps the service-role key out of the browser
 * bundle.
 */

function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    // Never echo the value — only the name.
    throw new Error(
      `Missing required environment variable: ${name}. See .env.example.`,
    );
  }
  return value;
}

export const serverEnv = {
  supabaseUrl: () => required("NEXT_PUBLIC_SUPABASE_URL"),
  supabaseAnonKey: () => required("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
  supabaseServiceRoleKey: () => required("SUPABASE_SERVICE_ROLE_KEY"),
  siteUrl: () =>
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
    "http://localhost:3000",
};
