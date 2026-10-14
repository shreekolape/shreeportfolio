"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import { useAnimations, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { getCharacterState, subscribeScene } from "@/lib/sceneStore";
import { model } from "./sceneConfig";
import { useScreenMaterial } from "./useScreenMaterial";

/**
 * The real desk + character GLB (enable via sceneConfig.model.enabled).
 * Plays the clip mapped to the current state with a crossfade and puts the
 * preview material on the mesh named `model.screenMeshName`.
 */
export function ModelDesk() {
  const group = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF(model.url, model.draco);
  const { actions } = useAnimations(animations, group);
  const state = useSyncExternalStore(subscribeScene, getCharacterState, getCharacterState);
  const screen = useScreenMaterial();

  useEffect(() => {
    const mesh = scene.getObjectByName(model.screenMeshName);
    if (mesh instanceof THREE.Mesh) mesh.material = screen;
    else console.warn(`[scene] No mesh named "${model.screenMeshName}" in ${model.url}`);
  }, [scene, screen]);

  useEffect(() => {
    const action = actions[model.clips[state]];
    if (!action) {
      console.warn(`[scene] Missing animation clip "${model.clips[state]}" in ${model.url}`);
      return;
    }
    action.reset().fadeIn(model.clipFade).play();
    return () => {
      action.fadeOut(model.clipFade);
    };
  }, [actions, state]);

  return (
    <group ref={group}>
      <primitive object={scene} />
    </group>
  );
}
