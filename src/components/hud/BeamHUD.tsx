"use client";

import { useEffect, useState } from "react";
import { subscribeHud } from "@/components/webgl/sceneStore";
import {
  STEEL_1020,
  forceAtYield,
  maxStress,
  maxDeflection,
  safetyFactor,
} from "@/lib/beam-physics";

const params = STEEL_1020;
const F_MAX = forceAtYield(params) * 1.05;

/** Telemetria ao vivo da viga — lê o store via subscription (~12fps). */
export function BeamHUD() {
  const [load, setLoad] = useState(0);

  useEffect(() => subscribeHud(({ load }) => setLoad(load)), []);

  const F = load * F_MAX;
  const sigma = maxStress(F, params);
  const delta = maxDeflection(F, params);
  const fs = safetyFactor(F, params);
  const yielding = sigma >= params.yieldStress * 0.95;

  return (
    <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-elevated)]/70 px-4 py-3 font-mono text-xs backdrop-blur-md">
      <div className="caption mb-2 text-[var(--color-fg-muted)]">
        Live load telemetry
      </div>
      <Row label="P" value={`${F.toFixed(0)} N`} />
      <Row label="σ_max" value={`${(sigma / 1e6).toFixed(1)} MPa`} warn={yielding} />
      <Row label="δ_center" value={`${(delta * 1000).toFixed(2)} mm`} />
      <Row label="FS" value={fs > 100 ? "∞" : fs.toFixed(2)} warn={fs < 1.5} />
    </div>
  );
}

function Row({
  label,
  value,
  warn,
}: {
  label: string;
  value: string;
  warn?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between gap-6 py-0.5">
      <span className="text-[var(--color-fg-dim)]">{label}</span>
      <span
        className={
          warn
            ? "font-semibold text-[var(--color-danger)]"
            : "text-[var(--color-fg)]"
        }
      >
        {value}
      </span>
    </div>
  );
}
