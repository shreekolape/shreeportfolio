// Everything needed to swap the placeholder scene for the real GLB lives here.

export type CharacterState = "sleep" | "wake" | "type" | "idle" | "wave" | "relax" | "phone";
export type Shot = "hero" | "intro" | "work" | "orbit" | "footer" | "about" | "contact";
export type Vec3 = [number, number, number];

/** Home sections (`data-scene="…"`) → character state + camera shot. */
export const sectionStates: Record<string, { state: CharacterState; shot: Shot }> = {
  hero: { state: "sleep", shot: "hero" },
  intro: { state: "wake", shot: "intro" },
  work: { state: "type", shot: "work" },
  services: { state: "idle", shot: "orbit" },
  stack: { state: "idle", shot: "orbit" },
  footer: { state: "wave", shot: "footer" },
};

/**
 * The real model. Set `enabled: true` once /public/models/desk-scene.glb exists.
 * It must contain the five clips below (rename them here if Blender/Mixamo
 * names differ) and a mesh named `screenMeshName` with 0–1 UVs, which gets
 * the crossfading preview material.
 */
export const model = {
  enabled: false,
  url: "/models/desk-scene.glb",
  /** true = drei's hosted Draco decoder; or a local path like "/draco/". */
  draco: true as boolean | string,
  clips: {
    sleep: "sleep",
    wake: "wake",
    type: "type",
    idle: "idle",
    wave: "wave",
    relax: "relax",
    phone: "phone",
  } satisfies Record<CharacterState, string>,
  screenMeshName: "Screen",
  /** Seconds to crossfade between animation clips. */
  clipFade: 0.6,
};

/**
 * Camera position + look-at per shot (scene units, desk centred at origin,
 * character in front of it at +z facing -z). `shift` moves the whole image
 * right by that fraction of the viewport width (lens film offset) so the
 * scene sits beside the left-aligned page content without changing perspective.
 */
export const shots: Record<Shot, { position: Vec3; target: Vec3; shift: number }> = {
  hero: { position: [-2.3, 1.95, 2.5], target: [0.05, 0.85, 0.35], shift: 0.2 },
  intro: { position: [-2.6, 1.7, 2.6], target: [0.05, 1.0, 0.4], shift: 0.21 },
  work: { position: [-1.15, 1.62, 2.45], target: [0.05, 1.1, -0.15], shift: 0.2 },
  orbit: { position: [-2.85, 1.75, 1.55], target: [0, 0.95, 0.3], shift: 0.17 },
  footer: { position: [-2.6, 1.5, 1.75], target: [0, 1.05, 0.7], shift: 0.14 },
  // Small close-ups for About (relax) and Contact (phone): tighter, centred on the
  // upper body/head rather than the whole desk.
  about: { position: [-1.05, 1.55, 1.35], target: [-0.05, 1.2, 0.55], shift: 0.1 },
  contact: { position: [-0.95, 1.45, 1.2], target: [0, 1.12, 0.5], shift: 0.1 },
};

export const render = {
  maxDpr: 1.5,
  fov: 35,
  /** How quickly the camera eases to a new shot (higher = faster). */
  cameraDamping: 2.2,
  /** How quickly the character blends between states. */
  poseDamping: 2.6,
};

export const palette = {
  background: "#0a0a0b",
  floor: "#0e0e10",
  desk: "#2a2a2f",
  deskLegs: "#1c1c20",
  clay: "#c9c2b8",
  chair: "#232327",
  device: "#18181b",
  object: "#55535a",
  wall: "#141418",
  windowFrame: "#1d1d22",
};
