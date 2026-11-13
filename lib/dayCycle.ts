// Shared (DOM-safe, no three.js) day-cycle math: a single scroll-driven
// `t` (0–1) travels midnight → sunrise → day → evening → midnight across
// Home. Keyframes sit at fixed fractions of that range; everything else
// (sky colour, light intensity, the page tint) is sampled from it.

/** Fixed fractions of the day-cycle range the keyframes below sit at. */
export const DAY_CYCLE_STOPS_T = [0, 0.25, 0.5, 0.75, 1] as const;

/** Each Home section's reference point along the cycle, keyed by `data-scene`. */
export const SECTION_DAY_T: Record<string, number> = {
  hero: 0, // Midnight
  intro: 0.25, // Sunrise
  work: 0.5, // Day
  services: 0.75, // Evening
  stack: 0.75, // Evening (same plateau as "services")
  footer: 1, // Midnight again
};

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));

/** Piecewise-linear interpolation of 5 values across DAY_CYCLE_STOPS_T. */
export function sampleStops(t: number, values: readonly [number, number, number, number, number]): number {
  const stops = DAY_CYCLE_STOPS_T;
  const clamped = clamp01(t);
  for (let i = 1; i < stops.length; i++) {
    if (clamped <= stops[i]) {
      const span = stops[i] - stops[i - 1];
      const local = span > 0 ? (clamped - stops[i - 1]) / span : 0;
      return values[i - 1] + (values[i] - values[i - 1]) * local;
    }
  }
  return values[values.length - 1];
}

function hexToRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

/** Same interpolation, over 5 hex colours, returned as a CSS `rgb()` string. */
export function sampleHexStops(t: number, hexes: readonly [string, string, string, string, string]): string {
  const stops = DAY_CYCLE_STOPS_T;
  const clamped = clamp01(t);
  for (let i = 1; i < stops.length; i++) {
    if (clamped <= stops[i]) {
      const span = stops[i] - stops[i - 1];
      const local = span > 0 ? (clamped - stops[i - 1]) / span : 0;
      const [r1, g1, b1] = hexToRgb(hexes[i - 1]);
      const [r2, g2, b2] = hexToRgb(hexes[i]);
      const r = Math.round(r1 + (r2 - r1) * local);
      const g = Math.round(g1 + (g2 - g1) * local);
      const b = Math.round(b1 + (b2 - b1) * local);
      return `rgb(${r} ${g} ${b})`;
    }
  }
  return hexes[hexes.length - 1];
}

/** Page background tint per B2: stays dark at every point, WCAG AA unaffected. */
export const BG_TINT_STOPS = ["#0B0D12", "#15110F", "#12161C", "#16120D", "#0B0D12"] as const;

export type RouteTheme = {
  /** Fixed time of day for routes without a scroll-driven cycle (null on Home). */
  t: number | null;
  /** Fixed page tint (null on Home, where it follows scroll). */
  bg: string | null;
  /** Transition overlay: a sky gradient for the destination's time of day. */
  curtain: string;
};

const CURTAIN = {
  midnight: "linear-gradient(180deg, #05060f 0%, #0b0e1c 55%, #1a2040 100%)",
  day: "linear-gradient(180deg, #2f8fdb 0%, #78bdee 55%, #c4e6ff 100%)",
  golden: "linear-gradient(180deg, #2a1f3a 0%, #b4563a 55%, #ff9d52 100%)",
  night: "linear-gradient(180deg, #04050c 0%, #0a0d1a 60%, #141a33 100%)",
};

/**
 * Each route's time of day (B3/B4). Home runs the full scroll-driven cycle;
 * Work and case studies are "working hours", About is golden hour, Contact
 * is night. Unknown routes (404, dev tools) fall back to midnight.
 */
export function routeTheme(pathname: string): RouteTheme {
  if (pathname === "/") return { t: null, bg: null, curtain: CURTAIN.midnight };
  if (pathname === "/work" || pathname.startsWith("/work/")) return { t: 0.5, bg: BG_TINT_STOPS[2], curtain: CURTAIN.day };
  if (pathname === "/about") return { t: 0.75, bg: BG_TINT_STOPS[3], curtain: CURTAIN.golden };
  if (pathname === "/contact") return { t: 0, bg: BG_TINT_STOPS[0], curtain: CURTAIN.night };
  return { t: null, bg: null, curtain: CURTAIN.midnight };
}
