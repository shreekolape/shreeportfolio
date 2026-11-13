"use client";

import { useState } from "react";
import { setSceneTarget } from "@/lib/sceneStore";
import type { CharacterState, Shot } from "./sceneConfig";

/**
 * Pins `sceneState` to `state`/`shot` synchronously, during this component's
 * first render — before any child (e.g. `Character`) can read it. `Character`
 * seeds its pose-blend weights from `sceneState.state` the first time it
 * renders, and `sceneState` is a plain module-level object that outlives any
 * one page's mount, so without this a page whose scene is always a single
 * fixed pose (About's `relax`, Contact's `phone`) could otherwise start its
 * very first frame still blending in from whatever pose the previous route
 * left behind. A `useEffect` runs too late to prevent that first frame; the
 * lazy `useState` initializer runs during render, in time.
 */
export function useSceneReset(state: CharacterState, shot: Shot): void {
  useState(() => {
    setSceneTarget(state, shot);
    return null;
  });
}
