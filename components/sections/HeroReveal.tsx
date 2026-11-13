"use client";

import { useRef, type ReactNode } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { appState, duration, ease, stagger } from "@/lib/motion";
import { PRELOADER_DONE_EVENT } from "@/lib/preloader";
import { TRANSITION_REVEAL_EVENT } from "@/providers/TransitionProvider";

/**
 * Hero entrance: words of `[data-hero-word]` rise out of their masks, then
 * `[data-hero-fade]` items fade up. It only plays while something covers the
 * screen (preloader on first visit, curtain on client navigation), so a hard
 * reload on a repeat visit never flashes hidden content.
 */
export function HeroReveal({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  // Runs once per mount. Read reduced motion directly: the context value flips
  // after hydration, which would re-run this after appState.mounted is set.
  useGSAP(
    () => {
      const root = ref.current;
      if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const firstLoad = !appState.mounted;
      const preloaderShowing = firstLoad && !document.documentElement.hasAttribute("data-preloaded");
      if (firstLoad && !preloaderShowing) return;

      const words = root.querySelectorAll("[data-hero-word]");
      const fades = root.querySelectorAll("[data-hero-fade]");
      const tl = gsap
        .timeline({ paused: true })
        .from(words, { yPercent: 110, duration: duration.hero, ease: ease.outStrong, stagger: stagger.base })
        .from(fades, { opacity: 0, y: 18, duration: duration.base, ease: ease.out, stagger: stagger.base }, "-=0.75");

      if (preloaderShowing) {
        const play = () => tl.play();
        window.addEventListener(PRELOADER_DONE_EVENT, play, { once: true });
        return () => window.removeEventListener(PRELOADER_DONE_EVENT, play);
      }
      // Client navigation: TransitionProvider fires this the instant the curtain starts lifting.
      const play = () => tl.play();
      window.addEventListener(TRANSITION_REVEAL_EVENT, play, { once: true });
      return () => window.removeEventListener(TRANSITION_REVEAL_EVENT, play);
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
