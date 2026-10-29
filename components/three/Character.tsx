"use client";

import { useMemo, useRef, type Ref } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { sceneState } from "@/lib/sceneStore";
import { render, type CharacterState } from "./sceneConfig";
import { dims } from "./sceneDims";
import { accentColor, accentGlow } from "./accent";
import { placeSegment } from "./placeSegment";
import { Head, ChestPrint, looks } from "./characterLook";
import {
  buildHoodDrape,
  buildHoodRoll,
  buildLeg,
  buildShoe,
  chestPrintFrame,
  createSweepGeometry,
  SLEEVE_RINGS,
  SLEEVE_SEGMENTS,
  TORSO_RINGS,
  TORSO_SEGMENTS,
  writeSleeve,
  writeTorso,
} from "./meshes";
import { blendPoses, CHEST_AT, FINGER, legs, poses, solve, STATES, type ArmJoints, type Pose, type Solved } from "./rig";

const C = dims.character;
const PRINT_H = C.lowerSpine + CHEST_AT + 0.02;

/** Latest solved joints, read by the debug overlay. */
export const rigDebug: { latest: Solved | null } = { latest: null };

// ------------------------------------------------------------------ hand

// Box dims [width across the knuckles, length along the hand, thickness].
// Lengths are stretched ~25% past their joint-to-joint span so neighbouring
// segments overlap at the seam instead of only touching edge to edge.
const SEAM_OVERLAP = 1.25;
const PALM_SIZE: [number, number, number] = [0.066, FINGER.knuckle * SEAM_OVERLAP, 0.024];
const FINGER_PROX_SIZE: [number, number, number] = [0.054, FINGER.proximal * SEAM_OVERLAP, 0.017];
const FINGER_DIST_SIZE: [number, number, number] = [0.046, FINGER.distal * SEAM_OVERLAP, 0.013];
const THUMB_RADIUS = 0.011;
const THUMB_LENGTH = 0.05;

/** Hand: a palm box and one grouped-fingers paddle (two curling segments), plus a thumb. */
function Hand({ handRef }: { handRef: Ref<THREE.Group> }) {
  return (
    <group ref={handRef}>
      <mesh material={looks.skin}>
        <boxGeometry args={PALM_SIZE} />
      </mesh>
      <mesh material={looks.skin}>
        <boxGeometry args={FINGER_PROX_SIZE} />
      </mesh>
      <mesh material={looks.skin}>
        <boxGeometry args={FINGER_DIST_SIZE} />
      </mesh>
      <mesh material={looks.skin}>
        <capsuleGeometry args={[THUMB_RADIUS, THUMB_LENGTH - THUMB_RADIUS * 2, 4, 8]} />
      </mesh>
    </group>
  );
}

const boxBasis = new THREE.Matrix4();
const dirV = new THREE.Vector3();
const acrossV = new THREE.Vector3();
const thickV = new THREE.Vector3();
const midV = new THREE.Vector3();

/** Orients a box along a→b (local Y), using `handQ`'s local X as the stable "across" axis (no twist as fingers curl). */
function placeFingerBox(mesh: THREE.Object3D | undefined, a: THREE.Vector3, b: THREE.Vector3, handQ: THREE.Quaternion) {
  if (!mesh) return;
  dirV.copy(b).sub(a).normalize();
  acrossV.set(1, 0, 0).applyQuaternion(handQ);
  thickV.crossVectors(acrossV, dirV).normalize();
  acrossV.crossVectors(dirV, thickV).normalize();
  mesh.position.copy(a).add(b).multiplyScalar(0.5);
  mesh.quaternion.setFromRotationMatrix(boxBasis.makeBasis(acrossV, dirV, thickV));
}

function applyHand(group: THREE.Group | null, j: ArmJoints, side: -1 | 1) {
  if (!group) return;
  const [palm, fingerProx, fingerDist, thumb] = group.children;

  palm.position.copy(midV.copy(j.wrist).add(j.knuckle).multiplyScalar(0.5));
  palm.quaternion.copy(j.handQ);

  placeFingerBox(fingerProx, j.knuckle, j.fingerMid, j.handQ);
  placeFingerBox(fingerDist, j.fingerMid, j.fingertip, j.handQ);

  // Thumb: short, angled out from the base of the palm on the inner side.
  const across = acrossV.set(1, 0, 0).applyQuaternion(j.handQ);
  const back = thickV.set(0, 0, 1).applyQuaternion(j.handQ);
  const base = dirV.copy(j.wrist).addScaledVector(j.handDir, 0.014).addScaledVector(across, -side * 0.024);
  const tip = midV
    .copy(base)
    .addScaledVector(j.handDir, THUMB_LENGTH * 0.62)
    .addScaledVector(across, -side * THUMB_LENGTH * 0.62)
    .addScaledVector(back, THUMB_LENGTH * 0.2);
  placeSegment(thumb, base.clone(), tip);
}

// ------------------------------------------------------------------ legs + shoes

function Leg({ geo, shoeGeo, ankle }: { geo: THREE.BufferGeometry; shoeGeo: THREE.BufferGeometry; ankle: THREE.Vector3 }) {
  return (
    <group>
      <mesh geometry={geo} material={looks.pants} />
      <mesh geometry={shoeGeo} material={looks.shoe} position={[ankle.x, 0, ankle.z - 0.05]} />
    </group>
  );
}

// ------------------------------------------------------------------ character

/**
 * Placeholder character (stylised Shree). Same state interface as the GLB:
 * reads sceneState.state, blends poses and renders the solved, clip-free rig
 * as continuous meshes (hoodie torso + sleeves, sculpted head/hair, joggers).
 */
export function Character() {
  const torsoGeo = useMemo(() => createSweepGeometry(TORSO_RINGS, TORSO_SEGMENTS), []);
  const sleeveGeoL = useMemo(() => createSweepGeometry(SLEEVE_RINGS, SLEEVE_SEGMENTS), []);
  const sleeveGeoR = useMemo(() => createSweepGeometry(SLEEVE_RINGS, SLEEVE_SEGMENTS), []);
  const hoodRollGeo = useMemo(() => buildHoodRoll(), []);
  const hoodDrapeGeo = useMemo(() => buildHoodDrape(), []);
  const shoeGeo = useMemo(() => buildShoe(), []);
  const legGeos = useMemo(() => legs.map((leg) => buildLeg(leg.hip, leg.knee, leg.ankle)), []);

  const head = useRef<THREE.Group>(null);
  const eyes = useRef<THREE.Group>(null);
  const hood = useRef<THREE.Group>(null);
  const print = useRef<THREE.Group>(null);
  const left = useRef<THREE.Group>(null);
  const right = useRef<THREE.Group>(null);
  const nextBlink = useRef(2.5);

  const weights = useRef<Record<CharacterState, number>>(
    Object.fromEntries(STATES.map((s) => [s, s === sceneState.state ? 1 : 0])) as Record<CharacterState, number>,
  );
  const printPos = useRef(new THREE.Vector3());
  const printQ = useRef(new THREE.Quaternion());

  useFrame(({ clock }, delta) => {
    const t = clock.elapsedTime;
    const w = weights.current;
    const k = 1 - Math.exp(-render.poseDamping * Math.min(delta, 0.1));

    const entries: Array<[Pose, number]> = [];
    for (const s of STATES) {
      w[s] += ((s === sceneState.state ? 1 : 0) - w[s]) * k;
      if (w[s] > 0.001) entries.push([poses[s](t), w[s]]);
    }

    const s = solve(blendPoses(entries));
    rigDebug.latest = s;

    writeTorso(torsoGeo, s);
    writeSleeve(sleeveGeoL, s.l.shoulder, s.l.elbow, s.l.wrist, s.chestCenter);
    writeSleeve(sleeveGeoR, s.r.shoulder, s.r.elbow, s.r.wrist, s.chestCenter);

    head.current?.position.copy(s.neck);
    head.current?.quaternion.copy(s.headQ);
    hood.current?.position.copy(s.waist);
    hood.current?.quaternion.copy(s.upperQ);
    chestPrintFrame(s, PRINT_H, printPos.current, printQ.current);
    print.current?.position.copy(printPos.current);
    print.current?.quaternion.copy(printQ.current);

    applyHand(left.current, s.l, -1);
    applyHand(right.current, s.r, 1);

    // Eyes: closed while asleep, otherwise an occasional quick blink.
    if (t > nextBlink.current + 0.14) nextBlink.current = t + 2.5 + Math.random() * 3.5;
    const blinking = t > nextBlink.current;
    const open = blinking ? 0.12 : 1 - w.sleep * 0.88;
    eyes.current?.scale.set(1, Math.max(0.12, open), 1);

    // </> print glows softly in the live accent.
    looks.print.color.copy(accentColor());
    looks.print.emissive.copy(accentColor());
    looks.print.emissiveIntensity = 0.55 + accentGlow() * 0.8;
  });

  return (
    <group>
      {legs.map((leg, i) => (
        <Leg key={leg.sx} geo={legGeos[i]} shoeGeo={shoeGeo} ankle={leg.ankle} />
      ))}

      {/* One continuous hoodie body, hips to neckline (writeTorso writes world-space each frame). */}
      <mesh geometry={torsoGeo} material={looks.hoodie} />
      <mesh geometry={sleeveGeoL} material={looks.hoodie} />
      <mesh geometry={sleeveGeoR} material={looks.hoodie} />

      {/* Hood lying down behind the neck: rigidly follows the upper spine. */}
      <group ref={hood}>
        <mesh geometry={hoodRollGeo} material={looks.hoodie} />
        <mesh geometry={hoodDrapeGeo} material={looks.hoodie} />
      </group>

      <group ref={print}>
        <ChestPrint />
      </group>

      {/* Head pivots at the neck. */}
      <group ref={head}>
        <Head ref={eyes} />
      </group>

      <Hand handRef={left} />
      <Hand handRef={right} />
    </group>
  );
}
