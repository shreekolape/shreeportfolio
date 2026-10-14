"use client";

import { useRef, type RefObject } from "react";
import { useFrame, type ThreeElements } from "@react-three/fiber";
import * as THREE from "three";
import { sceneState } from "@/lib/sceneStore";
import { palette, render, type CharacterState } from "./sceneConfig";
import { emptyPose, POSE_KEYS, poses } from "./poses";
import { useScreenMaterial } from "./useScreenMaterial";
import { accentColor } from "./accent";

// Simple primitive stand-in for the real GLB. Same state interface:
// it reads sceneState.state and blends between the five poses.

const STATES = Object.keys(poses) as CharacterState[];
const DESK_TOP = 0.775;
const SEAT = 0.47;
const FIGURE_Z = 0.86;

function Clay({ color = palette.clay, ...props }: { color?: string } & ThreeElements["meshStandardMaterial"]) {
  return <meshStandardMaterial color={color} roughness={0.85} metalness={0} {...props} />;
}

function Desk() {
  const screen = useScreenMaterial();
  const bulb = useRef<THREE.MeshBasicMaterial>(null);

  useFrame(() => {
    bulb.current?.color.copy(accentColor());
  });

  return (
    <group>
      {/* Top + legs */}
      <mesh position={[0, DESK_TOP - 0.025, 0]}>
        <boxGeometry args={[1.6, 0.05, 0.72]} />
        <Clay color={palette.desk} />
      </mesh>
      {[-0.74, 0.74].map((x) =>
        [-0.3, 0.3].map((z) => (
          <mesh key={`${x}${z}`} position={[x, (DESK_TOP - 0.05) / 2, z]}>
            <boxGeometry args={[0.05, DESK_TOP - 0.05, 0.05]} />
            <Clay color={palette.deskLegs} />
          </mesh>
        )),
      )}

      {/* Monitor */}
      <group position={[0, DESK_TOP, -0.2]}>
        <mesh position={[0, 0.008, 0]}>
          <boxGeometry args={[0.22, 0.016, 0.14]} />
          <Clay color={palette.device} />
        </mesh>
        <mesh position={[0, 0.14, -0.01]}>
          <boxGeometry args={[0.04, 0.26, 0.03]} />
          <Clay color={palette.device} />
        </mesh>
        <mesh position={[0, 0.36, 0]}>
          <boxGeometry args={[0.7, 0.43, 0.03]} />
          <Clay color={palette.device} />
        </mesh>
        <mesh position={[0, 0.365, 0.0155]} material={screen}>
          <planeGeometry args={[0.66, 0.39]} />
        </mesh>
      </group>

      {/* Keyboard + mouse */}
      <mesh position={[0, DESK_TOP + 0.01, 0.2]}>
        <boxGeometry args={[0.44, 0.02, 0.14]} />
        <Clay color={palette.device} />
      </mesh>
      <mesh position={[0.33, DESK_TOP + 0.012, 0.22]} scale={[1, 0.55, 1.4]}>
        <sphereGeometry args={[0.03, 16, 12]} />
        <Clay color={palette.device} />
      </mesh>

      {/* Mug + books */}
      <mesh position={[0.45, DESK_TOP + 0.05, 0.1]}>
        <cylinderGeometry args={[0.04, 0.037, 0.1, 20]} />
        <Clay color={palette.object} />
      </mesh>
      <mesh position={[-0.58, DESK_TOP + 0.02, -0.12]} rotation={[0, 0.2, 0]}>
        <boxGeometry args={[0.26, 0.04, 0.19]} />
        <Clay color="#3d3b42" />
      </mesh>
      <mesh position={[-0.57, DESK_TOP + 0.06, -0.12]} rotation={[0, -0.1, 0]}>
        <boxGeometry args={[0.22, 0.04, 0.17]} />
        <Clay color={palette.object} />
      </mesh>

      {/* Lamp (mirrored so it leans in from the right) */}
      <group position={[0.62, DESK_TOP, -0.2]} scale={[-1, 1, 1]}>
        <mesh position={[0, 0.012, 0]}>
          <cylinderGeometry args={[0.08, 0.09, 0.024, 24]} />
          <Clay color={palette.device} />
        </mesh>
        <mesh position={[0.04, 0.22, 0.02]} rotation={[0, 0, -0.35]}>
          <cylinderGeometry args={[0.012, 0.012, 0.44, 10]} />
          <Clay color={palette.device} />
        </mesh>
        <mesh position={[0.15, 0.43, 0.05]} rotation={[0, 0, -1.9]}>
          <cylinderGeometry args={[0.012, 0.012, 0.22, 10]} />
          <Clay color={palette.device} />
        </mesh>
        <mesh position={[0.24, 0.39, 0.08]} rotation={[0, 0, 0.35]}>
          <coneGeometry args={[0.08, 0.12, 24, 1, true]} />
          <Clay color={palette.device} side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[0.235, 0.345, 0.08]}>
          <sphereGeometry args={[0.028, 16, 12]} />
          <meshBasicMaterial ref={bulb} toneMapped={false} />
        </mesh>
      </group>
    </group>
  );
}

function Chair() {
  return (
    <group position={[0, 0, FIGURE_Z + 0.04]}>
      <mesh position={[0, SEAT - 0.03, 0]}>
        <boxGeometry args={[0.46, 0.06, 0.44]} />
        <Clay color={palette.chair} />
      </mesh>
      <mesh position={[0, SEAT + 0.3, 0.24]} rotation={[0.12, 0, 0]}>
        <boxGeometry args={[0.44, 0.52, 0.05]} />
        <Clay color={palette.chair} />
      </mesh>
      <mesh position={[0, (SEAT - 0.06) / 2, 0]}>
        <cylinderGeometry args={[0.025, 0.025, SEAT - 0.06, 10]} />
        <Clay color={palette.deskLegs} />
      </mesh>
      <mesh position={[0, 0.02, 0]}>
        <cylinderGeometry args={[0.24, 0.24, 0.03, 5]} />
        <Clay color={palette.deskLegs} />
      </mesh>
    </group>
  );
}

type Joint = RefObject<THREE.Group | null>;

function Arm({ side, shoulder, elbow }: { side: 1 | -1; shoulder: Joint; elbow: Joint }) {
  return (
    <group ref={shoulder} position={[0.2 * side, 0.5, 0]}>
      <mesh position={[0, -0.13, 0]}>
        <capsuleGeometry args={[0.045, 0.18, 6, 12]} />
        <Clay />
      </mesh>
      <group ref={elbow} position={[0, -0.27, 0]}>
        <mesh position={[0, -0.12, 0]}>
          <capsuleGeometry args={[0.04, 0.17, 6, 12]} />
          <Clay />
        </mesh>
        <mesh position={[0, -0.26, 0]}>
          <sphereGeometry args={[0.045, 14, 10]} />
          <Clay />
        </mesh>
      </group>
    </group>
  );
}

function Figure() {
  const yaw = useRef<THREE.Group>(null);
  const torso = useRef<THREE.Group>(null);
  const head = useRef<THREE.Group>(null);
  const lShoulder = useRef<THREE.Group>(null);
  const lElbow = useRef<THREE.Group>(null);
  const rShoulder = useRef<THREE.Group>(null);
  const rElbow = useRef<THREE.Group>(null);

  // Blend weights per state; start fully in whatever state the page is in.
  const weights = useRef<Record<CharacterState, number>>(
    Object.fromEntries(STATES.map((s) => [s, s === sceneState.state ? 1 : 0])) as Record<CharacterState, number>,
  );
  const pose = useRef(emptyPose());

  useFrame(({ clock }, delta) => {
    const t = clock.elapsedTime;
    const w = weights.current;
    const k = 1 - Math.exp(-render.poseDamping * Math.min(delta, 0.1));

    let total = 0;
    for (const s of STATES) {
      w[s] += ((s === sceneState.state ? 1 : 0) - w[s]) * k;
      total += w[s];
    }

    const p = pose.current;
    for (const key of POSE_KEYS) p[key] = 0;
    for (const s of STATES) {
      if (w[s] < 0.001) continue;
      const sp = poses[s](t);
      const f = w[s] / total;
      for (const key of POSE_KEYS) p[key] += sp[key] * f;
    }

    yaw.current?.rotation.set(0, p.yaw, 0);
    torso.current?.rotation.set(p.torso, 0, 0);
    head.current?.rotation.set(p.head, p.headYaw, 0);
    lShoulder.current?.rotation.set(p.lSx, 0, p.lSz);
    lElbow.current?.rotation.set(p.lEx, 0, p.lEz);
    rShoulder.current?.rotation.set(p.rSx, 0, p.rSz);
    rElbow.current?.rotation.set(p.rEx, 0, p.rEz);
  });

  return (
    <group position={[0, SEAT, FIGURE_Z]}>
      {/* Legs stay put; the upper body turns and leans. */}
      {[-0.1, 0.1].map((x) => (
        <group key={x} position={[x, 0.02, 0]}>
          <mesh position={[0, 0, -0.2]} rotation={[Math.PI / 2, 0, 0]}>
            <capsuleGeometry args={[0.06, 0.32, 6, 12]} />
            <Clay />
          </mesh>
          <mesh position={[0, -0.22, -0.4]}>
            <capsuleGeometry args={[0.05, 0.36, 6, 12]} />
            <Clay />
          </mesh>
        </group>
      ))}

      <group ref={yaw}>
        <group ref={torso}>
          <mesh position={[0, 0.07, 0]}>
            <sphereGeometry args={[0.15, 18, 14]} />
            <Clay />
          </mesh>
          <mesh position={[0, 0.3, 0]}>
            <capsuleGeometry args={[0.16, 0.26, 8, 16]} />
            <Clay />
          </mesh>
          <group ref={head} position={[0, 0.6, 0]}>
            <mesh position={[0, 0.03, 0]}>
              <cylinderGeometry args={[0.045, 0.05, 0.08, 12]} />
              <Clay />
            </mesh>
            <mesh position={[0, 0.15, 0]}>
              <sphereGeometry args={[0.12, 24, 18]} />
              <Clay />
            </mesh>
          </group>
          <Arm side={-1} shoulder={lShoulder} elbow={lElbow} />
          <Arm side={1} shoulder={rShoulder} elbow={rElbow} />
        </group>
      </group>
    </group>
  );
}

/** Placeholder desk + character. Swap for <ModelDesk /> via sceneConfig.model.enabled. */
export function PlaceholderDesk() {
  return (
    <group>
      <Desk />
      <Chair />
      <Figure />
    </group>
  );
}
