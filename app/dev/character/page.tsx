import type { Metadata } from "next";
import { notFound } from "next/navigation";
import DevCharacterView from "@/components/three/dev/DevCharacterView";

// Dev-only character preview/reference tool. 404s outside development, so it
// isn't reachable in the production build; also kept out of app/sitemap.ts.
export const metadata: Metadata = { title: "Character (dev)", robots: { index: false, follow: false } };

export default function DevCharacterPage() {
  if (process.env.NODE_ENV !== "development") notFound();
  return <DevCharacterView />;
}
