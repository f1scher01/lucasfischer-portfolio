import { ScrollReveal } from "@/components/common/ScrollReveal";
import { MagneticButton } from "@/components/ui/MagneticButton";

export function Contact() {
  return (
    <section id="contact" className="border-t border-[var(--color-border)] py-32">
      <div className="container-x">
        <ScrollReveal className="mb-12">
          <p className="caption text-[var(--color-fg-muted)]">Contact</p>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <h2 className="font-display text-5xl tracking-tight md:text-8xl">
            Let's build
            <br />
            <span className="text-[var(--color-accent)]">something solid.</span>
          </h2>
        </ScrollReveal>

        <ScrollReveal delay={0.2} className="mt-12 max-w-xl">
          <p className="text-lg text-[var(--color-fg-muted)]">
            Disponível para parcerias em FSAE / automotive / hardware,
            freelance premium de site e oportunidades acadêmicas.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.3} className="mt-12 flex flex-wrap gap-4">
          <MagneticButton
            as="a"
            href="mailto:lucasf22games@gmail.com"
            className="border-[var(--color-accent)] text-[var(--color-accent)]"
          >
            Send an email →
          </MagneticButton>
          <MagneticButton
            as="a"
            href="https://linkedin.com/in/lucasfischerpaez"
          >
            Connect on LinkedIn ↗
          </MagneticButton>
        </ScrollReveal>
      </div>
    </section>
  );
}
