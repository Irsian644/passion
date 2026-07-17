# Security Policy

## Reporting a vulnerability

Email **hello@passiondream.al** with details and reproduction steps. Please do
not open a public issue for security reports. We aim to acknowledge within a few
business days.

## Security model (summary)

- **Invite-only admin.** There is exactly one administrator role and no public
  signup. Only invited users can authenticate, and an invited user must create
  their own password before reaching the dashboard.
- **Authorization is server-side.** Every mutation runs through a Server Action
  that calls `requireAdmin()`; Supabase Row Level Security is the second,
  database-level boundary. Hiding a route is never the only protection.
- **Secrets never reach the browser.** The service-role key is imported only by
  `server-only` modules. The browser uses the anon key, constrained by RLS.
- **Uploads are server-authorized.** Image uploads receive a one-shot signed URL
  from a server action after MIME validation; filenames are random UUIDs.
- **Secure sessions.** Auth cookies are `HttpOnly`, `SameSite=Lax`, and `Secure`
  in production.
- **Security headers** (CSP, HSTS, `X-Content-Type-Options`, `Referrer-Policy`,
  `Permissions-Policy`, `frame-ancestors 'none'`) are set in `middleware.ts`.

## For contributors

- Never commit `.env`, `.env.local`, or any real key. Only `.env.example`
  (placeholder names) is tracked.
- Put real values in `.env.local` (gitignored) and in Vercel env vars.
- Any new mutation must call `requireAdmin()` and validate input with Zod.
- Never pass untrusted strings to `dangerouslySetInnerHTML` without escaping.
- Keep the service-role client out of any file that could be bundled for the
  browser.

See `SECURITY_AUDIT.md` for the full audit and `SECURITY_DEPLOYMENT_CHECKLIST.md`
for deployment steps.
