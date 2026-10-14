import type { CharacterState, Shot } from "@/components/three/sceneConfig";

// Shared between the DOM (ScrollTrigger, preloader) and the R3F scene.
// The scene reads `sceneState` every frame; React subscribers use subscribeScene.

export const sceneState = {
  state: "sleep" as CharacterState,
  shot: "hero" as Shot,
  /** True when the 3D canvas will load on this page (home + capable device). */
  expected: false,
  /** 0–1 asset loading progress, reported by the scene. */
  progress: 0,
  /** First frame rendered. */
  ready: false,
};

const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

export function setSceneTarget(state: CharacterState, shot: Shot): void {
  if (sceneState.state === state && sceneState.shot === shot) return;
  sceneState.state = state;
  sceneState.shot = shot;
  emit();
}

export function setSceneLoad(patch: Partial<Pick<typeof sceneState, "expected" | "progress" | "ready">>): void {
  Object.assign(sceneState, patch);
  emit();
}

export function subscribeScene(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export const getCharacterState = () => sceneState.state;
