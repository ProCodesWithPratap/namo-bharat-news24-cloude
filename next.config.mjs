import { withPayload } from "@payloadcms/next/withPayload";

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
      { protocol: "http", hostname: "localhost" },
    ],
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 86400,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 64, 96, 128, 256, 384],
  },
  experimental: {},
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
      {
        source: "/_next/static/(.*)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
    ];
  },
  async redirects() {
    return [
      { source: "/about-us", destination: "/about", permanent: true },
      { source: "/contact-us", destination: "/contact", permanent: true },
      { source: "/privacy-policy", destination: "/privacy", permanent: true },
      { source: "/terms-conditions", destination: "/terms", permanent: true },
      { source: "/epaper", destination: "/e-paper", permanent: true },
      { source: "/state", destination: "/states", permanent: true },
      { source: "/tech", destination: "/technology", permanent: true },
      { source: "/life-style", destination: "/lifestyle", permanent: true },
      { source: "/articles/:slug", destination: "/article/:slug", permanent: true },
      { source: "/category/:category", destination: "/:category", permanent: true },
      { source: "/authors/:slug", destination: "/author/:slug", permanent: true },
      { source: "/tags/:tag", destination: "/tag/:tag", permanent: true },
    ];
  },
};

export default withPayload(nextConfig);
