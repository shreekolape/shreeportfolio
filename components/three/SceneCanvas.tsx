"use client";

import { Suspense, useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useProgress } from "@react-three/drei";
import * as THREE from "three";
import { sceneState, setSceneLoad } from "@/lib/sceneStore";
import { model, palette, render, shots } from "./sceneConfig";
import { PlaceholderDesk } from "./PlaceholderDesk";
import { ModelDesk } from "./ModelDesk";
import { accentColor, accentGlow } from "./accent";
import { DebugBounds } from "./DebugBounds";
import { dims, lamp as lampDims } from "./sceneDims";
import { ambientFactor, exposureFactor, keyLightColor, keyLightFactor, lampFactor, sunVisibility } from "./dayCycle";

/**
 * Monitor glow and the rim light follow the live accent (unchanged); the
 * ambient/key/window-beam lights and the lamp follow the day cycle instead
 * (midnight → sunrise → day → evening → midnight), driven by Home's scroll.
 * On pages without a day cycle, `dayCycle.ts` reads a steady default `t`.
 */
function Lights() {
  const monitor = useRef<THREE.PointLight>(null);
  const lamp = useRef<THREE.PointLight>(null);
  const rim = useRef<THREE.SpotLight>(null);
  const ambient = useRef<THREE.AmbientLight>(null);
  const hemi = useRef<THREE.HemisphereLight>(null);
  const key = useRef<THREE.DirectionalLight>(null);
  const fill = useRef<THREE.DirectionalLight>(null);
  const windowBeam = useRef<THREE.DirectionalLight>(null);
  // Directional lights only aim at `target` once it's part of the scene graph (see the <primitive> below).
  const windowBeamTarget = useMemo(() => new THREE.Object3D(), []);

  useFrame(() => {
    const color = accentColor();
    const glow = accentGlow();
    if (monitor.current) {
      monitor.current.color.copy(color);
      monitor.current.intensity = 1.4 + glow * 2.2;
    }
    if (rim.current) {
      rim.current.color.copy(color);
      rim.current.intensity = 5 + glow * 4;
    }

    const keyFactor = keyLightFactor();
    const ambFactor = ambientFactor();
    const sunColor = keyLightColor();
    if (ambient.current) ambient.current.intensity = 0.45 * ambFactor;
    if (hemi.current) hemi.current.intensity = 0.5 * ambFactor;
    if (key.current) {
      key.current.intensity = 0.95 * keyFactor;
      key.current.color.copy(sunColor);
    }
    if (fill.current) fill.current.intensity = 0.6 * (0.6 + 0.4 * keyFactor);
    if (windowBeam.current) {
      windowBeam.current.intensity = 2.2 * sunVisibility();
      windowBeam.current.color.copy(sunColor);
    }

    if (lamp.current) {
      const lampOn = lampFactor();
      lamp.current.color.copy(color);
      lamp.current.intensity = (1.1 + glow * 1.4) * (0.08 + 0.92 * lampOn);
    }
  });

  return (
    <>
      <ambientLight ref={ambient} intensity={0.45} color="#9aa0b4" />
      <hemisphereLight ref={hemi} args={["#8a90a8", palette.background, 0.5]} />
      {/* Soft key from the camera side, cool rim from behind-right. */}
      <directionalLight ref={key} position={[-3, 4, 3]} intensity={0.95} color="#ece6dc" />
      <directionalLight ref={fill} position={[2.5, 2.5, -2.5]} intensity={0.6} color="#aab4ff" />
      {/* Sunlight beam through the window, behind the desk. */}
      <directionalLight
        ref={windowBeam}
        target={windowBeamTarget}
        position={[0, dims.window.centerY, dims.window.z - 1]}
        intensity={0}
      />
      <primitive object={windowBeamTarget} position={[0, dims.monitorCenterY, dims.monitor.z]} />
      <pointLight ref={monitor} position={[0, 1.15, 0.12]} distance={3} decay={1.6} />
      <pointLight ref={lamp} position={lampDims.head} distance={2.4} decay={1.6} />
      {/* Accent rim from behind-right so the black hoodie keeps its outline. */}
      <spotLight
        ref={rim}
        position={[1.1, 1.9, 1.7]}
        angle={0.55}
        penumbra={0.8}
        distance={5}
        decay={1.4}
        onUpdate={(l) => l.target.position.set(0, 0.95, dims.hips[2])}
      />
    </>
  );
}

/** Renderer-wide exposure follows the day cycle: the most reliable way to read
 *  "day" as clearly brighter than night against ACES tone-mapping's highlight
 *  compression, on top of the per-light intensities in `Lights()`. */
function ExposureRig() {
  const gl = useThree((s) => s.gl);
  useFrame(() => {
    // eslint-disable-next-line react-hooks/immutability -- renderer property mutated in the frame loop by design
    gl.toneMappingExposure = exposureFactor();
  });
  return null;
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
  // TEMPORARY debug toggle (?debug=bounds); removed before the final commit.
  const debugBounds = new URLSearchParams(window.location.search).get("debug") === "bounds";

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
      <ExposureRig />
      <CameraRig />
      <LoadReporter />
      <Suspense fallback={null}>
        {model.enabled ? <ModelDesk /> : <PlaceholderDesk />}
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[30, 30]} />
          <meshStandardMaterial color={palette.floor} roughness={1} />
        </mesh>
        <FirstFrame />
        {debugBounds && <DebugBounds />}
      </Suspense>
    </Canvas>
  );
}
