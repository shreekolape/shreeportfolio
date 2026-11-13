import type { SkillTier } from "./types";

/** About page: three honest tiers, the last one split into sub-groups. */
export const skillTiers: SkillTier[] = [
  {
    title: "Used in projects",
    items: [
      "React",
      "TypeScript (VIVIN)",
      "Tailwind CSS",
      "TanStack Start",
      "Wix Studio",
      "WordPress",
      "WooCommerce",
      "Shopify",
      "Shopify APIs",
      "Supabase",
      "MySQL",
      "Cloudflare R2",
      "Firebase Hosting",
      "Vercel",
      "GitHub",
      "Razorpay & Shiprocket (integration work)",
    ],
  },
  {
    title: "Workflow & tools",
    items: [
      "Claude Code",
      "Windsurf",
      "GitHub-based version control and deployment",
      "Environment configuration and build troubleshooting",
      "Third-party APIs and cloud services",
    ],
  },
  {
    title: "Currently learning",
    groups: [
      {
        title: "AI engineering",
        items: [
          "LLM integration",
          "RAG (embeddings and vector databases)",
          "AI agents and tool calling",
          "Evaluating AI output",
        ],
      },
      {
        title: "Engineering foundations",
        items: ["System design", "Backend and API design", "Database design", "Testing and clean architecture"],
      },
    ],
  },
];

/** Home page marquee. Figma is intentionally not here. */
export const stackStrip: string[] = [
  "React",
  "TypeScript",
  "Tailwind CSS",
  "TanStack Start",
  "Supabase",
  "MySQL",
  "Cloudflare R2",
  "Firebase",
  "Vercel",
  "GitHub",
  "Shopify",
  "WordPress",
  "Wix Studio",
];
