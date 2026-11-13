import type { Media, Project, ProjectFilter } from "./types";

// Real 16:9 cover shot, used for the cover, the 3D monitor preview and the
// mobile/fallback inline thumbnail alike.
function cover(slug: string, title: string, category: string): Media {
  return { type: "image", src: `/projects/${slug}/cover.webp`, alt: `${title} — ${category}`, label: `${title} · Cover` };
}

// Gallery screenshot of the public live site (1600×900); the caption is the alt text.
function shot(slug: string, n: number, caption: string): Media {
  return { type: "image", src: `/projects/${slug}/gallery-${n}.webp`, alt: caption, label: caption };
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
    status: "Live · ongoing development",
    featured: true,
    liveUrl: "https://www.vivin.shop/",
    repoUrl: null,
    sourcePrivate: true,
    cover: cover("vivin", "VIVIN", "B2B Wholesale Platform"),
    previewMedia: cover("vivin", "VIVIN", "B2B Wholesale Platform"),
    // Category, product and catalogue pages sit behind a login, so only public pages are shown.
    gallery: [
      shot("vivin", 1, "Storefront home page"),
      shot("vivin", 2, "Category-first browsing"),
      shot("vivin", 3, "Catalogue request and carton-based ordering steps"),
      shot("vivin", 4, "About page"),
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
          status: "Shipped",
        },
        {
          title: "Admin",
          body: "product management workflows, import history and reporting",
          status: "Shipped",
        },
        {
          title: "Bulk data",
          body: "Excel imports across thousands of products, data validation and SKU-based image matching",
          status: "Shipped",
        },
        {
          title: "Storage & backend",
          body: "Supabase for data and backend integration; Cloudflare R2 for product images",
          status: "Shipped",
        },
        {
          title: "Exports",
          body: "order exports (SKU, quantity, name, price), catalogue and product reports, and PDF catalogues with product details and images",
          status: "Shipped",
        },
        {
          title: "Pricing rules",
          body: "minimum order quantities and carton-based quantities",
          status: "In progress",
        },
        {
          title: "Deployment",
          body: "Vercel with a GitHub-connected workflow; environment variables, build failures, package compatibility and resource limits",
          status: "Shipped",
        },
      ],
      challenges: [
        {
          title: "Importing thousands of products from Excel",
          challenge:
            "Product data arrives in spreadsheets with thousands of rows, and every row has to be validated and matched to its images in storage by SKU. Bad rows and mismatched images need to be caught and fixed without breaking the whole import.",
          approach:
            "I built the import to check every row before saving anything: required fields, data formats and duplicate SKUs. Rows that failed were collected into a clear list instead of stopping the whole import, so the rest could go through and the bad rows could be fixed and re-imported. Product images were matched to products by SKU, which made missing or mismatched images obvious straight away, and every import was recorded in an import history so changes could be traced.",
        },
        {
          title: "Generating PDF catalogues at scale",
          challenge:
            "Building catalogues with product details and images across a large dataset ran into pagination, image processing and memory limits, all inside the constraints of a serverless deployment.",
          approach:
            "Instead of building the whole catalogue in one go, I generated it in smaller batches, resized and compressed product images before placing them, and used a fixed page layout so pagination stayed predictable. That kept memory use and processing time within what a serverless deployment allows, even with a large catalogue.",
        },
        {
          title: "Keeping production deployments healthy",
          challenge:
            "Shipping to Vercel meant working through environment configuration, build failures, package compatibility issues and platform resource limits.",
          approach:
            "I moved all configuration into environment variables for each environment, tracked down build failures to package version conflicts and fixed them, and kept heavy processing out of short-lived serverless functions to stay within Vercel's resource limits.",
        },
      ],
      learned:
        "VIVIN moved me from building pages to handling real data and production limits: thinking about what happens with thousands of records, large files and a deployment platform that has ceilings. It is the project where I learned the most about how web apps behave once real business data is involved.",
      outcome:
        "Live at vivin.shop as the business's wholesale storefront, with a catalogue of 2,000+ products, customer accounts, orders and downloadable PDF catalogues, alongside an admin side the team uses to manage it.",
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
    status: "Live",
    featured: true,
    liveUrl: "https://www.mittinav.com/",
    repoUrl: null,
    sourcePrivate: true,
    cover: cover("mittinav", "MittiNav", "Climate & Agriculture"),
    previewMedia: cover("mittinav", "MittiNav", "Climate & Agriculture"),
    gallery: [
      shot("mittinav", 1, "Home page"),
      shot("mittinav", 2, "Map & Data page with an interactive map of India"),
      shot("mittinav", 3, "Bhalgaon pilot study page"),
      shot("mittinav", 4, "Farmers page and participation model"),
    ],
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
      outcome:
        "Live at mittinav.com, presenting the biochar initiative and its Bhalgaon Pakhardi pilot to farmers, partners and collaborators.",
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
    status: "Live",
    featured: true,
    // Confirmed: this domain serves the Christ TCEA site itself.
    liveUrl: "https://beingrelevant.ai/",
    repoUrl: null,
    sourcePrivate: true,
    cover: cover("christ-tcea", "Christ TCEA", "Controlled Environment Agriculture Platform"),
    previewMedia: cover("christ-tcea", "Christ TCEA", "Controlled Environment Agriculture Platform"),
    // The Knowledge Library is left out: its public entries show a named individual.
    gallery: [
      shot("christ-tcea", 1, "Home page"),
      shot("christ-tcea", 2, "Daily operations log"),
      shot("christ-tcea", 3, "Nursery batch tracking, from sowing to transplant"),
    ],
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
      outcome: "Live and in use, with authentication and the daily log, nursery batch and library features I contributed to.",
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
    status: "Launched · since updated by another developer",
    featured: true,
    liveUrl: "https://swaminifoods.in/",
    repoUrl: null,
    cover: cover("swamini-foods", "Swamini Foods", "Food E-commerce"),
    previewMedia: cover("swamini-foods", "Swamini Foods", "Food E-commerce"),
    // Hidden on purpose: the live site has been rebuilt by another developer on a
    // different platform, so screenshots of it wouldn't show this original build.
    gallery: [],
    caseStudy: {
      // The live site has since been updated by someone else: this case study covers the original build only.
      note: "This case study covers my original build. The site has since been updated by another developer.",
      overview: "An e-commerce food-ordering website for a food business.",
      whatIDid: [
        {
          body: "Built and launched the store on WordPress + WooCommerce with 9 products, with real orders placed and shipped through it",
        },
      ],
      outcome: "Launched with 9 products, and real customer orders were placed and shipped through the store.",
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
    status: "Delivered",
    featured: false,
    // Hidden until the live link arrives; then capture its cover and gallery too.
    liveUrl: null,
    repoUrl: null, // Wix Studio site: no repo
    // No screenshot yet: renders as a typographic cover (title, category, accent gradient).
    cover: { type: "image", src: null, alt: "Being Relevant — Corporate Gifting Store", label: "Being Relevant" },
    previewMedia: { type: "image", src: null, alt: "Being Relevant — Corporate Gifting Store", label: "Being Relevant" },
    gallery: [],
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
      outcome: "Delivered a browsable 700+ product catalogue with size-based pricing and WhatsApp enquiries.",
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
