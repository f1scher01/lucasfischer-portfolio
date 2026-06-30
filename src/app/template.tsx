"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "@/lib/motion";
import { lenisRef } from "@/components/common/lenisRef";

/**
 * Transição de rota: uma cortina accent varre a tela (cima → cobre → baixo) a
 * cada navegação (exceto o 1º load, que o preloader cobre). Reseta o scroll ao
 * topo e atualiza os ScrollTriggers. Desligada em prefers-reduced-motion.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const firstRef = useRef(true);
  const [sweep, setSweep] = useState(false);

  useEffect(() => {
    if (firstRef.current) {
      firstRef.current = false;
      return;
    }

    // reset de scroll ao trocar de rota
    lenisRef.current?.scrollTo(0, { immediate: true });
    window.scrollTo(0, 0);

    if (prefersReducedMotion()) {
      ScrollTrigger.refresh();
      return;
    }

    setSweep(true);
    const t = window.setTimeout(() => {
      setSweep(false);
      ScrollTrigger.refresh();
    }, 760);
    return () => window.clearTimeout(t);
  }, [pathname]);

  return (
    <>
      {sweep ? (
        <motion.div
          className="route-curtain"
          initial={{ y: "-100%" }}
          animate={{ y: ["-100%", "0%", "100%"] }}
          transition={{
            duration: 0.72,
            ease: [0.76, 0, 0.24, 1],
            times: [0, 0.5, 1],
          }}
          aria-hidden
        />
      ) : null}
      {children}
    </>
  );
}
