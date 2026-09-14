"use client";

import { ScrollReveal } from "@/components/common/ScrollReveal";
import { RevealHeading } from "@/components/ui/RevealHeading";
import { SkewGroup } from "@/components/ui/SkewGroup";
import { useLang } from "@/i18n/LangProvider";

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
          <p className="caption text-[var(--color-fg-muted)]">{t.credentials.eyebrow}</p>
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
              <span className="text-[var(--color-fg)]">{t.credentials.descStrong}</span>
              {t.credentials.desc2}
            </p>
          </ScrollReveal>

          <SkewGroup className="space-y-12 md:col-span-7 md:col-start-6">
            {t.credentials.groups.map((g, gi) => (
              <ScrollReveal key={g.title} delay={gi * 0.08}>
                <h3 className="caption mb-5 text-[var(--color-accent)]">{g.title}</h3>
                <ul className="space-y-4">
                  {g.items.map((c) => (
                    <li
                      key={c.name}
                      className="flex flex-col gap-1 border-b border-[var(--color-border)] pb-4 sm:flex-row sm:items-baseline sm:gap-4"
                    >
                      <span className="font-editorial text-xl leading-snug md:text-2xl">{c.name}</span>
                      <span className="shrink-0 font-mono text-xs text-[var(--color-fg-dim)] sm:ml-auto sm:text-right">
                        {c.meta}
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
