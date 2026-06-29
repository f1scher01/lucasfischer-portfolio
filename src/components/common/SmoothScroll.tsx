"use client";

import { ReactNode, useEffect } from "react";
import { MotionConfig } from "motion/react";
import Lenis from "lenis";

export function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    // Respeita reduced-motion
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReduced) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => lenis.destroy();
  }, []);

  // reducedMotion="user" faz o Motion respeitar prefers-reduced-motion
  // globalmente (zera transforms/opacity animados em todo o site).
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
