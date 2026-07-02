"use client";

import { useEffect, useState } from "react";
import { subscribeHud } from "@/components/webgl/sceneStore";
import { useLang } from "@/i18n/LangProvider";
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
  const { t } = useLang();

  useEffect(() => subscribeHud(({ load }) => setLoad(load)), []);

  const F = load * F_MAX;
  const sigma = maxStress(F, params);
  const delta = maxDeflection(F, params);
  const fs = safetyFactor(F, params);
  const yielding = sigma >= params.yieldStress * 0.95;

  return (
    <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-elevated)]/70 px-4 py-3 font-mono text-xs backdrop-blur-md">
      <div className="caption mb-2 text-[var(--color-fg-muted)]">
        {t.hero.hud.title}
      </div>
      <Row label="P" value={`${F.toFixed(0)} N`} />
      <Row label="σ_max" value={`${(sigma / 1e6).toFixed(1)} MPa`} warn={yielding} />
      <Row label="δ_max" value={`${(delta * 1000).toFixed(2)} mm`} />
      <Row label="FS" value={fs > 100 ? "∞" : fs.toFixed(2)} warn={fs < 1.5} />

      {/* utilização σ/σ_y — enche rumo ao escoamento */}
      <div
        className="mt-2 h-1 w-full overflow-hidden rounded-full bg-[var(--color-border)]"
        role="meter"
        aria-label={t.hero.hud.utilization}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(Math.min(sigma / params.yieldStress, 1) * 100)}
      >
        <div
          className="h-full rounded-full transition-transform duration-100"
          style={{
            transformOrigin: "left",
            transform: `scaleX(${Math.min(sigma / params.yieldStress, 1)})`,
            background: yielding ? "var(--color-danger)" : "var(--color-accent)",
          }}
        />
      </div>
      <div className="mt-1 flex justify-between text-[0.6rem] text-[var(--color-fg-dim)]">
        <span>0</span>
        <span>σ_y</span>
      </div>

      {/* legenda do colormap — escala relativa do campo atual (estilo FEA) */}
      <div
        className="mt-3 h-2.5 w-full rounded-sm"
        style={{
          background:
            "linear-gradient(90deg,#0d0887,#0052f0,#00b3f2,#1ad980,#59d933,#d9eb1a,#ff9e00,#fa4008,#c7080d)",
        }}
        aria-hidden
      />
      <div className="mt-1 flex justify-between text-[0.6rem] text-[var(--color-fg-dim)]">
        <span>−{(sigma / 1e6).toFixed(0)} MPa</span>
        <span>{t.hero.hud.compression}</span>
        <span>0</span>
        <span>{t.hero.hud.tension}</span>
        <span>+{(sigma / 1e6).toFixed(0)} MPa</span>
      </div>
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
