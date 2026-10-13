"use client";

import { useRef, type ReactNode } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { useMotionPrefs } from "@/providers/MotionPrefsProvider";

type MagneticProps = {
  children: ReactNode;
  /** How far the element follows the pointer (fraction of the offset). */
  strength?: number;
  className?: string;
};

/** Pulls its child toward the pointer while hovered. Off on touch and reduced motion. */
export function Magnetic({ children, strength = 0.35, className }: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { finePointer, reducedMotion } = useMotionPrefs();
  const active = finePointer && !reducedMotion;

  useGSAP(
    () => {
      const el = ref.current;
      if (!active || !el) return;

      const xTo = gsap.quickTo(el, "x", { duration: 0.6, ease: "power3.out" });
      const yTo = gsap.quickTo(el, "y", { duration: 0.6, ease: "power3.out" });

      const onMove = (e: PointerEvent) => {
        const rect = el.getBoundingClientRect();
        xTo((e.clientX - (rect.left + rect.width / 2)) * strength);
        yTo((e.clientY - (rect.top + rect.height / 2)) * strength);
      };
      const onLeave = () => {
        gsap.to(el, { x: 0, y: 0, duration: 0.8, ease: "elastic.out(1, 0.4)" });
      };

      el.addEventListener("pointermove", onMove);
      el.addEventListener("pointerleave", onLeave);
      return () => {
        el.removeEventListener("pointermove", onMove);
        el.removeEventListener("pointerleave", onLeave);
      };
    },
    { dependencies: [active, strength], revertOnUpdate: true },
  );

  return (
    <div ref={ref} className={["inline-block", className].filter(Boolean).join(" ")}>
      {children}
    </div>
  );
}
