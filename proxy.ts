import { NextResponse, type NextRequest } from "next/server";
import { projects } from "@/content/projects";

const slugs = new Set(projects.map((p) => p.slug));

/**
 * Unknown /work/<slug> URLs would otherwise stream the 404 UI with a 200
 * status (Partial Prerendering sends the shell first). Checking the slug here,
 * before rendering, lets them return a real 404.
 */
export function proxy(request: NextRequest) {
  const slug = request.nextUrl.pathname.split("/")[2];
  if (slug && !slugs.has(slug)) {
    return NextResponse.rewrite(new URL("/_unknown-project", request.url), { status: 404 });
  }
  return NextResponse.next();
}

export const config = {
  matcher: "/work/:slug",
};
