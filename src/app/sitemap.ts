import fs from "node:fs";
import path from "node:path";
import type { MetadataRoute } from "next";

const BASE = "https://lucasfischer-portfolio.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const projectsDir = path.join(process.cwd(), "src", "content", "projects");
  const projects = fs.existsSync(projectsDir)
    ? fs
        .readdirSync(projectsDir)
        .filter((f) => f.endsWith(".mdx"))
        .map((f) => ({
          url: `${BASE}/projects/${f.replace(/\.mdx$/, "")}`,
          lastModified: new Date(),
          changeFrequency: "monthly" as const,
          priority: 0.7,
        }))
    : [];

  return [
    {
      url: BASE,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    ...projects,
  ];
}
