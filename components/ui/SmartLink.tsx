"use client";

import type { AnchorHTMLAttributes, ReactNode } from "react";
import { isExternalHref, isFileHref, isPlaceholderHref } from "@/lib/links";
import { TransitionLink } from "@/components/transitions/TransitionLink";

type SmartLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
  href: string | null | undefined;
  children: ReactNode;
};

/**
 * One link component for every case:
 * - empty / "#" → inert "#" link, marked in development
 * - external / mailto → new tab (http) with "Open" cursor label
 * - a static file (e.g. the résumé PDF) → plain link, so it downloads instead of routing
 * - internal → TransitionLink with the curtain wipe
 */
export function SmartLink({ href, children, ...props }: SmartLinkProps) {
  if (isPlaceholderHref(href)) {
    return (
      <a href="#" data-placeholder-link="" onClick={(e) => e.preventDefault()} {...props}>
        {children}
      </a>
    );
  }

  const url = href as string;
  if (isFileHref(url) && !isExternalHref(url)) {
    return (
      <a href={url} {...props}>
        {children}
      </a>
    );
  }
  if (isExternalHref(url)) {
    const newTab = url.startsWith("http") || url.startsWith("//");
    return (
      <a
        href={url}
        {...(newTab ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        data-cursor="Open"
        {...props}
      >
        {children}
      </a>
    );
  }

  return (
    <TransitionLink href={url} {...props}>
      {children}
    </TransitionLink>
  );
}
