import type { ReactNode } from "react";
import { about } from "@/content/about";
import { education, experience } from "@/content/experience";
import { skillTiers } from "@/content/skills";
import { ContentText } from "@/components/ui/ContentText";
import { MediaFrame } from "@/components/ui/MediaFrame";
import { Tag } from "@/components/ui/Tag";

export const metadata = { title: about.heading };

function Section({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section
      aria-labelledby={id}
      className="grid gap-6 border-t border-line py-14 sm:py-20 md:grid-cols-[minmax(0,1fr)_minmax(0,2.4fr)] md:gap-12"
    >
      <h2 id={id} className="font-mono text-xs uppercase tracking-widest text-muted">
        {title}
      </h2>
      <div className="min-w-0">{children}</div>
    </section>
  );
}

export default function AboutPage() {
  const { intro, photo, sections, howIWork } = about;

  return (
    <div className="wrap pb-16 pt-[calc(var(--header-h)+5rem)] sm:pt-[calc(var(--header-h)+8rem)]">
      <div className="grid gap-12 pb-16 md:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] md:items-end md:gap-16 sm:pb-24">
        <div>
          <h1 className="text-6xl font-semibold tracking-[-0.04em] sm:text-8xl">{about.heading}</h1>
          {!intro.approved && (
            <p data-dev-note="" className="mt-6">
              <ContentText value={intro.draftNote} />
            </p>
          )}
          <div className="mt-8 grid max-w-2xl gap-5 text-lg leading-relaxed text-muted sm:text-xl">
            {intro.paragraphs.map((p, i) => (
              <p key={i} className={i === 0 ? "text-fg" : undefined}>
                {p}
              </p>
            ))}
          </div>
        </div>
        <MediaFrame media={photo} aspect="4 / 5" sizes="(min-width: 768px) 35vw, 100vw" className="max-w-sm md:max-w-none" />
      </div>

      <Section id="education" title={sections.education}>
        <p className="text-xl font-semibold tracking-tight sm:text-2xl">{education.degree}</p>
        <p className="mt-2 font-mono text-xs text-muted">
          {education.university} · {education.year}
        </p>
      </Section>

      <Section id="experience" title={sections.experience}>
        <ol className="grid gap-12">
          {experience.map((job) => (
            <li key={job.company} className="relative border-l border-line pl-6">
              <span aria-hidden="true" className="absolute -left-[4.5px] top-2 h-2 w-2 rounded-full bg-accent shadow-glow" />
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <h3 className="text-xl font-semibold tracking-tight sm:text-2xl">{job.company}</h3>
                <p className="font-mono text-xs text-muted">{job.period}</p>
              </div>
              <p className="mt-1 text-muted">{job.role}</p>
              <ul className="mt-4 grid gap-2 text-muted">
                {job.points.map((point) => (
                  <li key={point} className="flex gap-3 leading-relaxed">
                    <span aria-hidden="true" className="mt-[0.7em] h-px w-3 shrink-0 bg-subtle" />
                    {point}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </Section>

      <Section id="skills" title={sections.skills}>
        <div className="grid gap-10">
          {skillTiers.map((tier) => (
            <div key={tier.title}>
              <h3 className="text-lg font-semibold tracking-tight">{tier.title}</h3>
              <ul className="mt-4 flex flex-wrap gap-2">
                {tier.items.map((item) => (
                  <li key={item}>
                    <Tag className="px-3 py-1.5 text-xs text-fg/85">{item}</Tag>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      <Section id="how-i-work" title={sections.howIWork}>
        <p className="max-w-2xl text-lg leading-relaxed text-muted">
          <ContentText value={howIWork} />
        </p>
      </Section>
    </div>
  );
}
