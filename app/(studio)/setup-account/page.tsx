import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { SetupForm } from "@/components/studio/SetupForm";
import { DASHBOARD_PATH, getAdminUser } from "@/lib/auth";
import { needsOnboarding } from "@/lib/onboarding";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Krijo fjalëkalimin",
  robots: { index: false, follow: false, nocache: true },
};

export const dynamic = "force-dynamic";

/** Friendly, non-technical explanation for a dead link. */
function InvalidLink() {
  return (
    <div className="w-full max-w-[400px] text-center">
      <p className="font-playfair text-[24px] tracking-tight text-[#1c1917]">
        Kjo ftesë nuk vlen më
      </p>
      <p className="mt-3 text-[14px] leading-[1.7] text-[#78716c]">
        Lidhja e ftesës ka skaduar ose është përdorur tashmë. Ftesat janë të
        vlefshme për një kohë të kufizuar.
      </p>
      <div className="mt-6 rounded-xl border border-[#e7e5e4] bg-white p-5 text-left">
        <p className="text-[13px] font-medium text-[#44403c]">Çfarë të bësh</p>
        <p className="mt-2 text-[13px] leading-[1.7] text-[#78716c]">
          Kërko një ftesë të re dhe hape lidhjen sapo ta marrësh. Nëse ke
          vendosur tashmë një fjalëkalim, hyr normalisht.
        </p>
        <p className="mt-3 text-[13px] text-[#78716c]">
          Na shkruaj në{" "}
          <a
            href={SITE.instagram}
            target="_blank"
            rel="noreferrer"
            className="text-[#1c1917] underline underline-offset-4"
          >
            Instagram
          </a>{" "}
          për një ftesë të re.
        </p>
      </div>
      <p className="mt-6 text-[13px]">
        <Link
          href="/studio/login"
          className="text-[#a8a29e] underline-offset-4 transition-colors hover:text-[#78716c] hover:underline"
        >
          ← Kthehu te hyrja
        </Link>
      </p>
    </div>
  );
}

export default async function SetupAccountPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const user = await getAdminUser();

  // The invite link failed to produce a session, or it was opened cold.
  if (error === "link" || !user) {
    return (
      <main className="flex min-h-screen items-center justify-center px-6 py-16">
        <InvalidLink />
      </main>
    );
  }

  // Already onboarded — nothing to do here.
  if (!needsOnboarding(user)) redirect(DASHBOARD_PATH);

  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-16">
      <div className="w-full max-w-[400px]">
        <div className="mb-8 text-center">
          <p className="font-playfair text-[26px] tracking-tight text-[#1c1917]">
            Passion Dream
          </p>
          <h1 className="mt-6 font-playfair text-[22px] tracking-tight text-[#1c1917]">
            Krijo fjalëkalimin tënd
          </h1>
          <p className="mt-2 text-[14px] leading-[1.6] text-[#78716c]">
            Mirë se erdhe{user.email ? `, ${user.email}` : ""}. Zgjidh një
            fjalëkalim për të vazhduar.
          </p>
        </div>

        <SetupForm />

        <p className="mt-8 text-center text-[12px] leading-[1.6] text-[#a8a29e]">
          Vetëm ti e di këtë fjalëkalim. Askush tjetër nuk ka akses tek ai.
        </p>
      </div>
    </main>
  );
}
