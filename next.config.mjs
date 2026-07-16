/** @type {import('next').NextConfig} */
const nextConfig = {
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
