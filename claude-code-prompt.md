# Build Brief: Shree Kolape — Developer Portfolio

You are building my personal portfolio website. Everything below (structure, visual direction, content and rules) is already decided. **Do not redesign, re-plan or add sections.** If something is unclear or missing, ask me instead of inventing it.

Work in the phases listed at the end. **Stop after each phase**, summarise what you built, and wait for my go-ahead before starting the next one.

---

## 1. Hard rules

1. **Never invent content.** No made-up metrics, testimonials, client names, URLs, features, outcomes or skills. Use only the copy in this file.
2. **Placeholders are expected.** Screenshots, live links, repo links, photos, the résumé and some case-study details are not ready yet. Use clearly marked placeholders (see section 9) so I can swap them later in one place.
3. **All content lives in data files**, never hard-coded in components, so I can edit copy without touching layout.
4. **Accuracy notes in the content are intentional.** Don't "upgrade" wording (for example, don't turn "contributed to" into "built", and don't call the Christ TCEA auth page a React project).
5. **Performance and accessibility are not optional.** The 3D and animation layer must degrade gracefully (section 8).

---

## 2. Tech stack

- **Framework:** Next.js (App Router) + TypeScript
- **Styling:** Tailwind CSS
- **Animation:** GSAP + ScrollTrigger
- **Smooth scroll:** Lenis (synced with ScrollTrigger)
- **3D:** React Three Fiber + @react-three/drei (lazy-loaded, client-only)
- **Sound:** Howler.js
- **Deploy:** Vercel, via GitHub

Keep dependencies lean. Ask before adding anything major that isn't listed.

---

## 3. Visual direction

- **Base:** dark and neutral (near-black background, off-white text, muted greys). Clean, professional and spacious, closer to a polished studio portfolio than a game.
- **Accent:** a single neon accent stored as a CSS variable that **shifts with scroll position**. It moves through a fixed range (cyan → violet → magenta) as the page progresses, and its **glow intensity increases with scroll velocity** (read Lenis velocity, ease it, and clamp it). The accent is used sparingly: links, active states, cursor, glows and small highlights.
- **Typography:** a clean modern grotesk for headings and body, plus a monospace for small labels such as tags, dates and the status line. Use Google Fonts via `next/font`. Large confident headings with generous whitespace.
- **Layout:** short, scannable sections. Content must stay readable on its own even if the 3D scene fails to load.

---

## 4. Site map

```
/                 Home (the hook)
/work             All projects, filterable
/work/[slug]      Case study pages
/about            About, experience, skills
/contact          Contact (freelance only)
```

Shared across all pages: header nav (Home, Work, About, Contact, sound toggle), custom cursor, smooth scroll, page transitions and footer CTA.

---

## 5. Site-wide features

### 5.1 Preloader (first visit per session only)
- Shows the **live date and time in Pune** (`Asia/Kolkata`), formatted like `Wed, 14 Oct · 01:19 in Pune`.
- A counter runs from 0 to 100 while assets load (tied to real loading progress where possible, especially the 3D model).
- Line underneath: **"Loading pixels. Please don't refresh, they're shy."**
- Exits with a smooth reveal into the hero.

### 5.2 Page transitions
Smooth transitions between all routes (an overlay or curtain wipe in the accent colour, timed and eased cleanly). Scroll resets to top on route change.

### 5.3 Custom cursor
- A small dot with a trailing ring that follows with easing.
- Context labels on hover: **"View"** on project items, **"Say hi"** on contact CTAs, **"Open"** on external links.
- Magnetic effect on primary buttons (especially the footer CTA).
- **Disabled on touch devices**, where the native cursor is restored.

### 5.4 Sound
- Subtle UI sounds on buttons, nav links, toggles and footer interactions (Howler.js, short and quiet clips).
- **Off by default.** A visible toggle sits in the header.
- Persist the preference in `localStorage`, with every read and write wrapped in try/catch.
- Use placeholder sound files in `/public/sounds/` with a README noting what each one is for.

### 5.5 Scroll-reactive accent
As described in section 3. Implement it as one hook or provider that updates CSS variables (`--accent`, `--accent-glow`) so every component simply uses the variables.

---

## 6. Pages and content

### 6.1 Home

The 3D desk scene (section 7) runs through the home page as a scroll-driven story. The sections below sit over or alongside it.

**Hero**
- Name: **Shree Kolape**
- Pitch: **Web developer building websites and web apps for real businesses, and keeping them running after launch.**
- Small line: *Computer Engineering · Savitribai Phule Pune University · 2027*
- Scroll hint: *scroll to wake him up ↓*
- 3D state: character asleep at the desk at night, monitor glowing.

**Intro** (the character wakes up during this section)
> Hi, I'm Shree. I build for actual clients: a B2B wholesale platform, corporate gifting stores, a climate startup's website and Shopify stores that need looking after. I care about clean design and things that don't break in production. Usually in that order, occasionally at 3 AM.

Link: **More about me →** (to /about)

**Selected Work** (4 projects in a clean list, not cards with heavy imagery)
- Each row shows the title, category, one-line description and stack tags.
- **Hovering a row plays that project's preview on the 3D monitor screen** (video or image texture). On mobile or the fallback, show a small inline thumbnail instead.
- Click opens the case study.
- Content comes from the projects data (section 6.3), where `featured: true` marks these four: VIVIN, MittiNav, Being Relevant, Christ TCEA.
- Link: **See all work →**

**What I Do** (exactly two blocks, with no UI/UX block)
- **Websites & Web Apps:** from clean business sites to React apps with databases, storage and admin dashboards.
- **E-commerce:** Shopify, WooCommerce and Wix stores, covering catalogues, enquiries, and payment and shipping integrations.

**Stack strip** (smooth infinite marquee; pauses on hover)
HTML · CSS · JavaScript · React · TypeScript · Tailwind CSS · TanStack Start · Supabase · MySQL · Cloudflare R2 · Firebase · Vercel · GitHub · Shopify · WordPress · Wix Studio
(Figma is intentionally **not** in this strip.)

**Footer CTA** (shared on every page)
- Heading: **Got a project? Let's build it.**
- Magnetic button: **Say hi** (to /contact)
- Status line, with the time live in Asia/Kolkata: 🟢 *Available for freelance projects · it's {HH:MM} in Pune, so I'll probably reply after I wake up.*
- Email and social links (placeholders)
- Bottom line: *Designed & built by Shree. Debugged at unreasonable hours.*
- 3D state: the character leans back and waves as the footer comes into view.
- Footer interactions have sound when sound is on.

### 6.2 Work page (`/work`)
- Grid or list of **all 5 projects**: VIVIN, MittiNav, Being Relevant, Christ TCEA, Swamini Foods.
- Filters: **All · Client · E-commerce**, with an animated filter transition.
- No personal or learning projects. Do not add any.

### 6.3 Projects data (`/content/projects.ts`)

Each project has: `slug, title, category, oneLiner, tags (filters), stack[], role, type, status, featured, liveUrl, repoUrl, cover, previewMedia, gallery[], caseStudy`.

**VIVIN** (`vivin`)
- Category: B2B Wholesale Platform · Filters: Client, E-commerce · Featured
- One-liner: A custom wholesale platform with a category-first storefront, bulk Excel imports across thousands of products, and PDF catalogues generated from all of it.
- Stack: TanStack Start, React, TypeScript, Tailwind CSS, Supabase, Cloudflare R2, Vercel, GitHub
- Role: Development, feature implementation, integrations, troubleshooting & deployment
- Case study: see section 6.4 (the deepest one)

**MittiNav** (`mittinav`)
- Category: Climate & Agriculture · Filters: Client · Featured
- One-liner: A website telling the story of biochar, connecting farmers, soil and climate impact through a clear, modern experience.
- Stack: React, Tailwind CSS, Vercel, GitHub
- Role: Website development & deployment
- Short case study:
  - Overview: MittiNav is centred on biochar, agriculture and climate impact. The site connects biochar infrastructure with farmers, nature and climate outcomes, including a pilot context at Bhalgaon Pakhardi, Ahmednagar.
  - What I did: built the React + Tailwind CSS website; focused on communicating the project's purpose through a clear, modern, responsive experience; set up the GitHub-connected workflow and deployed it on Vercel.
  - **Do not** mention carbon measurement, emissions verification, monitoring systems or any climate tech features.

**Being Relevant** (`being-relevant`)
- Category: Corporate Gifting Store · Filters: Client, E-commerce · Featured
- One-liner: 700+ products organised into categories people can actually navigate, with size-based pricing and WhatsApp enquiries.
- Stack: Wix Studio, Wix CMS
- Role: Website development (Wix Studio)
- Short case study:
  - Overview: a corporate gifting website with a large product assortment, categories, subcategories and customer enquiries.
  - What I did: built collection and product listing pages; worked with a 700+ product catalogue; organised categories and subcategories; presented size-based pricing; worked on account-related functionality and WhatsApp enquiry flows; refined CTA placement and overall UX.
  - **Do not** describe checkout or payments. It is an enquiry-based flow.

**Christ TCEA** (`christ-tcea`)
- Category: Permaculture Platform · Filters: Client · Featured · Label: *Internship project (Being Relevant)*
- One-liner: Authentication screens and contributions to platform features: daily logs, nursery batch tracking and library uploads.
- Stack: HTML, CSS, Tailwind CSS, Firebase Hosting, Cloudflare R2
- Role: UI implementation & platform functionality
- Short case study:
  - Overview: a permaculture website and platform with authentication, daily activity logs, nursery batch tracking and a file library.
  - What I did: implemented the authentication page in HTML, CSS and Tailwind CSS (**not React**); worked on login, Google sign-in and password-reset UI; contributed to daily logs and 15-day nursery batch features; worked on library file uploads and their storage setup; worked with Firebase Hosting and Cloudflare R2; helped troubleshoot functionality and deployment issues.
  - Use "contributed to" or "worked on" wording for platform features, exactly as written.

**Swamini Foods** (`swamini-foods`)
- Category: Food E-commerce · Filters: Client, E-commerce · Not featured
- One-liner: A WordPress and WooCommerce food-ordering store, built and launched with live orders and shipping.
- Stack: WordPress, WooCommerce
- Role: Website development & launch
- Short case study:
  - Overview: an e-commerce food-ordering website for a food business.
  - What I did: built and launched the store on WordPress + WooCommerce with 9 products, with real orders placed and shipped through it.
  - Note shown on the page: *This case study covers my original build. The site has since been updated by another developer.*
  - Use **my own screenshots (placeholders for now)**, not the current live site. Do not link the live site as representing my work.
  - **Do not** claim custom plugins, custom payment integrations or order-management features.

### 6.4 VIVIN case study (full content)

**Header:** VIVIN · A custom B2B wholesale platform
**Meta:** Client project · Role: Development, integrations & deployment · Stack: TanStack Start, React, TypeScript, Tailwind CSS, Supabase, Cloudflare R2, Vercel · Status: {PLACEHOLDER: confirm}

**Overview**
VIVIN is a B2B wholesale platform for corporate gifting and product distribution. It pairs a customer-facing storefront with admin tools for managing products, catalogues and orders, built on custom application logic rather than an e-commerce template.

**The brief**
A wholesale business works differently from a regular online store: a large catalogue, bulk product data that changes in spreadsheets, quantity rules like minimum orders and cartons, and catalogues and reports that the team needs to export. VIVIN needed a storefront and an admin side built around those workflows.

**What I worked on** (each item carries a status badge: `Shipped` or `In progress`, set in data; default to `{PLACEHOLDER: confirm}`)
- **Storefront:** category-first browsing, category and subcategory navigation, product discovery
- **Admin:** product management workflows, import history and reporting
- **Bulk data:** Excel imports across thousands of products, data validation and SKU-based image matching
- **Storage & backend:** Supabase for data and backend integration; Cloudflare R2 for product images
- **Exports:** order exports (SKU, quantity, name, price), catalogue and product reports, and PDF catalogues with product details and images
- **Pricing rules:** minimum order quantities and carton-based quantities
- **Deployment:** Vercel with a GitHub-connected workflow; environment variables, build failures, package compatibility and resource limits

**Engineering challenges** (three blocks; each has a "Challenge" paragraph written below and an "Approach" paragraph that stays a placeholder until I fill it in)

1. **Importing thousands of products from Excel**
   Product data arrives in spreadsheets with thousands of rows, and every row has to be validated and matched to its images in storage by SKU. Bad rows and mismatched images need to be caught and fixed without breaking the whole import.
   Approach: {PLACEHOLDER: what I did}

2. **Generating PDF catalogues at scale**
   Building catalogues with product details and images across a large dataset ran into pagination, image processing and memory limits, all inside the constraints of a serverless deployment.
   Approach: {PLACEHOLDER: what I did}

3. **Keeping production deployments healthy**
   Shipping to Vercel meant working through environment configuration, build failures, package compatibility issues and platform resource limits.
   Approach: {PLACEHOLDER: what I did}

**What it taught me**
VIVIN moved me from building pages to handling real data and production limits: thinking about what happens with thousands of records, large files and a deployment platform that has ceilings. It is the project where I learned the most about how web apps behave once real business data is involved.

**Gallery** (placeholders): storefront category page · product listing · admin import screen · sample PDF catalogue page

**Outcome:** {PLACEHOLDER: add a verified outcome after client approval; otherwise hide this section}

**Links:** Live site {PLACEHOLDER} · Hide the repo link if empty.

**Next project →** link at the bottom of every case study, cycling through the projects.

### 6.5 About page (`/about`)
Work-focused, playful in tone but professional. **No personal-life content for now.**

- **Intro:** a longer version of the home intro. {PLACEHOLDER: I'll provide or approve the final About text.} Draft from the home intro tone and do not add personal facts.
- **Photo:** {PLACEHOLDER}
- **Education:** B.E. Computer Engineering · Savitribai Phule Pune University · 2027. **Do not mention any college name.**
- **Experience timeline:**
  - **Thavare** · Website Development & Maintenance · Jun 2026 to Present
    Website maintenance and development; Shopify API integrations; contributing to payment-related work with Razorpay and shipping and fulfilment workflows with Shiprocket; add-ons, workflow improvements and functionality refinements. (Frame as contributions; never imply I own or built the whole platform.)
  - **Being Relevant** · Web Development & UI/UX Intern · Feb to Mar 2026
    Created and refined UI/UX designs in Figma; built the Christ TCEA authentication page in HTML, CSS and Tailwind CSS; worked on Wix Studio collection pages for a corporate gifting site; improved CTA placement and page presentation. (**This is the only place UI/UX and Figma appear.**)
- **Skills**, shown in three honest tiers:
  - **Used in projects:** HTML, CSS, JavaScript, React, TypeScript (VIVIN), Tailwind CSS, TanStack Start, Wix Studio, WordPress, WooCommerce, Shopify, Shopify APIs, Supabase, MySQL, Cloudflare R2, Firebase Hosting, Vercel, GitHub, Razorpay & Shiprocket (integration work)
  - **Workflow & tools:** Claude Code, Windsurf, GitHub-based version control and deployment, environment configuration and build troubleshooting, third-party APIs and cloud services
  - **Currently learning:** MERN stack, Java, and stronger JavaScript, React, TypeScript, backend, database and debugging fundamentals
- **How I work:** {PLACEHOLDER: short section, to be written with me}
- Footer CTA as usual.

### 6.6 Contact page (`/contact`)
- Heading: **Let's build something.**
- Subline: *I'm available for freelance projects: websites, web apps and e-commerce stores.*
- Form fields: name, email, project type (Website · Web App · E-commerce · Something else), message. Validate on the client side.
- Form submission: build the UI and a Next.js route handler stub; leave the email provider unconnected with a clear TODO and env var placeholders. **Do not** hard-code any API keys.
- Also show: email {PLACEHOLDER}, socials (GitHub, LinkedIn) {PLACEHOLDER}, résumé download {PLACEHOLDER}.
- The status line with live Pune time, the same as in the footer.
- Freelance only. Do not mention jobs or internships.

---

## 7. The 3D desk scene

A stylised night-time desk scene that runs through the home page and is driven by scroll.

**Style (this keeps it professional):** minimal, clean clay or low-poly look; muted colours plus the shifting neon accent on the monitor glow and lamp. Not cartoonish or anime. Small, believable motion only.

**Scene contents:** a desk, a monitor (its screen is a texture plane for project previews), a keyboard, a lamp, a chair, a few small objects and the character.

**Character states, mapped to scroll with GSAP ScrollTrigger:**
| Scroll position | State |
|---|---|
| Hero | Asleep with his head on the desk; monitor glowing |
| Intro | Wakes up and stretches; camera eases closer |
| Selected Work | Typing; camera pushes toward the monitor, which shows the hovered project's preview |
| What I Do / Stack | Camera orbits slightly; typing idle |
| Footer | Leans back and waves |

**Implementation:**
- Load the character and desk as a **GLB from `/public/models/`** (Draco-compressed), with named animation clips: `sleep`, `wake`, `type`, `idle`, `wave`. I'll supply the final model later (Blender or Mixamo).
- **Until then, build a placeholder scene from simple primitives** (blocky desk, monitor and a simple stylised figure) with the same state interface, so swapping in the real GLB only means changing the model file and the clip names in one config.
- The monitor screen accepts an image or video texture and crossfades between previews.
- Render the canvas fixed behind the content, lazy-load it after the preloader, and cap pixel ratio at about 1.5.

---

## 8. Performance, mobile and accessibility

- **Mobile and low-power:** below 768px, or when the device is low on memory or cores, **don't load the 3D canvas.** Show a pre-rendered image or short muted looping video of the scene instead (placeholder for now). Selected Work shows inline thumbnails.
- **`prefers-reduced-motion`:** disable smooth scroll, the 3D animation (show a static frame), page-transition motion and the velocity glow, and keep sound off.
- Semantic HTML, keyboard-navigable nav and forms, visible focus states, alt text from the data files and sufficient contrast on the dark theme.
- Target a strong Lighthouse score on mobile: lazy-load heavy assets and use `next/image`.
- **SEO:** per-page metadata, Open Graph tags (generated or placeholder OG images), sitemap and robots.

---

## 9. Placeholders

- Every unknown is written as `{PLACEHOLDER: ...}` in the data files, so I can search for and replace them all.
- Placeholder images are neutral gradient blocks labelled with what they stand for (for example, "VIVIN · Admin import screen"). Do not use random stock photos.
- Links that aren't ready point to `#` and are visually marked during development.
- Add a `CONTENT_TODO.md` listing every placeholder by file and line.

---

## 10. Build phases (stop after each one)

1. **Foundation:** Next.js + TS + Tailwind setup, design tokens, fonts, layout, header and footer, Lenis + GSAP wiring, scroll-reactive accent, custom cursor and page transitions.
2. **Content layer:** data files (projects, experience, skills, site copy) with every placeholder in place.
3. **Pages:** Home sections (without 3D), Work with filters, case study template (VIVIN plus the short ones), About and Contact.
4. **3D scene:** placeholder desk and character, scroll-driven states, monitor previews on hover, preloader tied to loading, and the mobile and reduced-motion fallbacks.
5. **Sound and polish:** Howler sounds and toggle, micro-interactions and animation timing.
6. **Ship-ready:** accessibility pass, performance pass, SEO, `CONTENT_TODO.md` and Vercel deploy config.

Start with Phase 1. Before writing code, give me a short plan of the folder structure and confirm you've understood the rules in section 1.
