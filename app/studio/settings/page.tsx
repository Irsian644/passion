import Link from "next/link";

import { PasswordForm } from "@/components/studio/PasswordForm";
import { requireAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const user = await requireAdmin();

  return (
    <main className="mx-auto max-w-[480px] px-5 py-10 sm:px-6 sm:py-14">
      <Link
        href="/studio"
        className="text-[13px] text-[#78716c] underline-offset-4 transition-colors hover:text-[#1c1917] hover:underline"
      >
        ← Produktet
      </Link>

      <h1 className="mt-4 font-playfair text-[28px] tracking-tight">Cilësimet</h1>

      <section className="mt-8 rounded-xl border border-[#e7e5e4] bg-white p-5">
        <h2 className="text-[15px] font-medium text-[#1c1917]">Llogaria</h2>
        <p className="mt-1 text-[13px] text-[#78716c]">{user.email}</p>
      </section>

      <section className="mt-4 rounded-xl border border-[#e7e5e4] bg-white p-5">
        <h2 className="text-[15px] font-medium text-[#1c1917]">
          Ndrysho fjalëkalimin
        </h2>
        <div className="mt-4">
          <PasswordForm />
        </div>
      </section>
    </main>
  );
}
