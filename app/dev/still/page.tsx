import type { Metadata } from "next";
import { notFound } from "next/navigation";
import DevStillView from "@/components/three/dev/DevStillView";

// Dev-only: renders the desk scene in one pose/shot/time of day, full screen,
// for capturing the fallback stills. 404s outside development; /dev/ is
// disallowed in robots.ts and absent from the sitemap.
export const metadata: Metadata = { title: "Still (dev)", robots: { index: false, follow: false } };

export default function DevStillPage() {
  if (process.env.NODE_ENV !== "development") notFound();
  return <DevStillView />;
}
