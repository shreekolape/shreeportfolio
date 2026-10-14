// Shared content types. Every unknown value is a "{PLACEHOLDER: ...}" string
// so all of them can be found with one search.

export type Placeholder = `{PLACEHOLDER: ${string}}`;

/**
 * An image or video. `src: null` renders a neutral gradient block showing
 * `label` (e.g. "VIVIN · Admin import screen") until the real file exists.
 */
export type Media = {
  type: "image" | "video";
  src: string | null;
  alt: string;
  label: string;
};

export type ProjectFilter = "Client" | "E-commerce";

export type WorkStatus = "Shipped" | "In progress" | Placeholder;

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
  /** null = never link (not a placeholder). Placeholder strings render as "#". */
  liveUrl: string | null;
  /** "" or null hides the repo link. */
  repoUrl: string | null;
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
  items: string[];
};
