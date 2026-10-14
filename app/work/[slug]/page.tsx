import type { Metadata } from "next";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { getNextProject, getProject, projects } from "@/content/projects";
import { caseStudyLabels as L } from "@/content/labels";
import type { WorkStatus } from "@/content/types";
import { isPlaceholder } from "@/lib/links";
import { pageMetadata } from "@/lib/metadata";
import { ContentText } from "@/components/ui/ContentText";
import { MediaFrame } from "@/components/ui/MediaFrame";
import { SmartLink } from "@/components/ui/SmartLink";
import { Tag } from "@/components/ui/Tag";
import { TransitionLink } from "@/components/transitions/TransitionLink";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/work/[slug]">): Promise<Metadata> {
  const project = getProject((await params).slug);
  if (!project) return {};
  return pageMetadata({ title: project.title, description: project.oneLiner, path: `/work/${project.slug}` });
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section data-reveal="" className="grid gap-4 border-t border-line py-12 sm:py-16 md:grid-cols-[minmax(0,1fr)_minmax(0,2.2fr)] md:gap-12">
      <h2 className="font-mono text-xs uppercase tracking-widest text-muted">{title}</h2>
      <div className="min-w-0">{children}</div>
    </section>
  );
}

function StatusBadge({ status }: { status: WorkStatus }) {
  if (isPlaceholder(status)) return <ContentText value={status} className="text-[11px]" />;
  return (
    <Tag className={status === "Shipped" ? "border-accent text-accent" : undefined}>{status}</Tag>
  );
}

export default async function CaseStudyPage({ params }: PageProps<"/work/[slug]">) {
  const project = getProject((await params).slug);
  if (!project) notFound();

  const cs = project.caseStudy;
  const next = getNextProject(project.slug);
  const meta = [
    { label: L.type, value: cs.meta?.type ?? project.type },
    { label: L.role, value: cs.meta?.role ?? project.role },
    { label: L.stack, value: (cs.meta?.stack ?? project.stack).join(", ") },
    { label: L.status, value: project.status },
  ];
  const showRepo = Boolean(project.repoUrl);

  return (
    <article className="wrap pb-16 pt-[calc(var(--header-h)+5rem)] sm:pt-[calc(var(--header-h)+8rem)]">
      {/* Header */}
      <header>
        <p className="font-mono text-xs text-muted">
          {project.category}
          {project.label && <span className="text-subtle"> · {project.label}</span>}
        </p>
        <h1 className="mt-4 max-w-5xl text-5xl font-semibold leading-[0.98] tracking-[-0.04em] sm:text-7xl lg:text-8xl">
          {cs.headline ?? project.title}
        </h1>
        {!cs.headline && <p className="mt-6 max-w-3xl text-lg text-muted sm:text-xl">{project.oneLiner}</p>}

        <dl className="mt-12 grid gap-6 border-t border-line pt-8 sm:grid-cols-2 lg:grid-cols-4">
          {meta.map((m) => (
            <div key={m.label}>
              <dt className="font-mono text-[11px] uppercase tracking-widest text-subtle">{m.label}</dt>
              <dd className="mt-2 text-sm leading-relaxed text-fg">
                <ContentText value={m.value} />
              </dd>
            </div>
          ))}
        </dl>

        {(project.liveUrl !== null || showRepo) && (
          <ul className="mt-8 flex flex-wrap gap-3">
            {project.liveUrl !== null && (
              <li>
                <SmartLink
                  href={project.liveUrl}
                  className="inline-flex items-center rounded-full border border-line px-5 py-2.5 text-sm transition-colors hover:border-accent hover:text-accent"
                >
                  {L.liveSite} ↗
                </SmartLink>
              </li>
            )}
            {showRepo && (
              <li>
                <SmartLink
                  href={project.repoUrl}
                  className="inline-flex items-center rounded-full border border-line px-5 py-2.5 text-sm transition-colors hover:border-accent hover:text-accent"
                >
                  {L.repo} ↗
                </SmartLink>
              </li>
            )}
          </ul>
        )}
      </header>

      {cs.note && (
        <p className="mt-12 max-w-3xl rounded-xl border border-line bg-bg-elevated px-5 py-4 text-sm leading-relaxed text-muted">
          {cs.note}
        </p>
      )}

      <MediaFrame media={project.cover} priority sizes="(min-width: 1280px) 1216px, 100vw" className="mt-12 sm:mt-16" />

      <div className="mt-12 sm:mt-20">
        <Section title={L.overview}>
          <p className="max-w-3xl text-lg leading-relaxed sm:text-xl">{cs.overview}</p>
        </Section>

        {cs.brief && (
          <Section title={L.brief}>
            <p className="max-w-3xl text-lg leading-relaxed text-muted">{cs.brief}</p>
          </Section>
        )}

        <Section title={cs.whatIDidHeading ?? L.whatIDid}>
          <ul className="max-w-3xl divide-y divide-line">
            {cs.whatIDid.map((item) => (
              <li key={item.title ?? item.body} className="flex flex-col gap-2 py-4 first:pt-0 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
                <p className="leading-relaxed text-muted">
                  {item.title && <strong className="font-semibold text-fg">{item.title}: </strong>}
                  {item.body}
                </p>
                {item.status && (
                  <span className="shrink-0">
                    <StatusBadge status={item.status} />
                  </span>
                )}
              </li>
            ))}
          </ul>
        </Section>

        {cs.challenges && cs.challenges.length > 0 && (
          <Section title={L.challenges}>
            <ol className="grid max-w-3xl gap-10">
              {cs.challenges.map((c, i) => (
                <li key={c.title}>
                  <h3 className="flex gap-3 text-xl font-semibold tracking-tight sm:text-2xl">
                    <span aria-hidden="true" className="pt-1.5 font-mono text-xs text-accent">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {c.title}
                  </h3>
                  <dl className="mt-4 grid gap-4 sm:pl-8">
                    <div>
                      <dt className="font-mono text-[11px] uppercase tracking-widest text-subtle">{L.challenge}</dt>
                      <dd className="mt-1.5 leading-relaxed text-muted">{c.challenge}</dd>
                    </div>
                    <div>
                      <dt className="font-mono text-[11px] uppercase tracking-widest text-subtle">{L.approach}</dt>
                      <dd className="mt-1.5 leading-relaxed text-muted">
                        <ContentText value={c.approach} />
                      </dd>
                    </div>
                  </dl>
                </li>
              ))}
            </ol>
          </Section>
        )}

        {cs.learned && (
          <Section title={L.learned}>
            <p className="max-w-3xl text-lg leading-relaxed">{cs.learned}</p>
          </Section>
        )}

        {project.gallery.length > 0 && (
          <Section title={L.gallery}>
            <ul className="grid gap-4 sm:grid-cols-2">
              {project.gallery.map((media) => (
                <li key={media.label}>
                  <MediaFrame media={media} sizes="(min-width: 768px) 40vw, 100vw" />
                </li>
              ))}
            </ul>
          </Section>
        )}

        {cs.outcome && (
          <Section title={L.outcome}>
            <p className="max-w-3xl text-lg leading-relaxed">
              <ContentText value={cs.outcome} />
            </p>
          </Section>
        )}
      </div>

      <nav aria-label="Next project" className="mt-8 border-t border-line pt-12 sm:pt-16">
        <TransitionLink href={`/work/${next.slug}`} data-cursor="View" className="group block">
          <span className="font-mono text-xs uppercase tracking-widest text-muted">{L.nextProject}</span>
          <span className="mt-3 block text-5xl font-semibold tracking-[-0.04em] transition-colors group-hover:text-accent sm:text-7xl">
            {next.title}
          </span>
          <span className="mt-2 block font-mono text-xs text-muted">{next.category}</span>
        </TransitionLink>
      </nav>
    </article>
  );
}
