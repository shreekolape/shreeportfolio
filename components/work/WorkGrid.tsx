"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { Flip } from "gsap/Flip";
import { gsap } from "@/lib/gsap";
import { projectFilters, projects } from "@/content/projects";
import { workPage } from "@/content/labels";
import { useMotionPrefs } from "@/providers/MotionPrefsProvider";
import { ProjectCard } from "./ProjectCard";

if (typeof window !== "undefined") gsap.registerPlugin(Flip);

type Filter = (typeof projectFilters)[number];

/** All projects with All · Client · E-commerce filters and a Flip transition. */
export function WorkGrid() {
  const [filter, setFilter] = useState<Filter>("All");
  const gridRef = useRef<HTMLUListElement>(null);
  const flipState = useRef<Flip.FlipState | null>(null);
  const { reducedMotion } = useMotionPrefs();

  const choose = (next: Filter) => {
    if (next === filter) return;
    if (!reducedMotion && gridRef.current) {
      flipState.current = Flip.getState(gridRef.current.children);
    }
    setFilter(next);
  };

  // Animate from the captured layout to the new one after React commits.
  useLayoutEffect(() => {
    const state = flipState.current;
    if (!state || !gridRef.current) return;
    flipState.current = null;
    Flip.from(state, {
      targets: gridRef.current.children,
      duration: 0.6,
      ease: "power3.inOut",
      scale: false,
      absolute: true,
      onEnter: (els) => gsap.fromTo(els, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.5, delay: 0.15 }),
      onLeave: (els) => gsap.to(els, { opacity: 0, y: -12, duration: 0.3 }),
    });
  }, [filter]);

  return (
    <>
      <div role="group" aria-label={workPage.filtersLabel} className="flex flex-wrap gap-2">
        {projectFilters.map((f) => {
          const active = f === filter;
          return (
            <button
              key={f}
              type="button"
              data-sound=""
              aria-pressed={active}
              onClick={() => choose(f)}
              className={[
                "rounded-full border px-4 py-2 font-mono text-xs transition-[color,background-color,border-color,transform] duration-200 active:scale-95",
                active
                  ? "border-accent bg-accent-soft text-accent"
                  : "border-line text-muted hover:border-fg/30 hover:text-fg",
              ].join(" ")}
            >
              {f}
            </button>
          );
        })}
      </div>

      <ul ref={gridRef} className="mt-12 grid gap-x-8 gap-y-16 md:grid-cols-2">
        {projects.map((project) => {
          const visible = filter === "All" || project.tags.includes(filter);
          return (
            <li
              key={project.slug}
              data-flip-id={project.slug}
              hidden={!visible}
              className={visible ? undefined : "hidden"}
            >
              <ProjectCard project={project} />
            </li>
          );
        })}
      </ul>
    </>
  );
}
