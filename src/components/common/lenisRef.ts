import type Lenis from "lenis";

/** Referência global ao Lenis para o preloader/transições pausarem o scroll. */
export const lenisRef: { current: Lenis | null } = { current: null };
