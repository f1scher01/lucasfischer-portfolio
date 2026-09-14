import type { NextConfig } from "next";
import bundleAnalyzer from "@next/bundle-analyzer";

const withBundleAnalyzer = bundleAnalyzer({ enabled: process.env.ANALYZE === "true" });

/**
 * CSP calibrada para o stack:
 * - script-src 'unsafe-inline': exigido pelos scripts inline de RSC do App
 *   Router (nonce via middleware forçaria rendering dinâmico e mataria o SSG;
 *   trade-off documentado em docs/threat-model.md). SEM 'unsafe-eval'.
 * - vitals.vercel-insights.com / va.vercel-scripts.com: Vercel Analytics
 * - HDR/fonts/áudio são self-hosted (nenhum CDN de terceiro em runtime).
 * - Sem formulário nem iframes: form-action e frame-src fechados.
 */
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://va.vercel-scripts.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  "connect-src 'self' https://vitals.vercel-insights.com",
  "media-src 'self'",
  "worker-src 'self' blob:",
  "frame-src 'none'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'none'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].join("; ");

const nextConfig: NextConfig = {
  // React Compiler (experimental) desligado: miscompila chamadas imperativas
  // do GSAP (gsap.context / ScrollTrigger) e causava crash client-side.
  images: { formats: ["image/avif", "image/webp"] },
  transpilePackages: ["three"],
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "Content-Security-Policy", value: csp },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
          },
          { key: "X-DNS-Prefetch-Control", value: "on" },
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
          { key: "Cross-Origin-Resource-Policy", value: "same-origin" },
        ],
      },
    ];
  },
};

export default withBundleAnalyzer(nextConfig);
