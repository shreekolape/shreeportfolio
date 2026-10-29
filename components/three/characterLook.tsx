"use client";

import { forwardRef, useMemo } from "react";
import * as THREE from "three";
import { dims } from "./sceneDims";
import { buildHair, buildHead } from "./meshes";

// Stylised "clay" version of Shree: slim build, black hoodie with a glowing
// </> print, thick wavy black hair, rectangular black glasses, light stubble.
// The head, hair, hoodie, sleeves and legs are continuous sculpted/swept
// meshes (see meshes.ts); only small appliqués (ears, brows, eyes, lips,
// moustache) sit on top of the sculpted head.

const C = dims.character;

// ------------------------------------------------------------------ materials

const clay = (color: string, roughness = 0.82) => new THREE.MeshStandardMaterial({ color, roughness, metalness: 0 });

export const looks = {
  skin: clay("#9a6443", 0.72),
  skinShadow: clay("#7d4f35", 0.8), // ears tone
  facialHair: clay("#1d1612", 0.9),
  features: clay("#1a1311", 0.6),
  lips: clay("#6f3e2b", 0.7),
  /** Vertex-coloured: skin + jaw/upper-lip stubble baked in (see meshes.buildHead). */
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

const unitSphere = new THREE.SphereGeometry(1, 24, 18);

function Blob({
  radii,
  position,
  rotation,
  material,
}: {
  radii: readonly number[];
  position?: readonly number[];
  rotation?: readonly number[];
  material: THREE.Material;
}) {
  return (
    <mesh
      geometry={unitSphere}
      material={material}
      scale={radii as [number, number, number]}
      position={position as [number, number, number] | undefined}
      rotation={rotation as [number, number, number] | undefined}
    />
  );
}

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

/** Medium rectangular black frames, sitting on the nose and running back to the ears. */
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
      {/* Temples run back to the ears, just outside the head. */}
      {[-1, 1].map((sx) => {
        const a = new THREE.Vector3(sx * outer, 0.006, 0.002);
        const b = new THREE.Vector3(sx * (C.head[0] + 0.006), -0.002, -oz - 0.004);
        const dir = b.clone().sub(a);
        const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), dir.clone().normalize());
        return (
          <mesh key={`t${sx}`} material={looks.frame} position={a.clone().addScaledVector(dir, 0.5)} quaternion={q}>
            <boxGeometry args={[0.003, 0.005, dir.length()]} />
          </mesh>
        );
      })}
    </group>
  );
}

// ------------------------------------------------------------------ head

/**
 * Head in its own frame (origin at the neck base, +y up the head, face at -z).
 * The skull, face relief (jaw, nose, brow, cheeks) and chin/lip stubble are one
 * sculpted mesh (meshes.buildHead); hair is one displaced shell (meshes.buildHair).
 * Only small appliqués sit on top: ears, brows, eyes (closable via `eyesRef`),
 * lips and a thin moustache.
 */
export const Head = forwardRef<THREE.Group>(function Head(_, eyesRef) {
  const headGeo = useMemo(() => buildHead(), []);
  const hairGeo = useMemo(() => buildHair(), []);
  const [hx, , hz] = C.head;
  const cy = C.headCenterAlong;
  return (
    <group>
      {/* Neck (partly covered by the hood roll, see Character.tsx) */}
      <mesh position={[0, C.neckLength / 2, 0]} material={looks.skin}>
        <cylinderGeometry args={[C.neckRadius * 0.92, C.neckRadius, C.neckLength + 0.05, 16]} />
      </mesh>

      <group position={[0, cy, 0]}>
        <mesh geometry={headGeo} material={looks.head} />
        <mesh geometry={hairGeo} material={looks.hair} />

        {/* Ears */}
        {[-1, 1].map((sx) => (
          <Blob key={sx} radii={[0.011, 0.028, 0.019]} position={[sx * hx * 0.97, -0.01, 0.004]} material={looks.skinShadow} />
        ))}
        {/* Thin moustache, just above the lip */}
        <mesh position={[0, -0.03, -hz * 0.975]} rotation={[0, 0, Math.PI / 2]} material={looks.facialHair}>
          <capsuleGeometry args={[0.0038, 0.03, 4, 8]} />
        </mesh>
        {/* Lips */}
        <mesh position={[0, -0.046, -hz * 0.95]} rotation={[0, 0, Math.PI / 2]} material={looks.lips}>
          <capsuleGeometry args={[0.0036, 0.024, 4, 8]} />
        </mesh>
        {/* Brows */}
        {[-1, 1].map((sx) => (
          <mesh key={`b${sx}`} position={[sx * 0.032, 0.046, -hz * 0.9]} rotation={[0, 0, Math.PI / 2 + sx * 0.08]} material={looks.features}>
            <capsuleGeometry args={[0.0033, 0.022, 4, 8]} />
          </mesh>
        ))}
        {/* Eyes (scaled flat to close them: sleep, blinks) */}
        <group ref={eyesRef} position={[0, 0.018, -hz * 0.9]}>
          {[-1, 1].map((sx) => (
            <Blob key={sx} radii={[0.0082, 0.0072, 0.005]} position={[sx * 0.031, 0, 0]} material={looks.features} />
          ))}
        </group>
        <Glasses />
      </group>
    </group>
  );
});

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
