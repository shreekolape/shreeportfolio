import { getProject, projects } from "@/content/projects";
import { site } from "@/content/site";
import { ogSize, renderOgImage } from "@/lib/ogImage";

export const alt = "Project case study";
export const size = ogSize;
export const contentType = "image/png";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const project = getProject((await params).slug);
  return renderOgImage({
    kicker: project ? `${project.category} · ${site.name}` : site.name,
    title: project?.title ?? site.name,
    subtitle: project?.oneLiner ?? site.pitch,
  });
}
