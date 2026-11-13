// Shared content types. Anything still owed is tracked in CONTENT_TODO.md.

/**
 * An image or video. `alt` doubles as the visible caption in galleries.
 * `src: null` (only Being Relevant's cover, until its screenshot arrives)
 * renders a typographic cover built from `label`, never an empty block.
 */
export type Media = {
  type: "image" | "video";
  src: string | null;
  alt: string;
  label: string;
};

export type ProjectFilter = "Client" | "E-commerce";

export type WorkStatus = "Shipped" | "In progress";

export type WorkItem = {
  /** Bold lead-in, e.g. "Storefront". Short case studies use plain bullets. */
  title?: string;
  body: string;
  /** Badge on VIVIN's "What I worked on" items. */
  status?: WorkStatus;
};

export type Challenge = {
  title: string;
  challenge: string;
  approach: string;
};

export type CaseStudy = {
  /** Page header line, e.g. "VIVIN · A custom B2B wholesale platform". */
  headline?: string;
  /** Overrides for the case-study meta row when it differs from the project card. */
  meta?: {
    type?: string;
    role?: string;
    stack?: string[];
  };
  overview: string;
  brief?: string;
  whatIDidHeading?: string;
  whatIDid: WorkItem[];
  challenges?: Challenge[];
  learned?: string;
  /** Shown at the top of the case study (e.g. Swamini Foods' original-build note). */
  note?: string;
  /** null hides the section. */
  outcome?: string | null;
};

export type Project = {
  slug: string;
  title: string;
  category: string;
  oneLiner: string;
  tags: ProjectFilter[];
  stack: string[];
  role: string;
  type: string;
  /** Small label next to the title, e.g. "Internship project (Being Relevant)". */
  label?: string;
  status: string;
  featured: boolean;
  /** null hides the "Live site" link. */
  liveUrl: string | null;
  /** null hides the repo link. */
  repoUrl: string | null;
  /** Private client repository: show a muted "Source code: private" note instead of a link. */
  sourcePrivate?: boolean;
  cover: Media;
  /** Plays on the 3D monitor (desktop) or as an inline thumbnail (mobile). */
  previewMedia: Media;
  gallery: Media[];
  caseStudy: CaseStudy;
};

export type Experience = {
  company: string;
  role: string;
  period: string;
  points: string[];
};

export type Education = {
  degree: string;
  university: string;
  year: string;
};

export type SkillTier = {
  title: string;
  /** Flat tiers set this. "Currently learning" uses `groups` instead. */
  items?: string[];
  groups?: { title: string; items: string[] }[];
};

export type WhatIDoRow = {
  title: string;
  body: string;
  /** Extra credibility link for the few rows backed by a real case study. */
  proof?: { label: string; href: string };
  /** Shown on the 3D monitor (desktop) or inline (mobile) on hover/focus. */
  mockup: Media;
  comingSoon?: boolean;
};
