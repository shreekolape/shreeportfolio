"use client";

import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { duration, ease, stagger } from "@/lib/motion";
import { useMotionPrefs } from "@/providers/MotionPrefsProvider";
import { usePageTransition } from "@/providers/TransitionProvider";

const revealed = { opacity: 1, y: 0, duration: duration.base + 0.2, ease: ease.out, overwrite: true };

/**
 * Fades `[data-reveal]` elements up as they scroll into view, batched so
 * neighbours stagger. Re-scans on every route change. Elements already on the
 * first screen are left alone (no hide-then-show flash); reduced motion skips it.
 *
 * Uses opacity only (never visibility) so hidden-until-scrolled content stays
 * in the tab order, and reveals immediately when keyboard focus lands inside.
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

      gsap.set(targets, { opacity: 0, y: 28 });
      ScrollTrigger.batch(targets, {
        start: "top 90%",
        once: true,
        onEnter: (batch) => gsap.to(batch, { ...revealed, stagger: stagger.base }),
      });

      const onFocusIn = (e: FocusEvent) => {
        const el = (e.target as Element | null)?.closest<HTMLElement>("[data-reveal]");
        if (el && targets.includes(el)) gsap.to(el, revealed);
      };
      document.addEventListener("focusin", onFocusIn);
      return () => document.removeEventListener("focusin", onFocusIn);
    },
    { dependencies: [pathname, reducedMotion], revertOnUpdate: true },
  );

  return null;
}
