// Shared animation timing so every motion on the site feels like one system.

export const ease = {
  /** Entrances: text, sections, reveals. */
  out: "power3.out",
  /** Big entrances (hero words). */
  outStrong: "expo.out",
  /** Screen-covering moves: curtain, preloader exit. */
  inOut: "power3.inOut",
  inOutStrong: "expo.inOut",
} as const;

export const duration = {
  fast: 0.3,
  base: 0.6,
  slow: 0.95,
  hero: 1.1,
} as const;

export const stagger = {
  tight: 0.06,
  base: 0.08,
} as const;

/** Set once the app has hydrated, so components can tell first load from client navigation. */
export const appState = { mounted: false };
