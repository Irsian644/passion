import Link from "next/link";

import { ForgotPasswordForm } from "@/components/studio/ForgotPasswordForm";
import { Banner } from "@/components/studio/ui";

export default async function ForgotPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-16">
      <div className="w-full max-w-[380px]">
        <div className="mb-8 text-center">
          <p className="font-playfair text-[24px] tracking-tight text-[#1c1917]">
            Rivendos fjalëkalimin
          </p>
          <p className="mt-2 text-[14px] leading-[1.6] text-[#78716c]">
            Shkruaj email-in tënd dhe do të marrësh një lidhje për ta ndryshuar.
          </p>
        </div>

        {/* A recovery link that failed to exchange (expired or already used)
            lands back here rather than on the invitation page. */}
        {error === "link" ? (
          <div className="mb-4">
            <Banner tone="error">
              Kjo lidhje ka skaduar ose është përdorur tashmë. Kërko një të re
              më poshtë.
            </Banner>
          </div>
        ) : null}

        <ForgotPasswordForm />

        <p className="mt-8 text-center text-[13px]">
          <Link
            href="/studio/login"
            className="text-[#a8a29e] underline-offset-4 transition-colors hover:text-[#78716c] hover:underline"
          >
            ← Kthehu te hyrja
          </Link>
        </p>
      </div>
    </main>
  );
}
