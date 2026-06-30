/**
 * Estado compartilhado da cena 3D — mutável, lido DENTRO do useFrame (nunca
 * via React state no hot path). O scroll/cursor escrevem aqui; a viga lê.
 */
export const sceneState = {
  targetLoad: 0, // 0..1 — carga alvo (scroll na Hero)
  load: 0, // 0..1 — carga suavizada (lerp no useFrame)
  pointerNudge: 0, // -0.15..0.15 — modulação leve pelo cursor
  scrollVelocity: 0, // velocidade normalizada do Lenis (p/ chromatic aberration)
  reducedMotion: false,
};

// pub/sub leve para o HUD (DOM) — emitido ~12fps de dentro do useFrame.
type HudListener = (snapshot: { load: number }) => void;
const listeners = new Set<HudListener>();

export function subscribeHud(fn: HudListener): () => void {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

export function emitHud(load: number): void {
  for (const fn of listeners) fn({ load });
}
