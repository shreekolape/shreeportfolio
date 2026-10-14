"use client";

import { useRef, useState, type FormEvent } from "react";
import { contact } from "@/content/contact";
import { projectTypes, validateContact, type ContactErrors, type ContactPayload } from "@/lib/contactSchema";
import { useSound } from "@/providers/SoundProvider";

type Status = "idle" | "sending" | "success" | "error";

const fieldClass =
  "mt-2 w-full rounded-xl border border-line bg-bg-elevated px-4 py-3.5 text-fg placeholder:text-subtle transition-colors hover:border-fg/25 focus:border-accent focus:outline-none aria-[invalid=true]:border-red-400";

export function ContactForm() {
  const f = contact.form.fields;
  const formRef = useRef<HTMLFormElement>(null);
  const [errors, setErrors] = useState<ContactErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  const { play } = useSound();

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const payload: ContactPayload = {
      name: String(data.get("name") ?? ""),
      email: String(data.get("email") ?? ""),
      projectType: String(data.get("projectType") ?? "") as ContactPayload["projectType"],
      message: String(data.get("message") ?? ""),
    };

    const nextErrors = validateContact(payload);
    setErrors(nextErrors);
    const firstInvalid = Object.keys(nextErrors)[0];
    if (firstInvalid) {
      formRef.current?.querySelector<HTMLElement>(`[name="${firstInvalid}"]`)?.focus();
      return;
    }

    play("click");
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, website: data.get("website") }),
      });
      if (!res.ok) throw new Error(String(res.status));
      setStatus("success");
      formRef.current?.reset();
    } catch {
      setStatus("error");
    }
  };

  const errorProps = (name: keyof ContactPayload) => ({
    "aria-invalid": Boolean(errors[name]),
    "aria-describedby": errors[name] ? `${name}-error` : undefined,
  });

  const errorText = (name: keyof ContactPayload) =>
    errors[name] ? (
      <p id={`${name}-error`} className="mt-2 text-sm text-red-300">
        {errors[name]}
      </p>
    ) : null;

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate className="grid gap-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="font-mono text-xs uppercase tracking-widest text-muted">
            {f.name.label}
          </label>
          <input id="name" name="name" type="text" autoComplete="name" className={fieldClass} {...errorProps("name")} />
          {errorText("name")}
        </div>
        <div>
          <label htmlFor="email" className="font-mono text-xs uppercase tracking-widest text-muted">
            {f.email.label}
          </label>
          <input id="email" name="email" type="email" autoComplete="email" className={fieldClass} {...errorProps("email")} />
          {errorText("email")}
        </div>
      </div>

      <fieldset aria-describedby={errors.projectType ? "projectType-error" : undefined}>
        <legend className="font-mono text-xs uppercase tracking-widest text-muted">{f.projectType.label}</legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {projectTypes.map((type) => (
            <label key={type} className="cursor-pointer">
              <input type="radio" name="projectType" value={type} className="peer sr-only" />
              <span className="inline-block rounded-full border border-line px-4 py-2 text-sm text-muted transition-colors hover:text-fg peer-checked:border-accent peer-checked:bg-accent-soft peer-checked:text-accent peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent">
                {type}
              </span>
            </label>
          ))}
        </div>
        {errorText("projectType")}
      </fieldset>

      <div>
        <label htmlFor="message" className="font-mono text-xs uppercase tracking-widest text-muted">
          {f.message.label}
        </label>
        <textarea id="message" name="message" rows={6} className={`${fieldClass} resize-y`} {...errorProps("message")} />
        {errorText("message")}
      </div>

      {/* Honeypot: hidden from people and assistive tech. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="flex flex-wrap items-center gap-5">
        <button
          type="submit"
          disabled={status === "sending"}
          className="inline-flex h-14 items-center rounded-full bg-accent px-9 font-medium text-bg shadow-glow transition-[transform,opacity] hover:scale-[1.03] disabled:opacity-60"
        >
          {status === "sending" ? contact.form.sending : contact.form.submit}
        </button>
        <p role="status" aria-live="polite" className="text-sm">
          {status === "success" && <span className="text-emerald-300">{contact.form.success}</span>}
          {status === "error" && <span className="text-red-300">{contact.form.error}</span>}
        </p>
      </div>
    </form>
  );
}
