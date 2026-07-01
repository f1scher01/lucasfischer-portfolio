"use client";

import { useEffect, useRef } from "react";
import { prefersReducedMotion, isCoarsePointer } from "@/lib/motion";

/**
 * Cursor custom "signature":
 *  - ponto instantâneo + anel com lerp e estados contextuais (data-cursor);
 *  - trail "gooey": 3 blobs com lag crescente fundidos por filtro SVG
 *    (feGaussianBlur + feColorMatrix) — o clássico goo effect;
 *  - magnetismo: sobre [data-cursor="magnetic"] o cursor gravita ao centro
 *    do elemento (70% elemento / 30% mouse).
 * Decorativo (pointer-events-none). Desligado em touch e reduced-motion.
 * Invisível até o 1º movimento; some quando o ponteiro sai da janela.
 */
export function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isCoarsePointer() || prefersReducedMotion()) return;

    document.documentElement.classList.add("has-custom-cursor");

    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    // alvo efetivo (com magnetismo aplicado)
    let tx = mx;
    let ty = my;
    let rx = mx;
    let ry = my;
    let raf = 0;
    let magnetEl: HTMLElement | null = null;

    // blobs do goo trail com lags diferentes
    const blobs = trailRef.current
      ? (Array.from(trailRef.current.children) as HTMLElement[])
      : [];
    const blobPos = blobs.map(() => ({ x: mx, y: my }));
    const blobLag = [0.3, 0.18, 0.1];

    const setVisible = (v: boolean) => {
      const o = v ? "1" : "0";
      if (dotRef.current) dotRef.current.style.opacity = o;
      if (ringRef.current) ringRef.current.style.opacity = o;
      if (trailRef.current) trailRef.current.style.opacity = v ? "0.5" : "0";
    };

    const onMove = (e: PointerEvent) => {
      mx = e.clientX;
      my = e.clientY;
      if (dotRef.current && dotRef.current.style.opacity !== "1") {
        setVisible(true);
      }
    };

    const loop = () => {
      // magnetismo: gravita ao centro do elemento alvo
      if (magnetEl && magnetEl.isConnected) {
        const r = magnetEl.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        tx = cx + (mx - cx) * 0.3;
        ty = cy + (my - cy) * 0.3;
      } else {
        tx = mx;
        ty = my;
      }

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${tx}px, ${ty}px, 0)`;
      }
      rx += (tx - rx) * 0.18;
      ry += (ty - ry) * 0.18;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
      }
      for (let i = 0; i < blobs.length; i++) {
        const p = blobPos[i];
        p.x += (tx - p.x) * blobLag[i];
        p.y += (ty - p.y) * blobLag[i];
        blobs[i].style.transform = `translate3d(${p.x}px, ${p.y}px, 0)`;
      }
      raf = requestAnimationFrame(loop);
    };

    const onOver = (e: Event) => {
      const el = (e.target as HTMLElement).closest?.(
        "[data-cursor]",
      ) as HTMLElement | null;
      const state = el?.getAttribute("data-cursor") ?? "";
      ringRef.current?.setAttribute("data-state", state);
      magnetEl = state === "magnetic" ? el : null;
    };

    const onLeave = (e: PointerEvent) => {
      if (!e.relatedTarget) setVisible(false);
    };
    const onEnter = () => setVisible(true);
    const onBlur = () => setVisible(false);
    const onDown = () => ringRef.current?.setAttribute("data-pressed", "true");
    const onUp = () => ringRef.current?.removeAttribute("data-pressed");

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerover", onOver);
    document.addEventListener("pointerout", onLeave);
    window.addEventListener("pointerenter", onEnter);
    window.addEventListener("blur", onBlur);
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
      document.removeEventListener("pointerout", onLeave);
      window.removeEventListener("pointerenter", onEnter);
      window.removeEventListener("blur", onBlur);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.documentElement.classList.remove("has-custom-cursor");
    };
  }, []);

  return (
    <>
      {/* filtro goo — blur + contraste de alpha funde os blobs */}
      <svg className="absolute h-0 w-0" aria-hidden focusable="false">
        <defs>
          <filter id="cursor-goo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -10"
              result="goo"
            />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>
      </svg>

      <div ref={trailRef} className="cursor-trail" aria-hidden>
        <span className="cursor-blob" style={{ width: 12, height: 12, margin: "-6px 0 0 -6px" }} />
        <span className="cursor-blob" style={{ width: 9, height: 9, margin: "-4.5px 0 0 -4.5px" }} />
        <span className="cursor-blob" style={{ width: 6, height: 6, margin: "-3px 0 0 -3px" }} />
      </div>

      <div ref={dotRef} className="cursor-dot" aria-hidden />
      <div ref={ringRef} className="cursor-ring" aria-hidden>
        <span className="cursor-label">ver</span>
      </div>
    </>
  );
}
