"use client";

import dynamic from "next/dynamic";
import type { Media } from "@/content/types";
import { MediaFrame } from "@/components/ui/MediaFrame";
import { useMotionPrefs } from "@/providers/MotionPrefsProvider";
import { SceneErrorBoundary } from "./SceneLayer";
import type { CharacterState, Shot } from "./sceneConfig";
import { useSceneReset } from "./useSceneReset";

// Same lazily-loaded scene as Home, framed as a small close-up panel.
const SceneCanvas = dynamic(() => import("./SceneCanvas"), { ssr: false });

/** Mounts fresh with the panel, so the pose is pinned before Character ever renders. */
function PanelScene({ state, shot }: { state: CharacterState; shot: Shot }) {
  useSceneReset(state, shot);
  return <SceneCanvas panel />;
}

/**
 * A small 3D close-up of the character in one fixed pose (About: `relax`,
 * Contact: `phone`), lit for that page's time of day (set by
 * DayCycleProvider). Wherever 3D doesn't load (small screens, reduced
 * motion, low-power devices, WebGL failure) the rendered still is shown
 * instead, exactly like Home's hero.
 */
export function PageScene({
  state,
  shot,
  fallback,
  aspect = "4 / 5",
  className,
}: {
  state: CharacterState;
  shot: Shot;
  fallback: Media;
  aspect?: string;
  className?: string;
}) {
  const { allow3D } = useMotionPrefs();

  return (
    <div className={["relative", className].filter(Boolean).join(" ")} style={{ aspectRatio: aspect }}>
      <MediaFrame media={fallback} aspect={aspect} sizes="(min-width: 768px) 35vw, 100vw" className="no3d-only" />
      {allow3D && (
        <div
          aria-hidden="true"
          className="scene-panel pointer-events-none absolute inset-0 overflow-hidden rounded-xl border border-line bg-bg-elevated"
        >
          <SceneErrorBoundary>
            <PanelScene state={state} shot={shot} />
          </SceneErrorBoundary>
        </div>
      )}
    </div>
  );
}
