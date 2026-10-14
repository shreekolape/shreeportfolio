/**
 * Absolute site URL for metadata, OG images, sitemap and robots.
 * Set NEXT_PUBLIC_SITE_URL once the domain is known; on Vercel the
 * production URL is used automatically until then.
 */
export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");
