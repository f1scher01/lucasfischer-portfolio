"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, PerspectiveCamera, AdaptiveDpr } from "@react-three/drei";
import * as THREE from "three";
import { Beam } from "./Beam";
import { Effects } from "./Effects";
import { sceneState } from "./sceneStore";
import { prefersReducedMotion, isCoarsePointer } from "@/lib/motion";

type Mode = "scroll" | "auto" | "static";

/** Dirige sceneState.targetLoad conforme o modo (dentro do loop R3F). */
function LoadDriver({ mode }: { mode: Mode }) {
  useFrame((state) => {
    if (mode === "static") {
      sceneState.targetLoad = 0.45;
    } else if (mode === "auto") {
      // oscila 0→1→0 em senoide (período ~5s) para touch
      const t = state.clock.elapsedTime;
      sceneState.targetLoad =
        (1 - Math.cos((2 * Math.PI * t) / 5)) / 2;
    }
    // mode "scroll": a Hero (ScrollTrigger) escreve targetLoad — nada aqui.
  });
  return null;
}

export default function SceneCanvas() {
  const [mode, setMode] = useState<Mode>("static");
  const [isCoarse, setIsCoarse] = useState(false);

  useEffect(() => {
    const reduce = prefersReducedMotion();
    const coarse = isCoarsePointer();
    sceneState.reducedMotion = reduce;
    setIsCoarse(coarse);
    setMode(reduce ? "static" : coarse ? "auto" : "scroll");
  }, []);

  // cursor modula levemente a carga (desktop)
  useEffect(() => {
    if (mode !== "scroll") return;
    const onMove = (e: PointerEvent) => {
      sceneState.pointerNudge = (e.clientX / window.innerWidth - 0.5) * 0.18;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [mode]);

  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true, toneMapping: THREE.ACESFilmicToneMapping }}
    >
      <PerspectiveCamera makeDefault position={[0, 0.32, 1.5]} fov={35} />
      <ambientLight intensity={0.3} />
      <directionalLight
        position={[2, 3, 2]}
        intensity={1.0}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0002}
        shadow-normalBias={0.02}
      />
      <directionalLight position={[-2, 1, -1]} intensity={0.3} />

      <Suspense fallback={null}>
        <Environment preset="city" />
      </Suspense>

      <Beam />
      <LoadDriver mode={mode} />

      {!sceneState.reducedMotion && !isCoarse ? <Effects /> : null}
      <AdaptiveDpr pixelated={false} />
    </Canvas>
  );
}
