import * as THREE from "three";
import { dims } from "./sceneDims";

// Procedural, continuous meshes for the stylised character: a sweep-based
// hoodie torso, sleeves and joggers (rings recomputed from the rig each frame),
// plus a sculpted head and a single displaced hair mesh. Everything is smooth
// shaded with computed normals; no stacked primitives.

const C = dims.character;
const smooth = (a: number, b: number, x: number) => {
  const t = THREE.MathUtils.clamp((x - a) / (b - a), 0, 1);
  return t * t * (3 - 2 * t);
};

// ------------------------------------------------------------------ sweep

/** Indexed tube: `rings` × `segments` vertices (wrapped around), open ends. */
export function createSweepGeometry(rings: number, segments: number) {
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(rings * segments * 3), 3));
  const idx: number[] = [];
  for (let r = 0; r < rings - 1; r++) {
    for (let s = 0; s < segments; s++) {
      const a = r * segments + s;
      const b = r * segments + ((s + 1) % segments);
      const c = (r + 1) * segments + s;
      const d = (r + 1) * segments + ((s + 1) % segments);
      idx.push(a, c, b, b, c, d);
    }
  }
  geo.setIndex(idx);
  return geo;
}

const ringPoint = new THREE.Vector3();

/** Rewrites a sweep's positions: `write(r, s, angle, out)` fills each vertex. */
export function writeSweep(
  geo: THREE.BufferGeometry,
  rings: number,
  segments: number,
  write: (ring: number, seg: number, angle: number, out: THREE.Vector3) => void,
) {
  const pos = geo.getAttribute("position") as THREE.BufferAttribute;
  for (let r = 0; r < rings; r++) {
    for (let s = 0; s < segments; s++) {
      write(r, s, (s / segments) * Math.PI * 2, ringPoint);
      pos.setXYZ(r * segments + s, ringPoint.x, ringPoint.y, ringPoint.z);
    }
  }
  pos.needsUpdate = true;
  geo.computeVertexNormals();
}

// ------------------------------------------------------------------ hoodie torso

/** [height up the spine from the hips, half-width, half-depth]. Hem → neckline. */
const TORSO_PROFILE: Array<[number, number, number]> = [
  [-0.055, 0.128, 0.098],
  [-0.015, 0.129, 0.098], // ribbed hem band ends
  [0.0, 0.136, 0.1],
  [0.08, 0.137, 0.098],
  [0.16, 0.133, 0.095], // slight taper at the waist
  [0.24, 0.141, 0.098],
  [0.32, 0.154, 0.102],
  [0.39, 0.163, 0.105], // chest
  [0.44, 0.172, 0.1],
  [0.47, 0.176, 0.092], // shoulder line
  [0.495, 0.158, 0.082],
  [0.51, 0.122, 0.07],
  [0.522, 0.074, 0.06], // neckline (neck passes through)
];
const HEM_TOP = -0.015;

function profileAt(h: number) {
  const p = TORSO_PROFILE;
  if (h <= p[0][0]) return [p[0][1], p[0][2]];
  for (let i = 1; i < p.length; i++) {
    if (h <= p[i][0]) {
      const t = (h - p[i - 1][0]) / (p[i][0] - p[i - 1][0]);
      const e = t * t * (3 - 2 * t);
      return [p[i - 1][1] + (p[i][1] - p[i - 1][1]) * e, p[i - 1][2] + (p[i][2] - p[i - 1][2]) * e];
    }
  }
  const last = p[p.length - 1];
  return [last[1], last[2]];
}

export const TORSO_RINGS = 40;
export const TORSO_SEGMENTS = 44;
const H0 = TORSO_PROFILE[0][0];
const H1 = TORSO_PROFILE[TORSO_PROFILE.length - 1][0];

type SpineFrame = { lowerQ: THREE.Quaternion; upperQ: THREE.Quaternion; waist: THREE.Vector3; hips: THREE.Vector3 };

const vA = new THREE.Vector3();
const vB = new THREE.Vector3();

/** Position + orientation of the spine at height h (blends lower/upper around the waist). */
export function spineFrameAt(f: SpineFrame, h: number, outPos: THREE.Vector3, outQ: THREE.Quaternion) {
  const L1 = C.lowerSpine;
  const w = smooth(L1 - 0.07, L1 + 0.07, h);
  vA.set(0, h, 0).applyQuaternion(f.lowerQ).add(f.hips);
  vB.set(0, h - L1, 0).applyQuaternion(f.upperQ).add(f.waist);
  outPos.lerpVectors(vA, vB, w);
  outQ.slerpQuaternions(f.lowerQ, f.upperQ, w);
}

/** Superellipse-ish point on a ring (slightly boxy, like a hoodie on a torso). */
function torsoRing(a: number, b: number, angle: number, out: THREE.Vector3) {
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  const n = 2 / 2.5;
  out.set(a * Math.sign(c) * Math.abs(c) ** n, 0, b * Math.sign(s) * Math.abs(s) ** n);
  return out;
}

const center = new THREE.Vector3();
const frameQ = new THREE.Quaternion();

/** One continuous hoodie body following the rig's lower + upper spine. */
export function writeTorso(geo: THREE.BufferGeometry, f: SpineFrame) {
  writeSweep(geo, TORSO_RINGS, TORSO_SEGMENTS, (r, _s, angle, out) => {
    const h = H0 + ((H1 - H0) * r) / (TORSO_RINGS - 1);
    let [a, b] = profileAt(h);
    // Ribbed hem: vertical ribs, a touch tighter.
    if (h < HEM_TOP) {
      const rib = 1 + 0.012 * Math.cos(angle * 30);
      a *= rib;
      b *= rib;
    } else {
      // Soft fabric folds around the belly and lower back.
      const band = smooth(0.0, 0.08, h) * (1 - smooth(0.26, 0.34, h));
      const fold = 1 + band * (0.012 * Math.sin(angle * 3 + h * 22) + 0.006 * Math.sin(angle * 7 - h * 35));
      a *= fold;
      b *= fold;
    }
    spineFrameAt(f, h, center, frameQ);
    torsoRing(a, b, angle, out).applyQuaternion(frameQ).add(center);
    // Close the neckline slightly toward the neck at the very top ring.
    if (r === TORSO_RINGS - 1) out.lerp(center, 0.08);
  });
}

/** Chest-print anchor: front surface of the torso at height h, facing forward. */
export function chestPrintFrame(f: SpineFrame, h: number, outPos: THREE.Vector3, outQ: THREE.Quaternion) {
  spineFrameAt(f, h, outPos, outQ);
  const [, b] = profileAt(h);
  outPos.add(new THREE.Vector3(0, 0, -(b + 0.0025)).applyQuaternion(outQ));
}

// ------------------------------------------------------------------ hood (static, upper-spine frame)

/** Hood lying down: a soft roll around the back and sides of the neck. */
export function buildHoodRoll() {
  const rings = 34;
  const segs = 18;
  const geo = createSweepGeometry(rings, segs);
  // Raised almost to the neck base (and bulked up below) so it covers most of a short neck.
  const y0 = C.upperSpine - 0.002;
  const span = 1.85; // radians each side of the back
  const path = (u: number, out: THREE.Vector3) => {
    const a = (u * 2 - 1) * span;
    return out.set(0.096 * Math.sin(a), y0 + 0.014 * Math.cos(a), 0.075 * Math.cos(a) + 0.006);
  };
  const p = new THREE.Vector3();
  const p2 = new THREE.Vector3();
  const tangent = new THREE.Vector3();
  const normal = new THREE.Vector3();
  const binormal = new THREE.Vector3();
  writeSweep(geo, rings, segs, (r, _s, angle, out) => {
    const u = r / (rings - 1);
    path(u, p);
    path(Math.min(1, u + 0.01), p2);
    tangent.copy(p2).sub(p);
    if (u >= 0.99) tangent.copy(p).sub(path(u - 0.01, p2));
    tangent.normalize();
    normal.copy(p).setY(0).normalize(); // outward from the neck
    binormal.crossVectors(tangent, normal).normalize();
    normal.crossVectors(binormal, tangent).normalize();
    // Thick at the back, tapering toward the front; soft fabric wrinkles.
    const across = Math.cos(((u * 2 - 1) * Math.PI) / 2);
    const rad = (0.016 + 0.044 * across ** 1.3) * (1 + 0.08 * Math.sin(u * 40) * across);
    // Flattened against the body (wider outward than upward).
    out
      .copy(p)
      .addScaledVector(normal, Math.cos(angle) * rad * 1.15)
      .addScaledVector(binormal, Math.sin(angle) * rad * 0.85);
  });
  return geo;
}

/** The hood's fabric lying flat on the upper back, below the roll. */
export function buildHoodDrape() {
  const cols = 22;
  const rows = 14;
  const geo = new THREE.BufferGeometry();
  const pos = new Float32Array(cols * rows * 3);
  const idx: number[] = [];
  const top = C.upperSpine - 0.02; // just under the roll
  const bottom = 0.17; // upper back
  for (let j = 0; j < rows; j++) {
    const v = j / (rows - 1);
    const y = top + (bottom - top) * v;
    const [a, b] = profileAt(C.lowerSpine + y);
    const halfSpan = 0.95 * (1 - 0.82 * v ** 1.4); // radians, narrowing to a point
    for (let i = 0; i < cols; i++) {
      const u = (i / (cols - 1)) * 2 - 1;
      const angle = Math.PI / 2 + u * halfSpan; // +z is the back
      const ring = torsoRing(a, b, angle, new THREE.Vector3());
      const lift = 0.011 * (1 - Math.abs(u) ** 3) * (1 - v * 0.4) + 0.002;
      const dir = new THREE.Vector3(ring.x, 0, ring.z).normalize();
      const k = (i + j * cols) * 3;
      pos[k] = ring.x + dir.x * lift;
      pos[k + 1] = y + 0.003 * Math.sin(u * 9 + v * 5);
      pos[k + 2] = ring.z + dir.z * lift;
      if (i < cols - 1 && j < rows - 1) {
        const a0 = i + j * cols;
        idx.push(a0, a0 + cols, a0 + 1, a0 + 1, a0 + cols, a0 + cols + 1);
      }
    }
  }
  geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  geo.setIndex(idx);
  geo.computeVertexNormals();
  return geo;
}

// ------------------------------------------------------------------ curve frames

const UP = new THREE.Vector3(0, 1, 0);
const X_AXIS = new THREE.Vector3(1, 0, 0);

type CurveFrames = { points: THREE.Vector3[]; normals: THREE.Vector3[]; binormals: THREE.Vector3[] };

function allocFrames(n: number): CurveFrames {
  const make = () => Array.from({ length: n }, () => new THREE.Vector3());
  return { points: make(), normals: make(), binormals: make() };
}

const tPrev = new THREE.Vector3();
const tCur = new THREE.Vector3();
const transport = new THREE.Quaternion();

/**
 * Samples a curve and builds twist-free (parallel-transported) frames, so
 * rings never flip or pinch when a limb points straight up.
 */
function sampleFrames(curve: THREE.Curve<THREE.Vector3>, f: CurveFrames) {
  const n = f.points.length;
  for (let i = 0; i < n; i++) {
    const u = i / (n - 1);
    curve.getPointAt(u, f.points[i]);
    curve.getTangentAt(u, tCur);
    if (i === 0) {
      f.normals[0].crossVectors(tCur, Math.abs(tCur.y) > 0.9 ? X_AXIS : UP).normalize();
    } else {
      transport.setFromUnitVectors(tPrev, tCur);
      f.normals[i].copy(f.normals[i - 1]).applyQuaternion(transport);
    }
    f.binormals[i].crossVectors(tCur, f.normals[i]).normalize();
    f.normals[i].crossVectors(f.binormals[i], tCur).normalize();
    tPrev.copy(tCur);
  }
}

// ------------------------------------------------------------------ sleeves

export const SLEEVE_RINGS = 36;
export const SLEEVE_SEGMENTS = 22;

const sleeveCurve = new THREE.CatmullRomCurve3([new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()], false, "centripetal");
const sleeveFrames = allocFrames(SLEEVE_RINGS);

/** Sleeve radius along the arm (u: 0 inside the shoulder → 1 at the wrist). */
function sleeveRadius(u: number, angle: number) {
  const shoulder = 0.058 - 0.01 * smooth(0, 0.14, u);
  const upper = 0.049;
  const fore = 0.044;
  let r = u < 0.14 ? shoulder : u < 0.52 ? upper : u < 0.6 ? upper - (upper - fore) * smooth(0.52, 0.6, u) : fore;
  // Fabric bunching at the elbow and just above the cuff.
  r += 0.0025 * Math.sin(angle * 3 + u * 30) * (smooth(0.45, 0.55, u) - smooth(0.6, 0.68, u));
  r += 0.0015 * smooth(0.82, 0.9, u) * (1 - smooth(0.9, 0.93, u)) * (1 + Math.sin(angle * 5));
  // Ribbed cuff, snug at the wrist.
  if (u > 0.92) r = 0.039 * (1 + 0.03 * Math.cos(angle * 26));
  return r;
}

/** Continuous sleeve from inside the shoulder, through the elbow, to the wrist. */
export function writeSleeve(
  geo: THREE.BufferGeometry,
  shoulder: THREE.Vector3,
  elbow: THREE.Vector3,
  wrist: THREE.Vector3,
  chestCenter: THREE.Vector3,
) {
  const pts = sleeveCurve.points;
  // Start inside the torso so the sleeve grows out of the shoulder seamlessly.
  pts[0].copy(shoulder).lerp(chestCenter, 0.28).addScaledVector(UP, 0.02);
  pts[1].copy(shoulder);
  pts[2].copy(elbow);
  pts[3].copy(wrist);
  sleeveCurve.updateArcLengths();
  sampleFrames(sleeveCurve, sleeveFrames);
  const { points, normals, binormals } = sleeveFrames;
  writeSweep(geo, SLEEVE_RINGS, SLEEVE_SEGMENTS, (r, _s, angle, out) => {
    const rad = sleeveRadius(r / (SLEEVE_RINGS - 1), angle);
    out.copy(points[r]).addScaledVector(normals[r], Math.cos(angle) * rad).addScaledVector(binormals[r], Math.sin(angle) * rad);
  });
}

// ------------------------------------------------------------------ joggers (static)

/** One jogger leg: thigh along the seat, rounded knee, shin down to a ribbed ankle cuff. */
export function buildLeg(hip: THREE.Vector3, knee: THREE.Vector3, ankle: THREE.Vector3) {
  const curve = new THREE.CatmullRomCurve3(
    [
      hip.clone().add(new THREE.Vector3(0, 0.005, 0.06)),
      hip.clone(),
      knee.clone().add(new THREE.Vector3(0, 0, 0.07)),
      knee.clone().add(new THREE.Vector3(0, -0.035, -0.012)),
      knee.clone().add(new THREE.Vector3(0, -0.12, 0)),
      ankle.clone(),
    ],
    false,
    "centripetal",
  );
  const rings = 48;
  const segs = 22;
  const geo = createSweepGeometry(rings, segs);
  const frames = allocFrames(rings);
  sampleFrames(curve, frames);
  writeSweep(geo, rings, segs, (r, _s, angle, out) => {
    const u = r / (rings - 1);
    const p = frames.points[r];
    const n = frames.normals[r];
    const b = frames.binormals[r];
    // Thigh → knee → calf → ankle, slim joggers with a soft knee crease.
    let rad = 0.058 - 0.01 * smooth(0.3, 0.5, u) - 0.002 * smooth(0.6, 0.7, u) + 0.003 * smooth(0.62, 0.72, u) * (1 - smooth(0.75, 0.88, u));
    rad -= 0.006 * smooth(0.8, 0.94, u);
    if (u > 0.94) rad = 0.039 * (1 + 0.03 * Math.cos(angle * 24));
    rad *= 1 + 0.012 * Math.sin(angle * 4 + u * 18) * smooth(0.35, 0.5, u) * (1 - smooth(0.5, 0.6, u));
    out.copy(p).addScaledVector(n, Math.cos(angle) * rad).addScaledVector(b, Math.sin(angle) * rad);
  });
  return geo;
}

/** Simple rounded sneaker (upper only; the sole is a separate slab). Origin under the heel-to-toe centre. */
export function buildShoe() {
  const geo = new THREE.SphereGeometry(1, 36, 22);
  const pos = geo.getAttribute("position") as THREE.BufferAttribute;
  const v = new THREE.Vector3();
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i);
    const toe = smooth(0.2, -1, v.z); // 1 at the toe (-z)
    let x = v.x * (0.046 + 0.004 * toe);
    let y = v.y * (0.042 - 0.012 * toe);
    const z = v.z * 0.13;
    if (y < 0) y *= 0.25; // flat underside
    // Opening at the ankle: dip the top near the heel.
    if (v.y > 0.6 && v.z > 0.1) y -= 0.012 * smooth(0.6, 1, v.y);
    x *= 1 - 0.1 * smooth(0.6, 1, v.z);
    pos.setXYZ(i, x, y + 0.03, z);
  }
  geo.computeVertexNormals();
  return geo;
}

// ------------------------------------------------------------------ head + hair

const SKIN = new THREE.Color("#8d5a3b");
const STUBBLE = new THREE.Color("#5a3d2a");

/**
 * Minimal head in its own frame (centre at origin, +y up, face at -z): a
 * smooth, slightly long oval with a defined jaw and no other facial relief
 * (no nose, lips, brows, cheeks, ears or eyes). The beard/moustache are a
 * subtle darker tint baked into the vertex colours, not geometry.
 */
export function buildHead() {
  const [hx, hy, hz] = C.head;
  const geo = new THREE.SphereGeometry(1, 72, 56);
  const pos = geo.getAttribute("position") as THREE.BufferAttribute;
  const colors = new Float32Array(pos.count * 3);
  const v = new THREE.Vector3();
  const col = new THREE.Color();
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i);
    const { y } = v;
    let { x, z } = v;
    // Jaw: narrow the lower head, with a firmer line under the cheeks.
    x *= 1 - 0.26 * smooth(-0.15, -1, y) - 0.1 * smooth(-0.45, -0.9, y);
    z *= 1 - 0.08 * smooth(-0.3, -1, y) * (z > 0 ? 1 : 0);
    pos.setXYZ(i, x * hx, y * hy, z * hz);

    // Beard + moustache: a soft darker tint over the lower face/jaw and the
    // upper-lip band, never sculpted — just colour.
    const front = Math.max(0, -z);
    const beard = smooth(-0.3, -0.72, v.y) * smooth(0.6, -0.3, v.z);
    const moustache = Math.exp(-((v.x / 0.3) ** 2 + ((v.y + 0.3) / 0.07) ** 2)) * front;
    col.copy(SKIN).lerp(STUBBLE, Math.min(0.55, beard * 0.55 + moustache * 0.35));
    colors[i * 3] = col.r;
    colors[i * 3 + 1] = col.g;
    colors[i * 3 + 2] = col.b;
  }
  geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  geo.computeVertexNormals();
  return geo;
}

/**
 * One continuous hair mesh: a displaced shell over the scalp with lots of
 * volume on top, soft curl bumps, a wavy fringe on the forehead and shorter
 * sides. Outside the hairline the shell tucks just inside the skull.
 */
const HAIR_BASE = new THREE.Color("#121011");
const HAIR_HI = new THREE.Color("#2e2926");

export function buildHair() {
  const [hx, hy, hz] = C.head;
  const geo = new THREE.SphereGeometry(1, 96, 72);
  const pos = geo.getAttribute("position") as THREE.BufferAttribute;
  const colors = new Float32Array(pos.count * 3);
  const d = new THREE.Vector3();
  const col = new THREE.Color();
  for (let i = 0; i < pos.count; i++) {
    d.fromBufferAttribute(pos, i);
    const theta = Math.atan2(d.x, -d.z); // 0 = front, ±π = back
    const at = Math.abs(theta);
    // Hairline height (unit sphere y): high on the forehead, above the ears, low at the nape.
    let line = 0.5 - 0.26 * smooth(0.35, 1.0, at) + 0.04 * smooth(1.1, 1.5, at) - 0.72 * smooth(1.7, 2.9, at);
    // Fringe: wavy edge falling onto the forehead (stops above the glasses).
    const fringe = 1 - smooth(0.55, 0.85, at);
    line -= fringe * (0.17 + 0.05 * Math.sin(theta * 26) + 0.02 * Math.sin(theta * 61));
    const mask = smooth(line - 0.07, line + 0.03, d.y);

    // Thickness: big volume on top, short at the sides, a little at the back.
    const top = smooth(0.15, 0.95, d.y);
    const sides = smooth(0.7, 1.4, at) * (1 - smooth(2.2, 2.9, at));
    let thick = 0.06 + 0.2 * top - 0.03 * sides + 0.02 * smooth(2.2, 3.1, at);
    // Soft wavy-to-curly bumps (curlier on top), plus a few larger messy lumps.
    const curl =
      0.034 * Math.sin(17 * d.x + 3) * Math.sin(15 * d.y + 1) * Math.sin(19 * d.z + 2) +
      0.022 * Math.sin(29 * d.x + 21 * d.z) * Math.sin(25 * d.y + 4) +
      0.04 * Math.sin(5 * d.x + 1) * Math.sin(6 * d.z + 2) * Math.sin(4 * d.y + 0.5);
    thick += curl * (0.45 + 0.55 * top);
    // Fringe hangs forward and down over the forehead.
    let dy = 0;
    if (fringe > 0 && d.y < 0.55 && d.z < 0) {
      dy = -0.035 * fringe * smooth(0.55, 0.3, d.y);
      thick = Math.max(thick, 0.07 * fringe);
    }
    // Outside the hairline the shell sinks well inside the skull (the jaw is
    // narrower than the base ellipsoid), so only the hair itself is visible.
    const scale = 0.6 + mask * (0.4 + Math.max(0.02, thick));
    pos.setXYZ(i, d.x * hx * scale, (d.y + dy * mask) * hy * scale, d.z * hz * scale);

    // Subtle highlight on the raised curls/crests so the volume reads under light.
    col.copy(HAIR_BASE).lerp(HAIR_HI, THREE.MathUtils.clamp(curl * 6 + top * 0.15, 0, 1) * mask);
    colors[i * 3] = col.r;
    colors[i * 3 + 1] = col.g;
    colors[i * 3 + 2] = col.b;
  }
  geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  geo.computeVertexNormals();
  return geo;
}
