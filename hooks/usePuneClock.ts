"use client";

import { useEffect, useState } from "react";
import { formatPuneClock } from "@/lib/time";

/**
 * Live time in Pune, formatted by `format` (default "HH:MM"). Returns null
 * until mounted so server HTML never bakes in a stale time (and Cache
 * Components never sees `new Date()` during prerender).
 */
export function usePuneClock(format: (date: Date) => string = formatPuneClock): string | null {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const tick = () => setTime(format(new Date()));
    tick();
    const id = window.setInterval(tick, 10_000);
    return () => window.clearInterval(id);
  }, [format]);

  return time;
}
