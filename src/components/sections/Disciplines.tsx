import { ScrollReveal } from "@/components/common/ScrollReveal";

const DISCIPLINES = [
  {
    n: "01",
    title: "Vehicle Dynamics",
    desc: "Suspensão, transferência de carga e comportamento em pista — do modelo analítico à validação com dados.",
  },
  {
    n: "02",
    title: "Análise Estrutural · FEA",
    desc: "Dimensionamento e otimização por elementos finitos: equilíbrio entre rigidez, massa e fator de segurança.",
  },
  {
    n: "03",
    title: "Modelagem CAD",
    desc: "SolidWorks, NX e CATIA 3DExperience — de conjuntos mecânicos a peças prontas para manufatura.",
  },
  {
    n: "04",
    title: "Telemetria & Dados",
    desc: "Aquisição, pós-processamento e decisão de setup baseada em evidência, não em intuição.",
  },
  {
    n: "05",
    title: "Powertrain",
    desc: "Fundamentos de motores de combustão interna, desempenho e eficiência veicular.",
  },
  {
    n: "06",
    title: "Web & 3D em tempo real",
    desc: "Next.js, React Three Fiber e shaders — a mesma precisão de engenharia aplicada à experiência digital.",
  },
];

export function Disciplines() {
  return (
    <section className="relative border-t border-[var(--color-border)] bg-[var(--color-bg)] py-32">
      <div className="container-x">
        <ScrollReveal className="mb-12 flex items-center gap-4">
          <span className="font-mono text-sm text-[var(--color-accent)]">02</span>
          <span className="h-px flex-1 bg-[var(--color-border)]" />
          <p className="caption text-[var(--color-fg-muted)]">Disciplinas</p>
        </ScrollReveal>

        <ScrollReveal className="mb-16">
          <h2 className="max-w-3xl font-display text-4xl tracking-tight md:text-6xl">
            Engenharia mecânica de ponta a ponta — e o código que a apresenta.
          </h2>
        </ScrollReveal>

        <ul className="grid gap-px overflow-hidden rounded-lg border border-[var(--color-border)] bg-[var(--color-border)] md:grid-cols-2 lg:grid-cols-3">
          {DISCIPLINES.map((d, i) => (
            <ScrollReveal key={d.title} delay={(i % 3) * 0.06}>
              <li className="group h-full bg-[var(--color-bg)] p-8 transition-colors hover:bg-[var(--color-bg-elevated)]">
                <span className="font-mono text-sm text-[var(--color-accent)]">
                  {d.n}
                </span>
                <h3 className="mt-5 font-display text-xl tracking-tight md:text-2xl">
                  {d.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-[var(--color-fg-muted)]">
                  {d.desc}
                </p>
              </li>
            </ScrollReveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
