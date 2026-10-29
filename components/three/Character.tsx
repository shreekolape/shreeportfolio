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

// Simple rounded mitten: a palm, one merged-fingers lump (no separate
// knuckle joints), and a thumb — all capsules, always overlapping their
// neighbour so the hand reads as one piece attached to the sleeve cuff.
const PALM_RADIUS = 0.027;
const PALM_LENGTH = FINGER.knuckle * 1.3; // wrist → knuckle, with cuff overlap
const FINGERS_RADIUS = 0.023;
const FINGERS_LENGTH = (FINGER.proximal + FINGER.distal) * 1.15; // knuckle → fingertip, open-hand span
const THUMB_RADIUS = 0.011;
const THUMB_LENGTH = 0.05;

function Hand({ handRef }: { handRef: Ref<THREE.Group> }) {
  return (
    <group ref={handRef}>
      <mesh material={looks.skin}>
        <capsuleGeometry args={[PALM_RADIUS, Math.max(0.001, PALM_LENGTH - PALM_RADIUS * 2), 4, 10]} />
      </mesh>
      <mesh material={looks.skin}>
        <capsuleGeometry args={[FINGERS_RADIUS, Math.max(0.001, FINGERS_LENGTH - FINGERS_RADIUS * 2), 4, 10]} />
      </mesh>
      <mesh material={looks.skin}>
        <capsuleGeometry args={[THUMB_RADIUS, Math.max(0.001, THUMB_LENGTH - THUMB_RADIUS * 2), 4, 8]} />
      </mesh>
    </group>
  );
}

const acrossV = new THREE.Vector3();
const backV = new THREE.Vector3();
const baseV = new THREE.Vector3();
const tipV = new THREE.Vector3();

function applyHand(group: THREE.Group | null, j: ArmJoints, side: -1 | 1) {
  if (!group) return;
  const [palm, fingers, thumb] = group.children;

  // Capsules are rotationally symmetric, so a simple a→b placement (no twist
  // bookkeeping needed) is enough for the palm and the merged-fingers lump.
  placeSegment(palm, j.wrist, j.knuckle);
  placeSegment(fingers, j.knuckle, j.fingertip);

  // Thumb: short, angled out from the base of the palm on the inner side.
  const across = acrossV.set(1, 0, 0).applyQuaternion(j.handQ);
  const back = backV.set(0, 0, 1).applyQuaternion(j.handQ);
  const base = baseV.copy(j.wrist).addScaledVector(j.handDir, 0.014).addScaledVector(across, -side * 0.024);
  const tip = tipV
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
  const hood = useRef<THREE.Group>(null);
  const print = useRef<THREE.Group>(null);
  const left = useRef<THREE.Group>(null);
  const right = useRef<THREE.Group>(null);

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
        <Head />
      </group>

      <Hand handRef={left} />
      <Hand handRef={right} />
    </group>
  );
}
