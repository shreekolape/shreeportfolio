import * as THREE from "three";
import type { CharacterState } from "./sceneConfig";
import { dims, legJoints, sceneBoxes, type Box, type Vec3 } from "./sceneDims";

// Placeholder character rig. Poses describe intent (lean, hunch, head turn,
// where each wrist should be, which way each elbow bends); `solve` turns that
// into joint positions with two-bone IK and then enforces "never inside the
// desk/keyboard/chair": hands are lifted, elbows re-bent and the spine/head
// straightened until nothing intersects. Hips and legs never move.

const C = dims.character;
const MARGIN = 0.002; // a couple of millimetres of air between resting surfaces

export type ArmPose = { wrist: Vec3; pole: Vec3 };
export type Pose = {
  /** Upper-body turn around the hips (+ = toward -x / the camera side). */
  yaw: number;
  /** Lower-spine lean from vertical (+ = toward the desk). */
  lean: number;
  /** Upper-spine bend relative to the lower spine (+ = hunch forward). */
  hunch: number;
  /** Head nod relative to the upper spine (+ = chin down). */
  headPitch: number;
  headYaw: number;
  headRoll: number;
  /** 0 = hand continues the forearm, 1 = hand held level (palm down). */
  handFlat: number;
  /** Finger curl: 0 = open (waving), 1 = curled toward the keys. */
  curl: number;
  l: ArmPose;
  r: ArmPose;
};

// --------------------------------------------------------------------- poses

const kbTop = dims.keyboardTop;
const deskTop = dims.desk.top;
const [, hipY, hipZ] = dims.hips;
const restOnDesk = deskTop + C.forearmRadius + MARGIN;
const shoulderY = hipY + C.lowerSpine + C.shoulderAlong;

/** Each state as a function of time, so states carry their own small motion. */
export const poses: Record<CharacterState, (t: number) => Pose> = {
  // Hunched forward, forehead on forearms folded in front of the keyboard.
  sleep: (t) => {
    const breathe = Math.sin(t * 1.4) * 0.012;
    return {
      yaw: 0,
      lean: 0.3 + breathe,
      hunch: 0.55,
      headPitch: 0.88,
      // Turned to one side, cheek toward the forearms.
      headYaw: 0.7,
      headRoll: 0.1,
      handFlat: 1,
      curl: 0.35,
      // Forearms folded flat on the desk in front of the keyboard, elbows out and
      // down on the surface, hands meeting under the head (one behind the other).
      l: { wrist: [-0.1, restOnDesk, 0.215], pole: [-1, -0.35, 0.05] },
      r: { wrist: [0.1, restOnDesk, 0.31], pole: [1, -0.35, 0.05] },
    };
  },
  // Sitting up, arms stretched overhead.
  wake: (t) => {
    const sway = Math.sin(t * 1.1) * 0.04;
    return {
      yaw: 0,
      lean: -0.05,
      hunch: -0.05,
      headPitch: -0.35,
      headYaw: sway,
      headRoll: 0,
      handFlat: 0,
      curl: 0.15,
      l: { wrist: [-0.17 + sway, shoulderY + 0.52, hipZ], pole: [-1, 0, -0.3] },
      r: { wrist: [0.17 + sway, shoulderY + 0.52, hipZ], pole: [1, 0, -0.3] },
    };
  },
  // Leaning in, wrists just above the keys, alternating taps (only ever upward).
  type: (t) => {
    const tap = (phase: number) => Math.abs(Math.sin(t * 9 + phase)) * 0.01;
    // Wrists hover just in front of the keyboard; curled fingers reach over the keys.
    const wristY = Math.max(kbTop + C.hand[2], dims.matTop + C.forearmRadius) + 0.004;
    const wristZ = dims.keyboard.z + dims.keyboard.depth / 2 + 0.02;
    return {
      yaw: 0,
      lean: 0.16,
      hunch: 0.22,
      headPitch: -0.22,
      headYaw: 0,
      headRoll: 0,
      handFlat: 1,
      curl: 1,
      l: { wrist: [-0.1, wristY + tap(0), wristZ], pole: [-0.6, -1, 0.4] },
      r: { wrist: [0.1, wristY + tap(1.7), wristZ], pole: [0.6, -1, 0.4] },
    };
  },
  // Upright, hands resting near the desk edge, glancing around.
  idle: (t) => ({
    yaw: 0,
    lean: 0.04 + Math.sin(t * 1.3) * 0.01,
    hunch: 0.05,
    headPitch: 0,
    headYaw: Math.sin(t * 0.5) * 0.3,
    headRoll: 0,
    handFlat: 1,
    curl: 0.45,
    l: { wrist: [-0.2, restOnDesk, 0.3], pole: [-0.7, -1, 0.3] },
    r: { wrist: [0.2, restOnDesk, 0.3], pole: [0.7, -1, 0.3] },
  }),
  // Leaning back, turned toward the camera (-x), waving with the near (left) hand.
  wave: (t) => {
    const swing = Math.sin(t * 7) * 0.07;
    return {
      yaw: 0.42,
      lean: -0.1,
      hunch: -0.04,
      headPitch: -0.05,
      headYaw: 0.4,
      headRoll: 0,
      handFlat: 0,
      curl: 0,
      l: { wrist: [-0.45 + swing, shoulderY + 0.36, hipZ - 0.05], pole: [-1, -1, 0] },
      r: { wrist: [0.13, hipY + 0.11, hipZ - 0.2], pole: [1, -0.3, 0.5] },
    };
  },
};

export const STATES = Object.keys(poses) as CharacterState[];

const NUMERIC = ["yaw", "lean", "hunch", "headPitch", "headYaw", "headRoll", "handFlat", "curl"] as const;

/** Weighted blend of poses (weights must sum to > 0). */
export function blendPoses(entries: Array<[Pose, number]>): Pose {
  const total = entries.reduce((s, [, w]) => s + w, 0) || 1;
  const out: Pose = {
    yaw: 0, lean: 0, hunch: 0, headPitch: 0, headYaw: 0, headRoll: 0, handFlat: 0, curl: 0,
    l: { wrist: [0, 0, 0], pole: [0, 0, 0] },
    r: { wrist: [0, 0, 0], pole: [0, 0, 0] },
  };
  for (const [p, w] of entries) {
    const f = w / total;
    for (const k of NUMERIC) out[k] += p[k] * f;
    for (const side of ["l", "r"] as const) {
      for (let i = 0; i < 3; i++) {
        out[side].wrist[i] += p[side].wrist[i] * f;
        out[side].pole[i] += p[side].pole[i] * f;
      }
    }
  }
  return out;
}

// ----------------------------------------------------------------- collision

const toBox3 = (b: Box) => ({ name: b.name, box: new THREE.Box3(new THREE.Vector3(...b.min), new THREE.Vector3(...b.max)) });
const boxes3 = sceneBoxes.map(toBox3);

/** Extra obstacles (props) registered by the scene. */
export function setPropBoxes(extra: Box[]) {
  boxes3.splice(sceneBoxes.length);
  boxes3.push(...extra.map(toBox3));
}

export function obstacleBoxes() {
  return boxes3;
}

type Hit = { depth: number; name: string };
const NONE: Hit = { depth: -Infinity, name: "" };
const worse = (a: Hit, b: Hit) => (b.depth > a.depth ? b : a);

/** How deep a sphere sits inside the worst obstacle (≤ 0 means clear). */
function sphereDepth(p: THREE.Vector3, r: number, ignore: string[] = []): Hit {
  let worst = NONE;
  for (const { name, box } of boxes3) {
    if (ignore.includes(name)) continue;
    worst = worse(worst, { depth: r - box.distanceToPoint(p), name });
  }
  return worst;
}

const tmp = new THREE.Vector3();
function capsuleDepth(a: THREE.Vector3, b: THREE.Vector3, r: number, ignore?: string[]) {
  let worst = NONE;
  for (let i = 0; i <= 8; i++) worst = worse(worst, sphereDepth(tmp.lerpVectors(a, b, i / 8), r, ignore));
  return worst;
}

/** Ellipsoid (centre, orientation, radii) vs obstacles, via points on its surface. */
const ELLIPSOID_DIRS = (() => {
  const dirs: THREE.Vector3[] = [];
  for (let i = 0; i < 6; i++) {
    const phi = (i / 5) * Math.PI;
    for (let j = 0; j < 10; j++) {
      const theta = (j / 10) * Math.PI * 2;
      dirs.push(new THREE.Vector3(Math.sin(phi) * Math.cos(theta), Math.cos(phi), Math.sin(phi) * Math.sin(theta)));
    }
  }
  return dirs;
})();

function ellipsoidDepth(center: THREE.Vector3, q: THREE.Quaternion, radii: Vec3, margin = 0, ignore?: string[]): Hit {
  let worst = NONE;
  for (const d of ELLIPSOID_DIRS) {
    tmp.set(d.x * radii[0], d.y * radii[1], d.z * radii[2]).applyQuaternion(q).add(center);
    worst = worse(worst, sphereDepth(tmp, margin, ignore));
  }
  return worst;
}

// ----------------------------------------------------------------- solving

export type ArmJoints = {
  shoulder: THREE.Vector3;
  elbow: THREE.Vector3;
  wrist: THREE.Vector3;
  handDir: THREE.Vector3;
  handTip: THREE.Vector3;
  /** Hand frame (see handFrom) and centre: drives the visible hand and its collision. */
  handQ: THREE.Quaternion;
  handCenter: THREE.Vector3;
  /** Base of the fingers (wrist + FINGER.knuckle along handDir). */
  knuckle: THREE.Vector3;
  fingerMid: THREE.Vector3;
  fingertip: THREE.Vector3;
};

export type Body = {
  lowerQ: THREE.Quaternion;
  upperQ: THREE.Quaternion;
  headQ: THREE.Quaternion;
  waist: THREE.Vector3;
  neck: THREE.Vector3;
  headCenter: THREE.Vector3;
  pelvisCenter: THREE.Vector3;
  abdomenCenter: THREE.Vector3;
  chestCenter: THREE.Vector3;
};

export type Solved = Body & { hips: THREE.Vector3; l: ArmJoints; r: ArmJoints };

const UP = new THREE.Vector3(0, 1, 0);
const HIPS = new THREE.Vector3(...dims.hips);
const euler = new THREE.Euler();

/** Pelvis/abdomen/chest centres in their segment frames (up the spine). */
export const PELVIS_AT = 0.06;
export const ABDOMEN_AT = 0.13;
export const CHEST_AT = 0.17;

function bodyAt(pose: Pose, lean: number, hunch: number, headPitch: number): Body {
  // Rotations: yaw around the hips, then lean forward (negative x-rotation tips +y toward -z).
  const lowerQ = new THREE.Quaternion().setFromEuler(euler.set(-lean, pose.yaw, 0, "YXZ"));
  const upperQ = lowerQ.clone().multiply(new THREE.Quaternion().setFromEuler(euler.set(-hunch, 0, 0)));
  const headQ = upperQ
    .clone()
    .multiply(new THREE.Quaternion().setFromEuler(euler.set(-headPitch, pose.headYaw, pose.headRoll, "YXZ")));
  const along = (q: THREE.Quaternion, origin: THREE.Vector3, d: number) =>
    new THREE.Vector3(0, d, 0).applyQuaternion(q).add(origin);

  const waist = along(lowerQ, HIPS, C.lowerSpine);
  const neck = along(upperQ, waist, C.upperSpine);
  return {
    lowerQ,
    upperQ,
    headQ,
    waist,
    neck,
    headCenter: along(headQ, neck, C.headCenterAlong),
    pelvisCenter: along(lowerQ, HIPS, PELVIS_AT),
    abdomenCenter: along(lowerQ, HIPS, ABDOMEN_AT),
    chestCenter: along(upperQ, waist, CHEST_AT),
  };
}

const SEAT = ["chair seat"];
/** Parts that sit on the seat, so the seat itself doesn't count as a hit. */
const LOW_PARTS = ["pelvis", "abdomen"];

type Part = { name: string; center: THREE.Vector3; q: THREE.Quaternion; radii: Vec3 };

/** Head volumes: skull, hair, glasses. */
function headParts(b: Body): Part[] {
  const at = (offset: Vec3) => new THREE.Vector3(...offset).applyQuaternion(b.headQ).add(b.headCenter);
  return [
    { name: "head", center: b.headCenter, q: b.headQ, radii: C.head },
    { name: "hair", center: at(C.hairCap.offset), q: b.headQ, radii: C.hairCap.radii },
    { name: "glasses", center: at(C.glasses.offset), q: b.headQ, radii: C.glasses.radii },
  ];
}

/** Torso volumes: pelvis, abdomen, chest, hood. */
function torsoParts(b: Body): Part[] {
  return [
    { name: "pelvis", center: b.pelvisCenter, q: b.lowerQ, radii: C.pelvis },
    { name: "abdomen", center: b.abdomenCenter, q: b.lowerQ, radii: C.abdomen },
    { name: "chest", center: b.chestCenter, q: b.upperQ, radii: C.chest },
    {
      name: "waist",
      center: new THREE.Vector3(0, C.waist.at, 0).applyQuaternion(b.upperQ).add(b.waist),
      q: b.upperQ,
      radii: C.waist.radii,
    },
    {
      name: "hood",
      center: new THREE.Vector3(...C.hood.offset).applyQuaternion(b.upperQ).add(b.waist),
      q: b.upperQ,
      radii: C.hood.radii,
    },
  ];
}

/** Worst intersection of the torso, neck and head with the scene. */
function bodyHit(b: Body, margin = 0): Hit {
  let worst = NONE;
  for (const p of torsoParts(b)) {
    const ignore = LOW_PARTS.includes(p.name) ? SEAT : undefined;
    worst = worse(worst, ellipsoidDepth(p.center, p.q, p.radii, margin, ignore));
  }
  worst = worse(worst, capsuleDepth(b.neck, new THREE.Vector3(0, C.neckLength, 0).applyQuaternion(b.headQ).add(b.neck), C.neckRadius + margin));
  for (const p of headParts(b)) worst = worse(worst, ellipsoidDepth(p.center, p.q, p.radii, margin));
  return worst;
}

/** How far the head (skull, hair, glasses) sinks into either forearm or hand. */
function headIntoArms(b: Body, arms: ArmJoints[]): Hit {
  let worst = NONE;
  const closest = new THREE.Vector3();
  const seg = new THREE.Line3();
  for (const p of headParts(b)) {
    for (const d of ELLIPSOID_DIRS) {
      tmp.set(d.x * p.radii[0], d.y * p.radii[1], d.z * p.radii[2]).applyQuaternion(p.q).add(p.center);
      for (const a of arms) {
        for (const [from, to, r] of [
          [a.elbow, a.wrist, C.forearmRadius],
          [a.wrist, a.handTip, C.hand[2]],
        ] as const) {
          seg.set(from, to).closestPointToPoint(tmp, true, closest);
          worst = worse(worst, { depth: r - closest.distanceTo(tmp), name: `${p.name} ↔ arm` });
        }
      }
    }
  }
  return worst;
}

/** Two-bone IK: shoulder → elbow → wrist, bending toward `pole`. */
function ik(shoulder: THREE.Vector3, target: THREE.Vector3, pole: THREE.Vector3) {
  const l1 = C.upperArm;
  const l2 = C.forearm;
  const toTarget = target.clone().sub(shoulder);
  const dist = THREE.MathUtils.clamp(toTarget.length(), Math.abs(l1 - l2) + 1e-3, l1 + l2 - 1e-3);
  const dir = toTarget.normalize();
  const wrist = shoulder.clone().addScaledVector(dir, dist);
  const a = (l1 * l1 - l2 * l2 + dist * dist) / (2 * dist);
  const h = Math.sqrt(Math.max(0, l1 * l1 - a * a));
  const bend = pole.clone().addScaledVector(dir, -pole.dot(dir));
  if (bend.lengthSq() < 1e-6) bend.set(0, -1, 0).addScaledVector(dir, dir.y);
  bend.normalize();
  const elbow = shoulder.clone().addScaledVector(dir, a).addScaledVector(bend, h);
  return { elbow, wrist };
}

const basisM = new THREE.Matrix4();

/** Finger geometry shared with the visible hand (hand frame: +y along, +z back of hand). */
export const FINGER = { knuckle: 0.088, proximal: 0.038, distal: 0.027, radius: 0.0095, curl1: 0.55, curl2: 0.5 };

/**
 * Hand frame: local +y along the hand, +x across the knuckles, +z out of the
 * back of the hand (up when the hand is level, palm down). Also tracks the
 * curled fingers' midpoint and tip for collision and rendering.
 */
function handFrom(elbow: THREE.Vector3, wrist: THREE.Vector3, flat: number, curl: number) {
  const fore = wrist.clone().sub(elbow).normalize();
  const handDir = new THREE.Vector3(fore.x, fore.y * (1 - flat), fore.z).normalize();
  const handTip = wrist.clone().addScaledVector(handDir, C.handLength);
  const across = new THREE.Vector3().crossVectors(handDir, UP);
  if (across.lengthSq() < 1e-4) across.set(1, 0, 0);
  across.normalize();
  const back = new THREE.Vector3().crossVectors(across, handDir).normalize();
  const handQ = new THREE.Quaternion().setFromRotationMatrix(basisM.makeBasis(across, handDir, back));
  // Palm: wrist → knuckle. Fingers (curled toward the keys when typing) continue past it.
  const knuckle = wrist.clone().addScaledVector(handDir, FINGER.knuckle);
  const handCenter = wrist.clone().addScaledVector(handDir, FINGER.knuckle / 2);
  const a1 = curl * FINGER.curl1;
  const a2 = a1 + curl * FINGER.curl2;
  const fingerMid = knuckle
    .clone()
    .addScaledVector(handDir, FINGER.proximal * Math.cos(a1))
    .addScaledVector(back, -FINGER.proximal * Math.sin(a1));
  const fingertip = fingerMid
    .clone()
    .addScaledVector(handDir, FINGER.distal * Math.cos(a2))
    .addScaledVector(back, -FINGER.distal * Math.sin(a2));
  return { handDir, handTip, handQ, handCenter, knuckle, fingerMid, fingertip };
}

function armHits(j: ArmJoints, margin = 0) {
  return {
    hand: worse(
      ellipsoidDepth(j.handCenter, j.handQ, C.hand, margin),
      worse(sphereDepth(j.fingertip, FINGER.radius + 0.004 + margin), sphereDepth(j.fingerMid, FINGER.radius + 0.004 + margin)),
    ),
    upper: worse(
      capsuleDepth(j.shoulder, j.elbow, C.upperArmRadius + margin, SEAT),
      sphereDepth(j.shoulder, C.deltoidRadius + margin, SEAT),
    ),
    fore: capsuleDepth(j.elbow, j.wrist, C.forearmRadius + margin, SEAT),
  };
}

function solveArm(side: "l" | "r", body: Body, pose: Pose): ArmJoints {
  const sx = side === "l" ? -1 : 1;
  const shoulder = new THREE.Vector3(sx * C.shoulderHalfWidth, C.shoulderAlong, 0)
    .applyQuaternion(body.upperQ)
    .add(body.waist);
  const target = new THREE.Vector3(...pose[side].wrist);
  const pole = new THREE.Vector3(...pose[side].pole).normalize();

  let joints: ArmJoints = {
    shoulder,
    elbow: shoulder,
    wrist: target,
    handDir: UP,
    handTip: target,
    handQ: new THREE.Quaternion(),
    handCenter: target,
    knuckle: target,
    fingerMid: target,
    fingertip: target,
  };
  for (let i = 0; i < 10; i++) {
    const { elbow, wrist } = ik(shoulder, target, pole);
    joints = { shoulder, elbow, wrist, ...handFrom(elbow, wrist, pose.handFlat, pose.curl) };
    const h = armHits(joints, MARGIN);
    const lift = Math.max(h.hand.depth, h.fore.depth, h.upper.depth);
    if (lift <= 0) break;
    // Lift the hand clear; for a limb also re-bend the elbow upward
    // (re-bending alone can't move the forearm near the wrist).
    target.y += lift + 0.002;
    if (h.fore.depth > 0 || h.upper.depth > 0) pole.addScaledVector(UP, 0.6).normalize();
  }
  return joints;
}

/** Shoulders and upper arms can't be fixed by moving the hand, only by moving the body. */
function shoulderHit(j: ArmJoints) {
  return armHits(j, MARGIN).upper.depth;
}

/** Pose → joint positions with every intersection resolved. */
export function solve(pose: Pose): Solved {
  let current = pose;
  for (let attempt = 0; ; attempt++) {
    // Straighten the spine and head until the torso, neck and head are clear.
    let { lean, hunch, headPitch } = current;
    let body = bodyAt(current, lean, hunch, headPitch);
    for (let i = 0; i < 60 && bodyHit(body, MARGIN).depth > 0; i++) {
      lean *= 0.96;
      hunch *= 0.96;
      headPitch *= 0.96;
      body = bodyAt(current, lean, hunch, headPitch);
    }
    const l = solveArm("l", body, current);
    const r = solveArm("r", body, current);
    const shoulders = Math.max(shoulderHit(l), shoulderHit(r));
    const onArm = { l: headIntoArms(body, [l]).depth, r: headIntoArms(body, [r]).depth };
    if (attempt >= 40 || (shoulders <= 0 && Math.max(onArm.l, onArm.r) <= -MARGIN / 2)) {
      return { ...body, hips: HIPS, l, r };
    }

    let raiseHead = false;
    const next: Pose = { ...current, l: { ...current.l }, r: { ...current.r } };
    for (const side of ["l", "r"] as const) {
      const depth = onArm[side] + MARGIN;
      if (depth <= 0) continue;
      const wrist = side === "l" ? l.wrist : r.wrist;
      if (wrist.y < body.headCenter.y - 0.06) {
        // Forearm under the head (resting): lift the head so it rests on, not in, the arm.
        raiseHead = true;
      } else {
        // Arm beside/above the head (passing it): move the hand outward, never down.
        const out = wrist.clone().sub(body.headCenter);
        out.y = Math.max(out.y, 0);
        out.normalize().multiplyScalar(depth + 0.006);
        next[side] = { ...current[side], wrist: [current[side].wrist[0] + out.x, current[side].wrist[1] + out.y, current[side].wrist[2] + out.z] };
      }
    }
    // A shoulder touching the chair/desk: ease the turn and lean.
    const k = shoulders > 0 ? 0.9 : raiseHead ? 0.97 : 1;
    current = {
      ...next,
      yaw: shoulders > 0 ? next.yaw * k : next.yaw,
      lean: next.lean * k,
      hunch: next.hunch * k,
      headPitch: raiseHead ? next.headPitch * 0.97 : next.headPitch,
    };
  }
}

// ------------------------------------------------------------ verification

export type Violation = { part: string; obstacle: string; depth: number };

/** Static legs (thighs rest on the seat, so only checked against everything else). */
export const legs = ([-1, 1] as const).map((sx) => {
  const j = legJoints(sx);
  return {
    sx,
    hip: new THREE.Vector3(...j.hip),
    knee: new THREE.Vector3(...j.knee),
    ankle: new THREE.Vector3(...j.ankle),
  };
});

/** Every intersection in a solved pose (used by the debug overlay and sweep). */
export function findViolations(s: Solved, tolerance = 0.002): Violation[] {
  const out: Violation[] = [];
  const add = (part: string, h: Hit) => {
    if (h.depth > tolerance) out.push({ part, obstacle: h.name, depth: +h.depth.toFixed(4) });
  };
  for (const p of torsoParts(s)) {
    const ignore = LOW_PARTS.includes(p.name) ? SEAT : undefined;
    add(p.name, ellipsoidDepth(p.center, p.q, p.radii, 0, ignore));
  }
  for (const p of headParts(s)) add(p.name, ellipsoidDepth(p.center, p.q, p.radii));
  const onArms = headIntoArms(s, [s.l, s.r]);
  if (onArms.depth > tolerance) out.push({ part: onArms.name, obstacle: "forearm", depth: +onArms.depth.toFixed(4) });
  for (const side of ["l", "r"] as const) {
    const h = armHits(s[side]);
    add(`${side} upper arm`, h.upper);
    add(`${side} forearm`, h.fore);
    add(`${side} hand`, h.hand);
  }
  for (const leg of legs) {
    const n = leg.sx < 0 ? "l" : "r";
    add(`${n} thigh`, capsuleDepth(leg.hip, leg.knee, C.thighRadius, SEAT));
    add(`${n} shin`, capsuleDepth(leg.knee, leg.ankle, C.shinRadius));
  }
  return out;
}

/**
 * Sweeps every state over time and every state-to-state transition at many
 * blend points; returns the worst intersections found.
 */
export function sweepAll(extraStates: Array<[string, (t: number) => Pose]> = []) {
  const all: Array<[string, (t: number) => Pose]> = [
    ...(Object.entries(poses) as Array<[string, (t: number) => Pose]>),
    ...extraStates,
  ];
  const issues: Array<Violation & { at: string }> = [];
  const record = (at: string, s: Solved) => {
    for (const v of findViolations(s)) issues.push({ ...v, at });
  };
  let checks = 0;
  for (const [name, fn] of all) {
    for (let t = 0; t < 6; t += 0.05) {
      record(`${name} t=${t.toFixed(2)}`, solve(fn(t)));
      checks++;
    }
  }
  for (const [a, fa] of all) {
    for (const [b, fb] of all) {
      if (a === b) continue;
      for (let w = 0; w <= 1.0001; w += 0.05) {
        for (const t of [0, 0.7, 1.9, 3.3]) {
          record(`${a}→${b} w=${w.toFixed(2)} t=${t}`, solve(blendPoses([[fa(t), 1 - w], [fb(t), w]])));
          checks++;
        }
      }
    }
  }
  issues.sort((x, y) => y.depth - x.depth);
  return { checks, count: issues.length, worst: issues.slice(0, 20) };
}
