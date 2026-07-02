"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import {
  STEEL_1020,
  bendingStress,
  deflection,
  forceAtYield,
  normalizedStress,
} from "@/lib/beam-physics";
import { sceneState, emitHud } from "./sceneStore";

const SEGMENTS = 64;
const VISUAL_DEFLECTION_SCALE = 30; // exagera deflexão visualmente

/**
 * Colormap "jet" clássico de FEA (Ansys/Dlubal), NORMALIZADO PELO CAMPO ATUAL
 * — como nos prints de simulação: azul = compressão máxima do estado atual,
 * verde = linha neutra, vermelho = tração máxima. O rainbow completo aparece
 * em qualquer carga (as cores são relativas ao min/max do campo, não a σ_y).
 */
const JET_STOPS = [
  [0.05, 0.03, 0.53], // azul profundo (compressão máx)
  [0.0, 0.32, 0.94], // azul
  [0.0, 0.7, 0.95], // ciano
  [0.1, 0.85, 0.5], // verde-ciano
  [0.35, 0.85, 0.2], // verde (neutro)
  [0.85, 0.92, 0.1], // amarelo
  [1.0, 0.62, 0.0], // laranja
  [0.98, 0.25, 0.03], // laranja-vermelho
  [0.78, 0.03, 0.05], // vermelho (tração máx)
] as const;

/** t ∈ [0,1] → jet (0 = compressão máx, 0.5 = neutro, 1 = tração máx). */
function jetColor(t: number, target: THREE.Color): THREE.Color {
  const clamped = Math.min(Math.max(t, 0), 0.9999);
  const idx = clamped * (JET_STOPS.length - 1);
  const i = Math.floor(idx);
  const f = idx - i;
  const a = JET_STOPS[i];
  const b = JET_STOPS[i + 1] ?? a;
  return target.setRGB(
    a[0] + (b[0] - a[0]) * f,
    a[1] + (b[1] - a[1]) * f,
    a[2] + (b[2] - a[2]) * f,
  );
}

/**
 * A viga bi-apoiada. Lê a carga de sceneState (escrita pelo scroll/cursor),
 * recalcula deflexão + heatmap de tensão por frame e acende emissivo no pico
 * (para o Bloom "sangrar" luz). Sem React state no hot path.
 */
export function Beam() {
  const meshRef = useRef<THREE.Mesh>(null);
  const params = STEEL_1020;
  const F_max = useMemo(() => forceAtYield(params) * 1.05, [params]);

  const geometry = useMemo(() => {
    const geo = new THREE.BoxGeometry(
      params.L,
      params.h,
      params.b,
      SEGMENTS,
      2,
      2,
    );
    const positions = geo.attributes.position;
    const restY = new Float32Array(positions.count);
    const xCoords = new Float32Array(positions.count);
    for (let i = 0; i < positions.count; i++) {
      restY[i] = positions.getY(i);
      xCoords[i] = positions.getX(i);
    }
    geo.setAttribute("restY", new THREE.BufferAttribute(restY, 1));
    geo.setAttribute("xCoord", new THREE.BufferAttribute(xCoords, 1));
    const colors = new Float32Array(positions.count * 3);
    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    return geo;
  }, [params.L, params.h, params.b]);

  // Material fosco — leitura de "resultado de software FEA", não metal/sol.
  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        vertexColors: true,
        metalness: 0.08,
        roughness: 0.62,
        envMapIntensity: 0.35,
      }),
    [],
  );

  const scratch = useMemo(() => new THREE.Color(), []);
  const hudClock = useRef(0);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    const d = Math.min(delta, 0.05);

    // suaviza a carga rumo ao alvo (resolvido pelo LoadDriver: cursor/idle/auto)
    const target = THREE.MathUtils.clamp(sceneState.targetLoad, 0, 1);
    sceneState.load += (target - sceneState.load) * Math.min(1, d * 4);
    const load = sceneState.load;
    const F = load * F_max;

    const geo = meshRef.current.geometry;
    const positions = geo.attributes.position;
    const restY = geo.attributes.restY;
    const xCoords = geo.attributes.xCoord;
    const colors = geo.attributes.color;

    const halfH = params.h / 2;
    // normalização pelo campo ATUAL (σ_max do estado) — mantém o rainbow
    // completo em qualquer carga, como nos prints de software de FEA
    const fieldMax = Math.max(
      normalizedStress(bendingStress(params.L / 2, F, params), params.yieldStress),
      0.02,
    );
    for (let i = 0; i < positions.count; i++) {
      const xBeam = xCoords.getX(i) + params.L / 2;
      const y = deflection(xBeam, F, params) * VISUAL_DEFLECTION_SCALE;
      const yFiber = restY.getX(i); // posição da fibra na seção [-h/2, +h/2]
      positions.setY(i, yFiber + y);
      // σ_xx = -M·y/I → topo comprime (s<0), base traciona (s>0)
      const sigmaMax = bendingStress(xBeam, F, params); // na fibra extrema
      const s =
        normalizedStress(sigmaMax, params.yieldStress) * (-yFiber / halfH);
      jetColor((s / fieldMax + 1) / 2, scratch);
      colors.setXYZ(i, scratch.r, scratch.g, scratch.b);
    }
    positions.needsUpdate = true;
    colors.needsUpdate = true;
    geo.computeVertexNormals();

    hudClock.current += d;
    if (hudClock.current > 0.08) {
      hudClock.current = 0;
      emitHud(load);
    }
  });

  // Grupo angulado em ¾ — dá profundidade 3D e protagonismo à viga.
  return (
    <group rotation={[-0.16, -0.42, 0.04]} scale={1.32}>
      <mesh
        ref={meshRef}
        geometry={geometry}
        material={material}
        castShadow
        receiveShadow
      />
      {/* Malha de elementos finitos sobreposta (mesma geometria → deforma junto) */}
      <mesh geometry={geometry}>
        <meshBasicMaterial
          wireframe
          transparent
          opacity={0.07}
          color="#cfe0ff"
          depthWrite={false}
        />
      </mesh>
      <Support position={[-params.L / 2, -params.h / 2 - 0.02, 0]} />
      <Support position={[params.L / 2, -params.h / 2 - 0.02, 0]} />
    </group>
  );
}

function Support({ position }: { position: [number, number, number] }) {
  return (
    <mesh position={position}>
      <coneGeometry args={[0.035, 0.04, 4]} />
      <meshStandardMaterial color="#3a3a40" metalness={0.5} roughness={0.5} />
    </mesh>
  );
}
