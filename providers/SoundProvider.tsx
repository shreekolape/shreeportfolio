"use client";

import { createContext, useCallback, useContext, useMemo, useSyncExternalStore, type ReactNode } from "react";
import { getSoundEnabled, setSoundEnabled, subscribeSound } from "@/lib/soundStore";

export type SoundName = "click" | "hover" | "toggle";

type SoundContextValue = {
  enabled: boolean;
  toggle: () => void;
  /** No-op until Phase 5 wires up Howler. */
  play: (name: SoundName) => void;
};

const SoundContext = createContext<SoundContextValue | null>(null);

export function SoundProvider({ children }: { children: ReactNode }) {
  const enabled = useSyncExternalStore(subscribeSound, getSoundEnabled, () => false);

  const toggle = useCallback(() => setSoundEnabled(!getSoundEnabled()), []);
  // TODO(Phase 5): load Howler sprites lazily and play here when enabled.
  const play = useCallback<SoundContextValue["play"]>(() => {}, []);

  const value = useMemo(() => ({ enabled, toggle, play }), [enabled, toggle, play]);
  return <SoundContext.Provider value={value}>{children}</SoundContext.Provider>;
}

export function useSound(): SoundContextValue {
  const ctx = useContext(SoundContext);
  if (!ctx) throw new Error("useSound must be used inside <SoundProvider>");
  return ctx;
}
