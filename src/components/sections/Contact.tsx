import { ScrollReveal } from "@/components/common/ScrollReveal";
import { ContactForm } from "@/components/sections/ContactForm";

export function Contact() {
  return (
    <section id="contact" className="border-t border-[var(--color-border)] py-32">
      <div className="container-x">
        <ScrollReveal className="mb-12">
          <p className="caption text-[var(--color-fg-muted)]">Contact</p>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <h2 className="font-display text-5xl tracking-tight md:text-8xl">
            Let&apos;s build
            <br />
            <span className="text-[var(--color-accent)]">something solid.</span>
          </h2>
        </ScrollReveal>

        <div className="mt-16 grid gap-16 md:grid-cols-12">
          <ScrollReveal delay={0.2} className="md:col-span-5">
            <p className="text-lg text-[var(--color-fg-muted)]">
              Disponível para parcerias em FSAE / automotive / hardware,
              freelance premium de site e oportunidades acadêmicas.
            </p>
            <p className="mt-8 text-sm text-[var(--color-fg-muted)]">
              Prefere outro canal?{" "}
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
                href="mailto:lucasf22games@gmail.com"
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
