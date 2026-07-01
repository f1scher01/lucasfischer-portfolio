"use client";

import { ScrollReveal } from "@/components/common/ScrollReveal";
import { RevealHeading } from "@/components/ui/RevealHeading";
import { useLang } from "@/i18n/LangProvider";

export function About() {
  const { t, lang } = useLang();

  return (
    <section
      id="about"
      className="relative border-t border-[var(--color-border)] bg-[var(--color-bg)] py-32"
    >
      {/* glow accent sutil */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 right-0 h-96 w-96 rounded-full bg-[var(--color-accent)] opacity-[0.07] blur-[120px]"
      />

      <div className="container-x">
        <ScrollReveal className="mb-12 flex items-center gap-4">
          <span className="font-mono text-sm text-[var(--color-accent)]">01</span>
          <span className="h-px flex-1 bg-[var(--color-border)]" />
          <p className="caption text-[var(--color-fg-muted)]">
            {t.about.eyebrow}
          </p>
        </ScrollReveal>

        <div className="grid gap-16 md:grid-cols-12">
          <div className="md:col-span-5">
            <RevealHeading
              key={lang}
              segments={[
                { text: t.about.h1 },
                {
                  text: t.about.h2,
                  className: "text-[var(--color-accent)]",
                  br: true,
                },
              ]}
              className="font-display text-3xl leading-tight tracking-tight md:text-5xl"
            />
          </div>

          <div className="md:col-span-6 md:col-start-7">
            <ScrollReveal delay={0.1}>
              <p className="font-editorial text-2xl leading-snug md:text-3xl">
                {t.about.lead1}
                <span className="text-[var(--color-accent)]">
                  {t.about.leadAccent}
                </span>
                {t.about.lead2}
              </p>
            </ScrollReveal>

            <ScrollReveal delay={0.18} className="mt-8 space-y-6">
              <p className="text-lg leading-relaxed text-[var(--color-fg-muted)]">
                {t.about.p1}
              </p>
              <p className="text-lg leading-relaxed text-[var(--color-fg-muted)]">
                {t.about.p2}
              </p>
            </ScrollReveal>
          </div>
        </div>

        <ScrollReveal delay={0.1} className="mt-20">
          <dl className="grid grid-cols-2 gap-x-6 gap-y-10 border-t border-[var(--color-border)] pt-12 md:grid-cols-4">
            {t.about.stats.map((s) => (
              <div key={s.label}>
                <dt className="font-display text-3xl tracking-tight text-[var(--color-fg)] md:text-4xl">
                  {s.value}
                </dt>
                <dd className="caption mt-2 text-[var(--color-fg-muted)]">
                  {s.label}
                </dd>
              </div>
            ))}
          </dl>
        </ScrollReveal>
      </div>
    </section>
  );
}
