import { stackStrip } from "@/content/skills";

/**
 * Infinite CSS marquee (list rendered twice, track slides -50%). Pauses on
 * hover. Under reduced motion it stops and wraps as a static list.
 */
export function StackMarquee() {
  const row = (hidden: boolean) => (
    <ul
      aria-hidden={hidden || undefined}
      className={[
        "flex shrink-0 items-center gap-x-10 pr-10 motion-reduce:flex-wrap motion-reduce:justify-center motion-reduce:gap-y-3 motion-reduce:pr-0",
        hidden ? "motion-reduce:hidden" : "",
      ].join(" ")}
    >
      {stackStrip.map((item) => (
        <li
          key={item}
          className="whitespace-nowrap text-2xl font-medium tracking-tight text-muted transition-colors hover:text-accent sm:text-4xl"
        >
          {item}
        </li>
      ))}
    </ul>
  );

  return (
    <section
      data-scene="stack"
      aria-label="Stack"
      className="marquee overflow-hidden border-y border-line py-10 sm:py-14"
    >
      <div className="marquee-track flex w-max motion-reduce:w-full motion-reduce:animate-none motion-reduce:justify-center">
        {row(false)}
        {row(true)}
      </div>
    </section>
  );
}
