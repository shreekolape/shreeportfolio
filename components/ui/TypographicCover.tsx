/**
 * A deliberate cover for a project with no screenshot yet: the title in the
 * heading font, an optional line underneath and a subtle gradient in the live
 * accent colour. Same frame and aspect as MediaFrame, so layouts don't shift.
 */
export function TypographicCover({
  title,
  subtitle,
  aspect = "16 / 10",
  className,
}: {
  title: string;
  subtitle?: string;
  aspect?: string;
  className?: string;
}) {
  return (
    <div
      role="img"
      aria-label={subtitle ? `${title} — ${subtitle}` : title}
      className={["relative overflow-hidden rounded-xl border border-line bg-bg-elevated [container-type:inline-size]", className]
        .filter(Boolean)
        .join(" ")}
      style={{
        aspectRatio: aspect,
        backgroundImage:
          "radial-gradient(120% 90% at 0% 0%, var(--accent-soft), transparent 60%), radial-gradient(90% 80% at 100% 100%, oklch(0.8 0.15 var(--accent-h) / 0.08), transparent 70%), linear-gradient(135deg, #17171b, #0e0e11)",
      }}
    >
      <div className="absolute inset-0 flex flex-col justify-end p-[8%]">
        <span aria-hidden="true" className="mb-[4%] h-px w-12 bg-accent" />
        <span className="text-[clamp(1.25rem,9cqw,4.5rem)] font-semibold leading-[0.95] tracking-[-0.04em] text-fg">
          {title}
        </span>
        {subtitle && <span className="mt-[3%] font-mono text-[11px] uppercase tracking-widest text-muted">{subtitle}</span>}
      </div>
    </div>
  );
}
