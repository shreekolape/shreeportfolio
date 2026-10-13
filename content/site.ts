// Site-wide copy: header, footer, status line, contact links.
// Phase 2 expands the content layer (projects, experience, skills, page copy).

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

  contact: {
    email: "{PLACEHOLDER: email address}",
    socials: [
      { label: "GitHub", href: "{PLACEHOLDER: GitHub profile URL}" },
      { label: "LinkedIn", href: "{PLACEHOLDER: LinkedIn profile URL}" },
    ] satisfies SocialLink[],
  },
} as const;
