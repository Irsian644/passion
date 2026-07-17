# Security & Deployment Checklist

Complete these manual steps before and after going live. Code-level protections
are already implemented; these require dashboard/infra access.

## 1. Supabase — database & storage

- [ ] Run `supabase/migrations/0001_products.sql` (creates `products`, RLS
      policies, storage policies). Safe to re-run.
- [ ] Run `supabase/migrations/0002_harden_storage.sql` (locks the
      `product-images` bucket to image MIME types + 25MB). Additive, reversible,
      existing files unaffected.
- [ ] Confirm **RLS is enabled** on `public.products` (Table editor → products →
      RLS should be ON).

## 2. Supabase — authentication

- [ ] Authentication → Providers → **Email** → ensure **"Enable signup" is
      OFF** (invite-only).
- [ ] Authentication → **URL Configuration** → Redirect URLs, add:
  - `http://localhost:3000/**`
  - `https://<your-vercel-preview-pattern>.vercel.app/**`
  - `https://<production-domain>/**`
- [ ] Set **Site URL** to the production origin.
- [ ] (Recommended) Project Settings → Auth → **Custom SMTP** — the built-in
      email service is rate-limited (~2–4/hr) and unsuitable for production
      password resets. Use a provider (e.g. Resend) with your own domain.

## 3. Vercel — environment variables

Set in Project → Settings → Environment Variables (do **not** commit these):

- [ ] `NEXT_PUBLIC_SUPABASE_URL`
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`  _(browser-safe; RLS-constrained)_
- [ ] `SUPABASE_SERVICE_ROLE_KEY`  _(secret; server-only)_
- [ ] `NEXT_PUBLIC_SITE_URL`  _(production origin, no trailing slash — drives
      canonicals, sitemap, OG tags)_

## 4. Credentials to rotate

- [ ] **`SUPABASE_SERVICE_ROLE_KEY`** — _optional/precautionary_. It was briefly
      in a tracked file during development but caught and amended before any
      push (verified 0 in git history, never on GitHub). If rotating: Supabase →
      Settings → API → roll the `service_role` key → update `.env.local` and the
      Vercel var → redeploy.
- [ ] Change the temporary admin password set during testing
      (`Temp-Test-Pass-2026!`) via the dashboard **Cilësimet** page or the
      "Ke harruar fjalëkalimin?" flow.

## 5. Post-deployment verification

- [ ] Visit the production site — products render, images load.
- [ ] Footer → "Menaxho Produktet" → log in → dashboard loads.
- [ ] Log out, then open `/studio` directly → redirected to login (not
      accessible).
- [ ] Confirm response headers include `Content-Security-Policy`,
      `Strict-Transport-Security`, `X-Content-Type-Options: nosniff`.
- [ ] Confirm the production CSP does **not** contain `unsafe-eval`
      (dev-only).
- [ ] Confirm `/robots.txt` disallows `/studio` and the sitemap uses the
      production domain.
- [ ] View source on a product page → JSON-LD shows `<` for any `<`,
      never a raw `</script>`.

## 6. Environment / build hygiene

- [ ] Production build passes (`npm run build`).
- [ ] `npm audit --omit=dev` → 0 vulnerabilities.
- [ ] Production browser source maps are not enabled (they are not).
- [ ] Move the project off OneDrive on the dev machine (OneDrive corrupts the
      Next.js `.next` build cache on Windows).

## 7. Backups & monitoring (infrastructure)

- [ ] Verify Supabase backup cadence for your plan (daily / PITR).
- [ ] Periodically restore a backup to a scratch project and confirm
      `products` + storage objects are intact.
- [ ] Consider enabling an error-monitoring integration (e.g. Sentry) via env
      vars for production error visibility.
