import * as THREE from "three";
import type { Media } from "@/content/types";

// Textures for the monitor screen. Placeholder media (src: null) are drawn
// onto a canvas as a neutral gradient with their label, matching MediaFrame.

const W = 1024;
const H = 640;

function canvasTexture(draw: (ctx: CanvasRenderingContext2D) => void): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;
  draw(ctx);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

/** Default screen: abstract code lines in white, tinted with the accent by the material. */
export function createIdleTexture(): THREE.CanvasTexture {
  return canvasTexture((ctx) => {
    const bg = ctx.createRadialGradient(W * 0.3, H * 0.2, 0, W * 0.3, H * 0.2, W);
    bg.addColorStop(0, "#3a3a3a");
    bg.addColorStop(1, "#121212");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    // Deterministic pseudo-random line widths so the screen never changes between renders.
    let seed = 7;
    const rand = () => ((seed = (seed * 9301 + 49297) % 233280) / 233280);
    let y = 70;
    let indent = 0;
    while (y < H - 50) {
      indent = Math.max(0, Math.min(3, indent + (rand() < 0.3 ? 1 : rand() < 0.3 ? -1 : 0)));
      const x = 70 + indent * 44;
      const width = 80 + rand() * 420;
      ctx.fillStyle = `rgba(255,255,255,${0.35 + rand() * 0.45})`;
      ctx.fillRect(x, y, width, 12);
      if (rand() < 0.5) {
        ctx.fillStyle = "rgba(255,255,255,0.18)";
        ctx.fillRect(x + width + 18, y, 40 + rand() * 160, 12);
      }
      y += 34;
    }
  });
}

/** Neutral gradient block labelled with what it stands for. */
export function createPlaceholderTexture(label: string): THREE.CanvasTexture {
  return canvasTexture((ctx) => {
    const g = ctx.createLinearGradient(0, 0, W, H);
    g.addColorStop(0, "#26262a");
    g.addColorStop(1, "#141416");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
    const glow = ctx.createRadialGradient(W * 0.2, H * 0.1, 0, W * 0.2, H * 0.1, W * 0.8);
    glow.addColorStop(0, "rgba(255,255,255,0.10)");
    glow.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, W, H);

    ctx.fillStyle = "#a1a1a7";
    ctx.font = "500 34px ui-monospace, SFMono-Regular, Menlo, monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(label.toUpperCase(), W / 2, H / 2);
  });
}

export type ScreenTexture = {
  texture: THREE.Texture;
  /** Tint the texture with the live accent (idle screen) or show it as-is. */
  tinted: boolean;
  /** Video previews play only while visible. */
  video?: HTMLVideoElement;
};

export function createMediaTexture(media: Media): ScreenTexture {
  if (!media.src) return { texture: createPlaceholderTexture(media.label), tinted: false };

  if (media.type === "video") {
    const video = document.createElement("video");
    video.src = media.src;
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.crossOrigin = "anonymous";
    video.preload = "auto";
    const texture = new THREE.VideoTexture(video);
    texture.colorSpace = THREE.SRGBColorSpace;
    return { texture, tinted: false, video };
  }

  const texture = new THREE.TextureLoader().load(media.src);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  return { texture, tinted: false };
}
