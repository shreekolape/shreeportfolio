import * as THREE from "three";
import { sampleStops } from "@/lib/dayCycle";
import { liveDayCycle } from "@/providers/DayCycleProvider";

/** The current scroll-driven time-of-day (0–1), set by DayCycleProvider on Home. */
export function dayT(): number {
  return liveDayCycle.t;
}

const COLOR_STOPS_T = [0, 0.25, 0.5, 0.75, 1];

function sampleColorStops(t: number, colors: readonly THREE.Color[], out: THREE.Color): THREE.Color {
  const clamped = Math.min(1, Math.max(0, t));
  for (let i = 1; i < COLOR_STOPS_T.length; i++) {
    if (clamped <= COLOR_STOPS_T[i]) {
      const span = COLOR_STOPS_T[i] - COLOR_STOPS_T[i - 1];
      const local = span > 0 ? (clamped - COLOR_STOPS_T[i - 1]) / span : 0;
      return out.copy(colors[i - 1]).lerp(colors[i], local);
    }
  }
  return out.copy(colors[colors.length - 1]);
}

const hex = (...values: string[]) => values.map((v) => new THREE.Color(v));

// Midnight → Sunrise → Day → Evening → Midnight.
const SKY_TOP = hex("#060713", "#2d2240", "#2f8fdb", "#2a1f3a", "#060713");
const SKY_HORIZON = hex("#0b0e1c", "#ff8f63", "#bfe4ff", "#ff9d52", "#0b0e1c");
const KEY_LIGHT_COLOR = hex("#5c6ab3", "#ffb37a", "#fdf6ea", "#ffab61", "#5c6ab3");

const SUN_VISIBILITY = [0, 0.55, 1, 0.3, 0] as const;
const MOON_VISIBILITY = [1, 0.2, 0, 0.25, 1] as const;
/** Multiplies the scene's base key/ambient light intensities. */
const KEY_LIGHT_FACTOR = [0.35, 0.85, 2.6, 0.9, 0.35] as const;
const AMBIENT_FACTOR = [0.4, 0.95, 2.1, 0.95, 0.4] as const;
/** The lamp is the main light at night, barely on by day. */
const LAMP_FACTOR = [1, 0.5, 0.06, 0.55, 1] as const;
/** Mug steam shows at sunrise and day only. */
const STEAM_OPACITY = [0, 1, 1, 0, 0] as const;
/** Renderer-wide exposure: the most reliable lever for "day reads as clearly bright"
 *  against ACES tone-mapping's highlight compression, on top of the light intensities above. */
const EXPOSURE_FACTOR = [0.5, 0.85, 1.55, 0.9, 0.5] as const;

const skyTopScratch = new THREE.Color();
export function skyTopColor(t = dayT()): THREE.Color {
  return sampleColorStops(t, SKY_TOP, skyTopScratch);
}

const skyHorizonScratch = new THREE.Color();
export function skyHorizonColor(t = dayT()): THREE.Color {
  return sampleColorStops(t, SKY_HORIZON, skyHorizonScratch);
}

const keyLightScratch = new THREE.Color();
export function keyLightColor(t = dayT()): THREE.Color {
  return sampleColorStops(t, KEY_LIGHT_COLOR, keyLightScratch);
}

export function sunVisibility(t = dayT()): number {
  return sampleStops(t, SUN_VISIBILITY);
}
export function moonVisibility(t = dayT()): number {
  return sampleStops(t, MOON_VISIBILITY);
}
export function keyLightFactor(t = dayT()): number {
  return sampleStops(t, KEY_LIGHT_FACTOR);
}
export function ambientFactor(t = dayT()): number {
  return sampleStops(t, AMBIENT_FACTOR);
}
export function lampFactor(t = dayT()): number {
  return sampleStops(t, LAMP_FACTOR);
}
export function steamOpacity(t = dayT()): number {
  return sampleStops(t, STEAM_OPACITY);
}
export function exposureFactor(t = dayT()): number {
  return sampleStops(t, EXPOSURE_FACTOR);
}

/** Sun and moon travel the window on the same arc, opposite ends of it. -1..1, scale by caller. */
export function celestialX(t = dayT()): number {
  return (Math.min(1, Math.max(0, t)) - 0.5) * 2;
}
/** 0..1 arc height, peaking at midday/mid-cycle. */
export function celestialY(t = dayT()): number {
  return Math.sin(Math.min(1, Math.max(0, t)) * Math.PI);
}
