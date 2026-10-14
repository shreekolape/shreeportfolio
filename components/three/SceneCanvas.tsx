"use client";

import { Suspense, useEffect, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useProgress } from "@react-three/drei";
import * as THREE from "three";
import { sceneState, setSceneLoad } from "@/lib/sceneStore";
import { model, palette, render, shots } from "./sceneConfig";
import { PlaceholderDesk } from "./PlaceholderDesk";
import { ModelDesk } from "./ModelDesk";
import { accentColor, accentGlow } from "./accent";

/** Monitor + lamp glow follow the live accent; intensity rises with scroll velocity. */
function Lights() {
  const monitor = useRef<THREE.PointLight>(null);
  const lamp = useRef<THREE.PointLight>(null);

  useFrame(() => {
    const color = accentColor();
    const glow = accentGlow();
    if (monitor.current) {
      monitor.current.color.copy(color);
      monitor.current.intensity = 1.4 + glow * 2.2;
    }
    if (lamp.current) {
      lamp.current.color.copy(color);
      lamp.current.intensity = 1.1 + glow * 1.4;
    }
  });

  return (
    <>
      <ambientLight intensity={0.45} color="#9aa0b4" />
      <hemisphereLight args={["#8a90a8", palette.background, 0.5]} />
      {/* Soft key from the camera side, cool rim from behind-right. */}
      <directionalLight position={[-3, 4, 3]} intensity={0.95} color="#ece6dc" />
      <directionalLight position={[2.5, 2.5, -2.5]} intensity={0.6} color="#aab4ff" />
      <pointLight ref={monitor} position={[0, 1.15, 0.12]} distance={3} decay={1.6} />
      <pointLight ref={lamp} position={[0.38, 1.08, -0.12]} distance={2.4} decay={1.6} />
    </>
  );
}

/**
 * Eases the camera toward the current shot; slow orbit on "orbit", subtle
 * pointer parallax. The shot's `shift` is applied as a lens film offset.
 */
function CameraRig() {
  const target = useRef(new THREE.Vector3(...shots[sceneState.shot].target));
  const goalPos = useRef(new THREE.Vector3());
  const goalTarget = useRef(new THREE.Vector3());
  const shift = useRef(shots[sceneState.shot].shift);

  useFrame(({ camera, clock, pointer, size }, delta) => {
    const shot = shots[sceneState.shot];
    const k = 1 - Math.exp(-render.cameraDamping * Math.min(delta, 0.1));

    const pos = goalPos.current.set(...shot.position);
    const look = goalTarget.current.set(...shot.target);

    // Content is only pushed left at ≥1024px; on tablets keep the scene nearly centred.
    const goalShift = size.width >= 1024 ? shot.shift : shot.shift * 0.35;
    shift.current += (goalShift - shift.current) * k;
    if (camera instanceof THREE.PerspectiveCamera) {
      const aspect = size.width / size.height;
      const frustumWidth = 2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * aspect;
      camera.filmOffset = -shift.current * camera.getFilmWidth() * frustumWidth;
      camera.updateProjectionMatrix();
    }

    if (sceneState.shot === "orbit") {
      const a = clock.elapsedTime * 0.18;
      pos.x += Math.sin(a) * 0.25;
      pos.z += Math.cos(a) * 0.2;
    }
    pos.x += pointer.x * 0.06;
    pos.y += pointer.y * 0.04;

    camera.position.lerp(pos, k);
    target.current.lerp(look, k);
    camera.lookAt(target.current);
  });

  return null;
}

/** Reports loader progress (GLB) to the preloader. */
function LoadReporter() {
  const { progress, active } = useProgress();
  useEffect(() => {
    if (active) setSceneLoad({ progress: progress / 100 });
  }, [progress, active]);
  return null;
}

/** Mounted after the scene's Suspense resolves; flags ready on the first frame. */
function FirstFrame() {
  const done = useRef(false);
  useFrame(() => {
    if (done.current) return;
    done.current = true;
    setSceneLoad({ progress: 1, ready: true });
  });
  return null;
}

export default function SceneCanvas() {
  const start = shots[sceneState.shot];

  return (
    <Canvas
      dpr={[1, render.maxDpr]}
      camera={{ fov: render.fov, near: 0.1, far: 30, position: start.position }}
      gl={{ antialias: true, powerPreference: "high-performance" }}
      eventSource={document.documentElement}
      eventPrefix="client"
      onCreated={({ camera }) => camera.lookAt(...start.target)}
    >
      <color attach="background" args={[palette.background]} />
      <fog attach="fog" args={[palette.background, 4.5, 10]} />
      <Lights />
      <CameraRig />
      <LoadReporter />
      <Suspense fallback={null}>
        {model.enabled ? <ModelDesk /> : <PlaceholderDesk />}
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[30, 30]} />
          <meshStandardMaterial color={palette.floor} roughness={1} />
        </mesh>
        <FirstFrame />
      </Suspense>
    </Canvas>
  );
}
