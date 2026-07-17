import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
      <p className="eyebrow justify-center mb-6">404</p>
      <h1 className="font-display text-[clamp(2.4rem,6vw,4.5rem)] leading-[1.05] text-ink text-balance">
        This page slipped away like a pearl.
      </h1>
      <p className="mt-5 max-w-md text-[16px] text-stone">
        The page you were looking for isn&apos;t here — but the collection still is.
      </p>
      <Link href="/" className="btn-primary mt-10">
        <span>Return home</span>
      </Link>
    </div>
  );
}
