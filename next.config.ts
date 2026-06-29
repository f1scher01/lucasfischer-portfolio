import type { NextConfig } from "next";
import bundleAnalyzer from "@next/bundle-analyzer";

const withBundleAnalyzer = bundleAnalyzer({ enabled: process.env.ANALYZE === "true" });

const nextConfig: NextConfig = {
  experimental: { reactCompiler: true },
  images: { formats: ["image/avif", "image/webp"] },
  transpilePackages: ["three"],
};

export default withBundleAnalyzer(nextConfig);
