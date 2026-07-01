"use client";

import { ScrollReveal } from "@/components/common/ScrollReveal";
import { ContactForm } from "@/components/sections/ContactForm";
import { RevealHeading } from "@/components/ui/RevealHeading";
import { useLang } from "@/i18n/LangProvider";

export function Contact() {
  const { t, lang } = useLang();

  return (
    <section
      id="contact"
      className="relative overflow-hidden border-t border-[var(--color-border)] bg-[var(--color-bg)] py-32"
    >
      {/* glow accent — calor no fim da página */}
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 left-1/4 h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-[var(--color-accent)] opacity-[0.08] blur-[140px]"
      />

      <div className="container-x">
        <ScrollReveal className="mb-12 flex items-center gap-4">
          <span className="font-mono text-sm text-[var(--color-accent)]">06</span>
          <span className="h-px flex-1 bg-[var(--color-border)]" />
          <p className="caption text-[var(--color-fg-muted)]">
            {t.contact.eyebrow}
          </p>
        </ScrollReveal>

        <RevealHeading
          key={lang}
          segments={[
            { text: t.contact.h1 },
            {
              text: t.contact.h2,
              className: "text-[var(--color-accent)]",
              br: true,
            },
          ]}
          className="font-display text-5xl tracking-tight md:text-8xl"
        />

        <div className="mt-16 grid gap-16 md:grid-cols-12">
          <ScrollReveal delay={0.2} className="md:col-span-5">
            <p className="text-lg text-[var(--color-fg-muted)]">
              {t.contact.desc}
            </p>
            <p className="mt-8 text-sm text-[var(--color-fg-muted)]">
              {t.contact.other}{" "}
              <a
                href="https://linkedin.com/in/lucasfischerpaez"
                target="_blank"
                rel="noreferrer"
                className="text-[var(--color-accent)] underline-offset-4 hover:underline"
              >
                LinkedIn ↗
              </a>{" "}
              ·{" "}
              <a
                href="mailto:fischer.paez@gmail.com"
                className="text-[var(--color-accent)] underline-offset-4 hover:underline"
              >
                Email
              </a>
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.3} className="md:col-span-7">
            <ContactForm />
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
