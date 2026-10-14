/**
 * Inline script that runs during HTML parsing (before paint). On the client
 * it renders as text/plain so React neither warns nor re-runs it.
 * Pattern from the Next.js "preventing flash before hydration" guide.
 */
export function InlineScript({ html }: { html: string }) {
  return (
    <script
      type={typeof window === "undefined" ? "text/javascript" : "text/plain"}
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
