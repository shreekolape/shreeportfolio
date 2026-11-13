# Content TODO

Everything else is filled in. Only these three things are still open.

---

## 1. Being Relevant live link

**Where:** `content/projects.ts`, the Being Relevant entry (`liveUrl: null`).

Until the link arrives, its case study hides the "Live site" button and the gallery, and the
cover is a typographic cover (title, category, accent gradient).

When you send the link:

1. Set `liveUrl` to it.
2. Capture its cover and 3–4 gallery screenshots of public pages at 1600×900, saved as
   `public/projects/being-relevant/cover.webp` and `gallery-1.webp`, `gallery-2.webp`, …
   (same rules as the other projects: never log in, no admin/account pages or personal data).
3. Point `cover` and `previewMedia` at `cover.webp`, and fill `gallery` with a short caption each.

## 2. Resend setup (contact form)

The sending code is done. Follow `CONTACT_SETUP.md` to create a Resend API key and set
`RESEND_API_KEY` and `CONTACT_TO_EMAIL` locally (`.env.local`) and on Vercel. Until then the
form shows its fallback message and asks people to email instead.

## 3. Custom domain

Once you have one, set `NEXT_PUBLIC_SITE_URL` (e.g. `https://yourdomain.com`) on Vercel, then
redeploy. Until then canonical links, Open Graph tags and the sitemap use Vercel's production
domain automatically.
