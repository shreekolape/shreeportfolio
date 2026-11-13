import { placeholderMedia, projects } from "./projects";
import { site } from "./site";
import type { WhatIDoRow } from "./types";

function projectCover(slug: string) {
  const project = projects.find((p) => p.slug === slug);
  if (!project) throw new Error(`projectCover: no project with slug "${slug}"`);
  return project.cover;
}

export const home = {
  hero: {
    name: site.name,
    pitch: site.pitch,
    smallLine: "Computer Engineering · Savitribai Phule Pune University · 2027",
    scrollHint: "scroll to wake him up ↓",
  },

  intro: {
    text: "I'm Shree. I help businesses get a website that does its job: easy for customers to use, simple for the team to manage, and reliable long after launch. I start with how your business works, build around it, and stay around to keep improving it.",
    link: { label: "More about me →", href: "/about" },
  },

  selectedWork: {
    heading: "Selected Work",
    link: { label: "See all work →", href: "/work" },
  },

  whatIDo: {
    heading: "Things I can build for you",
    rows: [
      {
        title: "Cafés & Restaurants",
        body: "Menus that make people hungry, with table bookings and orders straight to WhatsApp.",
        mockup: placeholderMedia("Café menu site · Concept"),
      },
      {
        title: "Magazines & Blogs",
        body: "Editorial sites with bold layouts, categories and an easy CMS so you can publish without me.",
        mockup: placeholderMedia("Editorial site · Concept"),
      },
      {
        title: "Online Stores & D2C Brands",
        body: "Product pages, carts, payments and shipping, from 9 products to 700+.",
        proof: { label: "See Swamini Foods →", href: "/work/swamini-foods" },
        mockup: projectCover("swamini-foods"),
      },
      {
        title: "Startup & Product Launches",
        body: "Landing pages that explain your idea in one scroll and collect sign-ups.",
        mockup: placeholderMedia("Launch landing page · Concept"),
      },
      {
        title: "Clinics & Local Businesses",
        body: "Services, timings, location and booking enquiries, simple and trustworthy.",
        mockup: placeholderMedia("Clinic site · Concept"),
      },
      {
        title: "Business Dashboards",
        body: "Custom admin panels for products, orders, imports and reports.",
        proof: { label: "See VIVIN →", href: "/work/vivin" },
        mockup: projectCover("vivin"),
      },
      {
        title: "B2B & Wholesale Catalogues",
        body: "Large product catalogues with categories, bulk pricing, quantity rules and downloadable PDF catalogues.",
        proof: { label: "See VIVIN →", href: "/work/vivin" },
        mockup: placeholderMedia("B2B catalogue · Concept"),
      },
      {
        title: "NGOs & Impact Projects",
        body: "Sites that explain your mission, show your work on the ground and make it easy for people to get involved.",
        proof: { label: "See MittiNav →", href: "/work/mittinav" },
        mockup: placeholderMedia("NGO site · Concept"),
      },
      {
        title: "Real Estate & Property Listings",
        body: "Filterable property listings with photo galleries and an enquiry form for every property.",
        mockup: placeholderMedia("Real estate listings · Concept"),
      },
      {
        title: "AI Agents for Business",
        body: "Assistants that answer customer questions from your own content, qualify leads and handle routine tasks, so your team can focus on the work that matters.",
        mockup: placeholderMedia("Business chat assistant · Coming soon"),
        comingSoon: true,
      },
    ] satisfies WhatIDoRow[],
  },
} as const;
