import { ImageResponse } from "next/og";

export const ogSize = { width: 1200, height: 630 };

/**
 * Shared Open Graph card: dark background, cyan→magenta accent bar (the
 * site's scroll accent), mono kicker, big title, muted subtitle.
 */
export function renderOgImage({ kicker, title, subtitle }: { kicker: string; title: string; subtitle: string }) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "#0a0a0b",
          color: "#ededea",
        }}
      >
        <div
          style={{
            display: "flex",
            width: 160,
            height: 6,
            borderRadius: 3,
            background: "linear-gradient(90deg, #4fd8e8, #a78bfa, #f472d0)",
          }}
        />
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 26, color: "#9a9a9f", letterSpacing: 1 }}>{kicker}</div>
          <div style={{ display: "flex", fontSize: 92, fontWeight: 700, letterSpacing: -3, lineHeight: 1, marginTop: 20 }}>
            {title}
          </div>
          <div style={{ display: "flex", fontSize: 32, color: "#9a9a9f", lineHeight: 1.35, marginTop: 28, maxWidth: 980 }}>
            {subtitle}
          </div>
        </div>
      </div>
    ),
    ogSize,
  );
}
