import { ScrollReveal } from "@/components/common/ScrollReveal";

export function About() {
  return (
    <section id="about" className="border-t border-[var(--color-border)] py-32">
      <div className="container-x grid gap-16 md:grid-cols-12">
        <ScrollReveal className="md:col-span-3">
          <p className="caption text-[var(--color-fg-muted)]">About</p>
        </ScrollReveal>

        <div className="md:col-span-8 md:col-start-5">
          <ScrollReveal delay={0.1}>
            <p className="font-editorial text-2xl leading-snug md:text-3xl">
              Aluno de Engenharia Mecânica no{" "}
              <span className="text-[var(--color-accent)]">
                Instituto Mauá de Tecnologia
              </span>
              . Trainee na Maua Racing, focado em vehicle dynamics. Atuo em
              projetos de extensão universitária aplicando CAD/CAE a tecnologias
              assistivas.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.2} className="mt-8">
            <p className="text-lg leading-relaxed text-[var(--color-fg-muted)]">
              Fora do laboratório, construo sites premium para marcas que
              querem aparência e performance no mesmo nível. A precisão que
              aplico em um modelo de elementos finitos é a mesma que aplico em
              uma transição de 200ms.
            </p>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
