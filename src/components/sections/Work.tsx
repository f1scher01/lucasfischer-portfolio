"use client";

import { motion, type Variants } from "motion/react";
import { ScrollReveal } from "@/components/common/ScrollReveal";
import { RevealHeading } from "@/components/ui/RevealHeading";
import { SkewGroup } from "@/components/ui/SkewGroup";
import { useLang } from "@/i18n/LangProvider";

interface ProjectMeta {
  tags: string[];
  code?: string;
  demo?: string;
}

/** Metadados independentes de idioma, na mesma ordem de `t.work.projects`. */
const META: ProjectMeta[] = [
  {
    tags: ["Python", "GDAL", "PyQGIS", "NetCDF", "SIH/SUS"],
    code: "https://github.com/f1scher01/cetesb-air-quality-sp",
  },
  {
    tags: ["Python", "InfluxDB", "Grafana", "Docker"],
    code: "https://github.com/f1scher01/telemetria-veicular-grafana",
    demo: "https://telemetria-veicular-grafana.vercel.app",
  },
  { tags: ["Ansys Workbench", "FEA"] },
  { tags: ["Granta EduPack", "FabLab", "MDF · PLA"] },
  { tags: ["Powertrain", "Dyno"] },
  {
    tags: ["JavaScript", "PWA", "Service Worker"],
    code: "https://github.com/f1scher01/notas-cr-maua-pwa",
    demo: "https://notas-cr-maua.vercel.app",
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

const linkClass =
  "caption text-[var(--color-accent)] underline-offset-4 transition-colors hover:underline";

export function Work() {
  const { t, lang } = useLang();

  return (
    <section
      id="work"
      className="relative border-t border-[var(--color-border)] bg-[var(--color-bg)] py-32"
    >
      <div className="container-x">
        <ScrollReveal className="mb-12 flex items-center gap-4">
          <span className="font-mono text-sm text-[var(--color-accent)]">02</span>
          <span className="h-px flex-1 bg-[var(--color-border)]" />
          <p className="caption text-[var(--color-fg-muted)]">{t.work.eyebrow}</p>
        </ScrollReveal>

        <RevealHeading
          key={lang}
          segments={[{ text: t.work.h }]}
          className="mb-12 font-display text-4xl tracking-tight md:text-6xl"
        />

        <SkewGroup>
          <motion.ul
            className="divide-y divide-[var(--color-border)] border-t border-[var(--color-border)]"
            variants={listVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-15% 0px" }}
          >
            {t.work.projects.map((p, i) => {
              const meta = META[i];
              return (
                <motion.li
                  key={i}
                  variants={itemVariants}
                  className="grid grid-cols-12 gap-6 py-10 transition-colors hover:bg-[var(--color-bg-elevated)]/40"
                >
                  <div className="col-span-12 md:col-span-8">
                    <h3 className="font-display text-2xl tracking-tight md:text-3xl">
                      {p.title}
                    </h3>
                    <p className="mt-3 text-[var(--color-fg-muted)]">{p.blurb}</p>
                    <ul className="mt-4 space-y-2">
                      {p.bullets.map((b) => (
                        <li
                          key={b}
                          className="flex gap-3 text-sm leading-relaxed text-[var(--color-fg-muted)]"
                        >
                          <span
                            aria-hidden
                            className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[var(--color-accent)]"
                          />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                    {meta ? (
                      <ul className="mt-5 flex flex-wrap gap-2">
                        {meta.tags.map((tag) => (
                          <li
                            key={tag}
                            className="caption rounded-full border border-[var(--color-border-strong)] px-3 py-1 text-[var(--color-fg-muted)]"
                          >
                            {tag}
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </div>

                  <div className="col-span-12 md:col-span-4">
                    <p className="caption text-[var(--color-fg-muted)]">{t.work.context}</p>
                    <p className="mt-1 text-sm">{p.role}</p>
                    {meta?.code || meta?.demo ? (
                      <div className="mt-5 flex flex-wrap gap-5">
                        {meta.code ? (
                          <a href={meta.code} target="_blank" rel="noreferrer" data-cursor="link" className={linkClass}>
                            {t.work.code}
                          </a>
                        ) : null}
                        {meta.demo ? (
                          <a href={meta.demo} target="_blank" rel="noreferrer" data-cursor="link" className={linkClass}>
                            {t.work.demo}
                          </a>
                        ) : null}
                      </div>
                    ) : null}
                  </div>
                </motion.li>
              );
            })}
          </motion.ul>
        </SkewGroup>
      </div>
    </section>
  );
}
