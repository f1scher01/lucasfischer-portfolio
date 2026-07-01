"use client";

import { ScrollReveal } from "@/components/common/ScrollReveal";
import { RevealHeading } from "@/components/ui/RevealHeading";
import { SkewGroup } from "@/components/ui/SkewGroup";
import { useLang } from "@/i18n/LangProvider";

const GROUPS = [
  {
    title: "Engenharia & CAE",
    items: [
      "Dimensionamento e Otimização Estrutural Veicular",
      "Modelamento de Conjuntos Mecânicos (NX)",
      "3DExperience — Introdução ao CATIA",
      "Motores de Combustão Interna de Veículos",
    ],
  },
  {
    title: "Métodos, Dados & Gestão",
    items: [
      "Lean Six Sigma — Green Belt",
      "Telemetria para Competições Acadêmicas",
      "A Bolsa de Valores no Brasil e seus Ativos Financeiros",
    ],
  },
  {
    title: "Extensão & Idiomas",
    items: [
      "Projeto Integrador Extensionista (MC-1)",
      "Introdução à Língua Francesa (A1.1)",
    ],
  },
];

export function Credentials() {
  const { t, lang } = useLang();

  return (
    <section
      id="credentials"
      className="relative border-t border-[var(--color-border)] bg-[var(--color-bg)] py-32"
    >
      <div className="container-x">
        <ScrollReveal className="mb-12 flex items-center gap-4">
          <span className="font-mono text-sm text-[var(--color-accent)]">05</span>
          <span className="h-px flex-1 bg-[var(--color-border)]" />
          <p className="caption text-[var(--color-fg-muted)]">
            {t.credentials.eyebrow}
          </p>
        </ScrollReveal>

        <div className="grid gap-12 md:grid-cols-12">
          <ScrollReveal className="md:col-span-4">
            <RevealHeading
              key={lang}
              segments={[{ text: t.credentials.h }]}
              className="font-display text-4xl tracking-tight md:text-5xl"
            />
            <p className="mt-4 text-[var(--color-fg-muted)]">
              {t.credentials.desc1}
              <span className="text-[var(--color-fg)]">
                {t.credentials.descStrong}
              </span>
              {t.credentials.desc2}
            </p>
          </ScrollReveal>

          <SkewGroup className="space-y-12 md:col-span-7 md:col-start-6">
            {GROUPS.map((g, gi) => (
              <ScrollReveal key={g.title} delay={gi * 0.08}>
                <h3 className="caption mb-5 text-[var(--color-accent)]">
                  {t.credentials.groups[gi] ?? g.title}
                </h3>
                <ul className="space-y-4">
                  {g.items.map((c) => (
                    <li
                      key={c}
                      className="flex items-baseline gap-4 border-b border-[var(--color-border)] pb-4"
                    >
                      <span className="font-editorial text-xl leading-snug md:text-2xl">
                        {c}
                      </span>
                      <span className="ml-auto shrink-0 font-mono text-xs text-[var(--color-fg-dim)]">
                        40 h
                      </span>
                    </li>
                  ))}
                </ul>
              </ScrollReveal>
            ))}
          </SkewGroup>
        </div>
      </div>
    </section>
  );
}
