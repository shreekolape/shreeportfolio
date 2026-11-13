import type { Project } from "@/content/types";
import { TransitionLink } from "@/components/transitions/TransitionLink";
import { ProjectCover } from "@/components/ui/ProjectCover";
import { Tag } from "@/components/ui/Tag";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <TransitionLink href={`/work/${project.slug}`} data-cursor="View" className="group block">
      <ProjectCover
        project={project}
        sizes="(min-width: 768px) 50vw, 100vw"
        className="transition-[border-color] duration-300 group-hover:border-accent"
      />
      <div className="mt-5 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h2 className="text-2xl font-semibold tracking-tight transition-colors group-hover:text-accent sm:text-3xl">
          {project.title}
        </h2>
        <p className="font-mono text-xs text-muted">{project.category}</p>
      </div>
      {project.label && <p className="mt-1 font-mono text-xs text-subtle">{project.label}</p>}
      <p className="mt-3 max-w-xl leading-relaxed text-muted">{project.oneLiner}</p>
      <ul aria-label="Stack" className="mt-4 flex flex-wrap gap-1.5">
        {project.stack.map((item) => (
          <li key={item}>
            <Tag>{item}</Tag>
          </li>
        ))}
      </ul>
    </TransitionLink>
  );
}
