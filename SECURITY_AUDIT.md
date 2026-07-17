# Security Audit — Passion Dream

_Full-stack security review of the Passion Dream showroom + admin CMS._

## 1. Executive summary

Passion Dream is an Instagram-first luxury showroom: a public bilingual
(SQ/EN) storefront plus a single-admin content dashboard at `/studio`. Products
are managed in Supabase and rendered by Next.js on Vercel. There is no cart,
checkout, payment, webhook, or AI integration — those attack surfaces are **not
applicable**.

The audit found **one HIGH** issue (stored XSS via JSON-LD) and **one LOW**
issue (open-redirect hardening), both **fixed and verified**. Defense-in-depth
storage hardening was prepared as an additive migration. All previously
implemented protections (RLS, service-key isolation, auth gating, CSP, rate
limiting, secure cookies) were re-verified and hold.

**Overall status: production-ready** once the manual actions in
`SECURITY_DEPLOYMENT_CHECKLIST.md` are completed (env vars, Supabase redirect
URLs, credential rotation).

## 2. Architecture overview

| Aspect | Value |
|---|---|
| Framework | Next.js 15.5.20 (App Router), React 19, TypeScript |
| Hosting | Vercel |
| Rendering | Static + ISR for public pages; dynamic for `/studio`, `/auth` |
| Auth | Supabase Auth (email/password, invite-only) |
| Authz model | **Single admin. Authenticated == admin.** No role column, public signup disabled |
| Database | Supabase Postgres, accessed via `@supabase/ssr` + `supabase-js` |
| Storage | Supabase Storage, one public bucket `product-images` |
| API routes | `app/auth/confirm/route.ts` (token exchange only) |
| Server Actions | `lib/studio-actions.ts`, `lib/upload-actions.ts`, `lib/setup-actions.ts` |
| Middleware | `middleware.ts` — session refresh, route gating, security headers |
| Secrets | `.env.local` (gitignored); `NEXT_PUBLIC_*` for browser-safe values |

### Supabase client trust boundaries (verified)

- **Browser** (`lib/supabase/client.ts`): `"use client"`, anon key only. Every
  query constrained by RLS.
- **Server** (`lib/supabase/server.ts`): `import "server-only"`. Holds both the
  cookie-bound SSR client and the service-role admin client.
- **Service-role client**: imported only by `lib/rate-limit.ts` and
  `lib/upload-actions.ts` (both server-only). **0 occurrences of the full
  service key in the client bundle** (grepped `.next/static`).

## 3. Attack surface

- Public storefront (read-only, DB-driven, published products only).
- `/studio` dashboard + its Server Actions (mutations).
- `/auth/confirm` (invite / recovery token exchange).
- Image upload (browser → Supabase via server-signed URL).
- Supabase Postgres + Storage (RLS-enforced).

Trust boundaries: anonymous visitor → RLS; admin session → `requireAdmin()` +
RLS; upload → server-signed, MIME-validated.

## 4. Findings by severity

| ID | Finding | Severity | Status |
|----|---------|----------|--------|
| H-1 | Stored XSS via JSON-LD `dangerouslySetInnerHTML` | **HIGH** | ✅ Fixed |
| L-1 | Open-redirect: `next` param allowed `/\host` | LOW | ✅ Fixed |
| D-1 | `product-images` bucket accepted any MIME type | Def-in-depth | 📄 Migration prepared |
| I-1 | Onboarding flag lives in user-writable `user_metadata` | Info | Documented, accepted |

## 5. Evidence

### H-1 — Stored XSS via JSON-LD (FIXED)
- **File:** `lib/schema.tsx`, `JsonLd()`.
- **Cause:** `dangerouslySetInnerHTML={{ __html: JSON.stringify(arr) }}`.
  `JSON.stringify` does not escape `<`, `>`, `&`. A product name of
  `</script><script>alert(document.cookie)</script>` — admin-authored via the
  CMS — broke out of the `<script type="application/ld+json">` block and
  executed on every product/collection/home page.
- **Exploit:** malicious or compromised admin sets such a product name; script
  runs in every visitor's browser (cookie theft, defacement).
- **Fix:** `safeJsonLd()` escapes `<`→`<`, `>`→`>`, `&`→`&`.
- **Verified:** seeded a product literally named
  `XSS</script><script>alert(1)</script>Test`, rendered
  `/products/xss-audit-test`; the HTML emits `<script>`, **no
  `</script><script>` breakout**. `<title>`/`<meta>` were already React-escaped
  (`&lt;/script&gt;`). Test product deleted.

### L-1 — Open-redirect hardening (FIXED)
- **File:** `app/auth/confirm/route.ts`.
- **Cause:** `next.startsWith("/") && !next.startsWith("//")` allowed `/\evil.com`,
  which browsers may treat as protocol-relative → off-site redirect.
- **Fix:** predicate `/^\/(?![/\\])/` rejects `//` and `/\`.
- **Verified:** unit-tested `/studio` (allow), `//evil.com`, `/\evil.com`,
  `https://evil.com`, `""` (all blocked).

### D-1 — Storage MIME allowlist (MIGRATION PREPARED, not executed)
- Bucket `product-images` had `allowed_mime_types = null`. The upload action
  validates MIME before signing, but the bucket itself would accept anything if
  that path were bypassed. `supabase/migrations/0002_harden_storage.sql`
  constrains the bucket to the 4 image types + a 25MB ceiling. Additive,
  reversible, existing objects unaffected.

## 6. Files changed
- `lib/schema.tsx` — `safeJsonLd()` escaping (H-1).
- `app/auth/confirm/route.ts` — redirect predicate (L-1).
- `supabase/migrations/0002_harden_storage.sql` — new, not executed (D-1).
- `SECURITY.md`, `SECURITY_AUDIT.md`, `SECURITY_DEPLOYMENT_CHECKLIST.md` — new.

## 7. Tests added / run
- XSS: live-render check against a seeded malicious product (passed).
- Redirect: predicate unit tests for `//`, `/\`, absolute, empty (passed).
- Prior session suite still valid: RLS matrix, admin CRUD lifecycle, secret-in-bundle grep, header presence.

## 8. Verification results
- `tsc --noEmit`: **pass**
- `eslint`: **pass**
- `npm audit --omit=dev`: **0 vulnerabilities**
- Production source maps: not emitted
- Service key in client bundle: **0**
- Secret in git history: **0**

## 9. Remaining risks
- **I-1 (accepted):** `onboarding_complete` in `user_metadata` is user-writable.
  It only routes users to the setup page; it grants no data access. An invited
  user self-setting it can only skip their own password step (locking
  themselves out when the invite session expires). Not privilege escalation in
  a single-admin invite-only model. To eliminate entirely, move the flag to a
  server-controlled `admin_profiles` table — noted as a future hardening, not
  required now.
- **Supabase built-in email** rate-limits ~2–4/hr; custom SMTP recommended
  before heavy password-reset use.

## 10. Non-applicable checks
Payments / subscriptions / webhooks (none); AI features (none); multi-tenant
isolation (single admin); IDOR (no per-user ownership — every authenticated
user is the sole admin by design); NoSQL injection (Postgres only); SSRF (no
server-side fetch of user-controlled URLs).

## 11. Manual actions required
See `SECURITY_DEPLOYMENT_CHECKLIST.md`.

## 12. Secret-rotation checklist
- **`SUPABASE_SERVICE_ROLE_KEY`** — was pasted into a tracked file earlier in
  development but caught and amended before any push (verified: **0 in git
  history, never on GitHub**). Rotation is **optional/precautionary**, not
  required. If rotating: Supabase → Settings → API → roll the `service_role`
  key, then update `.env.local` and the Vercel env var, and redeploy.
- No other credentials were exposed.

## 13. Supabase dashboard checklist
- Run `supabase/migrations/0001_products.sql` (if not already) and
  `0002_harden_storage.sql`.
- Authentication → Providers → Email → **disable public signup**.
- Authentication → URL Configuration → add redirect URLs for localhost, the
  Vercel preview pattern, and production.
- Confirm RLS is enabled on `public.products` (migration does this).

## 14. Vercel deployment checklist
- Set env vars: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`,
  `SUPABASE_SERVICE_ROLE_KEY`, `NEXT_PUBLIC_SITE_URL`.
- `NEXT_PUBLIC_SITE_URL` = production origin (drives canonicals/sitemap/OG).
- Confirm production build succeeds and source maps are not public.

## 15. Backup & recovery checklist
- Supabase provides automated daily backups (Pro plan) / point-in-time
  recovery. Verify the plan's backup cadence in the dashboard.
- Product images live in Supabase Storage — included in project backups.
- **Restore test:** periodically restore a backup to a scratch project and
  confirm `products` rows + storage objects are intact.
- The hardcoded `lib/products.ts` catalogue + `scripts/seed.ts` can re-seed the
  original 9 products if ever needed.
