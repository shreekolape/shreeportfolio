import type { ReactNode } from "react";

/** Small monospace pill for stack items, filters and dates. */
export function Tag({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={[
        "inline-flex items-center rounded-full border border-line px-2.5 py-1 font-mono text-[11px] leading-none text-muted",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </span>
  );
}
