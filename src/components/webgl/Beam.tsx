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
const ACCENT = new THREE.Color("#f5993a"); // ≈ --accent oklch(70% 0.18 60)

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

  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        vertexColors: true,
        metalness: 0.6,
        roughness: 0.32,
        envMapIntensity: 1.1,
        emissive: ACCENT.clone(),
        emissiveIntensity: 0,
      }),
    [],
  );

  const scratch = useMemo(() => new THREE.Color(), []);
  const hudClock = useRef(0);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    const d = Math.min(delta, 0.05);

    // suaviza a carga rumo ao alvo (scroll) + leve modulação do cursor
    const target = THREE.MathUtils.clamp(
      sceneState.targetLoad + sceneState.pointerNudge,
      0,
      1,
    );
    sceneState.load += (target - sceneState.load) * Math.min(1, d * 4);
    const load = sceneState.load;
    const F = load * F_max;

    const geo = meshRef.current.geometry;
    const positions = geo.attributes.position;
    const restY = geo.attributes.restY;
    const xCoords = geo.attributes.xCoord;
    const colors = geo.attributes.color;

    for (let i = 0; i < positions.count; i++) {
      const xBeam = xCoords.getX(i) + params.L / 2;
      const y = deflection(xBeam, F, params) * VISUAL_DEFLECTION_SCALE;
      positions.setY(i, restY.getX(i) + y);
      const sigma = bendingStress(xBeam, F, params);
      viridis(normalizedStress(sigma, params.yieldStress), scratch);
      colors.setXYZ(i, scratch.r, scratch.g, scratch.b);
    }
    positions.needsUpdate = true;
    colors.needsUpdate = true;
    geo.computeVertexNormals();

    // emissivo acende no pico → captado pelo Bloom
    material.emissiveIntensity = Math.pow(load, 2.2) * 2.4;

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
