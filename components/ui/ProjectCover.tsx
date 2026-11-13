import type { Project } from "@/content/types";
import { MediaFrame } from "./MediaFrame";
import { TypographicCover } from "./TypographicCover";

/** A project's cover image, or a typographic cover (title + category) until it has one. */
export function ProjectCover({
  project,
  sizes,
  priority,
  className,
}: {
  project: Project;
  sizes?: string;
  priority?: boolean;
  className?: string;
}) {
  if (!project.cover.src) return <TypographicCover title={project.title} subtitle={project.category} className={className} />;
  return <MediaFrame media={project.cover} sizes={sizes} priority={priority} className={className} />;
}
