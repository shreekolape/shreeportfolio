import type { Media } from "./types";

// Work-focused only. No personal-life content.
export const about = {
  heading: "About",

  intro: {
    paragraphs: [
      "I'm Shree, a Computer Engineering student at Savitribai Phule Pune University and a web developer who builds for real clients. So far that's meant a B2B wholesale platform with bulk imports and PDF catalogues, a corporate gifting store with 700+ products, a climate startup's website, a food brand's online store, and ongoing work on a live Shopify store.",
      "I like the part after launch as much as the launch itself: fixing what breaks, improving what's slow, and adding what the business needs next. Most of my best debugging happens late at night, which explains the guy asleep on the homepage.",
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

  /** Numbered list, same visual style as Home's Selected Work rows. */
  howIWork: [
    {
      title: "Understand the business first",
      body: "What you sell, who it's for and what the site has to do, before I pick a single tool.",
    },
    {
      title: "Pick the right tool, not the trendy one",
      body: "Wix, WordPress or Shopify when you want to manage it yourself. React when it needs custom logic.",
    },
    {
      title: "Show progress early",
      body: "You see working pages along the way, so feedback lands before changes get expensive.",
    },
    {
      title: "Stick around after launch",
      body: "Fixes, updates and new features, so the site keeps up with the business.",
    },
  ],
} as const;
