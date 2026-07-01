/**
 * Estado compartilhado da cena 3D — mutável, lido DENTRO do useFrame (nunca
 * via React state no hot path). O scroll/cursor escrevem aqui; a viga lê.
 */
export const sceneState = {
  targetLoad: 0, // 0..1 — carga alvo (resolvida pelo LoadDriver)
  load: 0, // 0..1 — carga suavizada (lerp no useFrame)
  cursorLoad: 0, // 0..1 — carga vinda do Y do cursor (interação principal)
  px: 0, // -0.5..0.5 — ponteiro X normalizado (parallax de câmera)
  py: 0, // -0.5..0.5 — ponteiro Y normalizado
  scrollVelocity: 0, // velocidade normalizada do Lenis
  reducedMotion: false,
  autoPaused: false, // touch: pausa o loop automático de carga
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
