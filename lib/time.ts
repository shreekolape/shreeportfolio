export const PUNE_TIME_ZONE = "Asia/Kolkata";

const clockOptions: Intl.DateTimeFormatOptions = {
  timeZone: PUNE_TIME_ZONE,
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
};

// en-US gives "Wed" / "Sep" (en-GB would give "Sept").
const dateOptions: Intl.DateTimeFormatOptions = {
  timeZone: PUNE_TIME_ZONE,
  weekday: "short",
  day: "2-digit",
  month: "short",
};

const clockFormat = new Intl.DateTimeFormat("en-GB", clockOptions);
const dateFormat = new Intl.DateTimeFormat("en-US", dateOptions);

/** "01:19" */
export function formatPuneClock(date: Date): string {
  return clockFormat.format(date);
}

const hourFormat = new Intl.DateTimeFormat("en-GB", { timeZone: PUNE_TIME_ZONE, hour: "2-digit", hourCycle: "h23" });

/** Current hour (0–23) in Asia/Kolkata. */
export function getPuneHour(date: Date): number {
  return Number(hourFormat.format(date));
}

/** "Wed, 14 Oct · 01:19" (used by the preloader) */
export function formatPuneDateTime(date: Date): string {
  const parts = Object.fromEntries(dateFormat.formatToParts(date).map((p) => [p.type, p.value]));
  return `${parts.weekday}, ${parts.day} ${parts.month} · ${formatPuneClock(date)}`;
}

/**
 * Inline-script version of formatPuneDateTime: fills element `id` before the
 * first paint so the preloader never shows an empty date.
 */
export function puneDateTimeScript(id: string, suffix: string): string {
  return `(function(){try{var d=new Date();var p={};new Intl.DateTimeFormat("en-US",${JSON.stringify(
    dateOptions,
  )}).formatToParts(d).forEach(function(x){p[x.type]=x.value});var t=new Intl.DateTimeFormat("en-GB",${JSON.stringify(
    clockOptions,
  )}).format(d);var el=document.getElementById(${JSON.stringify(id)});if(el)el.textContent=p.weekday+", "+p.day+" "+p.month+" \\u00b7 "+t+" "+${JSON.stringify(
    suffix,
  )}}catch(e){}})()`;
}
