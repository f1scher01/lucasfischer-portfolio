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
 * Colormap FEA de tensão ASSINADA (σ_xx = -M·y/I):
 *   compressão (fibra superior, σ<0) → frio: aço → ciano → azul profundo
 *   tração     (fibra inferior, σ>0) → quente: aço → amarelo → vermelho
 *   linha neutra (y=0)               → aço escuro
 * Igual a plot de tensão normal em software de FEA (Dlubal/Ansys).
 */
const NEUTRAL = [0.16, 0.19, 0.24] as const; // aço escuro
const TENSION_MID = [0.99, 0.74, 0.1] as const; // amarelo
const TENSION_MAX = [0.82, 0.08, 0.07] as const; // vermelho
const COMPR_MID = [0.1, 0.78, 0.92] as const; // ciano
const COMPR_MAX = [0.09, 0.16, 0.58] as const; // azul profundo

function lerp3(
  a: readonly number[],
  b: readonly number[],
  f: number,
  target: THREE.Color,
): THREE.Color {
  return target.setRGB(
    a[0] + (b[0] - a[0]) * f,
    a[1] + (b[1] - a[1]) * f,
    a[2] + (b[2] - a[2]) * f,
  );
}

/** s ∈ [-1, 1] — negativo = compressão (frio), positivo = tração (quente). */
function signedFeaColor(s: number, target: THREE.Color): THREE.Color {
  // potência 0.7 amplifica visualmente cargas médias (não-linear)
  const t = Math.pow(Math.min(Math.abs(s), 1), 0.7);
  const mid = s >= 0 ? TENSION_MID : COMPR_MID;
  const max = s >= 0 ? TENSION_MAX : COMPR_MAX;
  if (t < 0.5) return lerp3(NEUTRAL, mid, t * 2, target);
  return lerp3(mid, max, (t - 0.5) * 2, target);
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
    for (let i = 0; i < positions.count; i++) {
      const xBeam = xCoords.getX(i) + params.L / 2;
      const y = deflection(xBeam, F, params) * VISUAL_DEFLECTION_SCALE;
      const yFiber = restY.getX(i); // posição da fibra na seção [-h/2, +h/2]
      positions.setY(i, yFiber + y);
      // σ_xx = -M·y/I → topo comprime (s<0), base traciona (s>0)
      const sigmaMax = bendingStress(xBeam, F, params); // na fibra extrema
      const s =
        normalizedStress(sigmaMax, params.yieldStress) * (-yFiber / halfH);
      signedFeaColor(s, scratch);
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
