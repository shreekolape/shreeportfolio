# Master Prompt: Content, Fixes & Day Cycle

This replaces `claude-code-update-3.md` and every update message I've pasted since it. If they conflict, **this file wins**. Rules from `claude-code-prompt.md` still apply: never invent content, all copy lives in content data files, don't touch what isn't listed, no GitHub account, no remote, no push.

**Don't change the character's look or rig.** Only add the new `relax` and `phone` poses in Pass B.

---

## Step 0: Status report (no code changes)

List in short bullets which items below are already **done**, **partly done** or **not done** in the current code. Then do Pass A and Pass B. **Commit after each pass and stop for my review.**

---

# PASS A: Content and fixes

## A1. Project links and monitor previews

`public/projects/` contains one 16:9 WebP screenshot per project (1600×900).

| Project | Live URL | Image |
|---|---|---|
| VIVIN | https://www.vivin.shop/ | `/projects/vivin/cover.webp` |
| MittiNav | https://www.mittinav.com/ | `/projects/mittinav/cover.webp` |
| Christ TCEA | https://beingrelevant.ai/ | `/projects/christ-tcea/cover.webp` |
| Swamini Foods | https://swaminifoods.in/ | `/projects/swamini-foods/cover.webp` |
| Being Relevant | {PLACEHOLDER: link} | {PLACEHOLDER: image} |

- In `/content/projects.ts`, set `liveUrl`, `cover` and `previewMedia` for these four, and remove their entries from `CONTENT_TODO.md`.
- **Monitor hover:** hovering a Selected Work row shows that project's image on the 3D monitor with a short crossfade. Use the correct 16:9 mapping (no stretching), set the texture colour space to sRGB, and make the screen material emissive so the image stays readable in every lighting state.
- Preload all four textures once after the scene loads, so the first hover is instant.
- Use the same images for the mobile inline thumbnails, the Work page covers and the top of each case study (through `next/image`).
- Live links open in a new tab (`target="_blank" rel="noopener noreferrer"`) with the cursor's "Open" label.
- Project galleries stay as placeholders for now.

## A2. Selected Work
- Featured, in this order: **VIVIN, MittiNav, Christ TCEA, Swamini Foods**. Being Relevant is no longer featured but stays on the Work page.
- Keep the Swamini Foods case-study note: *"This case study covers my original build. The site has since been updated by another developer."*

## A3. Christ TCEA label
The live site calls itself **Controlled Environment Agriculture**, not permaculture.
- Category: **Controlled Environment Agriculture Platform**
- Overview: "a controlled environment agriculture website and platform with authentication, daily activity logs, nursery batch tracking and a file library."
- Remove the word "permaculture" everywhere.

## A4. Footer email
- Show only the word **Email** as the link (`mailto:` to my address from content data). The full address must not appear in the footer.
- Next to it, a small copy icon that copies the address and briefly shows "Copied", with `aria-label="Copy email address"`.

## A5. Status line (footer and Contact page)
Replace all existing lines with these, chosen by the current hour in `Asia/Kolkata`, updating every minute without a reload. **No line ending "so I'll probably reply after I wake up" may remain anywhere in the code.**

| Pune time | Line |
|---|---|
| 00:00–04:59 | 🟢 Available for freelance projects · it's {HH:MM} in Pune, peak bug-fixing hours. |
| 05:00–09:59 | 🟢 Available for freelance projects · it's {HH:MM} in Pune. The bugs are asleep, and I might be too. |
| 10:00–17:59 | 🟢 Available for freelance projects · it's {HH:MM} in Pune, probably mid-deploy. |
| 18:00–23:59 | 🟢 Available for freelance projects · it's {HH:MM} in Pune, the night shift is warming up. |

## A6. Home intro
Replace the intro under the hero with:
> I'm Shree. I help businesses get a website that does its job: easy for customers to use, simple for the team to manage, and reliable long after launch. I start with how your business works, build around it, and stay around to keep improving it.

Keep the "More about me →" link.

## A7. About page
Remove the old intro and every `{PLACEHOLDER}` on this page except the photo.

**About intro:**
> I'm Shree, a web developer from Pune and a final-year Computer Engineering student. I started building websites for real businesses while still in college, and that shaped how I work. A website isn't just a design or a codebase. It's something a business depends on to sell, take orders and explain what it does.
>
> So I start with the business, not the tech. Who are your customers, what should they be able to do, and what's slowing your team down today? Then I build the simplest thing that solves it well, keep you in the loop as it takes shape, and make sure it's easy to run once it's live.
>
> What I enjoy most is the moment a messy process becomes simple: a spreadsheet turns into a dashboard, an enquiry turns into an order, a confusing page turns into one people actually use.
>
> Right now I'm finishing my degree, working on a live e-commerce store and taking on freelance projects. Alongside that, I'm learning to build with AI properly (LLMs, retrieval and AI agents) and studying system design, so the next things I build are smarter and still well engineered. And yes, a lot of it happens late at night.

**How I work** (four numbered items, same list style as Selected Work):
1. **Understand the business first.** What you sell, who it's for and what the site has to do, before any design or code.
2. **Choose what fits, not what's trendy.** The right approach depends on your goals, your budget and how much you want to manage yourself.
3. **Show progress early.** You see working pages along the way, so feedback lands before changes get expensive.
4. **Stick around after launch.** Fixes, improvements and new features, so the site keeps up with the business.

## A8. Skills
- Remove **HTML, CSS and JavaScript** from "Used in projects" and from the home stack strip.
- Replace "Currently learning" with two groups:
  - **AI engineering:** LLM integration, RAG (embeddings and vector databases), AI agents and tool calling, evaluating AI output
  - **Engineering foundations:** System design, backend and API design, database design, testing and clean architecture

## A9. What I Do
Heading: **Things I can build for you**. Numbered rows 01 to 10, in this order:

1. **Cafés & Restaurants:** Menus that make people hungry, with table bookings and orders straight to WhatsApp.
2. **Magazines & Blogs:** Editorial sites with bold layouts, categories and an easy CMS so you can publish without me.
3. **Online Stores & D2C Brands:** Product pages, carts, payments and shipping, from 9 products to 700+. *(Proof: "See Swamini Foods →" to /work/swamini-foods)*
4. **Startup & Product Launches:** Landing pages that explain your idea in one scroll and collect sign-ups.
5. **Clinics & Local Businesses:** Services, timings, location and booking enquiries, simple and trustworthy.
6. **Business Dashboards:** Custom admin panels for products, orders, imports and reports. *(Proof: "See VIVIN →" to /work/vivin)*
7. **B2B & Wholesale Catalogues:** Large product catalogues with categories, bulk pricing, quantity rules and downloadable PDF catalogues. *(Proof: "See VIVIN →" to /work/vivin)*
8. **NGOs & Impact Projects:** Sites that explain your mission, show your work on the ground and make it easy for people to get involved. *(Proof: "See MittiNav →" to /work/mittinav)*
9. **Real Estate & Property Listings:** Filterable property listings with photo galleries and an enquiry form for every property.
10. **AI Agents for Business** · tag **Coming soon**: Assistants that answer customer questions from your own content, qualify leads and handle routine tasks, so your team can focus on the work that matters.

- **Row 10 styling:** same layout as the others, with a small "Coming soon" pill in the accent colour beside the title. Row text is dimmed to about 70% opacity. Not clickable, no proof link, no "View" cursor label.
- **Monitor mockups:** each row shows a concept mockup on the monitor on hover. Create the missing ones (B2B catalogue, NGO, real estate, and a chat assistant on a generic business site for row 10). Use invented names only and a "Concept" label in the corner ("Coming soon" for row 10). No real brands or client names. On mobile, show them as inline thumbnails.
- The only proof links are the ones listed above. Don't add "delivered" or "trusted by" claims to the others.

## A10. Page transition fix
Right now the new page shows before the overlay covers it (or the overlay lags), so you see the page and then a black fade. Rebuild it so the order is always:

1. **Cover:** on clicking an internal link, prevent default navigation and animate the overlay in until it fully covers the screen (about 350 ms).
2. **Navigate:** only then call `router.push()`.
3. **Wait:** keep the overlay fully opaque until the new route has mounted (a `usePathname()` change in the provider, then one `requestAnimationFrame`). Reset scroll to top while covered (Lenis `scrollTo(0, { immediate: true })`).
4. **Reveal:** animate the overlay out (about 450 ms).

Also:
- **Speed:** prefetch all nav routes and featured case studies on mount (`router.prefetch`). The 3D canvas and heavy assets must never block route rendering.
- **One system:** a single `TransitionProvider` and `TransitionLink` used by every internal link (nav, Selected Work, "See all work", "More about me", proof links, "Next project", footer). Remove any other route-change animation.
- **Guards:** ignore clicks on the current route and new clicks during a transition. Let modifier and middle clicks and external links behave normally.
- **Back/forward:** skip the cover step and just do a quick reveal.
- **Fallback:** if the route hasn't mounted after 3 s, reveal anyway.
- **Reduced motion:** instant swap, no overlay.
- Test every route pair in both directions and confirm the new page never flashes before the cover.

**Finish Pass A:** update the matching sections of `claude-code-prompt.md`, commit as "master: content and fixes", list the changes and stop.

---

# PASS B: Day cycle (midnight to midnight)

**Current bug:** scrolling the home page from header to footer, everything stays dark. The day cycle is either missing or not visible.

## B1. Diagnose first, then report
Find and tell me the actual cause before fixing. Check at least:
1. Does the day-cycle code exist at all?
2. Is there a single `timeOfDay` value (0 to 1), and does it change on scroll? Add a **dev-only** overlay in the corner showing `timeOfDay`, the current section and the scene state. Remove it before the final commit.
3. Is the ScrollTrigger that drives it set up after Lenis and the preloader, with `ScrollTrigger.refresh()` called once the page and canvas have loaded? A trigger created before the preloader finishes often gets the wrong start and end points.
4. Do the lights, sky and lamp actually read `timeOfDay` every frame, or only on mount?
5. **Is the 3D canvas visible during the whole scroll?** If later home sections have opaque dark backgrounds, they cover the fixed canvas and you'll only ever see the dark night hero. Sections over the scene must be transparent or only lightly tinted.
6. Is the window with the sky inside the camera's view at every scroll point?

## B2. Build it so the change is clearly visible

| Scroll | Time | Scene |
|---|---|---|
| Hero | Midnight | Asleep, room dark, lamp on, moon in the window |
| Intro | Sunrise | Wakes and stretches, warm orange light through the window |
| Selected Work | Day | Typing in bright, clean daylight; monitor shows the hovered project |
| What I Do / Stack | Evening | Golden-hour light, sun setting |
| Footer | Midnight again | Lamp on, moon out, leans back and waves |

- **Window:** a clearly visible window behind the desk, always in frame. Its sky gradient follows `timeOfDay` (deep navy → dawn orange and pink → bright sky blue → golden amber → navy), and the sun and moon travel across it.
- **Lighting:** the key light, ambient light and a sunlight beam through the window follow `timeOfDay`. **Daytime must look clearly bright:** desk, character and room well lit, soft shadows. Night is dark with the lamp as the main light. Mug steam appears at sunrise and day. The lamp is on at night and off by day.
- **Smoothness:** all changes interpolate smoothly. No jumps between sections.
- **Page background:** the site stays dark for readability, but add a very subtle tint behind the content that follows `timeOfDay`, so the whole page feels the time change. Keep it dark at every point: night about `#0B0D12`, sunrise about `#15110F`, day about `#12161C`, evening about `#16120D`. Text contrast must stay WCAG AA at every point.
- The scroll-reactive accent (cyan → violet → magenta, glow by velocity) is unchanged.

## B3. Other pages
- **Work and case studies:** "working hours." No 3D. Background uses the day tint (`#12161C`).
- **About:** golden hour. A small 3D close-up of the character leaning back, relaxed (new `relax` pose). Background uses the evening tint.
- **Contact:** night. Lamp on, the character at the desk looking at the phone in his hand (new `phone` pose). Background uses the night tint.
- About and Contact reuse the same character and props with a different camera framing, lazy-loaded, with the same mobile and reduced-motion fallbacks (a static image or still frame).
- Run the clipping check on `relax` and `phone`.

## B4. Transition colour
Keep the A10 mechanics, and give the overlay a sky gradient matching the **destination** page's time: midnight navy for Home, daylight blue for Work and case studies, golden for About, night navy for Contact.

## B5. Mobile and reduced motion
On mobile and in reduced motion, there's no 3D, but the background tint still follows scroll on Home, and each section's fallback image matches its time of day where available.

**Finish Pass B:**
1. Tell me what the cause in B1 was.
2. Take screenshots of the home page at **midnight (hero), sunrise (intro), day (Selected Work), evening (What I Do) and the footer**, plus the About and Contact scenes. The day screenshot must look clearly bright.
3. Update `claude-code-prompt.md`, commit as "master: day cycle" and stop.
