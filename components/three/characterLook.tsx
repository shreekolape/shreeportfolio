"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { dims } from "./sceneDims";
import { placeSegment } from "./placeSegment";
import { buildHair, buildHead } from "./meshes";

// Stylised "clay" version of Shree: slim build, black hoodie with a glowing
// </> print, thick wavy black hair, rectangular black glasses. The head,
// hair, hoodie, sleeves and legs are continuous sculpted/swept meshes (see
// meshes.ts). The face is deliberately minimal: a smooth oval with a defined
// jaw and no sculpted nose/lips/brows/cheeks/ears/eyes; the beard and
// moustache are a tint on the head material only (see meshes.buildHead).

const C = dims.character;

// ------------------------------------------------------------------ materials

const clay = (color: string, roughness = 0.82) => new THREE.MeshStandardMaterial({ color, roughness, metalness: 0 });

export const looks = {
  /** Neck, hands and thumb. */
  skin: clay("#8d5a3b", 0.72),
  /** Vertex-coloured: skin + beard/moustache tint baked in (see meshes.buildHead). */
  head: new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.76, metalness: 0 }),
  /** Vertex-coloured: base + highlight on the raised curls (see meshes.buildHair). */
  hair: new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.56, metalness: 0 }),
  hoodie: clay("#1b1b1f", 0.86),
  pants: clay("#2a2d34", 0.84),
  shoe: clay("#38383f", 0.7),
  sole: clay("#9d988f", 0.8),
  frame: new THREE.MeshStandardMaterial({ color: "#0b0b0c", roughness: 0.35, metalness: 0.1 }),
  lens: new THREE.MeshPhysicalMaterial({
    color: "#ffffff",
    roughness: 0.04,
    metalness: 0,
    transparent: true,
    opacity: 0.16,
    clearcoat: 1,
    clearcoatRoughness: 0.03,
    depthWrite: false,
  }),
  /** Chest print: colour + emissive follow the live accent (set per frame). */
  print: new THREE.MeshStandardMaterial({ color: "#7fe3ee", emissive: "#7fe3ee", emissiveIntensity: 0.6, roughness: 0.6 }),
};

// ------------------------------------------------------------------ glasses

function rectRing(w: number, h: number, border: number, r: number) {
  const outer = new THREE.Shape();
  const ow = w / 2 + border;
  const oh = h / 2 + border;
  const R = r + border;
  outer.moveTo(-ow + R, -oh);
  outer.lineTo(ow - R, -oh);
  outer.quadraticCurveTo(ow, -oh, ow, -oh + R);
  outer.lineTo(ow, oh - R);
  outer.quadraticCurveTo(ow, oh, ow - R, oh);
  outer.lineTo(-ow + R, oh);
  outer.quadraticCurveTo(-ow, oh, -ow, oh - R);
  outer.lineTo(-ow, -oh + R);
  outer.quadraticCurveTo(-ow, -oh, -ow + R, -oh);
  const hole = new THREE.Path();
  const iw = w / 2;
  const ih = h / 2;
  hole.moveTo(-iw + r, -ih);
  hole.lineTo(iw - r, -ih);
  hole.quadraticCurveTo(iw, -ih, iw, -ih + r);
  hole.lineTo(iw, ih - r);
  hole.quadraticCurveTo(iw, ih, iw - r, ih);
  hole.lineTo(-iw + r, ih);
  hole.quadraticCurveTo(-iw, ih, -iw, ih - r);
  hole.lineTo(-iw, -ih + r);
  hole.quadraticCurveTo(-iw, -ih, -iw + r, -ih);
  outer.holes.push(hole);
  const geo = new THREE.ExtrudeGeometry(outer, { depth: 0.004, bevelEnabled: true, bevelSize: 0.0012, bevelThickness: 0.0012, bevelSegments: 2 });
  geo.translate(0, 0, -0.002);
  return geo;
}

const LENS_W = 0.046;
const LENS_H = 0.032;
const LENS_X = 0.033;
const TEMPLE_R = 0.0028;

/**
 * Temple-arm path from the lens hinge back over the side of the head,
 * following its curve (ellipse in x/z at a roughly constant height) rather
 * than running straight back.
 */
function templePoints(sx: -1 | 1, hinge: THREE.Vector3): THREE.Vector3[] {
  const [hx, , hz] = C.head;
  return [
    hinge,
    new THREE.Vector3(sx * hx * 0.97, hinge.y + 0.002, -hz * 0.55),
    new THREE.Vector3(sx * hx * 1.03, hinge.y - 0.002, -hz * 0.05),
    new THREE.Vector3(sx * hx * 0.95, hinge.y - 0.009, hz * 0.3),
  ];
}

/** Medium rectangular black frames at eye level; temples wrap back over the head's curve. */
function Glasses() {
  const ring = useMemo(() => rectRing(LENS_W, LENS_H, 0.0045, 0.006), []);
  const [ox, oy, oz] = C.glasses.offset;
  const outer = LENS_X + LENS_W / 2 + 0.0045;

  return (
    <group position={[ox, oy, oz]}>
      {[-1, 1].map((sx) => (
        <group key={sx} position={[sx * LENS_X, 0, 0]} rotation={[0, sx * 0.08, 0]}>
          <mesh geometry={ring} material={looks.frame} />
          <mesh material={looks.lens}>
            <planeGeometry args={[LENS_W, LENS_H]} />
          </mesh>
        </group>
      ))}
      {/* Bridge */}
      <mesh position={[0, 0.004, 0]} material={looks.frame}>
        <boxGeometry args={[LENS_X * 2 - LENS_W - 0.006, 0.004, 0.004]} />
      </mesh>
      {/* Temples: each a short curved wrap, built from thin cylinder segments. */}
      {([-1, 1] as const).map((sx) => {
        const pts = templePoints(sx, new THREE.Vector3(sx * outer, 0.006, 0.002));
        return (
          <group key={`t${sx}`}>
            {pts.slice(1).map((p, i) => (
              <mesh key={i} ref={(m) => placeSegment(m, pts[i], p)} material={looks.frame}>
                <cylinderGeometry args={[TEMPLE_R, TEMPLE_R, pts[i].distanceTo(p), 6]} />
              </mesh>
            ))}
          </group>
        );
      })}
    </group>
  );
}

// ------------------------------------------------------------------ head

/**
 * Head in its own frame (origin at the neck base, +y up the head, face at
 * -z): a short slim neck, the minimal sculpted oval head, the hair shell and
 * the glasses. No separate facial appliqués.
 */
export function Head() {
  const headGeo = useMemo(() => buildHead(), []);
  const hairGeo = useMemo(() => buildHair(), []);
  const cy = C.headCenterAlong;
  return (
    <group>
      {/* Short, slim neck — the hood roll (see Character.tsx) covers most of it. */}
      <mesh position={[0, C.neckLength / 2, 0]} material={looks.skin}>
        <cylinderGeometry args={[C.neckRadius * 0.94, C.neckRadius, C.neckLength + 0.03, 16]} />
      </mesh>

      <group position={[0, cy, 0]}>
        <mesh geometry={headGeo} material={looks.head} />
        <mesh geometry={hairGeo} material={looks.hair} />
        <Glasses />
      </group>
    </group>
  );
}

// ------------------------------------------------------------------ chest print

/** The </> print, built from flat bars (no font needed), glowing in the accent colour. */
export function ChestPrint() {
  const s = 0.0105; // half-height of the chevrons
  const bars: Array<[number, number, number, number]> = [
    // [x1, y1, x2, y2]
    [-0.027, 0, -0.012, s],
    [-0.027, 0, -0.012, -s],
    [0.027, 0, 0.012, s],
    [0.027, 0, 0.012, -s],
    [-0.006, -s * 1.2, 0.006, s * 1.2],
  ];
  return (
    <group>
      {bars.map(([x1, y1, x2, y2], i) => {
        const len = Math.hypot(x2 - x1, y2 - y1);
        const angle = Math.atan2(y2 - y1, x2 - x1);
        return (
          <mesh key={i} position={[(x1 + x2) / 2, (y1 + y2) / 2, 0]} rotation={[0, 0, angle]} material={looks.print}>
            <boxGeometry args={[len + 0.003, 0.0032, 0.0016]} />
          </mesh>
        );
      })}
    </group>
  );
}
