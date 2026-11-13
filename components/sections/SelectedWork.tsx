"use client";

import { home } from "@/content/home";
import { featuredProjects } from "@/content/projects";
import { setActivePreview } from "@/lib/previewStore";
import { TransitionLink } from "@/components/transitions/TransitionLink";
import { MediaFrame } from "@/components/ui/MediaFrame";
import { Tag } from "@/components/ui/Tag";

/**
 * Clean list of featured projects. Hover/focus sets the active preview that
 * the 3D monitor plays; without 3D, rows show an inline thumbnail instead.
 */
export function SelectedWork() {
  const { heading, link } = home.selectedWork;

  return (
    <section data-scene="work" aria-labelledby="selected-work-heading" className="py-20 sm:py-32">
      <div className="wrap">
        <h2
          id="selected-work-heading"
          data-reveal=""
          className="font-mono text-xs uppercase tracking-widest text-muted"
        >
          {heading}
        </h2>

        <ul className="scene-aside mt-8 border-t border-line" onPointerLeave={() => setActivePreview(null)}>
          {featuredProjects.map((project, i) => (
            <li key={project.slug} data-reveal="" className="border-b border-line">
              <TransitionLink
                href={`/work/${project.slug}`}
                data-cursor="View"
                onPointerEnter={() => setActivePreview(project.slug)}
                onFocus={() => setActivePreview(project.slug)}
                onBlur={() => setActivePreview(null)}
                className="group grid gap-4 py-7 sm:py-9 md:grid-cols-[3rem_minmax(0,1.1fr)_minmax(0,1.4fr)] md:gap-8"
              >
                <span aria-hidden="true" className="hidden pt-2 font-mono text-xs text-subtle md:block">
                  {String(i + 1).padStart(2, "0")}
                </span>

                <div className="flex gap-4">
                  {/* Inline thumbnail stands in for the 3D monitor preview. */}
                  <MediaFrame
                    media={project.previewMedia}
                    aspect="16 / 9"
                    sizes="112px"
                    className="no3d-only w-28 shrink-0 rounded-lg"
                  />
                  <div className="transition-transform duration-500 ease-[var(--ease-out)] md:group-hover:translate-x-2">
                    <h3 className="text-2xl font-semibold tracking-tight transition-colors group-hover:text-accent sm:text-3xl">
                      {project.title}
                    </h3>
                    <p className="mt-1.5 font-mono text-xs text-muted">
                      {project.category}
                      {project.label && <span className="text-subtle"> · {project.label}</span>}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="leading-relaxed text-muted transition-colors group-hover:text-fg">
                    {project.oneLiner}
                  </p>
                  <ul aria-label="Stack" className="mt-4 flex flex-wrap gap-1.5">
                    {project.stack.map((item) => (
                      <li key={item}>
                        <Tag>{item}</Tag>
                      </li>
                    ))}
                  </ul>
                </div>
              </TransitionLink>
            </li>
          ))}
        </ul>

        <TransitionLink
          href={link.href}
          className="link-underline mt-10 inline-block font-mono text-sm text-accent transition-[text-shadow] hover:text-glow"
        >
          {link.label}
        </TransitionLink>
      </div>
    </section>
  );
}
