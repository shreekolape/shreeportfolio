"use client";

import Link from "next/link";
import type { ComponentProps } from "react";
import { usePageTransition } from "@/providers/TransitionProvider";

type TransitionLinkProps = Omit<ComponentProps<typeof Link>, "href"> & { href: string };

/**
 * Internal link that plays the curtain transition. Modifier-clicks, new tabs
 * and same-page links fall through to Next's default behaviour.
 */
export function TransitionLink({ href, onNavigate, ...props }: TransitionLinkProps) {
  const { pathname, navigate } = usePageTransition();

  return (
    <Link
      href={href}
      onNavigate={(e) => {
        onNavigate?.(e);
        const targetPath = href.split(/[?#]/)[0] || "/";
        if (targetPath === pathname) return;
        e.preventDefault();
        navigate(href);
      }}
      {...props}
    />
  );
}
