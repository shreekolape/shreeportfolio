"use client";

import { site } from "@/content/site";
import { useSound } from "@/providers/SoundProvider";

/** Header toggle. Sound is off by default; the choice persists in localStorage. */
export function SoundToggle() {
  const { enabled, toggle, play } = useSound();
  const { label, on, off } = site.soundToggle;

  return (
    <button
      type="button"
      onClick={() => {
        toggle();
        play("toggle");
      }}
      aria-pressed={enabled}
      aria-label={`${label}: ${enabled ? on : off}`}
      className="group flex items-center gap-2 rounded-full px-2 py-1.5 font-mono text-[11px] uppercase tracking-wider text-muted transition-colors hover:text-fg"
    >
      <span aria-hidden="true" className="flex h-3 items-end gap-[2px]">
        {[0.45, 1, 0.7].map((h, i) => (
          <span
            key={i}
            className={[
              "w-[2px] rounded-full transition-all duration-300",
              enabled ? "bg-accent" : "bg-current",
            ].join(" ")}
            style={{ height: enabled ? `${h * 100}%` : "2px" }}
          />
        ))}
      </span>
      <span className="hidden sm:inline">
        {label} {enabled ? on : off}
      </span>
    </button>
  );
}
