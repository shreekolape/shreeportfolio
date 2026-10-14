import { site } from "./site";

export const home = {
  hero: {
    name: site.name,
    pitch: site.pitch,
    smallLine: "Computer Engineering · Savitribai Phule Pune University · 2027",
    scrollHint: "scroll to wake him up ↓",
  },

  intro: {
    text: "Hi, I'm Shree. I build for actual clients: a B2B wholesale platform, corporate gifting stores, a climate startup's website and Shopify stores that need looking after. I care about clean design and things that don't break in production. Usually in that order, occasionally at 3 AM.",
    link: { label: "More about me →", href: "/about" },
  },

  selectedWork: {
    heading: "Selected Work",
    link: { label: "See all work →", href: "/work" },
  },

  whatIDo: {
    heading: "What I Do",
    blocks: [
      {
        title: "Websites & Web Apps",
        body: "From clean business sites to React apps with databases, storage and admin dashboards.",
      },
      {
        title: "E-commerce",
        body: "Shopify, WooCommerce and Wix stores, covering catalogues, enquiries, and payment and shipping integrations.",
      },
    ],
  },
} as const;
