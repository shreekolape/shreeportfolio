# Contact form setup (Resend)

The contact form sends each enquiry to your inbox through [Resend](https://resend.com).
The code is already in place (`app/api/contact/route.ts`); it only needs an API key and
your email address. Until those are set, the form shows its fallback message
("Something went wrong sending that. Please email me instead.") and never breaks the page.

Each email arrives with:

- **Subject:** `New project enquiry from {name}`
- **Reply-to:** the visitor's email, so you can just hit Reply
- **Body:** name, email, project type and message

Spam protection that's already built in: field validation, a hidden honeypot field, and a
limit of 5 enquiries per 10 minutes per visitor.

---

## 1. Create a Resend account and API key

1. Sign up at https://resend.com, using the email address you want enquiries sent to.
2. Go to **API Keys** → **Create API Key**.
3. Name it (e.g. `portfolio`), set permission to **Sending access**, and create it.
4. Copy the key (it starts with `re_`). Resend shows it only once.

## 2. Run it locally

1. In the project folder, copy `.env.example` to `.env.local`.
2. Fill in:

   ```
   RESEND_API_KEY=re_your_key_here
   CONTACT_TO_EMAIL=the-email-you-signed-up-to-resend-with@example.com
   ```

   Leave `CONTACT_FROM_EMAIL` empty for now (see "About the sender" below).
3. Restart the dev server (`npm run dev`) so it picks up the new variables.
4. Open http://localhost:3000/contact, send a test message, and check your inbox
   (and spam folder the first time).

`.env.local` is ignored by Git, so your key is never committed.

## 3. Set it up on Vercel

1. Open your project on Vercel → **Settings** → **Environment Variables**.
2. Add each variable for the **Production** environment (and **Preview** too if you
   want the form to work on preview deployments):

   | Name               | Value                                      |
   | ------------------ | ------------------------------------------ |
   | `RESEND_API_KEY`   | your `re_…` key                            |
   | `CONTACT_TO_EMAIL` | your Resend account's email address        |
   | `CONTACT_FROM_EMAIL` | *(optional; see below)*                  |

3. Redeploy (Deployments → the latest one → **Redeploy**). Environment variables only
   apply to new deployments.
4. Send a test message from the live Contact page.

## About the sender (`CONTACT_FROM_EMAIL`)

- **Without a custom domain** (the default): leave `CONTACT_FROM_EMAIL` unset. Emails are sent
  from `Portfolio <onboarding@resend.dev>`. Resend only allows this shared sender to deliver to
  **your own Resend account's email**, so `CONTACT_TO_EMAIL` must be that address.
- **With your own domain:** in Resend, go to **Domains** → **Add Domain**, add the DNS records it
  shows at your domain registrar, and wait for it to verify. Then set, for example,
  `CONTACT_FROM_EMAIL=Portfolio <hello@yourdomain.com>`. You can then deliver to any address.

## Troubleshooting

- **The form says "Something went wrong…"**: check the server logs (locally, the terminal
  running `npm run dev`; on Vercel, the project's **Logs** tab). Every failure logs a line
  starting with `[contact]` that says what's wrong:
  - `RESEND_API_KEY is not set` / `CONTACT_TO_EMAIL is not set`: add the variable, then restart
    or redeploy.
  - `Resend rejected the message: 403 …`: usually the default sender sending to an address other
    than your Resend account's email. Use that email, or verify a domain.
  - `Resend rejected the message: 401 …`: the API key is wrong or was deleted; create a new one.
- **Nothing arrives, but no error:** check your spam folder, and Resend's **Emails** page,
  which lists every message it accepted.
