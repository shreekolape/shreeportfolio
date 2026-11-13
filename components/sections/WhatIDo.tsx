"use client";

import { home } from "@/content/home";
import { setActivePreview } from "@/lib/previewStore";
import { TransitionLink } from "@/components/transitions/TransitionLink";
import { MediaFrame } from "@/components/ui/MediaFrame";
import { Tag } from "@/components/ui/Tag";

/**
 * Numbered rows, same list pattern as Selected Work. Hover/focus sets the
 * active preview the 3D monitor plays; without 3D, rows show an inline
 * thumbnail. Row 10 (AI Agents) is a "Coming soon" preview: dimmed, not
 * clickable, no proof link, no cursor label.
 */
export function WhatIDo() {
  const { heading, rows } = home.whatIDo;

  return (
    <section data-scene="services" aria-labelledby="what-i-do-heading" className="py-20 sm:py-32">
      <div className="wrap">
        <h2 id="what-i-do-heading" data-reveal="" className="font-mono text-xs uppercase tracking-widest text-muted">
          {heading}
        </h2>

        <ul className="scene-aside mt-8 border-t border-line" onPointerLeave={() => setActivePreview(null)}>
          {rows.map((row, i) => {
            const slug = `what-i-do-${i}`;
            const content = (
              <>
                <span aria-hidden="true" className="hidden pt-2 font-mono text-xs text-subtle md:block">
                  {String(i + 1).padStart(2, "0")}
                </span>

                <div className="flex gap-4">
                  <MediaFrame
                    media={row.mockup}
                    aspect="16 / 9"
                    sizes="112px"
                    className="no3d-only w-28 shrink-0 rounded-lg"
                  />
                  <div>
                    <h3 className="text-xl font-semibold tracking-tight sm:text-2xl">{row.title}</h3>
                    {row.comingSoon && (
                      <Tag className="mt-2 border-accent text-accent">Coming soon</Tag>
                    )}
                  </div>
                </div>

                <div>
                  <p className="leading-relaxed text-muted">{row.body}</p>
                  {row.proof && (
                    <span className="link-underline mt-3 inline-block font-mono text-sm text-accent transition-[text-shadow] hover:text-glow">
                      {row.proof.label}
                    </span>
                  )}
                </div>
              </>
            );

            const rowClass =
              "grid gap-4 py-7 sm:py-9 md:grid-cols-[3rem_minmax(0,1.1fr)_minmax(0,1.4fr)] md:gap-8";

            return (
              <li key={row.title} data-reveal="" className="border-b border-line">
                {row.comingSoon ? (
                  <div
                    className={`${rowClass} opacity-70`}
                    onPointerEnter={() => setActivePreview(slug)}
                  >
                    {content}
                  </div>
                ) : row.proof ? (
                  <TransitionLink
                    href={row.proof.href}
                    data-cursor="View"
                    onPointerEnter={() => setActivePreview(slug)}
                    onFocus={() => setActivePreview(slug)}
                    onBlur={() => setActivePreview(null)}
                    className={`group ${rowClass}`}
                  >
                    {content}
                  </TransitionLink>
                ) : (
                  <div
                    className={rowClass}
                    onPointerEnter={() => setActivePreview(slug)}
                    onFocus={() => setActivePreview(slug)}
                    onBlur={() => setActivePreview(null)}
                    tabIndex={0}
                  >
                    {content}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
