# Content TODO

Everything still to fill in before launch. Search the repo for `{PLACEHOLDER` to find
all text placeholders. While one is unfilled it shows on the page with a dashed amber
outline, and links that aren't ready point to `#` and get a dashed outline in development.

Line numbers are as of the Phase 6 commit; they shift as you edit.

---

## 1. Text and links

### Site-wide: `content/site.ts`

| Line | What | Notes |
| ---- | ---- | ----- |
| 54 | Email address | Used in the footer and on Contact (mailto). |
| 56 | GitHub profile URL | Footer + Contact. |
| 57 | LinkedIn profile URL | Footer + Contact. |
| 49 | Alt text for the desk scene still | See media below. |

### About: `content/about.ts`

| Line | What | Notes |
| ---- | ---- | ----- |
| 8–17 | **Approve or replace the About intro** | Draft built only from facts in the brief. When it's final, set `approved: true` (line 10) to remove the dev-only "draft" marker. |
| 34 | "How I work" section | To be written together. |
| 23 | Photo alt text | Goes with the photo below. |

### Contact: `content/contact.ts`

| Line | What | Notes |
| ---- | ---- | ----- |
| 29 | Résumé PDF path | Put the file in `/public` (e.g. `/public/resume.pdf`) and set `href: "/resume.pdf"`. |

### Projects: `content/projects.ts`

| Line | Project | What |
| ---- | ------- | ---- |
| 31 | VIVIN | Project status |
| 33 | VIVIN | Live site URL |
| 34 | VIVIN | Repo URL (leave `""` to hide the link) |
| 67, 72, 77, 82, 87, 92, 97 | VIVIN | "What I worked on" badges: set each to `"Shipped"` or `"In progress"` |
| 105 | VIVIN | Challenge 1 approach (Excel imports) |
| 111 | VIVIN | Challenge 2 approach (PDF catalogues) |
| 117 | VIVIN | Challenge 3 approach (production deployments) |
| 122–123 | VIVIN | Outcome: add **only after client approval**; keep `null` to hide the section |
| 138 | MittiNav | Project status |
| 140 | MittiNav | Live site URL |
| 141 | MittiNav | Repo URL (leave `""` to hide) |
| 170 | Being Relevant | Project status |
| 172 | Being Relevant | Live site URL |
| 204 | Christ TCEA | Project status |
| 206 | Christ TCEA | Live site URL |
| 207 | Christ TCEA | Repo URL (leave `""` to hide) |
| 237 | Swamini Foods | Project status |

Swamini Foods intentionally has **no live link** (`liveUrl: null`), because the current site
has been changed by another developer. Being Relevant and Swamini Foods have no repo link.

---

## 2. Media files

Each item below currently renders as a neutral labelled gradient block. To swap one in, put
the file in `/public` (e.g. `/public/work/vivin/cover.jpg`), then replace that
`placeholderMedia("…")` call with
`{ type: "image", src: "/work/vivin/cover.jpg", alt: "…", label: "…" }`.
Use `type: "video"` for short muted loops (good for monitor previews).

| File: line | Slot |
| ---------- | ---- |
| `content/projects.ts:35` | VIVIN · Cover |
| `content/projects.ts:36` | VIVIN · Monitor preview (plays on the 3D monitor / mobile thumbnail) |
| `content/projects.ts:38` | VIVIN · Storefront category page |
| `content/projects.ts:39` | VIVIN · Product listing |
| `content/projects.ts:40` | VIVIN · Admin import screen |
| `content/projects.ts:41` | VIVIN · Sample PDF catalogue page |
| `content/projects.ts:142` | MittiNav · Cover |
| `content/projects.ts:143` | MittiNav · Monitor preview |
| `content/projects.ts:144` | MittiNav · Gallery (currently empty; add items to show the section) |
| `content/projects.ts:174` | Being Relevant · Cover |
| `content/projects.ts:175` | Being Relevant · Monitor preview |
| `content/projects.ts:176` | Being Relevant · Gallery (currently empty) |
| `content/projects.ts:208` | Christ TCEA · Cover |
| `content/projects.ts:209` | Christ TCEA · Monitor preview |
| `content/projects.ts:210` | Christ TCEA · Gallery (currently empty) |
| `content/projects.ts:242` | Swamini Foods · Cover: **your own screenshot of the original build** |
| `content/projects.ts:243` | Swamini Foods · Preview: original build |
| `content/projects.ts:246` | Swamini Foods · Original build screenshot(s) |
| `content/about.ts:22` | Your photo |
| `content/site.ts:48` | Desk scene still/loop for mobile, low-power and reduced motion |

---

## 3. Assets that aren't text

- **3D model**: `public/models/desk-scene.glb` with clips `sleep`, `wake`, `type`, `idle`,
  `wave` and a mesh named `Screen`. Then set `model.enabled = true` in
  `components/three/sceneConfig.ts`. Details: `public/models/README.md`.
- **UI sounds**: the four clips in `public/sounds/` are generated placeholders. Replace
  them with the same file names. Details: `public/sounds/README.md`.

---

## 4. Copy written during the build, for your approval

These aren't `{PLACEHOLDER}`s because the UI needs some wording to work, but they weren't
in the brief:

- Contact form messages (`content/contact.ts`): field errors, "Send", "Sending…", the success
  message and "Something went wrong sending that. Please email me instead."
- 404 page (`content/labels.ts`): "Page not found." and "Back to home →".
- Work page meta description (`app/work/page.tsx`): "Client projects: VIVIN, MittiNav, …",
  built from the project list.
- Case-study and About section labels (`content/labels.ts`, `content/about.ts`).

---

## 5. Configuration (Vercel → Settings → Environment Variables)

See `.env.example`.

- `NEXT_PUBLIC_SITE_URL`: set once there's a custom domain (Vercel's production URL is
  used until then).
- `CONTACT_PROVIDER_API_KEY`, `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL`: plus the send call
  in `app/api/contact/route.ts` (marked `TODO`). Until then the form honestly shows its
  error message.
