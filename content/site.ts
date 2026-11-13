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

  /**
   * Live status line, chosen by the current hour in Asia/Kolkata ([from, to)
   * in 24h local time). `{time}` is replaced with the current HH:MM. The
   * green dot is rendered separately by <StatusLine>, not part of the text.
   */
  status: [
    { from: 0, to: 5, text: "Available for freelance projects · it's {time} in Pune, peak bug-fixing hours." },
    {
      from: 5,
      to: 10,
      text: "Available for freelance projects · it's {time} in Pune. The bugs are asleep, and I might be too.",
    },
    { from: 10, to: 18, text: "Available for freelance projects · it's {time} in Pune, probably mid-deploy." },
    { from: 18, to: 24, text: "Available for freelance projects · it's {time} in Pune, the night shift is warming up." },
  ],

  footer: {
    heading: "Got a project? Let's build it.",
    cta: { label: "Say hi", href: "/contact" },
    credit: "Designed & built by Shree. Debugged at unreasonable hours.",
    /** The footer never prints the address itself — just the word "Email" plus a copy button. */
    emailLinkLabel: "Email",
    copyEmailAriaLabel: "Copy email address",
    copiedLabel: "Copied",
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
