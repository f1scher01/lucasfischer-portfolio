"use client";

import { ScrollReveal } from "@/components/common/ScrollReveal";
import { RevealHeading } from "@/components/ui/RevealHeading";
import { useLang } from "@/i18n/LangProvider";

/** Ferramentas agrupadas, cada uma com a evidência de onde foi usada. */
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
          <p className="caption text-[var(--color-fg-muted)]">{t.toolkit.eyebrow}</p>
        </ScrollReveal>

        <ScrollReveal className="mb-16">
          <RevealHeading
            key={lang}
            segments={[{ text: t.toolkit.h }]}
            className="font-display text-4xl tracking-tight md:text-6xl"
          />
          <p className="mt-4 max-w-xl text-[var(--color-fg-muted)]">{t.toolkit.sub}</p>
        </ScrollReveal>

        <div className="grid gap-x-16 gap-y-12 md:grid-cols-2">
          {t.toolkit.groups.map((g) => (
            <ScrollReveal key={g.title}>
              <h3 className="caption mb-4 text-[var(--color-accent)]">{g.title}</h3>
              <ul className="divide-y divide-[var(--color-border)] border-t border-[var(--color-border)]">
                {g.items.map((item) => (
                  <li key={item.name} className="py-3.5">
                    <p className="font-mono text-sm text-[var(--color-fg)]">{item.name}</p>
                    <p className="mt-1 text-sm text-[var(--color-fg-muted)]">{item.note}</p>
                  </li>
                ))}
              </ul>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
