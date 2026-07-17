/** @type {import('next').NextConfig} */
const nextConfig = {
  // An unrelated package-lock.json in the user's home directory makes Next
  // infer the wrong workspace root, which breaks build file tracing. Pin it.
  outputFileTracingRoot: import.meta.dirname,
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 31536000,
    // Product images live in Supabase Storage. next/image refuses any remote
    // host that isn't listed here.
    remotePatterns: [
      {
        protocol: "https",
        hostname: new URL(
          process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://placeholder.supabase.co",
        ).hostname,
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  poweredByHeader: false,
  compress: true,
};

export default nextConfig;
