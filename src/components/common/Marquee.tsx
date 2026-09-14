/**
 * Ticker infinito com termos técnicos neutros (iguais em todos os idiomas).
 * CSS puro; congela sob prefers-reduced-motion (regra global zera animation-duration).
 */
const TERMS = [
  "EULER–BERNOULLI",
  "FEA",
  "ANSYS",
  "CAD / CAE",
  "GRANTA EDUPACK",
  "PYTHON",
  "NETCDF",
  "GDAL",
  "QGIS",
  "SIH/SUS",
  "INFLUXDB",
  "GRAFANA",
];

export function Marquee() {
  const row = TERMS.map((term, i) => (
    <span key={i} className="mx-6 inline-flex items-center gap-6">
      <span>{term}</span>
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
