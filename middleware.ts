import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const DASHBOARD_PREFIX = "/studio";
const LOGIN_PATH = "/studio/login";
/** Reachable without a session (login, and the password-reset round trip). */
const PUBLIC_STUDIO_PATHS = [LOGIN_PATH, "/studio/forgot-password", "/studio/reset-password"];

function securityHeaders(response: NextResponse, nonce: string): NextResponse {
  const supabaseHost = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";

  // Next.js requires 'unsafe-inline' for its inline bootstrap in production;
  // 'strict-dynamic' with a nonce lets our own scripts run while blocking
  // arbitrary injected ones.
  //
  // 'unsafe-eval' is DEV ONLY: webpack's HMR runtime evaluates strings, and
  // without it React never hydrates — which silently leaves Framer Motion's
  // reveal animations stuck at opacity:0, i.e. an invisible product grid.
  // Production ships without it.
  const isDev = process.env.NODE_ENV === "development";
  const scriptSrc = [
    `'self'`,
    `'nonce-${nonce}'`,
    `'strict-dynamic'`,
    `https:`,
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
  const nonce = crypto.randomUUID().replace(/-/g, "");

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);

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
    return securityHeaders(NextResponse.redirect(url), nonce);
  }

  // Already signed in and hitting the login page -> straight to the dashboard.
  // This is what makes the footer link open the dashboard without re-asking.
  if (user && pathname === LOGIN_PATH) {
    const url = request.nextUrl.clone();
    url.pathname = DASHBOARD_PREFIX;
    url.search = "";
    return securityHeaders(NextResponse.redirect(url), nonce);
  }

  return securityHeaders(response, nonce);
}

export const config = {
  matcher: [
    // Everything except static assets, so headers apply site-wide.
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|webp|avif|svg|ico)$).*)",
  ],
};
