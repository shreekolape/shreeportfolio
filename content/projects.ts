import type { Media, Project, ProjectFilter } from "./types";

// Neutral placeholder media: renders as a labelled gradient block until `src` is set.
function placeholderMedia(label: string, type: Media["type"] = "image"): Media {
  return { type, src: null, alt: label, label };
}

// Real 16:9 cover shot, used for the cover, the 3D monitor preview and the
// mobile/fallback inline thumbnail alike.
function cover(slug: string, title: string, category: string): Media {
  return { type: "image", src: `/projects/${slug}/cover.webp`, alt: `${title} — ${category}`, label: `${title} · Cover` };
}

export const projectFilters: Array<"All" | ProjectFilter> = ["All", "Client", "E-commerce"];

export const projects: Project[] = [
  // ------------------------------------------------------------------ VIVIN
  {
    slug: "vivin",
    title: "VIVIN",
    category: "B2B Wholesale Platform",
    oneLiner:
      "A custom wholesale platform with a category-first storefront, bulk Excel imports across thousands of products, and PDF catalogues generated from all of it.",
    tags: ["Client", "E-commerce"],
    stack: [
      "TanStack Start",
      "React",
      "TypeScript",
      "Tailwind CSS",
      "Supabase",
      "Cloudflare R2",
      "Vercel",
      "GitHub",
    ],
    role: "Development, feature implementation, integrations, troubleshooting & deployment",
    type: "Client project",
    status: "{PLACEHOLDER: confirm}",
    featured: true,
    liveUrl: "https://www.vivin.shop/",
    repoUrl: "", // {PLACEHOLDER: VIVIN repo URL (leave empty to hide)}
    cover: cover("vivin", "VIVIN", "B2B Wholesale Platform"),
    previewMedia: cover("vivin", "VIVIN", "B2B Wholesale Platform"),
    gallery: [
      placeholderMedia("VIVIN · Storefront category page"),
      placeholderMedia("VIVIN · Product listing"),
      placeholderMedia("VIVIN · Admin import screen"),
      placeholderMedia("VIVIN · Sample PDF catalogue page"),
    ],
    caseStudy: {
      headline: "VIVIN · A custom B2B wholesale platform",
      meta: {
        type: "Client project",
        role: "Development, integrations & deployment",
        stack: [
          "TanStack Start",
          "React",
          "TypeScript",
          "Tailwind CSS",
          "Supabase",
          "Cloudflare R2",
          "Vercel",
        ],
      },
      overview:
        "VIVIN is a B2B wholesale platform for corporate gifting and product distribution. It pairs a customer-facing storefront with admin tools for managing products, catalogues and orders, built on custom application logic rather than an e-commerce template.",
      brief:
        "A wholesale business works differently from a regular online store: a large catalogue, bulk product data that changes in spreadsheets, quantity rules like minimum orders and cartons, and catalogues and reports that the team needs to export. VIVIN needed a storefront and an admin side built around those workflows.",
      whatIDidHeading: "What I worked on",
      whatIDid: [
        {
          title: "Storefront",
          body: "category-first browsing, category and subcategory navigation, product discovery",
          status: "{PLACEHOLDER: confirm}",
        },
        {
          title: "Admin",
          body: "product management workflows, import history and reporting",
          status: "{PLACEHOLDER: confirm}",
        },
        {
          title: "Bulk data",
          body: "Excel imports across thousands of products, data validation and SKU-based image matching",
          status: "{PLACEHOLDER: confirm}",
        },
        {
          title: "Storage & backend",
          body: "Supabase for data and backend integration; Cloudflare R2 for product images",
          status: "{PLACEHOLDER: confirm}",
        },
        {
          title: "Exports",
          body: "order exports (SKU, quantity, name, price), catalogue and product reports, and PDF catalogues with product details and images",
          status: "{PLACEHOLDER: confirm}",
        },
        {
          title: "Pricing rules",
          body: "minimum order quantities and carton-based quantities",
          status: "{PLACEHOLDER: confirm}",
        },
        {
          title: "Deployment",
          body: "Vercel with a GitHub-connected workflow; environment variables, build failures, package compatibility and resource limits",
          status: "{PLACEHOLDER: confirm}",
        },
      ],
      challenges: [
        {
          title: "Importing thousands of products from Excel",
          challenge:
            "Product data arrives in spreadsheets with thousands of rows, and every row has to be validated and matched to its images in storage by SKU. Bad rows and mismatched images need to be caught and fixed without breaking the whole import.",
          approach: "{PLACEHOLDER: what I did}",
        },
        {
          title: "Generating PDF catalogues at scale",
          challenge:
            "Building catalogues with product details and images across a large dataset ran into pagination, image processing and memory limits, all inside the constraints of a serverless deployment.",
          approach: "{PLACEHOLDER: what I did}",
        },
        {
          title: "Keeping production deployments healthy",
          challenge:
            "Shipping to Vercel meant working through environment configuration, build failures, package compatibility issues and platform resource limits.",
          approach: "{PLACEHOLDER: what I did}",
        },
      ],
      learned:
        "VIVIN moved me from building pages to handling real data and production limits: thinking about what happens with thousands of records, large files and a deployment platform that has ceilings. It is the project where I learned the most about how web apps behave once real business data is involved.",
      // {PLACEHOLDER: add a verified outcome after client approval}. Keep null to hide the section.
      outcome: null,
    },
  },

  // --------------------------------------------------------------- MittiNav
  {
    slug: "mittinav",
    title: "MittiNav",
    category: "Climate & Agriculture",
    oneLiner:
      "A website telling the story of biochar, connecting farmers, soil and climate impact through a clear, modern experience.",
    tags: ["Client"],
    stack: ["React", "Tailwind CSS", "Vercel", "GitHub"],
    role: "Website development & deployment",
    type: "Client project",
    status: "{PLACEHOLDER: confirm}",
    featured: true,
    liveUrl: "https://www.mittinav.com/",
    repoUrl: "", // {PLACEHOLDER: MittiNav repo URL (leave empty to hide)}
    cover: cover("mittinav", "MittiNav", "Climate & Agriculture"),
    previewMedia: cover("mittinav", "MittiNav", "Climate & Agriculture"),
    gallery: [], // {PLACEHOLDER: MittiNav gallery screenshots}
    caseStudy: {
      // Do not mention carbon measurement, emissions verification, monitoring systems or any climate tech features.
      overview:
        "MittiNav is centred on biochar, agriculture and climate impact. The site connects biochar infrastructure with farmers, nature and climate outcomes, including a pilot context at Bhalgaon Pakhardi, Ahmednagar.",
      whatIDid: [
        { body: "Built the React + Tailwind CSS website" },
        {
          body: "Focused on communicating the project's purpose through a clear, modern, responsive experience",
        },
        { body: "Set up the GitHub-connected workflow and deployed it on Vercel" },
      ],
    },
  },

  // ------------------------------------------------------------ Christ TCEA
  {
    slug: "christ-tcea",
    title: "Christ TCEA",
    category: "Controlled Environment Agriculture Platform",
    oneLiner:
      "Authentication screens and contributions to platform features: daily logs, nursery batch tracking and library uploads.",
    tags: ["Client"],
    stack: ["HTML", "CSS", "Tailwind CSS", "Firebase Hosting", "Cloudflare R2"],
    role: "UI implementation & platform functionality",
    type: "Internship project (Being Relevant)",
    label: "Internship project (Being Relevant)",
    status: "{PLACEHOLDER: confirm}",
    featured: true,
    liveUrl: "https://beingrelevant.ai/",
    repoUrl: "", // {PLACEHOLDER: Christ TCEA repo URL (leave empty to hide)}
    cover: cover("christ-tcea", "Christ TCEA", "Controlled Environment Agriculture Platform"),
    previewMedia: cover("christ-tcea", "Christ TCEA", "Controlled Environment Agriculture Platform"),
    gallery: [], // {PLACEHOLDER: Christ TCEA gallery screenshots}
    caseStudy: {
      // The auth page is HTML/CSS/Tailwind, NOT React. Keep "contributed to" / "worked on" wording.
      overview:
        "A controlled environment agriculture website and platform with authentication, daily activity logs, nursery batch tracking and a file library.",
      whatIDid: [
        { body: "Implemented the authentication page in HTML, CSS and Tailwind CSS" },
        { body: "Worked on login, Google sign-in and password-reset UI" },
        { body: "Contributed to daily logs and 15-day nursery batch features" },
        { body: "Worked on library file uploads and their storage setup" },
        { body: "Worked with Firebase Hosting and Cloudflare R2" },
        { body: "Helped troubleshoot functionality and deployment issues" },
      ],
    },
  },

  // ---------------------------------------------------------- Swamini Foods
  {
    slug: "swamini-foods",
    title: "Swamini Foods",
    category: "Food E-commerce",
    oneLiner:
      "A WordPress and WooCommerce food-ordering store, built and launched with live orders and shipping.",
    tags: ["Client", "E-commerce"],
    stack: ["WordPress", "WooCommerce"],
    role: "Website development & launch",
    type: "Client project",
    status: "{PLACEHOLDER: confirm}",
    featured: true,
    liveUrl: "https://swaminifoods.in/",
    repoUrl: null,
    cover: cover("swamini-foods", "Swamini Foods", "Food E-commerce"),
    previewMedia: cover("swamini-foods", "Swamini Foods", "Food E-commerce"),
    gallery: [
      // {PLACEHOLDER: additional screenshots of the original build}
      placeholderMedia("Swamini Foods · Original build screenshot"),
    ],
    caseStudy: {
      // The live site has since been updated by someone else: this case study covers the original build only.
      note: "This case study covers my original build. The site has since been updated by another developer.",
      overview: "An e-commerce food-ordering website for a food business.",
      whatIDid: [
        {
          body: "Built and launched the store on WordPress + WooCommerce with 9 products, with real orders placed and shipped through it",
        },
      ],
    },
  },

  // --------------------------------------------------------- Being Relevant
  {
    slug: "being-relevant",
    title: "Being Relevant",
    category: "Corporate Gifting Store",
    oneLiner:
      "700+ products organised into categories people can actually navigate, with size-based pricing and WhatsApp enquiries.",
    tags: ["Client", "E-commerce"],
    stack: ["Wix Studio", "Wix CMS"],
    role: "Website development (Wix Studio)",
    type: "Client project",
    status: "{PLACEHOLDER: confirm}",
    featured: false,
    liveUrl: "{PLACEHOLDER: Being Relevant live site URL}",
    repoUrl: null, // Wix Studio site: no repo
    cover: placeholderMedia("Being Relevant · Cover"),
    previewMedia: placeholderMedia("Being Relevant · Monitor preview"),
    gallery: [], // {PLACEHOLDER: Being Relevant gallery screenshots}
    caseStudy: {
      // Enquiry-based flow. Do not describe checkout or payments.
      overview:
        "A corporate gifting website with a large product assortment, categories, subcategories and customer enquiries.",
      whatIDid: [
        { body: "Built collection and product listing pages" },
        { body: "Worked with a 700+ product catalogue" },
        { body: "Organised categories and subcategories" },
        { body: "Presented size-based pricing" },
        { body: "Worked on account-related functionality and WhatsApp enquiry flows" },
        { body: "Refined CTA placement and overall UX" },
      ],
    },
  },
];

export const featuredProjects = projects.filter((p) => p.featured);

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

/** "Next project →" cycles through all projects in order. */
export function getNextProject(slug: string): Project {
  const index = projects.findIndex((p) => p.slug === slug);
  return projects[(index + 1) % projects.length];
}
