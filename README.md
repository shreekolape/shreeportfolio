# Shree Kolape: portfolio

Next.js 16 (App Router, Cache Components) · TypeScript · Tailwind CSS v4 · GSAP + ScrollTrigger ·
Lenis · React Three Fiber + drei · Howler.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
npm run start      # serve the production build
npm run lint
npm run typecheck
```

Requires Node.js 20.9 or newer.

## Editing content

All copy and data live in `content/`. Components only read from it.

| File | What's in it |
| ---- | ------------ |
| `content/site.ts` | Name, pitch, nav, footer, status line, preloader, email/socials |
| `content/home.ts` | Hero, intro, Selected Work and What I Do copy |
| `content/projects.ts` | All projects and case studies (`featured: true` = on the home page) |
| `content/experience.ts` | Education and experience timeline |
| `content/skills.ts` | Skill tiers (About) and the stack marquee (Home) |
| `content/about.ts` / `content/contact.ts` | About and Contact page copy |
| `content/labels.ts` | Small UI labels (case-study headings, 404) |

**Still to come.** `CONTENT_TODO.md` lists the few things not yet available (and what to do when
they arrive). Sections with no real content are hidden rather than shown empty.

**Images.** A project with no cover image yet (`src: null`) renders a typographic cover (its title,
category and an accent gradient). Point `src` at a file in `/public` to replace it.

## Where things live

- `components/three/sceneConfig.ts`: the 3D model path, clip names, screen mesh and camera shots
  (see `public/models/README.md`).
- `providers/`: motion preferences, smooth scroll (Lenis ↔ ScrollTrigger), scroll-reactive accent,
  sound, page transitions.
- `lib/motion.ts`: shared animation timing.
- `app/api/contact/route.ts`: contact form endpoint (email provider not connected yet).
- `proxy.ts`: returns a real 404 for unknown `/work/<slug>` URLs.

The 3D canvas only loads on desktop-class devices. Small screens, low-power devices,
`prefers-reduced-motion` and WebGL failures get the static scene image and inline thumbnails.

## Deploying to Vercel

No `vercel.json` is needed: Vercel detects Next.js. Headers (security and asset caching) are set
in `next.config.ts`.

1. Push this repo to GitHub.
2. In Vercel, **Add New → Project**, import the repo and keep the defaults (Framework: Next.js,
   build `next build`).
3. Add environment variables from `.env.example`. All are optional for a first deploy:
   - `NEXT_PUBLIC_SITE_URL`: once you have a custom domain (until then the Vercel production URL
     is used for canonical links, Open Graph, sitemap and robots).
   - `CONTACT_*`: once an email provider is wired into `app/api/contact/route.ts`.
4. Deploy. Each push to the main branch redeploys; other branches get preview URLs.
