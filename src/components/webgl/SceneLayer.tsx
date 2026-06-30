"use client";

import dynamic from "next/dynamic";

// Canvas WebGL só no client (ssr:false exige Client Component wrapper).
const SceneCanvas = dynamic(() => import("./SceneCanvas"), { ssr: false });

/**
 * Camada de fundo persistente: o Canvas 3D vive aqui, no layout — montado UMA
 * vez, nunca remonta entre rotas. Fica atrás do conteúdo e não captura ponteiro.
 */
export function SceneLayer() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0" aria-hidden>
      <SceneCanvas />
    </div>
  );
}
