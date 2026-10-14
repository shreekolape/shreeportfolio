import { contact } from "@/content/contact";
import { site } from "@/content/site";
import { pageMetadata } from "@/lib/metadata";
import { ContactForm } from "@/components/contact/ContactForm";
import { SmartLink } from "@/components/ui/SmartLink";
import { StatusLine } from "@/components/ui/StatusLine";

export const metadata = pageMetadata({ title: "Contact", description: contact.subline, path: "/contact" });

const linkClass = "link-underline text-lg text-fg transition-colors hover:text-accent";

export default function ContactPage() {
  const { email, socials } = site.contact;

  return (
    <div className="wrap pb-24 pt-[calc(var(--header-h)+5rem)] sm:pb-32 sm:pt-[calc(var(--header-h)+8rem)]">
      <h1 className="max-w-4xl text-6xl font-semibold leading-[0.95] tracking-[-0.04em] sm:text-8xl">
        {contact.heading}
      </h1>
      <p className="mt-6 max-w-2xl text-lg text-muted sm:text-xl">{contact.subline}</p>
      <StatusLine className="mt-6" />

      <div className="mt-16 grid gap-16 lg:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)] lg:gap-24">
        <ContactForm />

        <aside aria-label="Contact details" className="lg:border-l lg:border-line lg:pl-12">
          <ul className="grid gap-4">
            <li>
              <SmartLink href={`mailto:${email}`} data-cursor="Say hi" className={linkClass}>
                {email}
              </SmartLink>
            </li>
            {socials.map((social) => (
              <li key={social.label}>
                <SmartLink href={social.href} className={linkClass}>
                  {social.label}
                </SmartLink>
              </li>
            ))}
            <li className="mt-4">
              <SmartLink
                href={contact.resume.href}
                download
                className="inline-flex items-center rounded-full border border-line px-5 py-2.5 text-sm transition-colors hover:border-accent hover:text-accent"
              >
                {contact.resume.label} ↓
              </SmartLink>
            </li>
          </ul>
        </aside>
      </div>
    </div>
  );
}
