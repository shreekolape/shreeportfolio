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
import { featuredProjects } from "@/content/projects";
import { site } from "@/content/site";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { appState, ease } from "@/lib/motion";
import { useLenis } from "./SmoothScrollProvider";
import { useMotionPrefs } from "./MotionPrefsProvider";

type TransitionContextValue = {
  pathname: string;
  /** Cover the screen, then navigate. The only way any internal link should change route. */
  navigate: (href: string) => void;
};

const TransitionContext = createContext<TransitionContextValue | null>(null);

const COVER_DURATION = 0.35;
const REVEAL_DURATION = 0.45;
const QUICK_REVEAL_DURATION = 0.22; // untracked navigations: the curtain was only ever a snap-cover, so lift it fast
const MOUNT_FALLBACK_MS = 3000;

/** Fired the instant the curtain starts lifting, for content (e.g. the hero) timed to it. */
export const TRANSITION_REVEAL_EVENT = "sk:transition-reveal";

type Status = "idle" | "covering" | "waiting";

/**
 * Curtain page transitions, in a fixed order: Cover (animate in) → Navigate
 * (router.push, only once fully covered) → Wait (stay opaque until the new
 * route's pathname shows up and one frame has painted) → Reveal (animate
 * out). This is the one place that animates on route change; every internal
 * link goes through `navigate()` via <TransitionLink>.
 *
 * Browser back/forward is a hard limit: Next's router reacts to `popstate`
 * (and updates `pathname`, which this provider observes) before any listener
 * this provider could register of its own gets a turn — there is no reliable
 * hook to cover the screen *before* a native history navigation repaints.
 * So for any pathname change this provider didn't itself drive (that `status`
 * check below), it snap-covers for one frame and plays a quick reveal instead
 * of the old bug: a slow fade appearing *after* the new page was already shown.
 */
export function TransitionProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const lenis = useLenis();
  const { reducedMotion } = useMotionPrefs();

  const curtainRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef<Status>("idle");
  const fallbackTimer = useRef<number | null>(null);
  const prevPathname = useRef(pathname);

  const resetScrollInstant = useCallback(() => {
    lenis?.scrollTo(0, { immediate: true, force: true });
    window.scrollTo(0, 0);
  }, [lenis]);

  const clearFallback = useCallback(() => {
    if (fallbackTimer.current !== null) {
      window.clearTimeout(fallbackTimer.current);
      fallbackTimer.current = null;
    }
  }, []);

  const reveal = useCallback(
    (quick: boolean) => {
      clearFallback();
      statusRef.current = "idle";
      window.dispatchEvent(new Event(TRANSITION_REVEAL_EVENT));
      const curtain = curtainRef.current;
      if (!curtain) return;
      gsap.killTweensOf(curtain);
      gsap.to(curtain, {
        autoAlpha: 0,
        duration: quick ? QUICK_REVEAL_DURATION : REVEAL_DURATION,
        ease: ease.inOut,
        onComplete: () => gsap.set(curtain, { pointerEvents: "none" }),
      });
    },
    [clearFallback],
  );

  const navigate = useCallback(
    (href: string) => {
      if (statusRef.current !== "idle") return; // ignore clicks while a transition is running
      const targetPath = href.split(/[?#]/)[0] || "/";
      if (targetPath === pathname) return; // ignore clicks on the current route

      if (reducedMotion || !curtainRef.current) {
        router.push(href);
        return;
      }

      statusRef.current = "covering";
      const curtain = curtainRef.current;
      gsap.killTweensOf(curtain);
      gsap.set(curtain, { autoAlpha: 0, pointerEvents: "auto" });
      gsap.to(curtain, {
        autoAlpha: 1,
        duration: COVER_DURATION,
        ease: ease.inOut,
        onComplete: () => {
          statusRef.current = "waiting";
          router.push(href, { scroll: false });
          // Never leave the overlay stuck covering the page if the route somehow never mounts.
          clearFallback();
          fallbackTimer.current = window.setTimeout(() => {
            if (statusRef.current === "waiting") reveal(false);
          }, MOUNT_FALLBACK_MS);
        },
      });
    },
    [pathname, reducedMotion, router, clearFallback, reveal],
  );

  // The new route's pathname has shown up here. One more rAF so the new tree
  // has actually painted, then reset scroll and reveal.
  useEffect(() => {
    const firstRun = !appState.mounted;
    appState.mounted = true;
    if (prevPathname.current === pathname) return;
    prevPathname.current = pathname;
    if (firstRun) return; // first paint of the whole app, nothing to reveal from

    resetScrollInstant();
    ScrollTrigger.refresh();

    if (statusRef.current === "waiting") {
      // Driven by navigate(): the curtain is already fully covering.
      const id = requestAnimationFrame(() => reveal(false));
      return () => cancelAnimationFrame(id);
    }

    // Not driven by navigate() — browser back/forward, or the URL changed some
    // other way. Can't cover beforehand (see the comment above the component),
    // so snap-cover for one frame and reveal quickly rather than leaving a
    // flash of the new page with no transition at all.
    if (reducedMotion || !curtainRef.current) return;
    gsap.killTweensOf(curtainRef.current);
    gsap.set(curtainRef.current, { autoAlpha: 1, pointerEvents: "auto" });
    const id = requestAnimationFrame(() => reveal(true));
    return () => cancelAnimationFrame(id);
  }, [pathname, reducedMotion, reveal, resetScrollInstant]);

  // Prefetch the nav and every featured case study once, so navigation is instant.
  useEffect(() => {
    for (const item of site.nav) router.prefetch(item.href);
    for (const p of featuredProjects) router.prefetch(`/work/${p.slug}`);
  }, [router]);

  const value = useMemo(() => ({ pathname, navigate }), [pathname, navigate]);

  return (
    <TransitionContext.Provider value={value}>
      {children}
      <div
        ref={curtainRef}
        aria-hidden="true"
        className="invisible pointer-events-none fixed inset-0 z-[90] bg-accent opacity-0"
      />
    </TransitionContext.Provider>
  );
}

export function usePageTransition(): TransitionContextValue {
  const ctx = useContext(TransitionContext);
  if (!ctx) throw new Error("usePageTransition must be used inside <TransitionProvider>");
  return ctx;
}
