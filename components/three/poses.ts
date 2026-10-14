import type { CharacterState } from "./sceneConfig";

// Joint angles (radians) for the placeholder figure. Conventions:
// - torso/head/elbow X: negative leans or bends toward the desk (-z)
//   for torso/head; positive swings arms/forearms forward
// - shoulder Z: positive moves the arm tip toward +x
// - yaw: positive turns the figure toward -x (the camera side)

export type Pose = {
  yaw: number;
  torso: number;
  head: number;
  headYaw: number;
  lSx: number;
  lSz: number;
  lEx: number;
  lEz: number;
  rSx: number;
  rSz: number;
  rEx: number;
  rEz: number;
};

export const POSE_KEYS = Object.keys({
  yaw: 0, torso: 0, head: 0, headYaw: 0,
  lSx: 0, lSz: 0, lEx: 0, lEz: 0,
  rSx: 0, rSz: 0, rEx: 0, rEz: 0,
} satisfies Pose) as (keyof Pose)[];

export const emptyPose = (): Pose => ({
  yaw: 0, torso: 0, head: 0, headYaw: 0,
  lSx: 0, lSz: 0, lEx: 0, lEz: 0,
  rSx: 0, rSz: 0, rEx: 0, rEz: 0,
});

/** Each state's pose at time t (seconds), including its own small motion. */
export const poses: Record<CharacterState, (t: number) => Pose> = {
  // Head down on folded arms, slow breathing.
  sleep: (t) => {
    const breathe = Math.sin(t * 1.4) * 0.025;
    return {
      yaw: 0, torso: -1.0 + breathe, head: -0.35, headYaw: 0.15,
      lSx: 2.45, lSz: 0.45, lEx: 0.1, lEz: 1.3,
      rSx: 2.45, rSz: -0.45, rEx: 0.1, rEz: -1.3,
    };
  },
  // Sitting up, arms stretched overhead.
  wake: (t) => {
    const sway = Math.sin(t * 1.1) * 0.06;
    return {
      yaw: 0, torso: 0.12 + sway * 0.4, head: 0.3, headYaw: sway,
      lSx: 2.9, lSz: -0.35 + sway, lEx: 0.25, lEz: 0,
      rSx: 2.9, rSz: 0.35 + sway, rEx: 0.25, rEz: 0,
    };
  },
  // Leaning in, forearms toward the keyboard, alternating taps.
  type: (t) => ({
    yaw: 0, torso: -0.2, head: -0.12 + Math.sin(t * 2) * 0.02, headYaw: 0,
    lSx: 0.8, lSz: 0.18, lEx: 0.95 + Math.sin(t * 17) * 0.08, lEz: 0,
    rSx: 0.8, rSz: -0.18, rEx: 0.95 + Math.sin(t * 17 + 1.7) * 0.08, rEz: 0,
  }),
  // Upright, hands resting, glancing around.
  idle: (t) => ({
    yaw: 0, torso: -0.05 + Math.sin(t * 1.3) * 0.015, head: -0.05, headYaw: Math.sin(t * 0.5) * 0.3,
    lSx: 0.55, lSz: 0.12, lEx: 0.95, lEz: 0,
    rSx: 0.55, rSz: -0.12, rEx: 0.95, rEz: 0,
  }),
  // Leaning back, turned toward the camera (-x side), waving with the near (left) hand.
  wave: (t) => ({
    yaw: 0.6, torso: 0.3, head: 0.05, headYaw: 0.45,
    lSx: 0.25, lSz: -2.45, lEx: 0.15, lEz: 0.75 + Math.sin(t * 7) * 0.4,
    rSx: 0.35, rSz: -0.1, rEx: 0.6, rEz: 0,
  }),
};
