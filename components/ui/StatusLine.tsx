"use client";

import { useEffect, useState } from "react";
import { site } from "@/content/site";
import { formatPuneClock, getPuneHour } from "@/lib/time";

function pickLine(hour: number) {
  return site.status.find((s) => hour >= s.from && hour < s.to) ?? site.status[site.status.length - 1];
}

/** 🟢 Available for freelance projects · it's HH:MM in Pune, … — wording picked by the hour, live in Asia/Kolkata. */
export function StatusLine({ className }: { className?: string }) {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    const tick = () => setNow(new Date());
    tick();
    const id = window.setInterval(tick, 10_000); // well under the "update every minute" ask
    return () => window.clearInterval(id);
  }, []);

  const line = now ? pickLine(getPuneHour(now)) : null;
  const [before, after] = (line?.text ?? "").split("{time}");

  return (
    <p className={["flex items-start gap-2.5 font-mono text-xs leading-relaxed text-muted sm:text-sm", className].filter(Boolean).join(" ")}>
      <span aria-hidden="true" className="relative mt-[0.4em] flex h-2 w-2 shrink-0">
        <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400/60" />
        <span className="relative h-2 w-2 rounded-full bg-emerald-400" />
      </span>
      <span suppressHydrationWarning>
        {before}
        <time className="tabular-nums text-fg">{now ? formatPuneClock(now) : "--:--"}</time>
        {after}
      </span>
    </p>
  );
}
