"use client";

import { site } from "@/content/site";
import { TransitionLink } from "@/components/transitions/TransitionLink";
import { usePageTransition } from "@/providers/TransitionProvider";
import { SoundToggle } from "./SoundToggle";

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}

export function Header() {
  const { pathname } = usePageTransition();

  return (
    <header className="fixed inset-x-0 top-0 z-50 h-[var(--header-h)] bg-gradient-to-b from-bg via-bg/80 to-transparent">
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-8">
        <TransitionLink
          href="/"
          data-sound=""
          className="text-sm font-medium tracking-tight text-fg transition-colors hover:text-accent"
        >
          <span className="sm:hidden">{site.shortName}</span>
          <span className="hidden sm:inline">{site.name}</span>
        </TransitionLink>

        <div className="flex items-center gap-1 sm:gap-4">
          <nav aria-label="Main">
            <ul className="flex items-center gap-0.5 sm:gap-2">
              {site.nav.map((item) => {
                const active = isActive(pathname, item.href);
                return (
                  <li key={item.href}>
                    <TransitionLink
                      href={item.href}
                      data-sound=""
                      aria-current={active ? "page" : undefined}
                      className={[
                        "relative block rounded-full px-2 py-1.5 text-[13px] transition-colors sm:px-3 sm:text-sm",
                        active ? "text-accent" : "text-muted hover:text-fg",
                      ].join(" ")}
                    >
                      {item.label}
                      <span
                        aria-hidden="true"
                        className={[
                          "absolute bottom-0 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-accent shadow-glow transition-opacity",
                          active ? "opacity-100" : "opacity-0",
                        ].join(" ")}
                      />
                    </TransitionLink>
                  </li>
                );
              })}
            </ul>
          </nav>
          <SoundToggle />
        </div>
      </div>
    </header>
  );
}
