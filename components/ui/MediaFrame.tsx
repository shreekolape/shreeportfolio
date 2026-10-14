import Image from "next/image";
import type { Media } from "@/content/types";

type MediaFrameProps = {
  media: Media;
  /** CSS aspect-ratio, e.g. "16 / 10". */
  aspect?: string;
  sizes?: string;
  priority?: boolean;
  className?: string;
};

/**
 * Image, video or (when `src` is null) a neutral gradient placeholder that
 * shows what it stands for, e.g. "VIVIN · Admin import screen".
 */
export function MediaFrame({
  media,
  aspect = "16 / 10",
  sizes = "(min-width: 1024px) 50vw, 100vw",
  priority,
  className,
}: MediaFrameProps) {
  const frame = ["relative overflow-hidden rounded-xl border border-line bg-bg-elevated", className]
    .filter(Boolean)
    .join(" ");

  if (!media.src) {
    return (
      <div
        role="img"
        aria-label={media.alt}
        className={frame}
        style={{
          aspectRatio: aspect,
          backgroundImage:
            "radial-gradient(120% 90% at 15% 10%, rgb(255 255 255 / 0.07), transparent 60%), linear-gradient(135deg, #18181b, #0f0f11)",
        }}
      >
        <span className="absolute inset-0 flex items-center justify-center p-4 text-center font-mono text-[11px] uppercase tracking-wider text-subtle">
          {media.label}
        </span>
      </div>
    );
  }

  if (media.type === "video") {
    return (
      <div className={frame} style={{ aspectRatio: aspect }}>
        <video
          src={media.src}
          aria-label={media.alt}
          className="absolute inset-0 h-full w-full object-cover"
          muted
          loop
          playsInline
          autoPlay
          preload="metadata"
        />
      </div>
    );
  }

  return (
    <div className={frame} style={{ aspectRatio: aspect }}>
      <Image src={media.src} alt={media.alt} fill sizes={sizes} priority={priority} className="object-cover" />
    </div>
  );
}
