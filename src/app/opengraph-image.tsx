import { ImageResponse } from "@vercel/og";

export const runtime = "edge";
export const alt = "Lucas Fischer Paez · Mechanical Engineering Student";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * OG rica: fundo dark, grid técnico sutil, nome grande, silhueta da viga
 * bi-apoiada defletida (assinatura do site) e linha accent.
 * Cores = tokens do design system convertidos p/ hex (Satori não lê oklch).
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
          position: "relative",
          // grid técnico 40px
          backgroundImage:
            "linear-gradient(#1a1d24 1px, transparent 1px), linear-gradient(90deg, #1a1d24 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      >
        {/* silhueta: viga bi-apoiada defletida + apoios */}
        <svg
          width="380"
          height="120"
          viewBox="0 0 380 120"
          style={{ position: "absolute", top: 56, right: 64 }}
        >
          <path
            d="M10 30 Q 190 95 370 30"
            stroke="#f29d3d"
            strokeWidth="7"
            fill="none"
            strokeLinecap="round"
          />
          <path d="M2 52 L18 52 L10 36 Z" fill="#5a6170" />
          <path d="M362 52 L378 52 L370 36 Z" fill="#5a6170" />
          <text x="150" y="118" fill="#5a6170" fontSize="16" fontFamily="monospace">
            σ = M·c / I
          </text>
        </svg>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 110,
              fontWeight: 700,
              color: "#f2f3f5",
              lineHeight: 1,
              letterSpacing: "-0.03em",
            }}
          >
            LUCAS FISCHER
          </div>

          <div
            style={{
              width: 88,
              height: 5,
              background: "#f29d3d",
              marginTop: 30,
              marginBottom: 30,
              borderRadius: 3,
            }}
          />

          <div
            style={{
              fontSize: 38,
              fontStyle: "italic",
              color: "#a0a6ad",
            }}
          >
            Mechanical Engineering Student
          </div>

          <div
            style={{
              marginTop: 26,
              fontSize: 20,
              color: "#5a6170",
              fontFamily: "monospace",
            }}
          >
            Physics · Data · Code · IMT · São Paulo
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
