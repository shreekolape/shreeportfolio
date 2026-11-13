import type { Media } from "./types";

// Work-focused only. No personal-life content.
export const about = {
  heading: "About",

  intro: {
    paragraphs: [
      "I'm Shree, a web developer from Pune and a final-year Computer Engineering student. I started building websites for real businesses while still in college, and that shaped how I work. A website isn't just a design or a codebase. It's something a business depends on to sell, take orders and explain what it does.",
      "So I start with the business, not the tech. Who are your customers, what should they be able to do, and what's slowing your team down today? Then I build the simplest thing that solves it well, keep you in the loop as it takes shape, and make sure it's easy to run once it's live.",
      "What I enjoy most is the moment a messy process becomes simple: a spreadsheet turns into a dashboard, an enquiry turns into an order, a confusing page turns into one people actually use.",
      "Right now I'm finishing my degree, working on a live e-commerce store and taking on freelance projects. Alongside that, I'm learning to build with AI properly (LLMs, retrieval and AI agents) and studying system design, so the next things I build are smarter and still well engineered. And yes, a lot of it happens late at night.",
    ],
  },

  /** Still of the golden-hour `relax` scene, shown wherever 3D doesn't load. */
  sceneFallback: {
    type: "image",
    src: "/scenes/about-golden-hour.webp",
    alt: "Illustration of Shree leaning back in his chair at golden hour.",
    label: "About · Golden hour",
  } satisfies Media,

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
      body: "What you sell, who it's for and what the site has to do, before any design or code.",
    },
    {
      title: "Choose what fits, not what's trendy",
      body: "The right approach depends on your goals, your budget and how much you want to manage yourself.",
    },
    {
      title: "Show progress early",
      body: "You see working pages along the way, so feedback lands before changes get expensive.",
    },
    {
      title: "Stick around after launch",
      body: "Fixes, improvements and new features, so the site keeps up with the business.",
    },
  ],
} as const;
