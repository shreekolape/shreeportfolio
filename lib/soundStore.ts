import { readStorage, writeStorage } from "./storage";

// Tiny external store for the sound preference, read with useSyncExternalStore.
// Off by default; persisted in localStorage (Phase 5 wires Howler to it).

const KEY = "sk-sound";
const listeners = new Set<() => void>();
let enabled: boolean | null = null;

export function getSoundEnabled(): boolean {
  if (enabled === null) {
    // Respect reduced-motion users: never restore "on" for them.
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    enabled = !reduced && readStorage(KEY) === "on";
  }
  return enabled;
}

export function setSoundEnabled(next: boolean): void {
  enabled = next;
  writeStorage(KEY, next ? "on" : "off");
  listeners.forEach((l) => l());
}

export function subscribeSound(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
