import { workPage } from "@/content/labels";
import { WorkGrid } from "@/components/work/WorkGrid";

export const metadata = { title: workPage.heading };

export default function WorkPage() {
  return (
    <section className="wrap pb-24 pt-[calc(var(--header-h)+5rem)] sm:pb-32 sm:pt-[calc(var(--header-h)+8rem)]">
      <h1 className="mb-10 text-6xl font-semibold tracking-[-0.04em] sm:text-8xl">{workPage.heading}</h1>
      <WorkGrid />
    </section>
  );
}
