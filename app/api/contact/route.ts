import { toContactPayload, validateContact } from "@/lib/contactSchema";

/**
 * Contact form endpoint: validates the enquiry and emails it via Resend.
 * Setup (local and Vercel): see CONTACT_SETUP.md. Env vars, never hard-coded:
 *   RESEND_API_KEY      Resend API key
 *   CONTACT_TO_EMAIL    where enquiries are delivered
 *   CONTACT_FROM_EMAIL  sender (defaults to Resend's shared test sender, which
 *                       only delivers to the Resend account's own address)
 * Any failure returns a non-2xx status, so the form shows its fallback
 * message ("please email me instead"); the page itself never breaks.
 */

const DEFAULT_FROM = "Portfolio <onboarding@resend.dev>";

// Best-effort rate limit: 5 enquiries per 10 minutes per IP. In-memory, so
// it applies per server instance (enough to stop casual spam on a portfolio).
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear(); // keep memory bounded
  return recent.length > MAX_PER_WINDOW;
}

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (rateLimited(ip)) {
    return Response.json({ ok: false, error: "rate_limited" }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  // Honeypot: real users never fill the hidden "website" field.
  if ((body as Record<string, unknown>)?.website) {
    return Response.json({ ok: true });
  }

  const payload = toContactPayload(body);
  const errors = validateContact(payload);
  if (Object.keys(errors).length > 0) {
    return Response.json({ ok: false, error: "validation", errors }, { status: 422 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL || DEFAULT_FROM;
  if (!apiKey || !to) {
    console.error(
      `[contact] Not sent: ${!apiKey ? "RESEND_API_KEY" : "CONTACT_TO_EMAIL"} is not set. See CONTACT_SETUP.md.`,
    );
    return Response.json({ ok: false, error: "not_configured" }, { status: 503 });
  }

  // Strip line breaks so a name can't alter the subject line.
  const name = payload.name.replace(/[\r\n]+/g, " ");
  const text = [
    `Name: ${name}`,
    `Email: ${payload.email}`,
    `Project type: ${payload.projectType}`,
    "",
    payload.message,
  ].join("\n");

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: payload.email,
        subject: `New project enquiry from ${name}`,
        text,
      }),
    });
    if (!res.ok) {
      console.error(`[contact] Resend rejected the message: ${res.status} ${await res.text()}`);
      return Response.json({ ok: false, error: "send_failed" }, { status: 502 });
    }
  } catch (error) {
    console.error("[contact] Could not reach Resend:", error);
    return Response.json({ ok: false, error: "send_failed" }, { status: 502 });
  }

  return Response.json({ ok: true });
}
