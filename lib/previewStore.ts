// Which project's preview the 3D monitor should show (slug or null).
// Selected Work rows write it on hover/focus; the monitor reads it in Phase 4.

const listeners = new Set<() => void>();
let active: string | null = null;

export function getActivePreview(): string | null {
  return active;
}

export function setActivePreview(slug: string | null): void {
  if (active === slug) return;
  active = slug;
  listeners.forEach((l) => l());
}

export function subscribePreview(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
