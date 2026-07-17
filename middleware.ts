import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const DASHBOARD_PREFIX = "/studio";
const LOGIN_PATH = "/studio/login";
const SETUP_PATH = "/setup-account";

/**
 * Mirror of needsOnboarding() in lib/onboarding.ts.
 *
 * Duplicated deliberately: this file runs on the Edge runtime and cannot
 * import a `server-only` module. Keep the two in step — lib/onboarding.ts is
 * the authoritative copy, and the server-side requireAdmin() check is what
 * actually enforces the gate.
 */
function awaitingPassword(user: {
  invited_at?: string;
  user_metadata?: Record<string, unknown>;
}): boolean {
  if (user.user_metadata?.onboarding_complete === true) return false;
  return Boolean(user.user_metadata?.invited_at ?? user.invited_at);
}
/** Reachable without a session (login, and the password-reset round trip). */
const PUBLIC_STUDIO_PATHS = [LOGIN_PATH, "/studio/forgot-password", "/studio/reset-password"];

function securityHeaders(response: NextResponse): NextResponse {
  const supabaseHost = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";

  // Host-based allowlisting, NOT 'strict-dynamic'.
  //
  // 'strict-dynamic' disables 'self'/host allowlisting and only trusts scripts
  // loaded by a nonce'd parent. Next.js does not put a nonce on its static
  // chunk <script> tags, so under 'strict-dynamic' the browser blocked every
  // framework chunk — no JS, no hydration, and Framer Motion's
  // whileInView reveals stayed stuck at opacity:0 (blank product sections).
  //
  // 'self' allows Next's own chunks; 'unsafe-inline' covers its inline
  // bootstrap. 'unsafe-eval' is DEV ONLY (webpack HMR evaluates strings).
  const isDev = process.env.NODE_ENV === "development";
  const scriptSrc = [
    `'self'`,
    `'unsafe-inline'`,
    ...(isDev ? ["'unsafe-eval'"] : []),
  ].join(" ");

  const csp = [
    `default-src 'self'`,
    `script-src ${scriptSrc}`,
    `style-src 'self' 'unsafe-inline' https://fonts.googleapis.com`,
    `font-src 'self' https://fonts.gstatic.com data:`,
    `img-src 'self' data: blob: ${supabaseHost}`,
    `connect-src 'self' ${supabaseHost}`,
    `frame-ancestors 'none'`,
    `base-uri 'self'`,
    `form-action 'self'`,
    `object-src 'none'`,
    `upgrade-insecure-requests`,
  ].join("; ");

  response.headers.set("Content-Security-Policy", csp);
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("X-DNS-Prefetch-Control", "off");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  );
  response.headers.set(
    "Strict-Transport-Security",
    "max-age=63072000; includeSubDomains; preload",
  );
  return response;
}

export async function middleware(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);

  let response = NextResponse.next({ request: { headers: requestHeaders } });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          for (const { name, value } of cookiesToSet) {
            request.cookies.set(name, value);
          }
          response = NextResponse.next({ request: { headers: requestHeaders } });
          for (const { name, value, options } of cookiesToSet) {
            response.cookies.set(name, value, {
              ...options,
              httpOnly: true,
              sameSite: "lax",
              secure: process.env.NODE_ENV === "production",
              path: "/",
            });
          }
        },
      },
    },
  );

  // Refreshes an expiring session cookie. Verified against Supabase, not decoded.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;
  const isStudio = pathname.startsWith(DASHBOARD_PREFIX);
  const isPublicStudioPath = PUBLIC_STUDIO_PATHS.some((p) => pathname === p);

  // Not signed in and asking for a protected studio page -> login.
  if (isStudio && !isPublicStudioPath && !user) {
    const url = request.nextUrl.clone();
    url.pathname = LOGIN_PATH;
    url.search = "";
    return securityHeaders(NextResponse.redirect(url));
  }

  // An invited user is authenticated *before* they have a password, so a
  // session is not permission to enter. Anyone mid-onboarding is pinned to the
  // setup page — including from the login page, which would otherwise wave
  // them straight through to the dashboard.
  //
  // This mirrors requireAdmin(); the server-side check is the real boundary,
  // this one just avoids a pointless round-trip.
  if (user && awaitingPassword(user)) {
    if (isStudio || pathname === LOGIN_PATH) {
      const url = request.nextUrl.clone();
      url.pathname = SETUP_PATH;
      url.search = "";
      return securityHeaders(NextResponse.redirect(url));
    }
    return securityHeaders(response);
  }

  // Already signed in and hitting the login page -> straight to the dashboard.
  // This is what makes the footer link open the dashboard without re-asking.
  if (user && (pathname === LOGIN_PATH || pathname === SETUP_PATH)) {
    const url = request.nextUrl.clone();
    url.pathname = DASHBOARD_PREFIX;
    url.search = "";
    return securityHeaders(NextResponse.redirect(url));
  }

  return securityHeaders(response);
}

export const config = {
  matcher: [
    // Everything except static assets, so headers apply site-wide.
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|webp|avif|svg|ico)$).*)",
  ],
};
