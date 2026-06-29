/**
 * Viga bi-apoiada com força concentrada no centro.
 * Modelo Euler-Bernoulli, seção retangular, regime elástico.
 *
 * Convenção:
 *   x ∈ [0, L]   — posição ao longo da viga
 *   F            — força aplicada no centro (N), positiva para baixo
 *   E            — módulo de Young (Pa)
 *   b, h         — base e altura da seção retangular (m)
 *
 * Saídas:
 *   I            — momento de inércia (m^4)
 *   M(x)         — momento fletor (N·m)
 *   sigma(x)     — tensão na fibra extrema (Pa)
 *   deflection(x) — deflexão vertical (m), negativa para baixo
 */

export interface BeamParams {
  L: number; // comprimento (m)
  b: number; // base seção (m)
  h: number; // altura seção (m)
  E: number; // módulo de Young (Pa)
  yieldStress: number; // tensão de escoamento (Pa)
}

export const STEEL_1020: BeamParams = {
  L: 1.0,
  b: 0.03,
  h: 0.05,
  E: 200e9,
  yieldStress: 250e6,
};

export function momentOfInertia(b: number, h: number): number {
  return (b * h * h * h) / 12;
}

/** Momento fletor em x para viga bi-apoiada com carga central F. */
export function bendingMoment(x: number, F: number, L: number): number {
  if (x < 0 || x > L) return 0;
  const xMirrored = x <= L / 2 ? x : L - x;
  return (F * xMirrored) / 2;
}

/** Tensão de flexão na fibra extrema (σ = M·c/I, com c = h/2). */
export function bendingStress(
  x: number,
  F: number,
  params: BeamParams,
): number {
  const I = momentOfInertia(params.b, params.h);
  const M = bendingMoment(x, F, params.L);
  return (M * (params.h / 2)) / I;
}

/** Deflexão vertical em x (m). Negativa = para baixo. */
export function deflection(x: number, F: number, params: BeamParams): number {
  const { L, E, b, h } = params;
  const I = momentOfInertia(b, h);
  // Por simetria, expressão para x ∈ [0, L/2]; espelhar para o restante.
  const xMirror = x <= L / 2 ? x : L - x;
  // y(x) = -F·x·(3L² - 4x²) / (48·E·I)
  return -(F * xMirror * (3 * L * L - 4 * xMirror * xMirror)) / (48 * E * I);
}

/** Tensão máxima ocorre no centro. */
export function maxStress(F: number, params: BeamParams): number {
  return bendingStress(params.L / 2, F, params);
}

/** Deflexão máxima também no centro. */
export function maxDeflection(F: number, params: BeamParams): number {
  return Math.abs(deflection(params.L / 2, F, params));
}

/** Fator de segurança baseado em escoamento. */
export function safetyFactor(F: number, params: BeamParams): number {
  const sigma = maxStress(F, params);
  return params.yieldStress / Math.max(sigma, 1);
}

/** Mapeia tensão [0, yield] para [0, 1] saturando acima. */
export function normalizedStress(sigma: number, yieldStress: number): number {
  return Math.min(sigma / yieldStress, 1);
}

/** Força que causa escoamento exato (limite admissível "honesto"). */
export function forceAtYield(params: BeamParams): number {
  const I = momentOfInertia(params.b, params.h);
  // σ_y = (F·L/4)·(h/2) / I  →  F = (4 · σ_y · I) / (L · h/2)
  return (4 * params.yieldStress * I) / (params.L * (params.h / 2));
}
