import type { NextConfig } from "next";

// Replaceable assets keep stable file names, so cache them for a day (not "immutable").
const assetCache = { key: "Cache-Control", value: "public, max-age=86400, stale-while-revalidate=604800" };

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  poweredByHeader: false,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
        ],
      },
      { source: "/sounds/:file*", headers: [assetCache] },
      { source: "/models/:file*", headers: [assetCache] },
    ];
  },
};

export default nextConfig;
