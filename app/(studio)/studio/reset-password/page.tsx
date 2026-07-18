import Link from "next/link";

import { ResetPasswordForm } from "@/components/studio/ResetPasswordForm";
import { Banner } from "@/components/studio/ui";
import { getAdminUser } from "@/lib/auth";

// The recovery session lives in a cookie; never cache this page.
export const dynamic = "force-dynamic";

/**
 * Password reset.
 *
 * The session is checked HERE, on the server, rather than in the browser. The
 * previous client-side getSession() check raced the Supabase SDK rehydrating
 * after navigation, so a perfectly valid recovery link rendered as expired.
 */
export default async function ResetPasswordPage() {
  const user = await getAdminUser();

  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-16">
      <div className="w-full max-w-[380px]">
        <div className="mb-8 text-center">
          <p className="font-playfair text-[24px] tracking-tight text-[#1c1917]">
            Fjalëkalim i ri
          </p>
          <p className="mt-2 text-[14px] text-[#78716c]">
            {user
              ? "Zgjidh një fjalëkalim të ri për llogarinë tënde."
              : "Kjo lidhje nuk është më e vlefshme."}
          </p>
        </div>

        {user ? (
          <ResetPasswordForm />
        ) : (
          <div className="space-y-4">
            <Banner tone="error">
              Kjo lidhje ka skaduar ose është përdorur tashmë.
            </Banner>
            <Link
              href="/studio/forgot-password"
              className="block text-center text-[13px] text-[#78716c] underline-offset-4 hover:text-[#1c1917] hover:underline"
            >
              Kërko një lidhje të re
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
