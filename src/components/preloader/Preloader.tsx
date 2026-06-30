"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { prefersReducedMotion } from "@/lib/motion";
import { lenisRef } from "@/components/common/lenisRef";

/**
 * Boot de "ensaio": contador 0→100 em mono + reveal (a cortina sobe expondo a
 * viga). Só no 1º load da sessão. Trava o scroll durante. Em reduced-motion,
 * apenas garante um respiro curto e libera (sem animação).
 */
export function Preloader() {
  const rootRef = useRef<HTMLDivElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem("entered") === "1") {
      setDone(true);
      return;
    }

    const finish = () => {
      sessionStorage.setItem("entered", "1");
      document.documentElement.style.overflow = "";
      lenisRef.current?.start();
      setDone(true);
    };

    // trava scroll durante o boot
    document.documentElement.style.overflow = "hidden";
    lenisRef.current?.stop();

    if (prefersReducedMotion()) {
      const t = window.setTimeout(finish, 250);
      return () => window.clearTimeout(t);
    }

    const counter = { v: 0 };
    const tl = gsap.timeline();
    tl.to(counter, {
      v: 100,
      duration: 1.5,
      ease: "power2.inOut",
      onUpdate: () => {
        if (countRef.current) {
          countRef.current.textContent = String(Math.round(counter.v)).padStart(
            3,
            "0",
          );
        }
      },
    });
    tl.to(
      rootRef.current,
      {
        yPercent: -100,
        duration: 0.9,
        ease: "expo.inOut",
        onComplete: finish,
      },
      "+=0.15",
    );

    return () => {
      tl.kill();
      document.documentElement.style.overflow = "";
    };
  }, []);

  if (done) return null;

  return (
    <div ref={rootRef} className="preloader" aria-hidden>
      <div className="preloader-inner">
        <span className="caption text-[var(--color-fg-muted)]">
          Calibrando célula de carga · malha estrutural
        </span>
        <span ref={countRef} className="preloader-count">
          000
        </span>
        <span className="preloader-bar" />
      </div>
    </div>
  );
}
