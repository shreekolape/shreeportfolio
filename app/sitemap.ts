import type { MetadataRoute } from "next";
import { projects } from "@/content/projects";
import { siteUrl } from "@/lib/siteUrl";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["/", "/work", "/about", "/contact", ...projects.map((p) => `/work/${p.slug}`)];
  return routes.map((path) => ({
    url: new URL(path, siteUrl).toString(),
    changeFrequency: "monthly",
    priority: path === "/" ? 1 : path.startsWith("/work/") ? 0.7 : 0.8,
  }));
}
