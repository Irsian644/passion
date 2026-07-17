import type { Metadata } from "next";

export const metadata: Metadata = {
  // Neither the dashboard nor the account-setup page belongs in search.
  robots: { index: false, follow: false, nocache: true },
};

/**
 * Admin shell: a clean surface with none of the public site's chrome.
 *
 * Deliberately does not mount LanguageProvider — the dashboard is Albanian
 * only, and no component under it calls useLang().
 */
export default function StudioGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#faf9f7] text-[#1c1917]">{children}</div>
  );
}
