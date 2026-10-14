import type { Media } from "./types";

// Work-focused only. No personal-life content.
export const about = {
  heading: "About",

  intro: {
    // {PLACEHOLDER: Shree to provide or approve the final About text}
    // Draft below is built only from facts already in the brief; nothing personal added.
    approved: false,
    paragraphs: [
      "Hi, I'm Shree, a web developer building websites and web apps for real businesses, and keeping them running after launch.",
      "So far that's meant a B2B wholesale platform, corporate gifting stores, a climate startup's website and Shopify stores that need looking after. Some of it is building from scratch; a lot of it is the work after that: integrations, deployments, fixing what breaks and keeping things running.",
      "I care about clean design and things that don't break in production. Usually in that order, occasionally at 3 AM.",
    ],
  },

  photo: {
    type: "image",
    src: null, // {PLACEHOLDER: photo file in /public}
    alt: "{PLACEHOLDER: photo alt text}",
    label: "Shree · Photo",
  } satisfies Media,

  sections: {
    education: "Education",
    experience: "Experience",
    skills: "Skills",
    howIWork: "How I work",
  },

  howIWork: "{PLACEHOLDER: short 'How I work' section, to be written with Shree}",
} as const;
