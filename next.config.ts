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

const nextConfig: NextConfig = {
  // React Compiler (experimental) desligado: miscompila chamadas imperativas
  // do GSAP (gsap.context / ScrollTrigger) e causava crash client-side.
  images: { formats: ["image/avif", "image/webp"] },
  transpilePackages: ["three"],
  // permite .md/.mdx como páginas/módulos
  pageExtensions: ["ts", "tsx", "js", "jsx", "md", "mdx"],
};

export default withMDX(withBundleAnalyzer(nextConfig));
