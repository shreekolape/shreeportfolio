"use client";

import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { duration, ease, stagger } from "@/lib/motion";
import { useMotionPrefs } from "@/providers/MotionPrefsProvider";
import { usePageTransition } from "@/providers/TransitionProvider";

/**
 * Fades `[data-reveal]` elements up as they scroll into view, batched so
 * neighbours stagger. Re-scans on every route change. Elements already on the
 * first screen are left alone (no hide-then-show flash); reduced motion skips it.
 */
export function ScrollReveal() {
  const { pathname } = usePageTransition();
  const { reducedMotion } = useMotionPrefs();

  useGSAP(
    () => {
      if (reducedMotion) return;
      const firstScreen = window.innerHeight * 0.92;
      const targets = gsap.utils
        .toArray<HTMLElement>("[data-reveal]")
        // Skip routes kept hidden by <Activity> and anything above the fold.
        .filter((el) => el.offsetParent !== null && el.getBoundingClientRect().top + window.scrollY > firstScreen);
      if (targets.length === 0) return;

      gsap.set(targets, { autoAlpha: 0, y: 28 });
      ScrollTrigger.batch(targets, {
        start: "top 90%",
        once: true,
        onEnter: (batch) =>
          gsap.to(batch, {
            autoAlpha: 1,
            y: 0,
            duration: duration.base + 0.2,
            ease: ease.out,
            stagger: stagger.base,
            overwrite: true,
          }),
      });
    },
    { dependencies: [pathname, reducedMotion], revertOnUpdate: true },
  );

  return null;
}
