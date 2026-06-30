"use client";

import { Suspense, useEffect, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
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
      const t = state.clock.elapsedTime;
      sceneState.targetLoad = (1 - Math.cos((2 * Math.PI * t) / 5)) / 2;
    }
  });
  return null;
}

/** Câmera viva: enquadra a viga, com float lento + parallax pelo cursor. */
function CameraRig({ animate }: { animate: boolean }) {
  const { camera } = useThree();
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const fx = animate ? Math.sin(t * 0.25) * 0.06 : 0;
    const fy = animate ? Math.cos(t * 0.2) * 0.035 : 0;
    const tx = sceneState.px * 0.45 + fx;
    const ty = 0.14 - sceneState.py * 0.28 + fy;
    camera.position.x += (tx - camera.position.x) * 0.05;
    camera.position.y += (ty - camera.position.y) * 0.05;
    camera.lookAt(0, -0.02, 0);
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

  // ponteiro → parallax de câmera (sempre) + modulação de carga (só desktop/scroll)
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      const nx = e.clientX / window.innerWidth - 0.5;
      const ny = e.clientY / window.innerHeight - 0.5;
      sceneState.px = nx;
      sceneState.py = ny;
      if (mode === "scroll") sceneState.pointerNudge = nx * 0.12;
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
      <PerspectiveCamera makeDefault position={[0, 0.14, 1.5]} fov={42} />
      <CameraRig animate={mode !== "static"} />

      <ambientLight intensity={0.35} />
      <directionalLight
        position={[2, 3, 2]}
        intensity={1.1}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0002}
        shadow-normalBias={0.02}
      />
      <directionalLight position={[-3, 1, -1]} intensity={0.35} color="#88aaff" />
      <pointLight position={[0, 0.4, 0.6]} intensity={6} color="#f5993a" distance={3} />

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
