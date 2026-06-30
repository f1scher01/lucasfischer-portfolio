import { ScrollReveal } from "@/components/common/ScrollReveal";

const STATS = [
  { value: "2º ano", label: "Eng. Mecânica · IMT" },
  { value: "+360 h", label: "Certificações técnicas" },
  { value: "4", label: "Idiomas" },
  { value: "CAD · CAE · Web", label: "Áreas de atuação" },
];

export function About() {
  return (
    <section
      id="about"
      className="relative border-t border-[var(--color-border)] bg-[var(--color-bg)] py-32"
    >
      {/* glow accent sutil — quebra a sobriedade */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 right-0 h-96 w-96 rounded-full bg-[var(--color-accent)] opacity-[0.07] blur-[120px]"
      />

      <div className="container-x">
        <ScrollReveal className="mb-12 flex items-center gap-4">
          <span className="font-mono text-sm text-[var(--color-accent)]">01</span>
          <span className="h-px flex-1 bg-[var(--color-border)]" />
          <p className="caption text-[var(--color-fg-muted)]">Sobre mim</p>
        </ScrollReveal>

        <div className="grid gap-16 md:grid-cols-12">
          <ScrollReveal delay={0.05} className="md:col-span-5">
            <h2 className="font-display text-3xl leading-tight tracking-tight md:text-5xl">
              Engenheiro em formação,
              <br />
              <span className="text-[var(--color-accent)]">
                construtor por natureza.
              </span>
            </h2>
          </ScrollReveal>

          <div className="md:col-span-6 md:col-start-7">
            <ScrollReveal delay={0.1}>
              <p className="font-editorial text-2xl leading-snug md:text-3xl">
                Estudante de Engenharia Mecânica no{" "}
                <span className="text-[var(--color-accent)]">
                  Instituto Mauá de Tecnologia
                </span>
                , no 2º ano. Gosto de problemas que cruzam o físico e o digital
                — de uma análise estrutural por elementos finitos a uma
                transição de 200&nbsp;ms.
              </p>
            </ScrollReveal>

            <ScrollReveal delay={0.18} className="mt-8 space-y-6">
              <p className="text-lg leading-relaxed text-[var(--color-fg-muted)]">
                Minha base é mecânica: CAD/CAE, otimização estrutural, motores e
                telemetria. Mas aplico a mesma exigência de precisão quando
                construo experiências web — a viga aqui em cima usa a equação de
                Euler-Bernoulli de verdade, não um vídeo.
              </p>
              <p className="text-lg leading-relaxed text-[var(--color-fg-muted)]">
                Multilíngue (português, espanhol, inglês e francês em formação),
                curioso por motorsport e mercado, e movido por entregar coisas
                que funcionam de verdade.
              </p>
            </ScrollReveal>
          </div>
        </div>

        <ScrollReveal delay={0.1} className="mt-20">
          <dl className="grid grid-cols-2 gap-x-6 gap-y-10 border-t border-[var(--color-border)] pt-12 md:grid-cols-4">
            {STATS.map((s) => (
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
