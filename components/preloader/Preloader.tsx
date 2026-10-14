"use client";

import { useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore } from "react";
import { site } from "@/content/site";
import { gsap } from "@/lib/gsap";
import { PRELOADED_KEY, PRELOADER_DONE_EVENT } from "@/lib/preloader";
import { sceneState } from "@/lib/sceneStore";
import { readStorage, writeStorage } from "@/lib/storage";
import { formatPuneDateTime, puneDateTimeScript } from "@/lib/time";
import { usePuneClock } from "@/hooks/usePuneClock";
import { useLenis } from "@/providers/SmoothScrollProvider";
import { InlineScript } from "@/components/ui/InlineScript";

const TIME_ID = "preloader-time";
/** Never finish faster than this, so the counter reads as a count, not a flash. */
const MIN_SECONDS = 1.3;
/** Never block longer than this, even if the 3D scene stalls. */
const MAX_SECONDS = 9;

const noopSubscribe = () => () => {};
const wasPreloaded = () => readStorage(PRELOADED_KEY, "session") === "1";

/**
 * First visit per session: live Pune date/time, a 0–100 counter tied to fonts,
 * page load and the 3D scene's loading progress, then a curtain-up reveal.
 * Repeat visits are hidden before paint by the <head> script (data-preloaded).
 */
export function Preloader() {
  const skip = useSyncExternalStore(noopSubscribe, wasPreloaded, () => false);
  const [finished, setFinished] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const time = usePuneClock(formatPuneDateTime);
  const lenis = useLenis();
  const showing = !skip && !finished;

  // React's dev remount can clear <html> attributes set by the head script; re-apply.
  useLayoutEffect(() => {
    if (skip) document.documentElement.setAttribute("data-preloaded", "");
  }, [skip]);

  // Hold scrolling while the preloader is up.
  useEffect(() => {
    if (!lenis) return;
    if (showing) lenis.stop();
    else lenis.start();
  }, [lenis, showing]);

  useEffect(() => {
    if (!showing) return;
    const root = rootRef.current;
    const counter = counterRef.current;
    if (!root || !counter) return;

    const html = document.documentElement;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    html.classList.add("is-preloading");
    window.scrollTo(0, 0);

    let fonts = 0;
    let page = document.readyState === "complete" ? 1 : 0;
    document.fonts?.ready.then(() => (fonts = 1)).catch(() => (fonts = 1));
    const onLoad = () => (page = 1);
    window.addEventListener("load", onLoad);

    const start = performance.now();
    let shown = 0;
    let exiting = false;
    let exitTween: gsap.core.Timeline | gsap.core.Tween | null = null;

    const done = () => {
      html.classList.remove("is-preloading");
      setFinished(true);
      window.dispatchEvent(new Event(PRELOADER_DONE_EVENT));
    };

    const exit = () => {
      writeStorage(PRELOADED_KEY, "1", "session");
      if (reduced) {
        exitTween = gsap.to(root, { opacity: 0, duration: 0.3, onComplete: done });
        return;
      }
      exitTween = gsap
        .timeline({ onComplete: done })
        .to(root.querySelectorAll("[data-pl-fade]"), { opacity: 0, y: -16, duration: 0.4, stagger: 0.06, ease: "power2.in" })
        .to(root, { yPercent: -100, duration: 0.95, ease: "expo.inOut" }, "-=0.15");
    };

    const tick = () => {
      const elapsed = (performance.now() - start) / 1000;
      const scene = sceneState.expected ? (sceneState.ready ? 1 : sceneState.progress * 0.9) : 1;
      let target = 0.2 * fonts + 0.2 * page + 0.6 * scene;
      if (elapsed > MAX_SECONDS) target = 1;
      const goal = Math.min(target, reduced ? 1 : elapsed / MIN_SECONDS);

      shown = reduced ? goal : shown + (goal - shown) * 0.12;
      if (goal >= 1 && shown > 0.995) shown = 1;
      counter.textContent = String(Math.round(shown * 100));

      if (shown === 1 && !exiting) {
        exiting = true;
        exit();
      }
    };

    gsap.ticker.add(tick);
    return () => {
      gsap.ticker.remove(tick);
      window.removeEventListener("load", onLoad);
      exitTween?.kill();
      html.classList.remove("is-preloading");
    };
  }, [showing]);

  if (!showing) return null;

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className="preloader fixed inset-0 z-[120] flex flex-col justify-between bg-bg px-4 py-6 sm:px-8 sm:py-8"
    >
      <p data-pl-fade="" className="font-mono text-xs text-muted sm:text-sm">
        <span id={TIME_ID} suppressHydrationWarning>
          {time ? `${time} ${site.preloader.locationSuffix}` : ""}
        </span>
      </p>
      <InlineScript html={puneDateTimeScript(TIME_ID, site.preloader.locationSuffix)} />

      <div>
        <p
          data-pl-fade=""
          className="text-[clamp(6rem,24vw,20rem)] font-semibold leading-[0.8] tracking-[-0.05em] tabular-nums"
        >
          <span ref={counterRef}>0</span>
        </p>
        <p data-pl-fade="" className="mt-6 font-mono text-xs text-muted sm:text-sm">
          {site.preloader.line}
        </p>
      </div>
    </div>
  );
}
