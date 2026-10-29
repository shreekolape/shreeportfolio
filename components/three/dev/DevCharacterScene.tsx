"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { render } from "@/components/three/sceneConfig";
import { Character } from "@/components/three/Character";
import type { DevView } from "./views";
import { DEV_VIEWS } from "./views";

const BG = "#808080";

/** Flat, even, colour-neutral three-point lighting — no accent tint, no night scene. */
function StudioLights() {
  return (
    <>
      <ambientLight intensity={0.65} color="#ffffff" />
      <directionalLight position={[-1.4, 2.2, 2.2]} intensity={1.1} color="#ffffff" />
      <directionalLight position={[1.8, 1.4, 1.4]} intensity={0.55} color="#ffffff" />
      <directionalLight position={[0, 1.6, -2.2]} intensity={0.4} color="#ffffff" />
    </>
  );
}

/** Eases the camera toward the selected preset view; no scroll, no shift, no orbit. */
function DevCameraRig({ view }: { view: DevView }) {
  const pos = useRef(new THREE.Vector3(...DEV_VIEWS[view].position));
  const target = useRef(new THREE.Vector3(...DEV_VIEWS[view].target));

  useFrame(({ camera }, delta) => {
    const preset = DEV_VIEWS[view];
    const k = 1 - Math.exp(-render.cameraDamping * Math.min(delta, 0.1));
    pos.current.lerp(new THREE.Vector3(...preset.position), k);
    target.current.lerp(new THREE.Vector3(...preset.target), k);
    camera.position.copy(pos.current);
    camera.lookAt(target.current);
  });

  return null;
}

export default function DevCharacterScene({ view }: { view: DevView }) {
  const start = DEV_VIEWS[view];
  return (
    <Canvas
      dpr={[1, render.maxDpr]}
      camera={{ fov: render.fov, near: 0.1, far: 30, position: start.position }}
      gl={{ antialias: true, powerPreference: "high-performance" }}
      onCreated={({ camera }) => camera.lookAt(...start.target)}
    >
      <color attach="background" args={[BG]} />
      <StudioLights />
      <DevCameraRig view={view} />
      <Character />
    </Canvas>
  );
}
