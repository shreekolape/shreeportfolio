/**
 * Absolute site URL for canonical links, Open Graph, the sitemap and robots.
 * Order: NEXT_PUBLIC_SITE_URL (set once there's a custom domain), then
 * Vercel's production domain, then the current deployment's URL (previews),
 * then localhost for local development.
 */
const withProtocol = (host: string | undefined) => (host ? `https://${host.replace(/^https?:\/\//, "")}` : undefined);

export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  withProtocol(process.env.VERCEL_PROJECT_PRODUCTION_URL) ||
  withProtocol(process.env.VERCEL_URL) ||
  "http://localhost:3000";
