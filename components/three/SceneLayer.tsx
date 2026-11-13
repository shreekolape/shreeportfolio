"use client";

import dynamic from "next/dynamic";
import { Component, useEffect, type ReactNode } from "react";
import { ScrollTrigger, useGSAP } from "@/lib/gsap";
import { setSceneLoad, setSceneTarget } from "@/lib/sceneStore";
import { useMotionPrefs } from "@/providers/MotionPrefsProvider";
import { usePageTransition } from "@/providers/TransitionProvider";
import { sectionStates } from "./sceneConfig";
import { useSceneReset } from "./useSceneReset";

// three.js + R3F live in their own chunk, fetched only when the scene is allowed.
const SceneCanvas = dynamic(() => import("./SceneCanvas"), { ssr: false });

/**
 * Mounts fresh every time Home's canvas becomes active, so the synchronous
 * reset below always runs before `Character` ever reads `sceneState` — no
 * stale pose (e.g. "wave" left over from a previous visit to the footer, or
 * a fixed pose from About/Contact) can blend in for a frame.
 */
function HomeScene() {
  useSceneReset("sleep", "hero");
  return <SceneCanvas />;
}

/** If WebGL fails, drop the canvas and show the static fallbacks instead. */
export class SceneErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(error: unknown) {
    console.warn("[scene] 3D disabled:", error);
    document.documentElement.setAttribute("data-no3d", "");
    setSceneLoad({ expected: false });
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

/**
 * Fixed 3D layer behind the home page. Only mounts on "/" for capable devices
 * (not small screens, low-power devices or reduced motion). ScrollTrigger maps
 * each `data-scene` section to a character state + camera shot.
 */
export function SceneLayer() {
  const { pathname } = usePageTransition();
  const { allow3D } = useMotionPrefs();
  const active = pathname === "/" && allow3D;

  useEffect(() => {
    if (!active) return;
    const html = document.documentElement;
    setSceneLoad({ expected: true, progress: 0, ready: false });
    html.setAttribute("data-scene3d", "");
    return () => {
      html.removeAttribute("data-scene3d");
      setSceneLoad({ expected: false });
    };
  }, [active]);

  useGSAP(
    () => {
      if (!active) return;
      document.querySelectorAll<HTMLElement>("[data-scene]").forEach((el) => {
        const entry = sectionStates[el.dataset.scene ?? ""];
        if (!entry) return;
        ScrollTrigger.create({
          trigger: el,
          start: "top 60%",
          end: "bottom 60%",
          onToggle: (self) => self.isActive && setSceneTarget(entry.state, entry.shot),
        });
      });
    },
    { dependencies: [active, pathname], revertOnUpdate: true },
  );

  if (!active) return null;

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10">
      <SceneErrorBoundary>
        <HomeScene />
      </SceneErrorBoundary>
      {/* Scrim keeps text readable over the scene; content sits left, scene right. */}
      <div className="absolute inset-0 bg-[linear-gradient(90deg,var(--bg)_0%,rgb(10_10_11/0.82)_32%,rgb(10_10_11/0.25)_62%,transparent_78%)] max-lg:bg-bg/55" />
    </div>
  );
}
