"use client";

import { ScrollReveal } from "@/components/common/ScrollReveal";
import { RevealHeading } from "@/components/ui/RevealHeading";
import { useLang } from "@/i18n/LangProvider";

export function Disciplines() {
  const { t, lang } = useLang();

  return (
    <section className="relative border-t border-[var(--color-border)] bg-[var(--color-bg)] py-32">
      <div className="container-x">
        <ScrollReveal className="mb-12 flex items-center gap-4">
          <span className="font-mono text-sm text-[var(--color-accent)]">03</span>
          <span className="h-px flex-1 bg-[var(--color-border)]" />
          <p className="caption text-[var(--color-fg-muted)]">
            {t.disciplines.eyebrow}
          </p>
        </ScrollReveal>

        <RevealHeading
          key={lang}
          segments={[{ text: t.disciplines.h }]}
          className="mb-16 max-w-3xl font-display text-4xl tracking-tight md:text-6xl"
        />

        <ul className="grid gap-px overflow-hidden rounded-lg border border-[var(--color-border)] bg-[var(--color-border)] md:grid-cols-2 lg:grid-cols-3">
          {t.disciplines.items.map((d, i) => (
            <ScrollReveal key={d.title} delay={(i % 3) * 0.06}>
              <li className="group h-full bg-[var(--color-bg)] p-8 transition-colors hover:bg-[var(--color-bg-elevated)]">
                <span className="font-mono text-sm text-[var(--color-accent)]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-5 font-display text-xl tracking-tight md:text-2xl">
                  {d.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-[var(--color-fg-muted)]">
                  {d.desc}
                </p>
              </li>
            </ScrollReveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
