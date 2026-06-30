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

    const setVisible = (v: boolean) => {
      const o = v ? "1" : "0";
      if (dotRef.current) dotRef.current.style.opacity = o;
      if (ringRef.current) ringRef.current.style.opacity = o;
    };

    const onMove = (e: PointerEvent) => {
      mx = e.clientX;
      my = e.clientY;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mx}px, ${my}px, 0)`;
        if (dotRef.current.style.opacity !== "1") setVisible(true);
      }
    };

    const onLeave = (e: PointerEvent) => {
      // esconde quando o ponteiro sai da janela (relatedTarget nulo)
      if (!e.relatedTarget) setVisible(false);
    };
    const onEnter = () => setVisible(true);
    const onBlur = () => setVisible(false);

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
    document.addEventListener("pointerout", onLeave);
    window.addEventListener("pointerenter", onEnter);
    window.addEventListener("blur", onBlur);
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
      document.removeEventListener("pointerout", onLeave);
      window.removeEventListener("pointerenter", onEnter);
      window.removeEventListener("blur", onBlur);
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
