"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useSyncExternalStore, type ReactNode } from "react";
import type { Howl } from "howler";
import { getSoundEnabled, setSoundEnabled, subscribeSound } from "@/lib/soundStore";

export type SoundName = "click" | "hover" | "toggle-on" | "toggle-off";

/** Short, quiet UI clips (35–120 ms); see public/sounds/README.md. */
const SOUNDS: Record<SoundName, { src: string; volume: number }> = {
  click: { src: "/sounds/click.wav", volume: 0.3 },
  hover: { src: "/sounds/hover.wav", volume: 0.12 },
  "toggle-on": { src: "/sounds/toggle-on.wav", volume: 0.35 },
  "toggle-off": { src: "/sounds/toggle-off.wav", volume: 0.35 },
};
const HOVER_MIN_GAP_MS = 70;

// Howler is only downloaded once sound is switched on.
let howls: Promise<Record<SoundName, Howl>> | null = null;
function loadHowls() {
  howls ??= import("howler").then(({ Howl }) => {
    const entries = Object.entries(SOUNDS).map(([name, s]) => [name, new Howl({ src: [s.src], volume: s.volume })]);
    return Object.fromEntries(entries) as Record<SoundName, Howl>;
  });
  return howls;
}

let lastHover = 0;
function playSound(name: SoundName) {
  if (!getSoundEnabled()) return;
  if (name === "hover") {
    const now = performance.now();
    if (now - lastHover < HOVER_MIN_GAP_MS) return;
    lastHover = now;
  }
  loadHowls()
    .then((h) => h[name].play())
    .catch(() => {});
}

type SoundContextValue = {
  enabled: boolean;
  toggle: () => void;
  play: (name: SoundName) => void;
};

const SoundContext = createContext<SoundContextValue | null>(null);

/**
 * UI sounds (Howler). Off by default, preference persisted in localStorage.
 * Any element with `data-sound` gets a hover + click sound via delegation,
 * so components only need the attribute.
 */
export function SoundProvider({ children }: { children: ReactNode }) {
  const enabled = useSyncExternalStore(subscribeSound, getSoundEnabled, () => false);

  // Preload as soon as sound is on so the first click isn't silent.
  useEffect(() => {
    if (enabled) loadHowls().catch(() => {});
  }, [enabled]);

  useEffect(() => {
    let hovered: Element | null = null;

    const onOver = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const el = (e.target as Element | null)?.closest("[data-sound]") ?? null;
      if (el && el !== hovered) playSound("hover");
      hovered = el;
    };
    const onClick = (e: MouseEvent) => {
      if ((e.target as Element | null)?.closest("[data-sound]")) playSound("click");
    };

    document.addEventListener("pointerover", onOver, { passive: true });
    document.addEventListener("click", onClick);
    return () => {
      document.removeEventListener("pointerover", onOver);
      document.removeEventListener("click", onClick);
    };
  }, []);

  const toggle = useCallback(() => {
    if (getSoundEnabled()) {
      playSound("toggle-off"); // play while still enabled
      setSoundEnabled(false);
    } else {
      setSoundEnabled(true);
      playSound("toggle-on");
    }
  }, []);

  const value = useMemo(() => ({ enabled, toggle, play: playSound }), [enabled, toggle]);
  return <SoundContext.Provider value={value}>{children}</SoundContext.Provider>;
}

export function useSound(): SoundContextValue {
  const ctx = useContext(SoundContext);
  if (!ctx) throw new Error("useSound must be used inside <SoundProvider>");
  return ctx;
}
