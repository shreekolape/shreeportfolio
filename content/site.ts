// Site-wide copy: header, footer, status line, contact links, preloader.
// Page copy lives in home.ts / about.ts / contact.ts; data in projects.ts,
// experience.ts and skills.ts.

import type { Media } from "./types";

export type NavItem = { label: string; href: string };
export type SocialLink = { label: string; href: string };

export const site = {
  name: "Shree Kolape",
  shortName: "Shree",
  pitch:
    "Web developer building websites and web apps for real businesses, and keeping them running after launch.",

  nav: [
    { label: "Home", href: "/" },
    { label: "Work", href: "/work" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ] satisfies NavItem[],

  soundToggle: {
    label: "Sound",
    on: "On",
    off: "Off",
  },

  /** Live status line. `{time}` is replaced with the current HH:MM in Pune. */
  status:
    "Available for freelance projects · it's {time} in Pune, so I'll probably reply after I wake up.",

  footer: {
    heading: "Got a project? Let's build it.",
    cta: { label: "Say hi", href: "/contact" },
    credit: "Designed & built by Shree. Debugged at unreasonable hours.",
  },

  /** First visit per session. Date/time is rendered live in Asia/Kolkata. */
  preloader: {
    locationSuffix: "in Pune",
    line: "Loading pixels. Please don't refresh, they're shy.",
  },

  /** Shown instead of the 3D canvas on mobile, low-power devices and reduced motion. */
  sceneFallback: {
    type: "image",
    src: null, // {PLACEHOLDER: pre-rendered still or short muted loop of the desk scene}
    alt: "{PLACEHOLDER: alt text for the desk scene still}",
    label: "Desk scene · Pre-rendered fallback",
  } satisfies Media,

  contact: {
    email: "workwidshree@gmail.com",
    socials: [
      { label: "GitHub", href: "https://github.com/shreekolape" },
      { label: "LinkedIn", href: "https://www.linkedin.com/in/pranavkolape/" },
    ] satisfies SocialLink[],
  },
} as const;
