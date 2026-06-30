"use client";

import { EffectComposer, Vignette, Noise } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";

/**
 * Pós-processamento discreto — vinheta + grão sutil para acabamento, SEM bloom
 * (a viga deve ler como resultado de software FEA, não brilhar como um sol).
 * Montado só no desktop (interação "cursor").
 */
export function Effects() {
  return (
    <EffectComposer multisampling={0}>
      <Vignette offset={0.32} darkness={0.62} />
      <Noise premultiply blendFunction={BlendFunction.OVERLAY} opacity={0.025} />
    </EffectComposer>
  );
}
