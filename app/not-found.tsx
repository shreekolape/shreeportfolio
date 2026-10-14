import type { Metadata } from "next";
import { notFoundPage } from "@/content/labels";
import { TransitionLink } from "@/components/transitions/TransitionLink";

export const metadata: Metadata = { title: notFoundPage.heading, robots: { index: false } };

export default function NotFound() {
  return (
    <section className="wrap flex min-h-[70dvh] flex-col justify-end pb-16 pt-[calc(var(--header-h)+5rem)]">
      <p className="font-mono text-xs text-muted">{notFoundPage.code}</p>
      <h1 className="mt-4 text-6xl font-semibold tracking-[-0.04em] sm:text-8xl">{notFoundPage.heading}</h1>
      <TransitionLink
        href={notFoundPage.link.href}
        data-sound=""
        className="link-underline mt-10 inline-block self-start font-mono text-sm text-accent"
      >
        {notFoundPage.link.label}
      </TransitionLink>
    </section>
  );
}
