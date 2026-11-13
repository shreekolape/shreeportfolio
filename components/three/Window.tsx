"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { dims } from "./sceneDims";
import { palette } from "./sceneConfig";
import { celestialX, celestialY, moonVisibility, skyHorizonColor, skyTopColor, sunVisibility } from "./dayCycle";

const win = dims.window;

const skyVertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const skyFragmentShader = /* glsl */ `
  uniform vec3 topColor;
  uniform vec3 horizonColor;
  varying vec2 vUv;
  void main() {
    vec3 color = mix(horizonColor, topColor, smoothstep(0.0, 1.0, vUv.y));
    gl_FragColor = vec4(color, 1.0);
    #include <colorspace_fragment>
  }
`;

/**
 * Window on the back wall: a sky plane crossfading through the day cycle,
 * with a sun and moon travelling the same arc at opposite ends of it. Sits
 * behind the desk, inside every camera shot (see sceneConfig.ts `shots`).
 */
export function Window() {
  const skyMat = useRef<THREE.ShaderMaterial>(null);
  const sun = useRef<THREE.Group>(null);
  const sunMat = useRef<THREE.MeshBasicMaterial>(null);
  const moon = useRef<THREE.Group>(null);
  const moonMat = useRef<THREE.MeshBasicMaterial>(null);

  const skyUniforms = useMemo(
    () => ({ topColor: { value: new THREE.Color() }, horizonColor: { value: new THREE.Color() } }),
    [],
  );

  useFrame(() => {
    if (skyMat.current) {
      (skyMat.current.uniforms.topColor.value as THREE.Color).copy(skyTopColor());
      (skyMat.current.uniforms.horizonColor.value as THREE.Color).copy(skyHorizonColor());
    }
    const x = celestialX() * win.width * 0.3;
    const y = win.centerY - win.height * 0.08 + celestialY() * win.height * 0.32;
    sun.current?.position.set(x, y, 0.01);
    moon.current?.position.set(-x, y, 0.01);
    if (sunMat.current) sunMat.current.opacity = sunVisibility();
    if (moonMat.current) moonMat.current.opacity = moonVisibility();
  });

  const frameMargin = 0.07;
  const mullionThickness = 0.018;

  return (
    <group position={[0, 0, win.z]}>
      {/* Back wall: close to the scene's own background colour, so it reads as void except at the window. */}
      <mesh position={[0, win.centerY, -0.03]}>
        <planeGeometry args={[4, 3]} />
        <meshStandardMaterial color={palette.wall} roughness={1} />
      </mesh>

      {/* Frame backing: a touch larger than the sky pane, visible as a border around it. */}
      <mesh position={[0, win.centerY, -0.015]}>
        <planeGeometry args={[win.width + frameMargin, win.height + frameMargin]} />
        <meshStandardMaterial color={palette.windowFrame} roughness={0.7} />
      </mesh>

      {/* Sky */}
      <mesh position={[0, win.centerY, 0]}>
        <planeGeometry args={[win.width, win.height]} />
        <shaderMaterial
          ref={skyMat}
          vertexShader={skyVertexShader}
          fragmentShader={skyFragmentShader}
          uniforms={skyUniforms}
          toneMapped={false}
          depthWrite={false}
        />
      </mesh>

      {/* Sun / moon, same travel arc, opposite phase. */}
      <group ref={sun}>
        <mesh>
          <circleGeometry args={[win.height * 0.1, 24]} />
          <meshBasicMaterial ref={sunMat} color="#fff2d2" toneMapped={false} transparent depthWrite={false} />
        </mesh>
      </group>
      <group ref={moon}>
        <mesh>
          <circleGeometry args={[win.height * 0.075, 24]} />
          <meshBasicMaterial ref={moonMat} color="#e9edf7" toneMapped={false} transparent depthWrite={false} />
        </mesh>
      </group>

      {/* Mullions: a plus-shaped cross over the glass, four-pane look. */}
      <mesh position={[0, win.centerY, 0.005]}>
        <boxGeometry args={[mullionThickness, win.height, 0.01]} />
        <meshStandardMaterial color={palette.windowFrame} roughness={0.7} />
      </mesh>
      <mesh position={[0, win.centerY, 0.005]}>
        <boxGeometry args={[win.width, mullionThickness, 0.01]} />
        <meshStandardMaterial color={palette.windowFrame} roughness={0.7} />
      </mesh>
    </group>
  );
}
