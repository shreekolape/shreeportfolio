// Phase 1 stub used by /work, /about and /contact until Phase 3 builds the real pages.
export function PageStub({ title }: { title: string }) {
  return (
    <section className="mx-auto min-h-[150vh] max-w-7xl px-4 pt-[30vh] sm:px-8">
      <h1 className="text-6xl font-semibold tracking-tight sm:text-8xl">{title}</h1>
    </section>
  );
}
