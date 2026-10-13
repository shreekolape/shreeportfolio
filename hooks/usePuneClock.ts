"use client";

import { useEffect, useState } from "react";
import { formatPuneClock } from "@/lib/time";

/**
 * Live HH:MM in Pune. Returns null until mounted so the server-rendered HTML
 * never bakes in a stale time (and Cache Components never sees `new Date()`).
 */
export function usePuneClock(): string | null {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const tick = () => setTime(formatPuneClock(new Date()));
    tick();
    const id = window.setInterval(tick, 10_000);
    return () => window.clearInterval(id);
  }, []);

  return time;
}
