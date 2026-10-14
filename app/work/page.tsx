import { workPage } from "@/content/labels";
import { projects } from "@/content/projects";
import { pageMetadata } from "@/lib/metadata";
import { WorkGrid } from "@/components/work/WorkGrid";

const titles = projects.map((p) => p.title);

export const metadata = pageMetadata({
  title: workPage.heading,
  // Built from the project list so it never drifts from the data.
  description: `Client projects: ${titles.slice(0, -1).join(", ")} and ${titles.at(-1)}.`,
  path: "/work",
});

export default function WorkPage() {
  return (
    <section className="wrap pb-24 pt-[calc(var(--header-h)+5rem)] sm:pb-32 sm:pt-[calc(var(--header-h)+8rem)]">
      <h1 className="mb-10 text-6xl font-semibold tracking-[-0.04em] sm:text-8xl">{workPage.heading}</h1>
      <WorkGrid />
    </section>
  );
}
