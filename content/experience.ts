import type { Education, Experience } from "./types";

// No college name anywhere: university only.
export const education: Education = {
  degree: "B.E. Computer Engineering",
  university: "Savitribai Phule Pune University",
  year: "2027",
};

export const experience: Experience[] = [
  {
    // Frame as contributions; never imply ownership of the whole platform.
    company: "Thavare",
    role: "Website Development & Maintenance",
    period: "Jun 2026 to Present",
    points: [
      "Website maintenance and development",
      "Shopify API integrations",
      "Contributing to payment-related work with Razorpay and shipping and fulfilment workflows with Shiprocket",
      "Add-ons, workflow improvements and functionality refinements",
    ],
  },
  {
    // The only place UI/UX and Figma appear on the site.
    company: "Being Relevant",
    role: "Web Development & UI/UX Intern",
    period: "Feb to Mar 2026",
    points: [
      "Created and refined UI/UX designs in Figma",
      "Built the Christ TCEA authentication page in HTML, CSS and Tailwind CSS",
      "Worked on Wix Studio collection pages for a corporate gifting site",
      "Improved CTA placement and page presentation",
    ],
  },
];
