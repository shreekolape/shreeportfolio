import { site } from "@/content/site";

// Phase 1 stub: only exists to exercise layout, scroll, accent and transitions.
// Replaced by the real Home sections in Phase 3.
export default function Home() {
  return (
    <section className="mx-auto flex min-h-[200vh] max-w-7xl flex-col px-4 pt-[30vh] sm:px-8">
      <h1 className="text-6xl font-semibold tracking-tight sm:text-8xl">{site.name}</h1>
      <p className="mt-6 max-w-2xl text-lg text-muted sm:text-xl">{site.pitch}</p>
    </section>
  );
}
