"use client";

import Lenis from "lenis";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useMotionPrefs } from "./MotionPrefsProvider";

const LenisContext = createContext<Lenis | null>(null);

/**
 * Lenis smooth scroll driven by GSAP's ticker, so Lenis and ScrollTrigger
 * share one frame loop. Disabled entirely under prefers-reduced-motion
 * (native scrolling is used and useLenis() returns null).
 */
export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const { reducedMotion } = useMotionPrefs();
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    if (reducedMotion) return;

    const instance = new Lenis({ autoRaf: false, lerp: 0.1, smoothWheel: true });
    instance.on("scroll", ScrollTrigger.update);

    const raf = (time: number) => instance.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- Lenis needs the DOM, so it can only be created after mount.
    setLenis(instance);

    return () => {
      gsap.ticker.remove(raf);
      gsap.ticker.lagSmoothing(500, 33);
      instance.destroy();
      setLenis(null);
    };
  }, [reducedMotion]);

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
}

/** The active Lenis instance, or null (reduced motion / not yet mounted). */
export function useLenis(): Lenis | null {
  return useContext(LenisContext);
}
