"use client";

import { useEffect, useRef } from "react";
import { prefersReducedMotion, isCoarsePointer } from "@/lib/motion";

/**
 * Cursor custom: ponto que segue instantâneo + anel com lerp suave e estados
 * contextuais (data-cursor nos elementos). Decorativo (pointer-events-none),
 * desligado em touch e prefers-reduced-motion (volta o cursor nativo).
 */
export function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isCoarsePointer() || prefersReducedMotion()) return;

    document.documentElement.classList.add("has-custom-cursor");

    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let rx = mx;
    let ry = my;
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      mx = e.clientX;
      my = e.clientY;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mx}px, ${my}px, 0)`;
      }
    };

    const loop = () => {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
      }
      raf = requestAnimationFrame(loop);
    };

    const onOver = (e: Event) => {
      const el = (e.target as HTMLElement).closest?.("[data-cursor]");
      const state = el?.getAttribute("data-cursor") ?? "";
      ringRef.current?.setAttribute("data-state", state);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerover", onOver);
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
      document.documentElement.classList.remove("has-custom-cursor");
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className="cursor-dot" aria-hidden />
      <div ref={ringRef} className="cursor-ring" aria-hidden>
        <span className="cursor-label">ver</span>
      </div>
    </>
  );
}
