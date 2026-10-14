/** True for any content value still carrying a {PLACEHOLDER: ...}. */
export function isPlaceholder(value: string | undefined | null): boolean {
  return typeof value === "string" && value.includes("{PLACEHOLDER");
}

/** A link that isn't ready yet: empty, "#" or a {PLACEHOLDER: ...}. */
export function isPlaceholderHref(href: string | undefined | null): boolean {
  return !href || href === "#" || isPlaceholder(href);
}

export function isExternalHref(href: string): boolean {
  return /^(https?:)?\/\//.test(href) || href.startsWith("mailto:") || href.startsWith("tel:");
}

/** Placeholder hrefs always resolve to "#" so they never produce broken URLs. */
export function resolveHref(href: string | undefined | null): string {
  return isPlaceholderHref(href) ? "#" : (href as string);
}
