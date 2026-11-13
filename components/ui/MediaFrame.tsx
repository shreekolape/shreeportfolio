import Image from "next/image";
import type { Media } from "@/content/types";
import { TypographicCover } from "./TypographicCover";

type MediaFrameProps = {
  media: Media;
  /** CSS aspect-ratio, e.g. "16 / 10". */
  aspect?: string;
  sizes?: string;
  priority?: boolean;
  className?: string;
};

/**
 * Image, video or (when `src` is null) a typographic cover built from the
 * label, so a missing file never shows as an empty block.
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
    return <TypographicCover title={media.label} aspect={aspect} className={className} />;
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
