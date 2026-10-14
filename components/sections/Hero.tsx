import { home } from "@/content/home";

/** Home hero. 3D state: asleep at the desk (Phase 4 reads data-scene). */
export function Hero() {
  const { name, pitch, smallLine, scrollHint } = home.hero;

  return (
    <section
      data-scene="hero"
      aria-labelledby="hero-heading"
      className="relative flex min-h-dvh flex-col justify-end pb-10 pt-[var(--header-h)] sm:pb-14"
    >
      <div className="wrap">
        <p className="font-mono text-xs text-muted sm:text-sm">{smallLine}</p>
        <h1
          id="hero-heading"
          className="mt-5 text-[clamp(3.25rem,11vw,10rem)] font-semibold leading-[0.92] tracking-[-0.04em]"
        >
          {name}
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted sm:text-2xl sm:leading-snug">
          {pitch}
        </p>
        <p
          aria-hidden="true"
          className="mt-16 font-mono text-xs text-subtle [animation:hint-bob_2.4s_ease-in-out_infinite] sm:mt-24"
        >
          {scrollHint}
        </p>
      </div>
    </section>
  );
}
