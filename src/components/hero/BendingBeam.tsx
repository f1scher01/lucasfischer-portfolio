"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, Environment } from "@react-three/drei";
import { useMemo, useRef, useState, useCallback, useEffect } from "react";
import * as THREE from "three";
import {
  STEEL_1020,
  bendingStress,
  deflection,
  forceAtYield,
  maxStress,
  maxDeflection,
  safetyFactor,
  normalizedStress,
} from "@/lib/beam-physics";

const SEGMENTS = 64;
const VISUAL_DEFLECTION_SCALE = 30; // exagera deflexão visualmente (engenharia "honesta-mas-mostrada")

// Stops do colormap viridis (constante de módulo — não realocar por frame).
const VIRIDIS_STOPS = [
  [0.267, 0.005, 0.329],
  [0.283, 0.141, 0.458],
  [0.254, 0.265, 0.53],
  [0.207, 0.372, 0.553],
  [0.164, 0.471, 0.558],
  [0.128, 0.567, 0.551],
  [0.135, 0.659, 0.518],
  [0.267, 0.749, 0.441],
  [0.478, 0.821, 0.318],
  [0.741, 0.873, 0.15],
  [0.993, 0.906, 0.144],
] as const;

/**
 * Colormap viridis simplificado (11 stops).
 * Entrada: t ∈ [0, 1] e um THREE.Color `target` para escrever (reuso —
 * evita alocar um Color novo por vértice/frame). Saída: o próprio `target`.
 */
function viridis(t: number, target: THREE.Color): THREE.Color {
  const clamped = Math.min(Math.max(t, 0), 0.9999);
  const idx = clamped * (VIRIDIS_STOPS.length - 1);
  const i = Math.floor(idx);
  const f = idx - i;
  const a = VIRIDIS_STOPS[i];
  const b = VIRIDIS_STOPS[i + 1] ?? a;
  return target.setRGB(
    a[0] + (b[0] - a[0]) * f,
    a[1] + (b[1] - a[1]) * f,
    a[2] + (b[2] - a[2]) * f,
  );
}

interface BeamMeshProps {
  forceRef: React.MutableRefObject<number>;
}

function BeamMesh({ forceRef }: BeamMeshProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const params = STEEL_1020;
  const F_yield = useMemo(() => forceAtYield(params), [params]);

  // Geometria base — box segmentado no eixo X
  const geometry = useMemo(() => {
    const geo = new THREE.BoxGeometry(
      params.L,
      params.h,
      params.b,
      SEGMENTS,
      2,
      2,
    );
    // Armazena posição inicial X para cálculo de deflexão
    const positions = geo.attributes.position;
    const restY = new Float32Array(positions.count);
    const xCoords = new Float32Array(positions.count);
    for (let i = 0; i < positions.count; i++) {
      restY[i] = positions.getY(i);
      xCoords[i] = positions.getX(i);
    }
    geo.setAttribute("restY", new THREE.BufferAttribute(restY, 1));
    geo.setAttribute("xCoord", new THREE.BufferAttribute(xCoords, 1));

    // Atributo de cor por vértice
    const colors = new Float32Array(positions.count * 3);
    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    return geo;
  }, [params.L, params.h, params.b]);

  // Material com vertex colors
  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        vertexColors: true,
        metalness: 0.6,
        roughness: 0.35,
        envMapIntensity: 1.0,
      }),
    [],
  );

  // Color de rascunho reutilizado no hot path (useFrame roda ~60fps × N vértices).
  const scratchColor = useMemo(() => new THREE.Color(), []);

  useFrame(() => {
    if (!meshRef.current) return;
    const F = forceRef.current;
    const geo = meshRef.current.geometry;
    const positions = geo.attributes.position;
    const restY = geo.attributes.restY;
    const xCoords = geo.attributes.xCoord;
    const colors = geo.attributes.color;

    for (let i = 0; i < positions.count; i++) {
      // Posição local X → posição global ao longo da viga [0, L]
      const xLocal = xCoords.getX(i);
      const xBeam = xLocal + params.L / 2;

      // Aplica deflexão
      const y = deflection(xBeam, F, params) * VISUAL_DEFLECTION_SCALE;
      positions.setY(i, restY.getX(i) + y);

      // Cor por tensão (na fibra extrema; gradiente suave por altura também)
      const sigma = bendingStress(xBeam, F, params);
      const t = normalizedStress(sigma, params.yieldStress);
      viridis(t, scratchColor); // escreve em scratchColor, sem alocar
      colors.setXYZ(i, scratchColor.r, scratchColor.g, scratchColor.b);
    }
    positions.needsUpdate = true;
    colors.needsUpdate = true;
    geo.computeVertexNormals();
  });

  return (
    <>
      <mesh ref={meshRef} geometry={geometry} material={material} castShadow receiveShadow />

      {/* Apoios bi-apoiados (triângulos de apoio simples) */}
      <Support position={[-params.L / 2, -params.h / 2 - 0.02, 0]} />
      <Support position={[params.L / 2, -params.h / 2 - 0.02, 0]} />
    </>
  );
}

function Support({ position }: { position: [number, number, number] }) {
  return (
    <mesh position={position}>
      <coneGeometry args={[0.035, 0.04, 4]} />
      <meshStandardMaterial color="#444" metalness={0.5} roughness={0.5} />
    </mesh>
  );
}

interface HUDProps {
  force: number;
}

function HUD({ force }: HUDProps) {
  const params = STEEL_1020;
  const sigma = maxStress(force, params);
  const delta = maxDeflection(force, params);
  const fs = safetyFactor(force, params);

  const isYielding = sigma >= params.yieldStress * 0.95;

  return (
    <div className="absolute top-6 right-6 z-10 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-elevated)]/80 px-4 py-3 font-mono text-xs backdrop-blur-md">
      <div className="caption mb-2 text-[var(--color-fg-muted)]">Live Telemetry</div>
      <Row label="Force" value={`${force.toFixed(0)} N`} />
      <Row
        label="σ_max"
        value={`${(sigma / 1e6).toFixed(1)} MPa`}
        warn={isYielding}
      />
      <Row label="δ_center" value={`${(delta * 1000).toFixed(2)} mm`} />
      <Row label="FS" value={fs > 100 ? "∞" : fs.toFixed(2)} warn={fs < 1.5} />
    </div>
  );
}

function Row({
  label,
  value,
  warn,
}: {
  label: string;
  value: string;
  warn?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between gap-6 py-0.5">
      <span className="text-[var(--color-fg-dim)]">{label}</span>
      <span
        className={
          warn
            ? "text-[var(--color-danger)] font-semibold"
            : "text-[var(--color-fg)]"
        }
      >
        {value}
      </span>
    </div>
  );
}

interface InteractionLayerProps {
  forceRef: React.MutableRefObject<number>;
  onForceChange: (f: number) => void;
}

function InteractionLayer({ forceRef, onForceChange }: InteractionLayerProps) {
  const { size } = useThree();
  const params = STEEL_1020;
  const F_max = useMemo(() => forceAtYield(params) * 1.2, [params]);

  const handlePointerMove = useCallback(
    (e: PointerEvent) => {
      // Mapeia y normalizado [0, 1] → força [0, F_max]
      const y = e.clientY / size.height;
      const normalized = Math.min(Math.max(y, 0), 1);
      const F = normalized * F_max;
      forceRef.current = F;
      onForceChange(F);
    },
    [size.height, F_max, forceRef, onForceChange],
  );

  useEffect(() => {
    window.addEventListener("pointermove", handlePointerMove);
    return () => window.removeEventListener("pointermove", handlePointerMove);
  }, [handlePointerMove]);

  return null;
}

const AUTO_PERIOD = 4; // segundos por ciclo do loop automático (mobile)

interface AutoForceProps {
  forceRef: React.MutableRefObject<number>;
  onForceChange: (f: number) => void;
}

/**
 * Fallback de interação para touch devices: oscila F entre 0 e a força de
 * escoamento em senoide (período 4s). Respeita prefers-reduced-motion —
 * nesse caso a viga fica estática em ~metade da carga.
 */
function AutoForce({ forceRef, onForceChange }: AutoForceProps) {
  const params = STEEL_1020;
  const F_yield = useMemo(() => forceAtYield(params), [params]);
  const reduced = useMemo(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    [],
  );
  const lastEmit = useRef(0);

  useFrame((state) => {
    let F: number;
    if (reduced) {
      F = F_yield * 0.5; // carga fixa, sem animação
    } else {
      const t = state.clock.elapsedTime;
      // (1 - cos)/2 ∈ [0, 1] → varre 0 → F_yield → 0 suavemente
      const phase = (1 - Math.cos((2 * Math.PI * t) / AUTO_PERIOD)) / 2;
      F = F_yield * phase;
    }
    forceRef.current = F;

    // HUD não precisa de 60fps; emite ~12x/s para evitar render churn.
    if (state.clock.elapsedTime - lastEmit.current > 0.08) {
      lastEmit.current = state.clock.elapsedTime;
      onForceChange(F);
    }
  });

  return null;
}

/** Detecta ponteiro grosso (touch) via matchMedia. */
function useIsTouch(): boolean {
  const [isTouch, setIsTouch] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(pointer: coarse)");
    setIsTouch(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setIsTouch(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return isTouch;
}

export function BendingBeam() {
  const forceRef = useRef<number>(0);
  const [forceState, setForceState] = useState(0);
  const isTouch = useIsTouch();

  return (
    <div className="relative h-full w-full">
      <HUD force={forceState} />
      <Canvas
        shadows
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
        camera={{ position: [0, 0.3, 1.5], fov: 35 }}
      >
        <PerspectiveCamera makeDefault position={[0, 0.3, 1.5]} fov={35} />
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

        {/* Reflexos/IBL realistas no aço — preset city do drei */}
        <Environment preset="city" />

        <BeamMesh forceRef={forceRef} />

        <OrbitControls
          enablePan={false}
          enableZoom={false}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 1.8}
        />

        {/* Touch → loop automático; mouse → segue o cursor */}
        {isTouch ? (
          <AutoForce forceRef={forceRef} onForceChange={setForceState} />
        ) : (
          <InteractionLayer forceRef={forceRef} onForceChange={setForceState} />
        )}
      </Canvas>

      <div className="pointer-events-none absolute bottom-6 left-6 z-10 max-w-xs">
        <p className="caption mb-1 text-[var(--color-fg-muted)]">
          {isTouch ? "Live load simulation" : "Move your cursor vertically"}
        </p>
        <p className="font-mono text-xs text-[var(--color-fg-dim)]">
          Steel 1020 · L=1.0m · b=30mm · h=50mm · E=200 GPa
        </p>
      </div>
    </div>
  );
}
