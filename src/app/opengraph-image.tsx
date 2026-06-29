import { ImageResponse } from "@vercel/og";

// OG image dinâmica — renderizada no edge.
export const runtime = "edge";
export const alt = "Lucas Fischer — Mechanical Engineer & Design Engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Cores: o Satori (engine do @vercel/og) não interpreta oklch(), então
 * usamos os equivalentes em hex dos tokens do design system:
 *   --bg        oklch(15% 0.01 240)  → #0d0f14
 *   --fg        oklch(95% 0.005 240) → #f2f3f5
 *   --fg-muted  oklch(70% 0.01 240)  → #a0a6ad
 *   --accent    oklch(70% 0.18 60)   → #f29d3d
 */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "#0d0f14",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 96,
              fontWeight: 600,
              color: "#f2f3f5",
              lineHeight: 1,
              letterSpacing: "-0.03em",
            }}
          >
            Lucas Fischer
          </div>

          {/* Linha accent — referência à tensão de viga (80×4) */}
          <div
            style={{
              width: 80,
              height: 4,
              background: "#f29d3d",
              marginTop: 28,
              marginBottom: 28,
              borderRadius: 2,
            }}
          />

          <div
            style={{
              fontSize: 36,
              fontWeight: 400,
              color: "#a0a6ad",
            }}
          >
            Mechanical Engineer · Design Engineer
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
