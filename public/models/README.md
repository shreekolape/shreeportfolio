# 3D model

The home page currently renders a placeholder desk + figure built from primitives
(`components/three/PlaceholderDesk.tsx`). To swap in the real model:

1. Export the desk scene + character as a **Draco-compressed GLB** to
   `public/models/desk-scene.glb`.
2. Include five animation clips: `sleep`, `wake`, `type`, `idle`, `wave`.
   If Blender/Mixamo names differ, map them in `components/three/sceneConfig.ts` → `model.clips`.
3. Name the monitor's screen mesh `Screen` (or change `model.screenMeshName`).
   Its UVs must cover 0–1 so project previews fill the screen.
4. Set `model.enabled = true` in `sceneConfig.ts`.

Scale/orientation: desk centred at the origin, desk top at ~0.78 units, the character
in front of the desk (+z) facing the monitor (-z). Camera shots in `sceneConfig.ts`
assume that layout; adjust `shots` if the model differs.
