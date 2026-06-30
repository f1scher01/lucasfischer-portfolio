"use client";

import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";

// Canvas WebGL só no client (ssr:false exige Client Component wrapper).
const SceneCanvas = dynamic(() => import("./SceneCanvas"), { ssr: false });

/**
 * Camada de fundo do HERO: o Canvas 3D vive aqui, no layout — montado uma vez,
 * nunca remonta entre rotas. Fica atrás do conteúdo, não captura ponteiro e
 * DESVANECE conforme você rola para fora do hero (a viga aparece só no topo).
 */
export function SceneLayer() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf = 0;
    const apply = () => {
      const vh = window.innerHeight || 1;
      // 1 no topo → 0 ao passar ~85% do hero
      const o = Math.min(Math.max(1 - window.scrollY / (vh * 0.85), 0), 1);
      if (ref.current) ref.current.style.opacity = String(o);
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(apply);
    };
    apply();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={ref}
      className="pointer-events-none fixed inset-0 z-0 transition-opacity"
      aria-hidden
    >
      <SceneCanvas />
    </div>
  );
}
