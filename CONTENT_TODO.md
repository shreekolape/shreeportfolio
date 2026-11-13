# Content TODO

Everything still to fill in before launch. Search the repo for `{PLACEHOLDER` to find
all text placeholders. While one is unfilled it shows on the page with a dashed amber
outline, and links that aren't ready point to `#` and get a dashed outline in development.

Line numbers are as of the "content and fixes" update commit; they shift as you edit.

---

## 1. Text and links

### Site-wide: `content/site.ts`

| Line | What | Notes |
| ---- | ---- | ----- |
| — | Email address | Already set. Used in the footer ("Email" link + copy button) and on Contact. |
| — | GitHub / LinkedIn URLs | Already set. |
| 60ish | Alt text for the desk scene still | See media below. |

### Contact: `content/contact.ts`

| Line | What | Notes |
| ---- | ---- | ----- |
| 29 | Résumé PDF path | Put the file in `/public` (e.g. `/public/resume.pdf`) and set `href: "/resume.pdf"`. |

### Projects: `content/projects.ts`

VIVIN, MittiNav, Christ TCEA and Swamini Foods now have real live URLs and cover images.
Only Being Relevant and a few per-project details are still open:

| Line | Project | What |
| ---- | ------- | ---- |
| 37 | VIVIN | Project status |
| 40 | VIVIN | Repo URL (leave `""` to hide the link) |
| 73, 78, 83, 88, 93, 98, 103 | VIVIN | "What I worked on" badges: set each to `"Shipped"` or `"In progress"` |
| 111 | VIVIN | Challenge 1 approach (Excel imports) |
| 117 | VIVIN | Challenge 2 approach (PDF catalogues) |
| 123 | VIVIN | Challenge 3 approach (production deployments) |
| 129 | VIVIN | Outcome: add **only after client approval**; keep `null` to hide the section |
| 144 | MittiNav | Project status |
| 147 | MittiNav | Repo URL (leave `""` to hide) |
| 177 | Christ TCEA | Project status |
| 180 | Christ TCEA | Repo URL (leave `""` to hide) |
| 210 | Swamini Foods | Project status |
| 243 | Being Relevant | Project status |
| 245 | Being Relevant | Live site URL |
| 247–248 | Being Relevant | Cover + monitor preview image |

Being Relevant has no repo link (Wix Studio site). Swamini Foods has no repo link either.

---

## 2. Media files

Each item below currently renders as a neutral labelled gradient block. To swap one in, put
the file in `/public` (e.g. `/public/projects/being-relevant/cover.webp`), then replace that
`placeholderMedia("…")` call with
`{ type: "image", src: "/projects/being-relevant/cover.webp", alt: "…", label: "…" }`.
Use `type: "video"` for short muted loops (good for monitor previews).

| File: line | Slot |
| ---------- | ---- |
| `content/projects.ts:34-38` (VIVIN gallery) | Storefront category page · Product listing · Admin import screen · Sample PDF catalogue page |
| `content/projects.ts:150` | MittiNav · Gallery (currently empty; add items to show the section) |
| `content/projects.ts:183` | Christ TCEA · Gallery (currently empty) |
| `content/projects.ts:218` | Swamini Foods · Additional original-build screenshots (one placeholder in the gallery already) |
| `content/projects.ts:247` | Being Relevant · Cover |
| `content/projects.ts:248` | Being Relevant · Monitor preview |
| `content/projects.ts:249` | Being Relevant · Gallery (currently empty) |
| `content/about.ts` | Your photo |
| `content/site.ts` | Desk scene still/loop for mobile, low-power and reduced motion |
| `content/home.ts` (`whatIDo.rows`) | 6 "What I Do" concept mockups (Cafés, Magazines, Startup, Clinics, Real estate, AI agents chat). Invented names/screens only — no real brands or client names. The 4 rows with a proof link (Online Stores, Business Dashboards, B2B Catalogues, NGOs) reuse the real Swamini Foods / VIVIN / VIVIN / MittiNav covers instead. |

---

## 3. Assets that aren't text

- **3D model**: `public/models/desk-scene.glb` with clips `sleep`, `wake`, `type`, `idle`,
  `wave` (plus `relax`/`phone` once those poses exist) and a mesh named `Screen`. Then set
  `model.enabled = true` in `components/three/sceneConfig.ts`. Details: `public/models/README.md`.
- **UI sounds**: the four clips in `public/sounds/` are generated placeholders. Replace
  them with the same file names. Details: `public/sounds/README.md`.

---

## 4. Copy written during the build, for your approval

These aren't `{PLACEHOLDER}`s because the UI needs some wording to work, but they weren't
in a brief verbatim:

- Contact form messages (`content/contact.ts`): field errors, "Send", "Sending…", the success
  message and "Something went wrong sending that. Please email me instead."
- 404 page (`content/labels.ts`): "Page not found." and "Back to home →".
- Work page meta description (`app/work/page.tsx`): "Client projects: VIVIN, MittiNav, …",
  built from the project list.
- Case-study and About section labels (`content/labels.ts`).
- Footer "Copy email address" / "Copied" wording (`content/site.ts`).

---

## 5. Configuration (Vercel → Settings → Environment Variables)

See `.env.example`.

- `NEXT_PUBLIC_SITE_URL`: set once there's a custom domain (Vercel's production URL is
  used until then).
- `CONTACT_PROVIDER_API_KEY`, `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL`: plus the send call
  in `app/api/contact/route.ts` (marked `TODO`). Until then the form honestly shows its
  error message.
