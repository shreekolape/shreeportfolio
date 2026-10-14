import type { Metadata } from "next";
import { site } from "@/content/site";

/**
 * Complete per-page metadata. Next merges metadata shallowly, so each page
 * sets its own full openGraph/twitter objects instead of partial overrides.
 * og:image comes from the nearest opengraph-image.tsx.
 */
export function pageMetadata({
  title,
  description,
  path,
}: {
  /** Omit for the home page (uses the site name alone). */
  title?: string;
  description: string;
  path: string;
}): Metadata {
  const fullTitle = title ? `${title} · ${site.name}` : site.name;
  return {
    ...(title ? { title } : {}),
    description,
    alternates: { canonical: path },
    openGraph: { type: "website", siteName: site.name, title: fullTitle, description, url: path },
    twitter: { card: "summary_large_image", title: fullTitle, description },
  };
}
