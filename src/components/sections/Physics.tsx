import { ScrollReveal } from "@/components/common/ScrollReveal";
import { RevealHeading } from "@/components/ui/RevealHeading";

const EQUATIONS = [
  { label: "Momento de inércia", expr: "I = b·h³ ⁄ 12", note: "seção retangular" },
  { label: "Tensão de flexão", expr: "σ = M·c ⁄ I", note: "fibra extrema" },
  { label: "Deflexão no centro", expr: "δ = F·L³ ⁄ 48EI", note: "viga bi-apoiada" },
];

export function Physics() {
  return (
    <section className="relative border-t border-[var(--color-border)] bg-[var(--color-bg)] py-24">
      <div className="container-x">
        <ScrollReveal className="mb-10 flex items-center gap-4">
          <span className="font-mono text-sm text-[var(--color-accent)]">↑</span>
          <span className="h-px flex-1 bg-[var(--color-border)]" />
          <p className="caption text-[var(--color-fg-muted)]">Real-time physics</p>
        </ScrollReveal>

        <RevealHeading
          segments={[
            { text: "A viga acima não é um vídeo. É " },
            { text: "Euler-Bernoulli", className: "text-[var(--color-accent)]" },
            { text: " resolvida a cada frame, no seu cursor." },
          ]}
          className="max-w-3xl font-display text-3xl leading-tight tracking-tight md:text-5xl"
        />

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {EQUATIONS.map((e, i) => (
            <ScrollReveal key={e.label} delay={i * 0.08}>
              <div className="h-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-elevated)]/40 p-6">
                <p className="caption text-[var(--color-fg-muted)]">{e.label}</p>
                <p className="mt-4 font-mono text-2xl text-[var(--color-fg)] md:text-3xl">
                  {e.expr}
                </p>
                <p className="mt-3 text-sm text-[var(--color-fg-dim)]">{e.note}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal delay={0.1}>
          <p className="mt-8 font-mono text-xs text-[var(--color-fg-dim)]">
            Aço 1020 · E = 200 GPa · σ_y = 250 MPa · L = 1 m · seção 30×50 mm ·
            colormap de tensão (azul → vermelho) como em software de FEA
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
