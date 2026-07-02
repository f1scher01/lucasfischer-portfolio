/**
 * Ticker infinito estilo site de motorsport — termos técnicos neutros
 * (iguais em PT/EN). CSS puro; congela sob prefers-reduced-motion
 * (regra global zera animation-duration).
 */
const TERMS = [
  "VEHICLE DYNAMICS",
  "EULER–BERNOULLI",
  "FEA",
  "CAD / CAE",
  "TELEMETRIA",
  "FSAE",
  "NEXT.JS",
  "REACT THREE FIBER",
  "SOLIDWORKS",
  "ANSYS",
];

export function Marquee() {
  const row = TERMS.map((t2, i) => (
    <span key={i} className="mx-6 inline-flex items-center gap-6">
      <span>{t2}</span>
      <span className="text-[var(--color-accent)]">·</span>
    </span>
  ));

  return (
    <div
      className="relative overflow-hidden border-t border-[var(--color-border)] bg-[var(--color-bg)] py-4"
      aria-hidden
    >
      <div className="marquee-track caption whitespace-nowrap text-[var(--color-fg-dim)]">
        {row}
        {row}
      </div>
    </div>
  );
}
