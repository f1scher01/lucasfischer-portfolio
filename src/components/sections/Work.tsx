"use client";

import Link from "next/link";
import { motion, type Variants } from "motion/react";
import { ScrollReveal } from "@/components/common/ScrollReveal";

interface Project {
  title: string;
  slug?: string; // página interna /projects/[slug]
  href?: string; // link externo
  role: string;
  blurb: string;
  tags: string[];
}

const PROJECTS: Project[] = [
  {
    title: "Tecnologia Assistiva",
    slug: "tecnologia-assistiva",
    role: "Projeto Integrador Extensionista",
    blurb:
      "Engenharia aplicada à acessibilidade — projeto extensionista no IMT, unindo CAD e necessidades reais de mobilidade.",
    tags: ["Extensão", "CAD", "Impacto social"],
  },
  {
    title: "Otimização Estrutural Veicular",
    role: "Acadêmico · CAE",
    blurb:
      "Dimensionamento e otimização de estruturas veiculares — equilíbrio entre rigidez, massa e segurança via simulação.",
    tags: ["Ansys", "FEM", "Estrutura"],
  },
  {
    title: "Engenharia Digital — Web Premium",
    href: "https://github.com/lucasf22games-png/lucasfischer-portfolio",
    role: "Independente",
    blurb:
      "Este portfólio: Next.js + React Three Fiber com física real (Euler-Bernoulli) na viga do topo. Performance Lighthouse-first.",
    tags: ["Next.js", "R3F", "Performance"],
  },
];

const listVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
};

function ProjectTitle({ project }: { project: Project }) {
  const heading = (
    <h3 className="font-display text-2xl tracking-tight md:text-3xl">
      {project.title}
    </h3>
  );
  if (project.slug) {
    return (
      <Link
        href={`/projects/${project.slug}`}
        className="inline-block transition-colors hover:text-[var(--color-accent)]"
      >
        {heading}
      </Link>
    );
  }
  if (project.href) {
    return (
      <a
        href={project.href}
        target="_blank"
        rel="noreferrer"
        className="inline-block transition-colors hover:text-[var(--color-accent)]"
      >
        {heading}
      </a>
    );
  }
  return heading;
}

export function Work() {
  return (
    <section
      id="work"
      className="relative border-t border-[var(--color-border)] bg-[var(--color-bg)] py-32"
    >
      <div className="container-x">
        <ScrollReveal className="mb-12 flex items-center gap-4">
          <span className="font-mono text-sm text-[var(--color-accent)]">02</span>
          <span className="h-px flex-1 bg-[var(--color-border)]" />
          <p className="caption text-[var(--color-fg-muted)]">Selected Work</p>
        </ScrollReveal>

        <ScrollReveal className="mb-12">
          <h2 className="font-display text-4xl tracking-tight md:text-6xl">
            O que tenho construído
          </h2>
        </ScrollReveal>

        <motion.ul
          className="divide-y divide-[var(--color-border)] border-t border-[var(--color-border)]"
          variants={listVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-15% 0px" }}
        >
          {PROJECTS.map((p) => (
            <motion.li
              key={p.title}
              variants={itemVariants}
              data-cursor="view"
              className="group grid grid-cols-12 gap-6 py-8 transition-colors hover:bg-[var(--color-bg-elevated)]/40"
            >
              <div className="col-span-12 md:col-span-7">
                <ProjectTitle project={p} />
                <p className="mt-2 text-[var(--color-fg-muted)]">{p.blurb}</p>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {p.tags.map((t) => (
                    <li
                      key={t}
                      className="caption rounded-full border border-[var(--color-border-strong)] px-3 py-1 text-[var(--color-fg-muted)]"
                    >
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="col-span-9 md:col-span-4">
                <p className="caption text-[var(--color-fg-muted)]">Contexto</p>
                <p className="mt-1 text-sm">{p.role}</p>
              </div>
              <div className="col-span-3 md:col-span-1 md:text-right">
                {p.slug ? (
                  <Link
                    href={`/projects/${p.slug}`}
                    aria-label={`Ver ${p.title}`}
                    className="inline-block transition-transform group-hover:translate-x-1 group-hover:text-[var(--color-accent)]"
                  >
                    →
                  </Link>
                ) : p.href ? (
                  <a
                    href={p.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`Abrir ${p.title}`}
                    className="inline-block transition-transform group-hover:translate-x-1 group-hover:text-[var(--color-accent)]"
                  >
                    ↗
                  </a>
                ) : (
                  <span className="inline-block opacity-40">→</span>
                )}
              </div>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
