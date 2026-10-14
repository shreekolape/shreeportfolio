import { contact } from "@/content/contact";

// Shared by the client form and the route handler so both validate identically.

export const projectTypes = contact.form.fields.projectType.options;
export type ProjectType = (typeof projectTypes)[number];

export type ContactPayload = {
  name: string;
  email: string;
  projectType: ProjectType | "";
  message: string;
};

export type ContactErrors = Partial<Record<keyof ContactPayload, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX = { name: 120, email: 254, message: 5000 };

export function validateContact(input: ContactPayload): ContactErrors {
  const f = contact.form.fields;
  const errors: ContactErrors = {};
  if (!input.name.trim()) errors.name = f.name.required;
  if (!input.email.trim()) errors.email = f.email.required;
  else if (!EMAIL_RE.test(input.email.trim()) || input.email.length > MAX.email) errors.email = f.email.invalid;
  if (!projectTypes.includes(input.projectType as ProjectType)) errors.projectType = f.projectType.required;
  if (!input.message.trim()) errors.message = f.message.required;
  return errors;
}

/** Coerce unknown JSON into a payload (trims and length-limits every field). */
export function toContactPayload(raw: unknown): ContactPayload {
  const r = (raw ?? {}) as Record<string, unknown>;
  const str = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");
  return {
    name: str(r.name, MAX.name),
    email: str(r.email, MAX.email),
    projectType: str(r.projectType, 40) as ContactPayload["projectType"],
    message: str(r.message, MAX.message),
  };
}
