"use client";

import { usePathname, useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  type ReactNode,
} from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { appState, ease } from "@/lib/motion";
import { useLenis } from "./SmoothScrollProvider";
import { useMotionPrefs } from "./MotionPrefsProvider";

type TransitionContextValue = {
  pathname: string;
  /** Cover the screen with the curtain, then navigate. */
  navigate: (href: string) => void;
};

const TransitionContext = createContext<TransitionContextValue | null>(null);

const COVER_DURATION = 0.55;
const REVEAL_DURATION = 0.65;
const LAYER_STAGGER = 0.07;

/**
 * Curtain-wipe page transitions. Links call navigate() (via TransitionLink);
 * the curtain covers, the route changes, scroll resets to top, then the
 * curtain lifts. Under reduced motion it navigates instantly.
 */
export function TransitionProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const lenis = useLenis();
  const { reducedMotion } = useMotionPrefs();

  const curtainRef = useRef<HTMLDivElement>(null);
  const pendingRef = useRef<string | null>(null);

  const navigate = useCallback(
    (href: string) => {
      if (pendingRef.current) return;
      const curtain = curtainRef.current;
      if (reducedMotion || !curtain) {
        router.push(href);
        return;
      }

      pendingRef.current = href;
      const layers = curtain.children;
      gsap.killTweensOf(layers);
      gsap.set(curtain, { visibility: "visible", pointerEvents: "auto" });
      gsap.set(layers, { yPercent: 100 });
      gsap.to(layers, {
        yPercent: 0,
        duration: COVER_DURATION,
        ease: ease.inOut,
        stagger: LAYER_STAGGER,
        onComplete: () => router.push(href, { scroll: false }),
      });
    },
    [reducedMotion, router],
  );

  // Every route change: reset scroll, refresh triggers, lift the curtain if it's down.
  useEffect(() => {
    lenis?.scrollTo(0, { immediate: true, force: true });
    window.scrollTo(0, 0);
    ScrollTrigger.refresh();
    // Children's effects ran first, so on the very first pass they saw mounted === false.
    appState.mounted = true;

    const curtain = curtainRef.current;
    if (!pendingRef.current || !curtain) return;
    pendingRef.current = null;

    gsap.to(Array.from(curtain.children).reverse(), {
      yPercent: -100,
      duration: REVEAL_DURATION,
      ease: ease.inOut,
      stagger: LAYER_STAGGER,
      delay: 0.05,
      onComplete: () => gsap.set(curtain, { visibility: "hidden", pointerEvents: "none" }),
    });
  }, [pathname, lenis]);

  const value = useMemo(() => ({ pathname, navigate }), [pathname, navigate]);

  return (
    <TransitionContext.Provider value={value}>
      {children}
      <div
        ref={curtainRef}
        aria-hidden="true"
        className="pointer-events-none invisible fixed inset-0 z-[90] overflow-hidden"
      >
        <div className="absolute inset-0 translate-y-full bg-accent" />
        <div className="absolute inset-0 translate-y-full bg-bg" />
      </div>
    </TransitionContext.Provider>
  );
}

export function usePageTransition(): TransitionContextValue {
  const ctx = useContext(TransitionContext);
  if (!ctx) throw new Error("usePageTransition must be used inside <TransitionProvider>");
  return ctx;
}
