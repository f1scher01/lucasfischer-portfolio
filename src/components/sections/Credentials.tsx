import { ScrollReveal } from "@/components/common/ScrollReveal";

const CERTIFICATIONS = [
  "Telemetria para Competições Acadêmicas",
  "Motores de Combustão Interna",
  "Modelamento com NX",
  "Dimensionamento e Otimização Estrutural Veicular (Ansys)",
  "Lean Six Sigma Green Belt",
  "CATIA — 3DExperience",
];

export function Credentials() {
  return (
    <section id="credentials" className="border-t border-[var(--color-border)] py-32">
      <div className="container-x grid gap-16 md:grid-cols-12">
        <ScrollReveal className="md:col-span-3">
          <p className="caption text-[var(--color-fg-muted)]">Credentials</p>
        </ScrollReveal>

        <div className="md:col-span-8 md:col-start-5">
          <ScrollReveal>
            <h3 className="caption mb-6 text-[var(--color-accent)]">
              Certifications
            </h3>
            <ul className="space-y-3">
              {CERTIFICATIONS.map((c) => (
                <li
                  key={c}
                  className="font-editorial text-xl leading-snug md:text-2xl"
                >
                  {c}
                </li>
              ))}
            </ul>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
