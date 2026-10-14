import { Fragment } from "react";
import { home } from "@/content/home";
import { site } from "@/content/site";
import { MediaFrame } from "@/components/ui/MediaFrame";
import { HeroReveal } from "./HeroReveal";

/** Home hero. 3D state: asleep at the desk (the scene reads data-scene). */
export function Hero() {
  const { name, pitch, smallLine, scrollHint } = home.hero;

  return (
    <section
      data-scene="hero"
      aria-labelledby="hero-heading"
      className="relative flex min-h-dvh flex-col justify-end pb-10 pt-[var(--header-h)] sm:pb-14"
    >
      <div className="wrap">
        {/* Static still of the desk scene wherever the 3D canvas doesn't load. */}
        <MediaFrame
          media={site.sceneFallback}
          aspect="16 / 10"
          priority
          sizes="(min-width: 768px) 48rem, 100vw"
          className="no3d-only mb-10 max-w-3xl"
        />
        <HeroReveal className="scene-aside">
          <p data-hero-fade="" className="font-mono text-xs text-muted sm:text-sm">
            {smallLine}
          </p>
          <h1
            id="hero-heading"
            className="mt-5 text-[clamp(3.25rem,11vw,10rem)] font-semibold leading-[0.92] tracking-[-0.04em]"
          >
            {/* Each word sits in a mask so it can rise into place. */}
            {name.split(" ").map((word, i) => (
              <Fragment key={i}>
                {i > 0 && " "}
                <span className="inline-block overflow-hidden pb-[0.08em] align-top">
                  <span data-hero-word="" className="inline-block">
                    {word}
                  </span>
                </span>
              </Fragment>
            ))}
          </h1>
          <p data-hero-fade="" className="mt-6 max-w-2xl text-lg leading-relaxed text-muted sm:text-2xl sm:leading-snug">
            {pitch}
          </p>
          <p data-hero-fade="" aria-hidden="true" className="mt-16 font-mono text-xs text-subtle sm:mt-24">
            <span className="inline-block [animation:hint-bob_2.4s_ease-in-out_infinite]">{scrollHint}</span>
          </p>
        </HeroReveal>
      </div>
    </section>
  );
}
