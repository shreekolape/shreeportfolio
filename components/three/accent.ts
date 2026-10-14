import * as THREE from "three";
import { oklchToLinearRgb } from "@/lib/color";
import { ACCENT_C, ACCENT_L, liveAccent } from "@/providers/AccentProvider";

const color = new THREE.Color();
let lastHue = -1;

/** The live CSS accent as a (shared, reused) THREE.Color. */
export function accentColor(): THREE.Color {
  if (liveAccent.hue !== lastHue) {
    lastHue = liveAccent.hue;
    const [r, g, b] = oklchToLinearRgb(ACCENT_L, ACCENT_C, liveAccent.hue);
    color.setRGB(r, g, b);
  }
  return color;
}

/** 0–1 scroll-velocity glow. */
export function accentGlow(): number {
  return liveAccent.glow;
}
