"use client";

import { useState } from "react";
import { ScrollReveal } from "@/components/common/ScrollReveal";
import { RevealHeading } from "@/components/ui/RevealHeading";
import { useLang } from "@/i18n/LangProvider";

const EMAIL = "fischer.paez@gmail.com";
const CHANNELS = [
  { label: "LinkedIn", value: "linkedin.com/in/lucasfischerpaez", href: "https://www.linkedin.com/in/lucasfischerpaez" },
  { label: "GitHub", value: "github.com/f1scher01", href: "https://github.com/f1scher01" },
];

export function Contact() {
  const { t, lang } = useLang();
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      /* clipboard bloqueado: o link mailto cobre */
    }
  };

  return (
    <section
      id="contact"
      className="relative overflow-hidden border-t border-[var(--color-border)] bg-[var(--color-bg)] py-32"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 left-1/4 h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-[var(--color-accent)] opacity-[0.08] blur-[140px]"
      />

      <div className="container-x">
        <ScrollReveal className="mb-12 flex items-center gap-4">
          <span className="font-mono text-sm text-[var(--color-accent)]">06</span>
          <span className="h-px flex-1 bg-[var(--color-border)]" />
          <p className="caption text-[var(--color-fg-muted)]">{t.contact.eyebrow}</p>
        </ScrollReveal>

        <RevealHeading
          key={lang}
          segments={[
            { text: t.contact.h1 },
            { text: t.contact.h2, className: "text-[var(--color-accent)]", br: true },
          ]}
          className="font-display text-5xl tracking-tight md:text-8xl"
        />

        <div className="mt-16 grid gap-16 md:grid-cols-12">
          <ScrollReveal delay={0.2} className="md:col-span-5">
            <p className="text-lg text-[var(--color-fg-muted)]">{t.contact.desc}</p>
          </ScrollReveal>

          <ScrollReveal delay={0.3} className="md:col-span-7">
            <ul className="divide-y divide-[var(--color-border)] border-y border-[var(--color-border)]">
              <li className="flex flex-col gap-2 py-6 sm:flex-row sm:items-baseline sm:justify-between">
                <span className="caption text-[var(--color-fg-muted)]">{t.contact.email}</span>
                <span className="flex flex-wrap items-baseline gap-4">
                  <a
                    href={`mailto:${EMAIL}`}
                    data-cursor="link"
                    className="font-editorial text-2xl text-[var(--color-fg)] underline-offset-4 hover:text-[var(--color-accent)] hover:underline md:text-3xl"
                  >
                    {EMAIL}
                  </a>
                  <button
                    type="button"
                    onClick={copyEmail}
                    data-cursor="link"
                    className="caption text-[var(--color-accent)] underline-offset-4 hover:underline"
                  >
                    {copied ? t.contact.copied : t.contact.copy}
                  </button>
                </span>
              </li>
              {CHANNELS.map((c) => (
                <li key={c.label} className="flex flex-col gap-2 py-6 sm:flex-row sm:items-baseline sm:justify-between">
                  <span className="caption text-[var(--color-fg-muted)]">{c.label}</span>
                  <a
                    href={c.href}
                    target="_blank"
                    rel="noreferrer"
                    data-cursor="link"
                    className="font-editorial text-2xl text-[var(--color-fg)] underline-offset-4 hover:text-[var(--color-accent)] hover:underline md:text-3xl"
                  >
                    {c.value} ↗
                  </a>
                </li>
              ))}
            </ul>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
