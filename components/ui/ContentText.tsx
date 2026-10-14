import { isPlaceholder } from "@/lib/links";

/** Renders a content string; unfilled {PLACEHOLDER: ...} values get a dashed marker. */
export function ContentText({ value, className }: { value: string; className?: string }) {
  if (isPlaceholder(value)) {
    return <span className={["placeholder-text", className].filter(Boolean).join(" ")}>{value}</span>;
  }
  return className ? <span className={className}>{value}</span> : <>{value}</>;
}
