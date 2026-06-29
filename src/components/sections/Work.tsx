"use client";

import Link from "next/link";
import { motion, type Variants } from "motion/react";
import { ScrollReveal } from "@/components/common/ScrollReveal";

interface Project {
  title: string;
  slug?: string; // só projetos com página /projects/[slug]
  role: string;
  year: string;
  blurb: string;
  tags: string[];
}

const PROJECTS: Project[] = [
  {
    title: "Maua Racing — Vehicle Dynamics",
    slug: "maua-racing",
    role: "Trainee · FSAE",
    year: "2026",
    blurb:
      "Análise de suspensão e telemetria do protótipo. Aplicação de Telemetria para Competições Acadêmicas em decisões de setup.",
    tags: ["Telemetria", "Suspensão", "CAD"],
  },
  {
    title: "Projeto Extensão — Tecnologia Assistiva",
    role: "CAD/CAE Engineer",
    year: "2026",
    blurb:
      "Aplicação de SolidWorks e Ansys em soluções de acessibilidade para população com restrição de mobilidade.",
    tags: ["SolidWorks", "Ansys", "Impacto Social"],
  },
  {
    title: "Sites Premium — Design Engineering",
    role: "Independent",
    year: "2025—2026",
    blurb:
      "Construção de sites com Next.js + R3F + Motion para marcas que querem alto padrão visual e performance Lighthouse 95+.",
    tags: ["Next.js", "R3F", "Motion"],
  },
];

// Container orquestra o stagger; cada item entra com fade-up.
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

export function Work() {
  return (
    <section id="work" className="border-t border-[var(--color-border)] py-32">
      <div className="container-x">
        <ScrollReveal className="mb-16 flex items-baseline justify-between">
          <h2 className="font-display text-4xl md:text-6xl tracking-tight">
            Selected Work
          </h2>
          <p className="caption text-[var(--color-fg-muted)]">2025—2026</p>
        </ScrollReveal>

        <motion.ul
          className="divide-y divide-[var(--color-border)]"
          variants={listVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-15% 0px" }}
        >
          {PROJECTS.map((p) => (
            <motion.li
              key={p.title}
              variants={itemVariants}
              className="group grid grid-cols-12 gap-6 py-8 transition-colors hover:bg-[var(--color-bg-elevated)]/40"
            >
              <div className="col-span-12 md:col-span-7">
                {p.slug ? (
                  <Link
                    href={`/projects/${p.slug}`}
                    className="inline-block transition-colors hover:text-[var(--color-accent)]"
                  >
                    <h3 className="font-display text-2xl tracking-tight md:text-3xl">
                      {p.title}
                    </h3>
                  </Link>
                ) : (
                  <h3 className="font-display text-2xl tracking-tight md:text-3xl">
                    {p.title}
                  </h3>
                )}
                <p className="mt-2 text-[var(--color-fg-muted)]">{p.blurb}</p>
              </div>
              <div className="col-span-6 md:col-span-3">
                <p className="caption text-[var(--color-fg-muted)]">Role</p>
                <p className="mt-1 text-sm">{p.role}</p>
              </div>
              <div className="col-span-6 md:col-span-1">
                <p className="caption text-[var(--color-fg-muted)]">Year</p>
                <p className="mt-1 text-sm">{p.year}</p>
              </div>
              <div className="col-span-12 md:col-span-1 md:text-right">
                {p.slug ? (
                  <Link
                    href={`/projects/${p.slug}`}
                    aria-label={`Ver ${p.title}`}
                    className="inline-block transition-transform group-hover:translate-x-1 group-hover:text-[var(--color-accent)]"
                  >
                    →
                  </Link>
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
