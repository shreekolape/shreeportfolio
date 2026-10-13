"use client";

import { site } from "@/content/site";
import { usePuneClock } from "@/hooks/usePuneClock";

/** 🟢 Available for freelance projects · it's HH:MM in Pune, … (time live in Asia/Kolkata) */
export function StatusLine({ className }: { className?: string }) {
  const time = usePuneClock();
  const [before, after] = site.status.split("{time}");

  return (
    <p className={["flex items-start gap-2.5 font-mono text-xs leading-relaxed text-muted sm:text-sm", className].filter(Boolean).join(" ")}>
      <span aria-hidden="true" className="relative mt-[0.4em] flex h-2 w-2 shrink-0">
        <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400/60" />
        <span className="relative h-2 w-2 rounded-full bg-emerald-400" />
      </span>
      <span>
        {before}
        <time className="tabular-nums text-fg" suppressHydrationWarning>
          {time ?? "--:--"}
        </time>
        {after}
      </span>
    </p>
  );
}
