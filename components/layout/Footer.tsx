"use client";

import { usePathname } from "next/navigation";
import { site } from "@/content/site";
import { Magnetic } from "@/components/ui/Magnetic";
import { SmartLink } from "@/components/ui/SmartLink";
import { StatusLine } from "@/components/ui/StatusLine";
import { TransitionLink } from "@/components/transitions/TransitionLink";
import { CopyEmailButton } from "@/components/ui/CopyEmailButton";

const linkClass = "link-underline text-muted transition-colors hover:text-accent";

/** Shared footer CTA, on every page. `data-scene="footer"` is the 3D wave trigger (Phase 4). */
export function Footer() {
  const { footer, contact } = site;
  const pathname = usePathname();
  if (pathname.startsWith("/dev")) return null;

  return (
    <footer data-scene="footer" className="relative border-t border-line">
      <div className="mx-auto max-w-7xl px-4 pb-10 pt-24 sm:px-8 sm:pt-32">
        <section aria-labelledby="footer-cta-heading" className="flex flex-col items-start gap-10">
          <h2
            id="footer-cta-heading"
            data-reveal=""
            className="max-w-3xl text-5xl font-semibold leading-[1.02] tracking-tight sm:text-7xl lg:text-8xl"
          >
            {footer.heading}
          </h2>

          {/* Reveal wraps Magnetic so the two never fight over the same transform. */}
          <div data-reveal="">
            <Magnetic strength={0.4}>
              <TransitionLink
                href={footer.cta.href}
                data-cursor={footer.cta.label}
                data-sound=""
                className="inline-flex h-16 items-center rounded-full bg-accent px-10 text-lg font-medium text-bg shadow-glow transition-transform duration-300 ease-[var(--ease-out)] hover:scale-[1.04] active:scale-[0.97] sm:h-20 sm:px-12 sm:text-xl"
              >
                {footer.cta.label}
              </TransitionLink>
            </Magnetic>
          </div>

          <div data-reveal="">
            <StatusLine />
          </div>
        </section>

        <div className="mt-20 flex flex-col gap-6 border-t border-line pt-8 text-sm sm:flex-row sm:items-center sm:justify-between">
          <ul className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <li className="flex items-center gap-1.5">
              <SmartLink href={`mailto:${contact.email}`} data-sound="" className={linkClass}>
                {footer.emailLinkLabel}
              </SmartLink>
              <CopyEmailButton email={contact.email} ariaLabel={footer.copyEmailAriaLabel} copiedLabel={footer.copiedLabel} />
            </li>
            {contact.socials.map((social) => (
              <li key={social.label}>
                <SmartLink href={social.href} data-sound="" className={linkClass}>
                  {social.label}
                </SmartLink>
              </li>
            ))}
          </ul>
          <p className="font-mono text-xs text-muted">{footer.credit}</p>
        </div>
      </div>
    </footer>
  );
}
