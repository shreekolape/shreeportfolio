"use client";

// TEMPORARY (remove before the final commit): ?debug=bounds shows obstacle
// boxes (grey) and the character's collision volumes (green, red on contact),
// and exposes window.__sceneCheck(), which sweeps every state + transition.
// Extra debug-only params: &state=<sleep|wake|type|idle|wave> locks a pose,
// &view=side|front|top fixes the camera for inspection.

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { sceneState } from "@/lib/sceneStore";
import type { CharacterState } from "./sceneConfig";
import { dims } from "./sceneDims";
import { findViolations, obstacleBoxes, STATES, sweepAll } from "./rig";
import { rigDebug } from "./Character";

const C = dims.character;
const OK = new THREE.Color("#3ddc84");
const HIT = new THREE.Color("#ff3b3b");

const VIEWS: Record<string, { position: [number, number, number]; target: [number, number, number] }> = {
  side: { position: [-2.1, 0.98, 0.45], target: [0, 0.85, 0.45] },
  // Character faces -z (toward the monitor), so "front" sits on the -z side looking back
  // at +z; raised above the monitor (top ≈ y1.32) so it doesn't block the view.
  front: { position: [0, 1.75, -0.95], target: [0, 1.15, 0.6] },
  top: { position: [0, 3.2, 0.45], target: [0, 0.7, 0.4] },
  face: { position: [-0.95, 1.36, -0.05], target: [-0.05, 1.27, 0.6] },
  body: { position: [-2.1, 1.25, -0.6], target: [0, 0.95, 0.55] },
  // Right hand/wrist sits around [0.1–0.2, 0.79, 0.2–0.3] in idle/type; a close 3/4 view that covers both.
  hand: { position: [0.52, 1.02, 0.62], target: [0.14, 0.79, 0.26] },
};

export const debugParams = () => {
  const p = new URLSearchParams(window.location.search);
  const state = p.get("state") as CharacterState | null;
  return {
    bounds: p.get("debug") === "bounds",
    state: state && STATES.includes(state) ? state : null,
    view: VIEWS[p.get("view") ?? ""] ?? null,
    boxes: p.get("boxes") !== "0",
  };
};

export function DebugBounds() {
  const params = useMemo(() => debugParams(), []);
  const obstacles = useMemo(() => obstacleBoxes().map(({ box }) => new THREE.Box3Helper(box, "#9a9a9f")), []);
  const parts = useMemo(() => Array.from({ length: 12 }, () => new THREE.Box3Helper(new THREE.Box3(), OK)), []);
  const lastLog = useRef(0);

  useEffect(() => {
    (window as unknown as { __sceneCheck: () => unknown }).__sceneCheck = () => sweepAll();
    return () => {
      delete (window as unknown as { __sceneCheck?: unknown }).__sceneCheck;
    };
  }, []);

  // Mounted after the camera rig, so this runs later in the same frame.
  useFrame(({ clock, camera }) => {
    if (params.state) sceneState.state = params.state;
    if (params.view && camera instanceof THREE.PerspectiveCamera) {
      camera.filmOffset = 0;
      camera.position.set(...params.view.position);
      camera.lookAt(...params.view.target);
      camera.updateProjectionMatrix();
    }

    const s = rigDebug.latest;
    if (!s) return;
    const ell = (c: THREE.Vector3, r: readonly number[]) => [c, c, Math.max(...r)] as const;
    const volumes: ReadonlyArray<readonly [THREE.Vector3, THREE.Vector3, number]> = [
      ell(s.pelvisCenter, C.pelvis),
      ell(s.abdomenCenter, C.abdomen),
      ell(s.chestCenter, C.chest),
      ell(s.headCenter, C.head),
      [s.l.shoulder, s.l.elbow, C.upperArmRadius],
      [s.l.elbow, s.l.wrist, C.forearmRadius],
      [s.l.wrist, s.l.handTip, C.handRadius],
      [s.r.shoulder, s.r.elbow, C.upperArmRadius],
      [s.r.elbow, s.r.wrist, C.forearmRadius],
      [s.r.wrist, s.r.handTip, C.handRadius],
      [s.l.shoulder, s.l.shoulder, C.deltoidRadius],
      [s.r.shoulder, s.r.shoulder, C.deltoidRadius],
    ];
    const violations = findViolations(s);
    volumes.forEach(([a, b, r], i) => {
      parts[i].box.setFromPoints([a, b]).expandByScalar(r);
      (parts[i].material as THREE.LineBasicMaterial).color.copy(violations.length ? HIT : OK);
    });
    if (violations.length && clock.elapsedTime - lastLog.current > 1) {
      lastLog.current = clock.elapsedTime;
      console.warn("[scene debug] intersections:", violations);
    }
  });

  if (!params.boxes) return null;
  return (
    <group>
      {obstacles.map((h, i) => (
        <primitive key={`o${i}`} object={h} />
      ))}
      {parts.map((h, i) => (
        <primitive key={`p${i}`} object={h} />
      ))}
    </group>
  );
}
