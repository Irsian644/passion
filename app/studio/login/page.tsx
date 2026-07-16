import Link from "next/link";

import { LoginForm } from "@/components/studio/LoginForm";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-16">
      <div className="w-full max-w-[380px]">
        <div className="mb-10 text-center">
          <p className="font-playfair text-[26px] tracking-tight text-[#1c1917]">
            Passion Dream
          </p>
          <p className="mt-2 text-[14px] text-[#78716c]">
            Hyr për të menaxhuar produktet
          </p>
        </div>

        <LoginForm />

        <p className="mt-6 text-center text-[13px]">
          <Link
            href="/studio/forgot-password"
            className="text-[#78716c] underline-offset-4 transition-colors hover:text-[#1c1917] hover:underline"
          >
            Ke harruar fjalëkalimin?
          </Link>
        </p>

        <p className="mt-10 text-center text-[13px]">
          <Link
            href="/"
            className="text-[#a8a29e] underline-offset-4 transition-colors hover:text-[#78716c] hover:underline"
          >
            ← Kthehu te faqja
          </Link>
        </p>
      </div>
    </main>
  );
}
