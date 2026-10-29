// Single source of truth for scene geometry (metres-ish, desk centred at the
// origin, character in front of it at +z facing the monitor at -z).
// The desk, chair, keyboard, props, character rig and collision boxes are
// all built from these numbers.

export type Vec3 = [number, number, number];
export type Box = { name: string; min: Vec3; max: Vec3 };

const desk = {
  top: 0.75,
  thickness: 0.04,
  width: 1.4,
  depth: 0.7,
  legSize: 0.045,
  legInset: 0.05,
};

const mat = { width: 0.8, depth: 0.3, height: 0.004, x: 0.06, z: 0.17 };
const matTop = desk.top + mat.height;

// Keyboard sits back from the edge, leaving a strip in front for resting forearms.
const keyboard = { width: 0.4, depth: 0.13, height: 0.018, x: 0, z: 0.12 };
const keyboardTop = matTop + keyboard.height;

const mouse = { x: 0.31, z: 0.14, width: 0.06, depth: 0.1, height: 0.03 };

const chair = {
  seatTop: 0.47,
  seatThickness: 0.07,
  seatWidth: 0.48,
  seatDepth: 0.46,
  /** Seat centre z: pulled in so the chest is about a forearm from the desk edge. */
  z: 0.73,
  /** Distance from seat centre to the backrest's front face. */
  backOffset: 0.21,
  backThickness: 0.06,
  /** Backrest bottom edge above the seat. */
  backLift: 0.1,
  backHeight: 0.56,
};

const monitor = {
  z: -0.2,
  width: 0.7,
  height: 0.43,
  depth: 0.03,
  /** Bottom edge of the screen above the desk top. */
  lift: 0.14,
  standBase: { width: 0.22, depth: 0.14, height: 0.016 },
};
const monitorCenterY = desk.top + monitor.lift + monitor.height / 2;

/** Window on the back wall (built in the day-cycle part). */
const room = { backWallZ: -0.95 };
const windowPane = { z: room.backWallZ + 0.01, centerY: 1.45, width: 1.3, height: 0.95 };

/**
 * Character proportions (slim build, ~1.8 m standing, head ≈ 1/7 of that).
 * Spine: hips → waist (lower) → neck base (upper), so the back can hunch.
 * Hips are pinned to the seat; thighs lie on it, knees at 90°, shins vertical.
 */
const character = {
  hipAboveSeat: 0.06,
  lowerSpine: 0.2,
  upperSpine: 0.32,
  /** Shoulder joints, measured up the upper spine from the waist. */
  shoulderAlong: 0.26,
  shoulderHalfWidth: 0.18,
  pelvis: [0.13, 0.09, 0.105] as Vec3,
  abdomen: [0.14, 0.14, 0.098] as Vec3,
  /** Smooths the join between abdomen and chest (upper-spine frame, at the waist). */
  waist: { at: 0.03, radii: [0.145, 0.13, 0.1] as Vec3 },
  chest: [0.163, 0.16, 0.105] as Vec3,
  deltoidRadius: 0.055,
  neckLength: 0.07,
  neckRadius: 0.052,
  /** Head ellipsoid radii (x width, y height, z depth): 0.25 m tall. */
  head: [0.085, 0.125, 0.102] as Vec3,
  /** Neck base → head centre, along the head's up axis. */
  headCenterAlong: 0.172,
  /** Extra collision volumes in the head frame (offset from head centre, radii). */
  hairCap: { offset: [0, 0.04, 0.008] as Vec3, radii: [0.104, 0.126, 0.126] as Vec3 },
  glasses: { offset: [0, 0.015, -0.11] as Vec3, radii: [0.072, 0.027, 0.014] as Vec3 },
  /** Hood lying down: a roll around the back of the neck, in the upper-spine frame. */
  hood: { offset: [0, 0.305, 0.06] as Vec3, radii: [0.135, 0.07, 0.075] as Vec3 },
  upperArm: 0.29,
  forearm: 0.26,
  /** Collision radii match the slightly baggy sleeves. */
  upperArmRadius: 0.05,
  forearmRadius: 0.045,
  /** Wrist → fingertips (coarse span, used only for the head/arm proximity check). */
  handLength: 0.17,
  /** Palm ellipsoid radii in the hand frame: across the knuckles, half-length (wrist→knuckle), thickness. */
  hand: [0.038, 0.05, 0.014] as Vec3,
  handRadius: 0.02,
  hipHalfWidth: 0.085,
  thighLength: 0.44,
  thighRadius: 0.058,
  shinRadius: 0.045,
  ankleHeight: 0.09,
  foot: [0.095, 0.075, 0.26] as Vec3,
};

/** Fixed root of the character (hip joint centre), sitting on the seat. */
const hips: Vec3 = [0, chair.seatTop + character.hipAboveSeat, chair.z];

export const dims = {
  desk,
  mat,
  matTop,
  keyboard,
  keyboardTop,
  mouse,
  chair,
  monitor,
  monitorCenterY,
  room,
  window: windowPane,
  character,
  hips,
} as const;

const box = (name: string, cx: number, cy: number, cz: number, w: number, h: number, d: number): Box => ({
  name,
  min: [cx - w / 2, cy - h / 2, cz - d / 2],
  max: [cx + w / 2, cy + h / 2, cz + d / 2],
});

/** Everything the character must never pass through. Props add theirs in propBoxes. */
export const sceneBoxes: Box[] = [
  box("desk top", 0, desk.top - desk.thickness / 2, 0, desk.width, desk.thickness, desk.depth),
  box("desk mat", mat.x, desk.top + mat.height / 2, mat.z, mat.width, mat.height, mat.depth),
  box("keyboard", keyboard.x, matTop + keyboard.height / 2, keyboard.z, keyboard.width, keyboard.height, keyboard.depth),
  box("mouse", mouse.x, matTop + mouse.height / 2, mouse.z, mouse.width, mouse.height, mouse.depth),
  box(
    "monitor",
    0,
    monitorCenterY,
    monitor.z,
    monitor.width,
    monitor.height,
    monitor.depth,
  ),
  box("monitor stand", 0, desk.top + monitor.lift / 2, monitor.z - 0.01, 0.05, monitor.lift, 0.04),
  box(
    "chair seat",
    0,
    chair.seatTop - chair.seatThickness / 2,
    chair.z,
    chair.seatWidth,
    chair.seatThickness,
    chair.seatDepth,
  ),
  box(
    "chair back",
    0,
    chair.seatTop + chair.backLift + chair.backHeight / 2,
    chair.z + chair.backOffset + chair.backThickness / 2,
    chair.seatWidth,
    chair.backHeight,
    chair.backThickness,
  ),
];

/** Lamp on the left of the desk (world coordinates), shade aimed at the keyboard. */
export const lamp = {
  base: [-0.62, desk.top, 0.0] as Vec3,
  /** Elbow joint of the lamp arm. */
  elbow: [-0.66, desk.top + 0.3, -0.04] as Vec3,
  /** Shade centre (also the light position). */
  head: [-0.56, desk.top + 0.26, 0.11] as Vec3,
  aim: [0, keyboardTop, keyboard.z] as Vec3,
};

/** Pose → the hip joint, knee and ankle of each leg (static: knees at 90°, shins vertical). */
export function legJoints(sx: -1 | 1) {
  const [, hy, hz] = hips;
  const x = sx * character.hipHalfWidth;
  return {
    hip: [x, hy, hz] as Vec3,
    knee: [x, hy, hz - character.thighLength] as Vec3,
    ankle: [x, character.ankleHeight, hz - character.thighLength] as Vec3,
  };
}

export const deskLegPositions: Vec3[] = [-1, 1].flatMap((sx) =>
  [-1, 1].map(
    (sz) =>
      [
        sx * (desk.width / 2 - desk.legInset),
        (desk.top - desk.thickness) / 2,
        sz * (desk.depth / 2 - desk.legInset),
      ] as Vec3,
  ),
);
