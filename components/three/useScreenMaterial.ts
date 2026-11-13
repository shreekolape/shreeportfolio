"use client";
/* eslint-disable react-hooks/immutability -- shader uniforms are mutated in the R3F frame loop by design */

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { featuredProjects } from "@/content/projects";
import { dims } from "./sceneDims";
import { getActivePreview, subscribePreview } from "@/lib/previewStore";
import { createIdleTexture, createMediaTexture, SCREEN_ASPECT, type ScreenTexture } from "./screenTextures";
import { accentColor } from "./accent";

const FADE_SPEED = 3.2; // full crossfade in ~0.3s

/** The screen plane's own width/height (see PlaceholderDesk.tsx's screen mesh). */
const FRAME_ASPECT = (dims.monitor.width - 0.04) / (dims.monitor.height - 0.04);

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  uniform sampler2D mapA;
  uniform sampler2D mapB;
  uniform vec3 tintA;
  uniform vec3 tintB;
  uniform float mixAmount;
  uniform float brightness;
  uniform float aspectA;
  uniform float aspectB;
  uniform float frameAspect;
  varying vec2 vUv;

  // object-fit: cover — crops the wider/taller axis so the image never stretches.
  vec2 coverUV(vec2 uv, float texAspect, float frame) {
    vec2 scale = texAspect > frame ? vec2(frame / texAspect, 1.0) : vec2(1.0, texAspect / frame);
    return clamp((uv - 0.5) * scale + 0.5, 0.0, 1.0);
  }

  void main() {
    vec3 a = texture2D(mapA, coverUV(vUv, aspectA, frameAspect)).rgb * tintA;
    vec3 b = texture2D(mapB, coverUV(vUv, aspectB, frameAspect)).rgb * tintB;
    gl_FragColor = vec4(mix(a, b, mixAmount) * brightness, 1.0);
    #include <colorspace_fragment>
  }
`;

/**
 * Monitor screen material: two texture slots crossfaded in the shader, each
 * sampled with an object-fit: cover UV map so project covers (16:9) and the
 * idle/placeholder canvases never stretch, whatever the screen plane's own
 * aspect is. Follows previewStore (hovered Selected Work row); falls back to
 * an idle screen tinted with the live accent. Works on the placeholder plane
 * and on the GLB's screen mesh alike.
 */
export function useScreenMaterial(): THREE.ShaderMaterial {
  const idle = useMemo<ScreenTexture>(() => ({ texture: createIdleTexture(), tinted: true, aspect: SCREEN_ASPECT }), []);
  const cache = useRef(new Map<string, ScreenTexture>());

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        toneMapped: false,
        uniforms: {
          mapA: { value: idle.texture },
          mapB: { value: idle.texture },
          tintA: { value: new THREE.Color(1, 1, 1) },
          tintB: { value: new THREE.Color(1, 1, 1) },
          mixAmount: { value: 0 },
          brightness: { value: 1.1 },
          aspectA: { value: idle.aspect },
          aspectB: { value: idle.aspect },
          frameAspect: { value: FRAME_ASPECT },
        },
      }),
    [idle],
  );

  // Slot bookkeeping lives in refs so the frame loop never triggers React renders.
  const slots = useRef<{ a: ScreenTexture; b: ScreenTexture }>({ a: idle, b: idle });
  const wanted = useRef<ScreenTexture>(idle);

  useEffect(() => {
    const textures = cache.current;
    const getOrCreate = (slug: string, media: (typeof featuredProjects)[number]["previewMedia"]) => {
      let tex = textures.get(slug);
      if (!tex) {
        tex = createMediaTexture(media);
        textures.set(slug, tex);
      }
      return tex;
    };

    // Preload every featured project's cover once the monitor exists, so the
    // first hover shows an already-decoded texture instead of a blank frame.
    for (const p of featuredProjects) getOrCreate(p.slug, p.previewMedia);

    const resolve = (): ScreenTexture => {
      const slug = getActivePreview();
      const project = slug ? featuredProjects.find((p) => p.slug === slug) : undefined;
      return project ? getOrCreate(project.slug, project.previewMedia) : idle;
    };
    const update = () => {
      wanted.current = resolve();
    };
    update();
    const unsubscribe = subscribePreview(update);
    return () => {
      unsubscribe();
      textures.forEach((t) => {
        t.video?.pause();
        t.texture.dispose();
      });
      textures.clear();
      idle.texture.dispose();
      material.dispose();
    };
  }, [idle, material]);

  useFrame((_, delta) => {
    const u = material.uniforms;
    const s = slots.current;
    const target = wanted.current;

    if (target !== s.b) {
      const previous = [s.a, s.b];
      // Keep whichever slot is currently more visible as "A", fade the new one in as "B".
      if (u.mixAmount.value > 0.5) {
        s.a = s.b;
        u.mixAmount.value = 1 - u.mixAmount.value;
      }
      s.b = target;
      for (const p of previous) if (p !== s.a && p !== s.b) p.video?.pause();
      s.b.video?.play().catch(() => {});
      u.mapA.value = s.a.texture;
      u.mapB.value = s.b.texture;
    }

    u.mixAmount.value = Math.min(1, u.mixAmount.value + delta * FADE_SPEED);
    if (u.mixAmount.value >= 1 && s.a !== s.b) {
      s.a.video?.pause();
      s.a = s.b;
      u.mapA.value = s.a.texture;
    }

    // Re-read every frame: an async image/video can update its slot's aspect after load.
    u.aspectA.value = s.a.aspect;
    u.aspectB.value = s.b.aspect;

    const accent = accentColor();
    (u.tintA.value as THREE.Color).copy(s.a.tinted ? accent : WHITE);
    (u.tintB.value as THREE.Color).copy(s.b.tinted ? accent : WHITE);
  });

  return material;
}

const WHITE = new THREE.Color(1, 1, 1);
