import type { NextConfig } from "next";
import bundleAnalyzer from "@next/bundle-analyzer";
import createMDX from "@next/mdx";
import remarkGfm from "remark-gfm";
import remarkFrontmatter from "remark-frontmatter";
import remarkMdxFrontmatter from "remark-mdx-frontmatter";

const withBundleAnalyzer = bundleAnalyzer({ enabled: process.env.ANALYZE === "true" });

const withMDX = createMDX({
  options: {
    remarkPlugins: [
      remarkGfm,
      remarkFrontmatter,
      // Expõe o frontmatter como export `frontmatter` do módulo .mdx.
      [remarkMdxFrontmatter, { name: "frontmatter" }],
    ],
  },
});

/**
 * CSP calibrada para o stack:
 * - script-src 'unsafe-inline': exigido pelos scripts inline de RSC do App
 *   Router (nonce via middleware forçaria rendering dinâmico e mataria o SSG
 *   — trade-off documentado em docs/threat-model.md). SEM 'unsafe-eval'.
 * - challenges.cloudflare.com: Cloudflare Turnstile (script + iframe + verify)
 * - vitals.vercel-insights.com / va.vercel-scripts.com: Vercel Analytics
 * - HDR/fonts/áudio são self-hosted (nenhum CDN de terceiro em runtime).
 */
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://challenges.cloudflare.com https://va.vercel-scripts.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  "connect-src 'self' https://challenges.cloudflare.com https://vitals.vercel-insights.com",
  "media-src 'self'",
  "worker-src 'self' blob:",
  "frame-src https://challenges.cloudflare.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].join("; ");

const nextConfig: NextConfig = {
  // React Compiler (experimental) desligado: miscompila chamadas imperativas
  // do GSAP (gsap.context / ScrollTrigger) e causava crash client-side.
  images: { formats: ["image/avif", "image/webp"] },
  transpilePackages: ["three"],
  // permite .md/.mdx como páginas/módulos
  pageExtensions: ["ts", "tsx", "js", "jsx", "md", "mdx"],
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
            value:
              "camera=(), microphone=(), geolocation=(), interest-cohort=()",
          },
          { key: "X-DNS-Prefetch-Control", value: "on" },
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
          { key: "Cross-Origin-Resource-Policy", value: "same-origin" },
        ],
      },
    ];
  },
};

export default withMDX(withBundleAnalyzer(nextConfig));
