"use client";

import { motion, type Variants } from "motion/react";
import { ScrollReveal } from "@/components/common/ScrollReveal";
import { RevealHeading } from "@/components/ui/RevealHeading";
import { useLang } from "@/i18n/LangProvider";

interface Skill {
  name: string;
  level: number; // 0..100
}

const GROUPS: { title: string; items: Skill[] }[] = [
  {
    title: "CAD / CAE",
    items: [
      { name: "SolidWorks", level: 85 },
      { name: "Siemens NX", level: 75 },
      { name: "CATIA 3DExperience", level: 65 },
      { name: "Ansys Workbench", level: 70 },
      { name: "Fusion 360 · AutoCAD", level: 78 },
    ],
  },
  {
    title: "Programação",
    items: [
      { name: "Python", level: 80 },
      { name: "MATLAB", level: 75 },
      { name: "TypeScript / React", level: 78 },
      { name: "Three.js / R3F", level: 66 },
    ],
  },
  {
    title: "Manufatura",
    items: [
      { name: "Impressão 3D", level: 82 },
      { name: "Usinagem CNC", level: 60 },
    ],
  },
  {
    title: "Idiomas",
    items: [
      { name: "Português (nativo)", level: 100 },
      { name: "Español (avançado)", level: 92 },
      { name: "English (C1)", level: 85 },
      { name: "Français (B1)", level: 58 },
    ],
  },
];

const barVariants: Variants = {
  hidden: { scaleX: 0 },
  visible: (level: number) => ({
    scaleX: level / 100,
    transition: { duration: 1, ease: [0.16, 1, 0.3, 1] },
  }),
};

function Bar({ skill, index }: { skill: Skill; index: number }) {
  return (
    <li className="py-2.5">
      <div className="mb-2 flex items-baseline justify-between gap-4">
        <span className="font-mono text-sm text-[var(--color-fg)]">
          {skill.name}
        </span>
        <span className="font-mono text-xs text-[var(--color-fg-dim)]">
          {skill.level}
        </span>
      </div>
      <div className="h-[3px] w-full overflow-hidden rounded-full bg-[var(--color-border)]">
        <motion.div
          className="h-full origin-left rounded-full bg-[var(--color-accent)]"
          variants={barVariants}
          custom={skill.level}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ delay: index * 0.05 }}
        />
      </div>
    </li>
  );
}

export function Toolkit() {
  const { t, lang } = useLang();

  return (
    <section
      id="toolkit"
      className="relative border-t border-[var(--color-border)] bg-[var(--color-bg)] py-32"
    >
      <div className="container-x">
        <ScrollReveal className="mb-12 flex items-center gap-4">
          <span className="font-mono text-sm text-[var(--color-accent)]">04</span>
          <span className="h-px flex-1 bg-[var(--color-border)]" />
          <p className="caption text-[var(--color-fg-muted)]">
            {t.toolkit.eyebrow}
          </p>
        </ScrollReveal>

        <ScrollReveal className="mb-16">
          <RevealHeading
            key={lang}
            segments={[{ text: t.toolkit.h }]}
            className="font-display text-4xl tracking-tight md:text-6xl"
          />
          <p className="mt-4 max-w-xl text-[var(--color-fg-muted)]">
            {t.toolkit.sub}
          </p>
        </ScrollReveal>

        <div className="grid gap-x-16 gap-y-12 md:grid-cols-2">
          {GROUPS.map((g, gi) => (
            <ScrollReveal key={g.title}>
              <h3 className="caption mb-4 text-[var(--color-accent)]">
                {t.toolkit.groups[gi] ?? g.title}
              </h3>
              <ul className="divide-y divide-[var(--color-border)]">
                {g.items.map((s, i) => (
                  <Bar key={s.name} skill={s} index={i} />
                ))}
              </ul>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
