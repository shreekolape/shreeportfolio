"use client";

import { useEffect, useState, type ReactNode } from "react";
import { gsap } from "@/lib/gsap";
import { BG_TINT_STOPS, sampleHexStops, SECTION_DAY_T } from "@/lib/dayCycle";
import { useLenis } from "./SmoothScrollProvider";
import { usePageTransition } from "./TransitionProvider";

/** Live time-of-day (0–1): midnight → sunrise → day → evening → midnight. Only
 *  this provider writes it on Home; fixed-theme pages set it directly (B3). */
export const liveDayCycle = { t: 0 };

/**
 * Pins the day cycle and page tint to a fixed point, synchronously during
 * this component's first render — before any child (e.g. a 3D scene) can
 * read `liveDayCycle.t`. For pages with one fixed lighting theme instead of
 * a scroll-driven cycle: About's golden hour, Contact's night, Work's
 * "working hours". Like `useSceneReset`, a `useEffect` would run too late.
 */
export function useFixedDayTheme(t: number, bg: string): void {
  useState(() => {
    liveDayCycle.t = t;
    document.documentElement.style.setProperty("--bg", bg);
    return null;
  });
}

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));

/**
 * Drives `liveDayCycle.t` and the `--bg` page tint from Home's scroll
 * position. Measures each `[data-scene]` section's offset so the keyframes
 * (midnight at the hero, sunrise at the intro, ...) land on the right
 * section regardless of how tall each one renders, not a uniform 1/5th of
 * the page. Runs independent of whether the 3D canvas is mounted, so the
 * tint still follows scroll on mobile and under reduced motion (B5) even
 * though `SceneLayer` never loads the canvas there.
 */
export function DayCycleProvider({ children }: { children: ReactNode }) {
  const { pathname } = usePageTransition();
  const lenis = useLenis();
  const isHome = pathname === "/";

  useEffect(() => {
    if (!isHome) return;
    const root = document.documentElement;

    let stops: { frac: number; t: number }[] = [
      { frac: 0, t: 0 },
      { frac: 1, t: 1 },
    ];

    const scrollMax = () => (lenis ? lenis.limit : document.documentElement.scrollHeight - window.innerHeight);

    const measure = () => {
      const max = scrollMax();
      if (max <= 0) return;
      // `[data-scene]` elements are already in document order, i.e. ascending
      // offsetTop. Sections within one viewport of the bottom (e.g. "stack"
      // and "footer") can clamp to the same frac (1); when that happens the
      // later section in document order wins, so the last stop is always the
      // true page bottom rather than whichever section happened to sort first.
      const found: { frac: number; t: number }[] = [];
      document.querySelectorAll<HTMLElement>("[data-scene]").forEach((el) => {
        const target = SECTION_DAY_T[el.dataset.scene ?? ""];
        if (target === undefined) return;
        const frac = clamp01(el.offsetTop / max);
        const last = found[found.length - 1];
        if (last && frac <= last.frac) found[found.length - 1] = { frac, t: target };
        else found.push({ frac, t: target });
      });
      if (found.length >= 2) stops = found;
    };

    measure();
    // Layout can still settle after fonts/images/the preloader; re-measure once things do.
    const settleTimer = window.setTimeout(measure, 400);
    window.addEventListener("resize", measure);
    window.addEventListener("load", measure);

    let lastBg = "";
    const tick = () => {
      const max = scrollMax();
      const scroll = lenis ? lenis.animatedScroll : window.scrollY;
      const frac = max > 0 ? clamp01(scroll / max) : 0;

      let t = stops[stops.length - 1].t;
      for (let i = 1; i < stops.length; i++) {
        if (frac <= stops[i].frac) {
          const span = stops[i].frac - stops[i - 1].frac;
          const local = span > 0 ? (frac - stops[i - 1].frac) / span : 0;
          t = stops[i - 1].t + (stops[i].t - stops[i - 1].t) * local;
          break;
        }
      }
      liveDayCycle.t = t;

      const bg = sampleHexStops(t, BG_TINT_STOPS);
      if (bg !== lastBg) {
        root.style.setProperty("--bg", bg);
        lastBg = bg;
      }
    };

    gsap.ticker.add(tick);
    return () => {
      gsap.ticker.remove(tick);
      window.clearTimeout(settleTimer);
      window.removeEventListener("resize", measure);
      window.removeEventListener("load", measure);
    };
  }, [isHome, lenis]);

  return children;
}
