"use client";

import { useRef } from "react";
import { useFrame, type ThreeElements } from "@react-three/fiber";
import * as THREE from "three";
import { palette } from "./sceneConfig";
import { RoundedBox } from "@react-three/drei";
import { deskLegPositions, dims, lamp } from "./sceneDims";
import { aimAt, placeSegment } from "./placeSegment";
import { useScreenMaterial } from "./useScreenMaterial";
import { accentColor } from "./accent";
import { Character, rigDebug } from "./Character";
import { Window } from "./Window";
import { lampFactor, steamOpacity } from "./dayCycle";
import { phoneInHand } from "./rig";
import { sceneState } from "@/lib/sceneStore";

// Placeholder desk set + character, all built from sceneDims.

const { desk, mat, keyboard, mouse, chair, monitor } = dims;

function Clay({ color = palette.clay, ...props }: { color?: string } & ThreeElements["meshStandardMaterial"]) {
  return <meshStandardMaterial color={color} roughness={0.85} metalness={0} {...props} />;
}

/** Soft rising wisps above the mug; only visible at sunrise and day (dayCycle.steamOpacity). */
function Steam({ position }: { position: [number, number, number] }) {
  const group = useRef<THREE.Group>(null);
  const mats = useRef<(THREE.MeshBasicMaterial | null)[]>([]);

  useFrame(({ clock }) => {
    const opacity = steamOpacity();
    const group_ = group.current;
    if (!group_) return;
    group_.children.forEach((child, i) => {
      const mesh = child as THREE.Mesh;
      const speed = 0.18 + i * 0.05;
      const cycle = 1.6 + i * 0.3;
      const h = ((clock.elapsedTime * speed + i * 0.6) % cycle) / cycle;
      mesh.position.set(Math.sin(clock.elapsedTime * 0.9 + i) * 0.02 * h, h * 0.32, 0);
      mesh.scale.setScalar(0.6 + h * 1.3);
      const mat = mats.current[i];
      if (mat) mat.opacity = opacity * (1 - h) * 0.75;
    });
  });

  return (
    <group ref={group} position={position}>
      {[0, 1, 2].map((i) => (
        <mesh key={i}>
          <sphereGeometry args={[0.026, 8, 8]} />
          <meshBasicMaterial
            ref={(m) => {
              mats.current[i] = m;
            }}
            color="#ffffff"
            transparent
            opacity={0}
            depthWrite={false}
            toneMapped={false}
          />
        </mesh>
      ))}
    </group>
  );
}

const { phone } = dims;
const PHONE_DESK_POS = new THREE.Vector3(phone.desk.x, desk.top + phone.thickness / 2, phone.desk.z);
// Face down: rotate the screen (+z) to point at the desk, then turn it on the desk.
const PHONE_DESK_Q = new THREE.Quaternion()
  .setFromAxisAngle(new THREE.Vector3(0, 1, 0), phone.desk.yaw)
  .multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI / 2));

/**
 * The phone: face down on the desk in every pose except `phone`, where it
 * sits in the right hand with the screen turned toward his face and a soft
 * glow from the screen lighting it (see rig.ts `phoneInHand`).
 */
function Phone() {
  const group = useRef<THREE.Group>(null);
  const screen = useRef<THREE.Mesh>(null);
  const glow = useRef<THREE.PointLight>(null);

  useFrame(() => {
    const g = group.current;
    if (!g) return;
    const solved = rigDebug.latest;
    const held = sceneState.state === "phone" && solved !== null;
    if (held) {
      const { center, q } = phoneInHand(solved);
      g.position.copy(center);
      g.quaternion.copy(q);
    } else {
      g.position.copy(PHONE_DESK_POS);
      g.quaternion.copy(PHONE_DESK_Q);
    }
    if (screen.current) screen.current.visible = held;
    if (glow.current) glow.current.intensity = held ? 0.9 : 0;
  });

  return (
    <group ref={group}>
      <RoundedBox args={[phone.width, phone.length, phone.thickness]} radius={0.004} smoothness={3}>
        <Clay color="#141417" roughness={0.45} />
      </RoundedBox>
      <mesh ref={screen} position={[0, 0, phone.thickness / 2 + 0.0006]} visible={false}>
        <planeGeometry args={[phone.width - 0.008, phone.length - 0.014]} />
        <meshBasicMaterial color="#d5e3ff" toneMapped={false} />
      </mesh>
      {/* Screen glow on his face, only while he's looking at it. */}
      <pointLight ref={glow} position={[0, 0, 0.05]} color="#bcd2ff" intensity={0} distance={0.7} decay={2} />
    </group>
  );
}

function Desk() {
  const screen = useScreenMaterial();
  const bulb = useRef<THREE.MeshBasicMaterial>(null);

  useFrame(() => {
    if (bulb.current) {
      bulb.current.color.copy(accentColor()).multiplyScalar(0.15 + 0.85 * lampFactor());
    }
  });

  return (
    <group>
      {/* Top + legs */}
      <mesh position={[0, desk.top - desk.thickness / 2, 0]}>
        <boxGeometry args={[desk.width, desk.thickness, desk.depth]} />
        <Clay color={palette.desk} />
      </mesh>
      {deskLegPositions.map((p) => (
        <mesh key={p.join()} position={p}>
          <boxGeometry args={[desk.legSize, desk.top - desk.thickness, desk.legSize]} />
          <Clay color={palette.deskLegs} />
        </mesh>
      ))}

      {/* Monitor: stand, panel, screen */}
      <group position={[0, desk.top, monitor.z]}>
        <mesh position={[0, monitor.standBase.height / 2, 0.01]}>
          <boxGeometry args={[monitor.standBase.width, monitor.standBase.height, monitor.standBase.depth]} />
          <Clay color={palette.device} />
        </mesh>
        <mesh position={[0, monitor.lift / 2, -0.01]}>
          <boxGeometry args={[0.04, monitor.lift + 0.04, 0.03]} />
          <Clay color={palette.device} />
        </mesh>
        <mesh position={[0, monitor.lift + monitor.height / 2, 0]}>
          <boxGeometry args={[monitor.width, monitor.height, monitor.depth]} />
          <Clay color={palette.device} />
        </mesh>
        <mesh position={[0, monitor.lift + monitor.height / 2, monitor.depth / 2 + 0.0005]} material={screen}>
          <planeGeometry args={[monitor.width - 0.04, monitor.height - 0.04]} />
        </mesh>
      </group>

      {/* Desk mat, keyboard, mouse */}
      <mesh position={[mat.x, desk.top + mat.height / 2, mat.z]}>
        <boxGeometry args={[mat.width, mat.height, mat.depth]} />
        <Clay color="#1d1d21" />
      </mesh>
      <mesh position={[keyboard.x, dims.matTop + keyboard.height / 2, keyboard.z]}>
        <boxGeometry args={[keyboard.width, keyboard.height, keyboard.depth]} />
        <Clay color={palette.device} />
      </mesh>
      <mesh position={[mouse.x, dims.matTop + mouse.height / 2, mouse.z]} scale={[1, 0.5, 1.6]}>
        <sphereGeometry args={[mouse.width / 2, 16, 12]} />
        <Clay color={palette.device} />
      </mesh>

      {/* Mug + books (Part 3 replaces these with the full prop set) */}
      <mesh position={[0.45, desk.top + 0.05, 0.05]}>
        <cylinderGeometry args={[0.04, 0.037, 0.1, 20]} />
        <Clay color={palette.object} />
      </mesh>
      <Steam position={[0.45, desk.top + 0.1, 0.05]} />
      <mesh position={[0.55, desk.top + 0.02, -0.14]} rotation={[0, 0.2, 0]}>
        <boxGeometry args={[0.26, 0.04, 0.19]} />
        <Clay color="#3d3b42" />
      </mesh>
      <mesh position={[0.56, desk.top + 0.06, -0.14]} rotation={[0, -0.1, 0]}>
        <boxGeometry args={[0.22, 0.04, 0.17]} />
        <Clay color={palette.object} />
      </mesh>

      {/* Lamp: left side of the desk, shade aimed at the keyboard. */}
      <group>
        <mesh position={[lamp.base[0], lamp.base[1] + 0.012, lamp.base[2]]}>
          <cylinderGeometry args={[0.075, 0.085, 0.024, 24]} />
          <Clay color={palette.device} />
        </mesh>
        <mesh ref={(m) => placeSegment(m, lamp.base, lamp.elbow, true)}>
          <cylinderGeometry args={[0.011, 0.011, 1, 10]} />
          <Clay color={palette.device} />
        </mesh>
        <mesh ref={(m) => placeSegment(m, lamp.elbow, lamp.head, true)}>
          <cylinderGeometry args={[0.011, 0.011, 1, 10]} />
          <Clay color={palette.device} />
        </mesh>
        <mesh position={lamp.elbow}>
          <sphereGeometry args={[0.018, 12, 10]} />
          <Clay color={palette.device} />
        </mesh>
        {/* Shade: local +y aims at the keyboard; the cone opens toward it. */}
        <group ref={(g) => aimAt(g, lamp.head, lamp.aim)}>
          <mesh rotation={[Math.PI, 0, 0]} position={[0, 0.02, 0]}>
            <coneGeometry args={[0.07, 0.11, 24, 1, true]} />
            <Clay color={palette.device} side={THREE.DoubleSide} />
          </mesh>
          <mesh position={[0, 0.045, 0]}>
            <sphereGeometry args={[0.024, 16, 12]} />
            <meshBasicMaterial ref={bulb} toneMapped={false} />
          </mesh>
        </group>
      </group>
    </group>
  );
}

/** Office chair: cushioned seat, backrest directly behind the sitter, five-star base. */
function Chair() {
  const backZ = chair.z + chair.backOffset + chair.backThickness / 2;
  const seatY = chair.seatTop - chair.seatThickness / 2;
  const columnTop = chair.seatTop - chair.seatThickness;
  return (
    <group>
      <RoundedBox args={[chair.seatWidth, chair.seatThickness, chair.seatDepth]} radius={0.03} smoothness={4} position={[0, seatY, chair.z]}>
        <Clay color={palette.chair} />
      </RoundedBox>
      <RoundedBox
        args={[chair.seatWidth, chair.backHeight, chair.backThickness]}
        radius={0.03}
        smoothness={4}
        position={[0, chair.seatTop + chair.backLift + chair.backHeight / 2, backZ]}
      >
        <Clay color={palette.chair} />
      </RoundedBox>
      {/* Spine bar joining the backrest to the seat */}
      <mesh position={[0, chair.seatTop + chair.backLift / 2 - 0.02, backZ + 0.01]}>
        <boxGeometry args={[0.07, chair.backLift + 0.08, 0.025]} />
        <Clay color={palette.deskLegs} />
      </mesh>
      <mesh position={[0, chair.seatTop - chair.seatThickness - 0.01, backZ - 0.1]}>
        <boxGeometry args={[0.07, 0.02, 0.22]} />
        <Clay color={palette.deskLegs} />
      </mesh>
      {/* Gas lift + five-star base with casters */}
      <mesh position={[0, (columnTop + 0.08) / 2, chair.z]}>
        <cylinderGeometry args={[0.024, 0.03, columnTop - 0.08, 12]} />
        <Clay color={palette.deskLegs} />
      </mesh>
      {Array.from({ length: 5 }, (_, i) => {
        const a = (i / 5) * Math.PI * 2;
        const tip: [number, number, number] = [Math.sin(a) * 0.3, 0.06, chair.z + Math.cos(a) * 0.3];
        return (
          <group key={i}>
            <mesh ref={(m) => placeSegment(m, [0, 0.085, chair.z], tip, true)}>
              <boxGeometry args={[0.035, 1, 0.025]} />
              <Clay color={palette.deskLegs} />
            </mesh>
            <mesh position={[tip[0], 0.025, tip[2]]}>
              <sphereGeometry args={[0.025, 12, 10]} />
              <Clay color={palette.device} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

/** Placeholder desk set + character. Swap for <ModelDesk /> via sceneConfig.model.enabled. */
export function PlaceholderDesk() {
  return (
    <group>
      <Desk />
      <Chair />
      <Character />
      {/* After Character, so it reads this frame's solved hand. */}
      <Phone />
      <Window />
    </group>
  );
}
