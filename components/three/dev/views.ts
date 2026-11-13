import type { Vec3 } from "@/components/three/sceneConfig";

// Character faces -z. Coordinates are tuned for the character alone (no desk/monitor
// rendered here, so unlike the main scene's shots there's nothing to look around).

export type DevView = "front" | "side" | "three-quarter" | "portrait";

export const DEV_VIEWS: Record<DevView, { position: Vec3; target: Vec3 }> = {
  front: { position: [0, 1.15, -1.1], target: [0, 1.0, 0.75] },
  side: { position: [-1.8, 1.0, 0.75], target: [0, 0.95, 0.75] },
  "three-quarter": { position: [-1.3, 1.05, -0.5], target: [0, 1.0, 0.72] },
  // Head and shoulders, three-quarter (the About portrait render).
  portrait: { position: [-0.95, 1.36, 0.02], target: [-0.03, 1.17, 0.8] },
};

export const DEV_VIEW_LABELS: Record<DevView, string> = {
  front: "Front",
  side: "Side",
  "three-quarter": "Three-quarter",
  portrait: "Portrait",
};
