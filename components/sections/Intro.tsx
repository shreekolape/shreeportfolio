import { home } from "@/content/home";
import { TransitionLink } from "@/components/transitions/TransitionLink";

/** 3D state: wakes up and stretches. */
export function Intro() {
  const { text, link } = home.intro;

  return (
    <section data-scene="intro" aria-label="Intro" className="py-28 sm:py-40">
      <div className="wrap">
        <div className="scene-aside">
          <p
            data-reveal=""
            className="max-w-4xl text-2xl font-medium leading-snug tracking-tight sm:text-4xl sm:leading-[1.2]"
          >
            {text}
          </p>
          <div data-reveal="" className="mt-10">
            <TransitionLink
              href={link.href}
              className="link-underline inline-block font-mono text-sm text-accent transition-[text-shadow] hover:text-glow"
            >
              {link.label}
            </TransitionLink>
          </div>
        </div>
      </div>
    </section>
  );
}
