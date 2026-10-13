"use client";

import { useEffect, type ReactNode } from "react";
import { gsap } from "@/lib/gsap";
import { useLenis } from "./SmoothScrollProvider";
import { useMotionPrefs } from "./MotionPrefsProvider";

// Hue stops in OKLCH: cyan → violet → magenta across page progress 0 → 0.5 → 1.
const HUE_STOPS = [200, 295, 335] as const;
// Lenis velocity (px/frame) that maps to full glow.
const VELOCITY_FOR_FULL_GLOW = 50;
// How quickly glow chases its target (per frame, 0–1).
const GLOW_EASE = 0.08;

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));

function hueAt(progress: number): number {
  const [a, b, c] = HUE_STOPS;
  return progress < 0.5 ? a + (b - a) * (progress / 0.5) : b + (c - b) * ((progress - 0.5) / 0.5);
}

/**
 * The single source of the scroll-reactive accent. Writes --accent-h (hue)
 * and --accent-glow (0–1) on <html>; every component just uses the variables.
 */
export function AccentProvider({ children }: { children: ReactNode }) {
  const lenis = useLenis();
  const { reducedMotion } = useMotionPrefs();

  useEffect(() => {
    const root = document.documentElement;
    let glow = 0;
    let lastHue = -1;
    let lastGlow = -1;

    const tick = () => {
      const max = lenis ? lenis.limit : root.scrollHeight - window.innerHeight;
      const scroll = lenis ? lenis.animatedScroll : window.scrollY;
      const hue = hueAt(max > 0 ? clamp01(scroll / max) : 0);

      const target = reducedMotion || !lenis ? 0 : clamp01(Math.abs(lenis.velocity) / VELOCITY_FOR_FULL_GLOW);
      glow += (target - glow) * GLOW_EASE;
      if (glow < 0.001) glow = 0;

      if (Math.abs(hue - lastHue) > 0.2) {
        root.style.setProperty("--accent-h", hue.toFixed(1));
        lastHue = hue;
      }
      if (Math.abs(glow - lastGlow) > 0.004) {
        root.style.setProperty("--accent-glow", glow.toFixed(3));
        lastGlow = glow;
      }
    };

    gsap.ticker.add(tick);
    return () => {
      gsap.ticker.remove(tick);
      root.style.setProperty("--accent-glow", "0");
    };
  }, [lenis, reducedMotion]);

  return children;
}
