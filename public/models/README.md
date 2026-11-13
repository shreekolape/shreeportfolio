# 3D model

The site uses a hand-built desk + character made in code
(`components/three/PlaceholderDesk.tsx`, `Character.tsx`). That's the intended design;
no model file is loaded while `model.enabled` is `false`, so nothing requests a missing
file. The GLB slot stays available for a possible future model. To swap one in:

1. Export the desk scene + character as a **Draco-compressed GLB** to
   `public/models/desk-scene.glb`.
2. Include seven animation clips: `sleep`, `wake`, `type`, `idle`, `wave` (Home),
   `relax` (About) and `phone` (Contact).
   If Blender/Mixamo names differ, map them in `components/three/sceneConfig.ts` → `model.clips`.
3. Name the monitor's screen mesh `Screen` (or change `model.screenMeshName`).
   Its UVs must cover 0–1 so project previews fill the screen.
4. Set `model.enabled = true` in `sceneConfig.ts`.

Scale/orientation: desk centred at the origin, desk top at ~0.78 units, the character
in front of the desk (+z) facing the monitor (-z). Camera shots in `sceneConfig.ts`
assume that layout; adjust `shots` if the model differs.
