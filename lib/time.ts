export const PUNE_TIME_ZONE = "Asia/Kolkata";

const clockFormat = new Intl.DateTimeFormat("en-GB", {
  timeZone: PUNE_TIME_ZONE,
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});

const dateFormat = new Intl.DateTimeFormat("en-GB", {
  timeZone: PUNE_TIME_ZONE,
  weekday: "short",
  day: "2-digit",
  month: "short",
});

/** "01:19" */
export function formatPuneClock(date: Date): string {
  return clockFormat.format(date);
}

/** "Wed, 14 Oct · 01:19" (used by the preloader) */
export function formatPuneDateTime(date: Date): string {
  const parts = Object.fromEntries(dateFormat.formatToParts(date).map((p) => [p.type, p.value]));
  return `${parts.weekday}, ${parts.day} ${parts.month} · ${formatPuneClock(date)}`;
}
