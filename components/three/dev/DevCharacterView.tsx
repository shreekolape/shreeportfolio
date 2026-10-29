"use client";

import dynamic from "next/dynamic";
import { useState, useSyncExternalStore } from "react";
import { getCharacterState, setSceneTarget, subscribeScene } from "@/lib/sceneStore";
import { STATES } from "@/components/three/rig";
import type { CharacterState } from "@/components/three/sceneConfig";
import { DEV_VIEW_LABELS, DEV_VIEWS, type DevView } from "./views";

// three.js + R3F are fetched only once this (already dev/prod-excluded) page mounts.
const DevCharacterScene = dynamic(() => import("./DevCharacterScene"), { ssr: false });

const btn = (active: boolean) =>
  [
    "rounded-full border px-3 py-1.5 text-xs font-mono transition-colors",
    active ? "border-white bg-white text-black" : "border-white/30 text-white/80 hover:border-white/70 hover:text-white",
  ].join(" ");

/**
 * /dev/character: the character alone, on a plain mid-grey background with flat
 * neutral studio lighting (no night scene, no accent tint) — for reference
 * screenshots, independent of the home page's scroll-driven desk scene.
 */
export default function DevCharacterView() {
  const [view, setView] = useState<DevView>("front");
  const pose = useSyncExternalStore(subscribeScene, getCharacterState, getCharacterState);

  return (
    <div className="fixed inset-0 bg-[#808080]">
      <DevCharacterScene view={view} />

      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col items-center gap-3 p-6">
        <div className="pointer-events-auto flex flex-wrap justify-center gap-2 rounded-xl bg-black/55 p-2 backdrop-blur-sm">
          {STATES.map((s: CharacterState) => (
            <button key={s} type="button" className={btn(pose === s)} onClick={() => setSceneTarget(s, "hero")}>
              {s}
            </button>
          ))}
        </div>
        <div className="pointer-events-auto flex flex-wrap justify-center gap-2 rounded-xl bg-black/55 p-2 backdrop-blur-sm">
          {(Object.keys(DEV_VIEWS) as DevView[]).map((v) => (
            <button key={v} type="button" className={btn(view === v)} onClick={() => setView(v)}>
              {DEV_VIEW_LABELS[v]}
            </button>
          ))}
        </div>
      </div>

      <p className="pointer-events-none absolute left-4 top-4 font-mono text-[11px] text-white/60">
        /dev/character — excluded from production
      </p>
    </div>
  );
}
