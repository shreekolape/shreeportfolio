"use client";

import { useState } from "react";
import { liveDayCycle } from "@/providers/DayCycleProvider";
import { STATES } from "@/components/three/rig";
import SceneCanvas from "@/components/three/SceneCanvas";
import { shots, type CharacterState, type Shot } from "@/components/three/sceneConfig";
import { useSceneReset } from "@/components/three/useSceneReset";

function params() {
  const p = new URLSearchParams(window.location.search);
  const state = p.get("state") as CharacterState | null;
  const shot = p.get("shot") as Shot | null;
  const t = Number(p.get("t"));
  return {
    state: state && STATES.includes(state) ? state : "sleep",
    shot: shot && shot in shots ? shot : "hero",
    t: Number.isFinite(t) ? Math.min(1, Math.max(0, t)) : 0,
  };
}

/** One pose, one shot, one fixed time of day, framed as a panel (no lens shift). */
export default function DevStill() {
  const [{ state, shot, t }] = useState(params);
  useState(() => {
    liveDayCycle.t = t;
    return null;
  });
  useSceneReset(state, shot);
  return <SceneCanvas panel />;
}
