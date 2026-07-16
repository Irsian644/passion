import { ResetPasswordForm } from "@/components/studio/ResetPasswordForm";

export default function ResetPasswordPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-16">
      <div className="w-full max-w-[380px]">
        <div className="mb-8 text-center">
          <p className="font-playfair text-[24px] tracking-tight text-[#1c1917]">
            Fjalëkalim i ri
          </p>
          <p className="mt-2 text-[14px] text-[#78716c]">
            Zgjidh një fjalëkalim të ri për llogarinë tënde.
          </p>
        </div>

        <ResetPasswordForm />
      </div>
    </main>
  );
}
