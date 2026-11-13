/** A link that isn't ready: empty or "#". Rendered as an inert "#" so it never breaks. */
export function isPlaceholderHref(href: string | undefined | null): boolean {
  return !href || href === "#";
}

export function isExternalHref(href: string): boolean {
  return /^(https?:)?\/\//.test(href) || href.startsWith("mailto:") || href.startsWith("tel:");
}

/** A static file (e.g. "/resume/cv.pdf"), not a page route: opened as a plain link, never routed. */
export function isFileHref(href: string): boolean {
  return /\.[a-z0-9]{2,5}$/i.test(href.split(/[?#]/)[0]);
}
