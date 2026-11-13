# Placeholder Fixes: My Answers to Your Audit

Your numbering from the audit is used below. All earlier rules still apply: never invent facts about my work, all copy lives in content data files, no push until I've reviewed.

## Order of work
1. **Pass B first:** finish the Pass B work that's uncommitted in the working tree (the About and Contact scenes, phone prop, B4 transition colours and B5 fallbacks), run the reachable-transitions clipping check, and commit as "master: day cycle". If something isn't finished, commit it as "wip: day cycle" and tell me what's left.
2. **Then the fixes below**, in one pass. Commit as "placeholder fixes".
3. **Don't push.** I'll review and push myself.

---

## Home

**#1 What I Do mockups:** yes, design invented concept screens. One per row: café menu, magazine cover layout, startup hero with a sign-up field, clinic page with timings and a "Book" button, real-estate listing grid with filters, and a chat assistant on a generic business site. Invented names only, no real brands, a small "Concept" label in a corner ("Coming soon" for AI Agents). They should be clean and modern and look good as monitor textures and as mobile thumbnails.

**#2 Fallback still:** yes. Render a still of the 3D desk scene at night (character asleep, lamp on) and use it as the mobile, reduced-motion and low-power fallback. Alt text: "Illustration of Shree asleep at his desk late at night, monitor and lamp glowing."

## Work page and case studies

**Status field** (#4, #10, #13, #17, #19). Set these exact values:
- VIVIN: **Live · ongoing development**
- MittiNav: **Live**
- Christ TCEA: **Live**
- Swamini Foods: **Launched · since updated by another developer**
- Being Relevant: **Delivered**

**#3 Being Relevant cover:** there's no screenshot yet. Replace the grey block with a clean typographic cover: "Being Relevant" in the heading font, the category underneath and a subtle accent gradient, so it looks deliberate rather than missing. Use the same treatment anywhere a project has no image.

**#5 VIVIN badges:** remove the Shipped/In progress badges completely. Keep the "What I worked on" list as written; its "worked on" wording is already accurate.

**#6 VIVIN approaches:** remove the three "Approach" placeholders. Keep the three challenge descriptions, under the heading **"Engineering challenges I worked through."** I'll send approach text later.

**#7 VIVIN gallery:** hide it until I send screenshots.

**#8 Outcome:** keep hidden.

**#9, #11, #15 repo links:** keep hidden. These are client repos.

**#12, #16, #21 empty galleries:** keep hidden.

**#14 Christ TCEA link:** confirmed correct. https://beingrelevant.ai/ serves the Christ TCEA site itself (page title "Totally Controlled Environment Agriculture | Christ"). Keep it.

**#18 Swamini gallery:** remove the grey block and hide the gallery.

**#20 Being Relevant live link:** hide the "Live site" button until I send a link.

**General rule:** any section with no real content is hidden. No grey blocks and no `{PLACEHOLDER` text may render anywhere on the live site.

## About

**#22 Photo:** remove the photo slot completely. The About page's 3D `relax` scene already represents me, so a separate photo isn't needed. Remove its alt text too.

## Contact

**#23 Résumé:** the PDF is included in this package at `public/resume/Shree-Kolape-Resume.pdf`. Link the "Download résumé ↓" button to it with the `download` attribute.

**#24 Contact form:** yes, use **Resend**. Write the sending code now:
- Environment variables: `RESEND_API_KEY`, `CONTACT_TO_EMAIL` and `CONTACT_FROM_EMAIL`. Default `CONTACT_FROM_EMAIL` to `Portfolio <onboarding@resend.dev>` when it's not set. This sender works without a custom domain, as long as `CONTACT_TO_EMAIL` is the email address of my Resend account.
- Use the **client's email as reply-to**. Subject: `New project enquiry from {name}`.
- Keep the validation, honeypot and rate limit.
- When the API key is missing, log a clear server error and show the existing fallback message, so the page never crashes.
- Update `.env.example` and write `CONTACT_SETUP.md` with step-by-step instructions for setting this up locally and on Vercel.

## Site-wide

**#25 Copy you wrote:** approved. In your final summary, list each piece of wording once so I can skim it.

**#26 Debug viewer:** limit `?debug=bounds` and `DebugBounds` to development only.

**#27 Site URL:** until I set `NEXT_PUBLIC_SITE_URL`, fall back to Vercel's `VERCEL_PROJECT_PRODUCTION_URL` (prefixed with `https://`), then `VERCEL_URL`, then localhost, so canonical links, OG tags and the sitemap use the real production address.

## Assets

**#28 Sounds:** keep the current ones for now. Make sure they're short and quiet.

**#29 3D model:** keep the hand-built character. Keep the GLB slot in the config for a possible future model, but make sure nothing tries to load a missing file.

## CONTENT_TODO.md

**#30–32:** fix the outdated line numbers, remove rows that are already done, and add the missing ones. After this pass, the file should list only:
- Things I still owe you: VIVIN approaches, gallery screenshots, the Being Relevant link and image, the Outcome, and the custom domain
- The Resend setup I need to do

## Done means
- A search for `{PLACEHOLDER` returns nothing in any file that renders on the site
- No grey placeholder blocks are visible anywhere
- Typecheck, lint and `npm run build` all pass on the first run
- Both commits are made, and nothing is pushed
- You send me a short summary plus screenshots of the What I Do mockups and the mobile fallback image
