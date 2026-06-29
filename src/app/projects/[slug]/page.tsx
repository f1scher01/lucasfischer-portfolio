import fs from "node:fs";
import path from "node:path";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import matter from "gray-matter";

const PROJECTS_DIR = path.join(process.cwd(), "src", "content", "projects");

interface Frontmatter {
  title: string;
  role: string;
  year: number;
  summary: string;
  tech: string[];
}

interface LoadedProject {
  Content: React.ComponentType;
  frontmatter: Frontmatter;
}

/** Importa o módulo .mdx (componente + frontmatter exportado pelo remark plugin). */
async function loadProject(slug: string): Promise<LoadedProject | null> {
  // Caminho relativo para o webpack montar o context dos .mdx disponíveis.
  if (!/^[a-z0-9-]+$/.test(slug)) return null;
  try {
    const mod = await import(`../../../content/projects/${slug}.mdx`);
    return {
      Content: mod.default as React.ComponentType,
      frontmatter: mod.frontmatter as Frontmatter,
    };
  } catch {
    return null;
  }
}

export function generateStaticParams() {
  const files = fs
    .readdirSync(PROJECTS_DIR)
    .filter((f) => f.endsWith(".mdx"));
  return files.map((f) => ({ slug: f.replace(/\.mdx$/, "") }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await loadProject(slug);
  if (!project) return {};
  const { title, summary } = project.frontmatter;
  return {
    title,
    description: summary,
    openGraph: { title, description: summary, type: "article" },
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await loadProject(slug);
  if (!project) notFound();

  const { Content, frontmatter } = project;

  return (
    <article className="mx-auto w-full max-w-3xl px-6 py-32 md:px-8">
      <Link
        href="/#work"
        className="caption inline-flex items-center gap-2 text-[var(--color-fg-muted)] transition-colors hover:text-[var(--color-accent)]"
      >
        ← Back to work
      </Link>

      <header className="mt-12 border-b border-[var(--color-border)] pb-10">
        <h1 className="font-display text-4xl tracking-tight md:text-6xl">
          {frontmatter.title}
        </h1>
        <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-[var(--color-fg-muted)]">
          <span>{frontmatter.role}</span>
          <span aria-hidden>·</span>
          <span>{frontmatter.year}</span>
        </div>
        {frontmatter.tech?.length ? (
          <ul className="mt-6 flex flex-wrap gap-2">
            {frontmatter.tech.map((t) => (
              <li
                key={t}
                className="caption rounded-full border border-[var(--color-border-strong)] px-3 py-1"
              >
                {t}
              </li>
            ))}
          </ul>
        ) : null}
      </header>

      <div className="mt-10 text-lg">
        <Content />
      </div>
    </article>
  );
}
