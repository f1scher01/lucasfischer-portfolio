"use client";

import {
  EffectComposer,
  Bloom,
  Vignette,
  Noise,
} from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";

/**
 * Pós-processamento cinematográfico. Bloom captura o emissivo da viga no pico
 * (a estrutura "sangra" luz sob tensão). Mantido enxuto e estável — sem refs a
 * efeitos nem objetos Three em props (evita serialização circular do reconciler).
 * Montado só quando NÃO há prefers-reduced-motion.
 */
export function Effects() {
  return (
    <EffectComposer multisampling={0}>
      <Bloom
        mipmapBlur
        luminanceThreshold={0.5}
        luminanceSmoothing={0.25}
        intensity={1.0}
      />
      <Vignette offset={0.3} darkness={0.7} />
      <Noise premultiply blendFunction={BlendFunction.OVERLAY} opacity={0.035} />
    </EffectComposer>
  );
}
