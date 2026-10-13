"use client";

import { createContext, useContext, useMemo, useSyncExternalStore, type ReactNode } from "react";
import { useMediaQuery } from "@/hooks/useMediaQuery";

export type MotionPrefs = {
  /** prefers-reduced-motion: reduce */
  reducedMotion: boolean;
  /** Mouse/trackpad with hover (custom cursor + magnetic effects are allowed). */
  finePointer: boolean;
  /** Below 768px. */
  smallScreen: boolean;
  /** Low device memory or few CPU cores. */
  lowPower: boolean;
  /** Whether the 3D canvas may load at all (Phase 4). */
  allow3D: boolean;
};

const MotionPrefsContext = createContext<MotionPrefs | null>(null);

// Thresholds for "low-power" devices. navigator.deviceMemory is Chromium-only.
const LOW_MEMORY_GB = 4;
const LOW_CORES = 4;

const noopSubscribe = () => () => {};

function detectLowPower(): boolean {
  const nav = navigator as Navigator & { deviceMemory?: number };
  const lowMemory = typeof nav.deviceMemory === "number" && nav.deviceMemory < LOW_MEMORY_GB;
  const lowCores =
    typeof nav.hardwareConcurrency === "number" && nav.hardwareConcurrency < LOW_CORES;
  return lowMemory || lowCores;
}

export function MotionPrefsProvider({ children }: { children: ReactNode }) {
  // Server values are the most conservative choice: reduced motion, no fancy pointer, no 3D.
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)", true);
  const finePointer = useMediaQuery("(hover: hover) and (pointer: fine)", false);
  const smallScreen = useMediaQuery("(max-width: 767.98px)", true);
  const lowPower = useSyncExternalStore(noopSubscribe, detectLowPower, () => true);

  const value = useMemo<MotionPrefs>(
    () => ({
      reducedMotion,
      finePointer,
      smallScreen,
      lowPower,
      allow3D: !reducedMotion && !smallScreen && !lowPower,
    }),
    [reducedMotion, finePointer, smallScreen, lowPower],
  );

  return <MotionPrefsContext.Provider value={value}>{children}</MotionPrefsContext.Provider>;
}

export function useMotionPrefs(): MotionPrefs {
  const ctx = useContext(MotionPrefsContext);
  if (!ctx) throw new Error("useMotionPrefs must be used inside <MotionPrefsProvider>");
  return ctx;
}
