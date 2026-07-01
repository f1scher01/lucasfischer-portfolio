"use client";

import { ScrollReveal } from "@/components/common/ScrollReveal";
import { RevealHeading } from "@/components/ui/RevealHeading";
import { useLang } from "@/i18n/LangProvider";

const EXPRESSIONS = ["I = b·h³ ⁄ 12", "σ = M·c ⁄ I", "δ = F·L³ ⁄ 48EI"];

export function Physics() {
  const { t, lang } = useLang();

  return (
    <section className="relative border-t border-[var(--color-border)] bg-[var(--color-bg)] py-24">
      <div className="container-x">
        <ScrollReveal className="mb-10 flex items-center gap-4">
          <span className="font-mono text-sm text-[var(--color-accent)]">↑</span>
          <span className="h-px flex-1 bg-[var(--color-border)]" />
          <p className="caption text-[var(--color-fg-muted)]">
            {t.physics.eyebrow}
          </p>
        </ScrollReveal>

        <RevealHeading
          key={lang}
          segments={[
            { text: t.physics.h1 },
            { text: t.physics.hAccent, className: "text-[var(--color-accent)]" },
            { text: t.physics.h2 },
          ]}
          className="max-w-3xl font-display text-3xl leading-tight tracking-tight md:text-5xl"
        />

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {t.physics.eq.map((e, i) => (
            <ScrollReveal key={e.label} delay={i * 0.08}>
              <div className="h-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-elevated)]/40 p-6">
                <p className="caption text-[var(--color-fg-muted)]">{e.label}</p>
                <p className="mt-4 font-mono text-2xl text-[var(--color-fg)] md:text-3xl">
                  {EXPRESSIONS[i]}
                </p>
                <p className="mt-3 text-sm text-[var(--color-fg-dim)]">{e.note}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal delay={0.1}>
          <p className="mt-8 font-mono text-xs text-[var(--color-fg-dim)]">
            {t.physics.specs}
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
