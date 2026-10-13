/** A link that isn't ready yet: "#" or anything still carrying a {PLACEHOLDER: ...}. */
export function isPlaceholderHref(href: string | undefined | null): boolean {
  return !href || href === "#" || href.includes("{PLACEHOLDER");
}

export function isExternalHref(href: string): boolean {
  return /^(https?:)?\/\//.test(href) || href.startsWith("mailto:") || href.startsWith("tel:");
}

/** Placeholder hrefs always resolve to "#" so they never produce broken URLs. */
export function resolveHref(href: string | undefined | null): string {
  return isPlaceholderHref(href) ? "#" : (href as string);
}
