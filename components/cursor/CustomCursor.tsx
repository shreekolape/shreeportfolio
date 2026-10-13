"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { isExternalHref } from "@/lib/links";
import { useMotionPrefs } from "@/providers/MotionPrefsProvider";

/**
 * Dot + trailing ring. Context labels come from `data-cursor="View"` on any
 * ancestor; external links default to "Open". Only rendered on fine-pointer
 * devices; touch devices keep the native cursor.
 */
export function CustomCursor() {
  const { finePointer, reducedMotion } = useMotionPrefs();
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState<string | null>(null);
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!finePointer || !dot || !ring) return;

    const html = document.documentElement;
    html.classList.add("has-custom-cursor");

    const ringDuration = reducedMotion ? 0.01 : 0.45;
    const dotX = gsap.quickTo(dot, "x", { duration: 0.08, ease: "power3.out" });
    const dotY = gsap.quickTo(dot, "y", { duration: 0.08, ease: "power3.out" });
    const ringX = gsap.quickTo(ring, "x", { duration: ringDuration, ease: "power3.out" });
    const ringY = gsap.quickTo(ring, "y", { duration: ringDuration, ease: "power3.out" });

    let visible = false;
    const show = (on: boolean) => {
      if (visible === on) return;
      visible = on;
      gsap.to([dot, ring], { autoAlpha: on ? 1 : 0, duration: 0.2 });
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      if (!visible) {
        // Jump straight to the pointer on first appearance instead of flying in from 0,0.
        gsap.set([dot, ring], { x: e.clientX, y: e.clientY });
      }
      dotX(e.clientX);
      dotY(e.clientY);
      ringX(e.clientX);
      ringY(e.clientY);
      show(true);
    };

    const onOver = (e: PointerEvent) => {
      const target = e.target as Element | null;
      const labelled = target?.closest<HTMLElement>("[data-cursor]");
      const interactive = target?.closest<HTMLElement>("a, button, [role='button'], label, select");
      let next = labelled?.dataset.cursor ?? null;
      if (!next && interactive instanceof HTMLAnchorElement) {
        const href = interactive.getAttribute("href") ?? "";
        if (interactive.target === "_blank" || isExternalHref(href)) next = "Open";
      }
      setLabel(next || null);
      setHovering(Boolean(interactive));
    };

    const onLeaveWindow = () => show(false);
    const onDown = () => gsap.to(ring, { scale: 0.85, duration: 0.15 });
    const onUp = () => gsap.to(ring, { scale: 1, duration: 0.25 });

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerover", onOver, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeaveWindow);
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);

    return () => {
      html.classList.remove("has-custom-cursor");
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
      document.documentElement.removeEventListener("pointerleave", onLeaveWindow);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
    };
  }, [finePointer, reducedMotion]);

  if (!finePointer) return null;

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[100]">
      <div
        ref={ringRef}
        className="invisible absolute left-0 top-0 opacity-0"
      >
        <div
          className={[
            "flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border transition-[width,height,background-color,border-color] duration-300 ease-[var(--ease-out)]",
            label
              ? "h-16 w-16 border-transparent bg-accent shadow-glow"
              : hovering
                ? "h-11 w-11 border-accent"
                : "h-8 w-8 border-fg/40",
          ].join(" ")}
        >
          {label && (
            <span className="font-mono text-[11px] font-medium uppercase tracking-wider text-bg">
              {label}
            </span>
          )}
        </div>
      </div>
      <div ref={dotRef} className="invisible absolute left-0 top-0 opacity-0">
        <div
          className={[
            "h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent transition-opacity duration-200",
            label ? "opacity-0" : "opacity-100",
          ].join(" ")}
        />
      </div>
    </div>
  );
}
