import { toContactPayload, validateContact } from "@/lib/contactSchema";

/**
 * Contact form endpoint (stub).
 *
 * TODO: connect an email provider (e.g. Resend, Postmark) here.
 * Required env vars (see .env.example), never hard-coded:
 *   CONTACT_PROVIDER_API_KEY  API key for the email provider
 *   CONTACT_TO_EMAIL          where enquiries are delivered
 *   CONTACT_FROM_EMAIL        verified sender address
 *
 * Until those are set this returns 503, so the form honestly shows its
 * error state instead of claiming the message was sent.
 */
export async function POST(request: Request) {
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

  const { CONTACT_PROVIDER_API_KEY, CONTACT_TO_EMAIL, CONTACT_FROM_EMAIL } = process.env;
  if (!CONTACT_PROVIDER_API_KEY || !CONTACT_TO_EMAIL || !CONTACT_FROM_EMAIL) {
    console.warn("[contact] Email provider not configured; message not sent.");
    return Response.json({ ok: false, error: "not_configured" }, { status: 503 });
  }

  // TODO: send `payload` via the chosen provider using the env vars above.
  return Response.json({ ok: false, error: "not_implemented" }, { status: 501 });
}
