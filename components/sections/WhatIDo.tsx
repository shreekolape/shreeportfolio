import { home } from "@/content/home";

/** Exactly two blocks. 3D state: camera orbits slightly, typing idle. */
export function WhatIDo() {
  const { heading, blocks } = home.whatIDo;

  return (
    <section data-scene="services" aria-labelledby="what-i-do-heading" className="py-20 sm:py-32">
      <div className="wrap">
        <h2 id="what-i-do-heading" className="font-mono text-xs uppercase tracking-widest text-muted">
          {heading}
        </h2>
        <div className="mt-8 grid gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-2">
          {blocks.map((block, i) => (
            <article key={block.title} className="bg-bg p-8 sm:p-12">
              <span aria-hidden="true" className="font-mono text-xs text-accent">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-6 text-3xl font-semibold tracking-tight sm:text-4xl">{block.title}</h3>
              <p className="mt-4 max-w-md leading-relaxed text-muted">{block.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
