"use client";

import { Suspense, useEffect, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, PerspectiveCamera, AdaptiveDpr } from "@react-three/drei";
import * as THREE from "three";
import { Beam } from "./Beam";
import { Effects } from "./Effects";
import { sceneState } from "./sceneStore";
import { prefersReducedMotion, isCoarsePointer } from "@/lib/motion";

type Interaction = "cursor" | "auto";

/**
 * Resolve sceneState.targetLoad por frame:
 *  - cursor (desktop): carga segue o Y do cursor + respiração idle (interação
 *    sempre viva; idle some em reduced-motion, mas o cursor continua valendo).
 *  - auto (touch): oscila em senoide.
 */
function LoadDriver({
  interaction,
  reduced,
}: {
  interaction: Interaction;
  reduced: boolean;
}) {
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (interaction === "auto") {
      if (!sceneState.autoPaused) {
        sceneState.targetLoad = (1 - Math.cos((2 * Math.PI * t) / 5)) / 2;
      }
    } else {
      const idle = reduced ? 0 : 0.06 + Math.sin(t * 0.8) * 0.05;
      sceneState.targetLoad = Math.min(
        1,
        Math.max(sceneState.cursorLoad, idle),
      );
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
  const [interaction, setInteraction] = useState<Interaction>("cursor");
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const r = prefersReducedMotion();
    const coarse = isCoarsePointer();
    sceneState.reducedMotion = r;
    setReduced(r);
    setInteraction(coarse ? "auto" : "cursor");
  }, []);

  // cursor → carga (Y) + parallax de câmera (X/Y). Sempre ativo no desktop.
  useEffect(() => {
    if (interaction !== "cursor") return;
    const onMove = (e: PointerEvent) => {
      sceneState.px = e.clientX / window.innerWidth - 0.5;
      sceneState.py = e.clientY / window.innerHeight - 0.5;
      sceneState.cursorLoad = Math.min(
        Math.max(e.clientY / window.innerHeight, 0),
        1,
      );
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [interaction]);

  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true, toneMapping: THREE.ACESFilmicToneMapping }}
    >
      <PerspectiveCamera makeDefault position={[0, 0.14, 1.5]} fov={42} />
      <CameraRig animate={!reduced} />

      <ambientLight intensity={0.6} />
      <directionalLight
        position={[2, 3, 2]}
        intensity={1.0}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0002}
        shadow-normalBias={0.02}
      />
      <directionalLight position={[-3, 1, -1]} intensity={0.3} color="#aab4c8" />

      <Suspense fallback={null}>
        {/* HDR self-hosted (sem CDN de terceiro em runtime; CSP mais estrita) */}
        <Environment files="/hdri/city.hdr" />
      </Suspense>

      <Beam />
      <LoadDriver interaction={interaction} reduced={reduced} />

      {interaction === "cursor" && !reduced ? <Effects /> : null}
      <AdaptiveDpr pixelated={false} />
    </Canvas>
  );
}
