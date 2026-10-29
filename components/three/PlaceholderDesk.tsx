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
import { Character } from "./Character";

// Placeholder desk set + character, all built from sceneDims.

const { desk, mat, keyboard, mouse, chair, monitor } = dims;

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
    </group>
  );
}
