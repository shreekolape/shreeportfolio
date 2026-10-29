import * as THREE from "three";

const UP = new THREE.Vector3(0, 1, 0);

/**
 * Point an object along the segment a→b (its local +y), centred between them.
 * With `stretch`, a unit-height geometry is scaled to the segment's length.
 */
export function placeSegment(
  obj: THREE.Object3D | null | undefined,
  a: THREE.Vector3 | readonly [number, number, number],
  b: THREE.Vector3 | readonly [number, number, number],
  stretch = false,
) {
  if (!obj) return;
  const va = a instanceof THREE.Vector3 ? a : new THREE.Vector3(...a);
  const vb = b instanceof THREE.Vector3 ? b : new THREE.Vector3(...b);
  const dir = vb.clone().sub(va);
  obj.position.copy(va).addScaledVector(dir, 0.5);
  if (stretch) obj.scale.set(1, dir.length(), 1);
  obj.quaternion.setFromUnitVectors(UP, dir.normalize());
}

/** Orient an object so its local +y points from `from` toward `to`. */
export function aimAt(
  obj: THREE.Object3D | null | undefined,
  from: readonly [number, number, number],
  to: readonly [number, number, number],
) {
  if (!obj) return;
  const dir = new THREE.Vector3(...to).sub(new THREE.Vector3(...from)).normalize();
  obj.position.set(...from);
  obj.quaternion.setFromUnitVectors(UP, dir);
}
