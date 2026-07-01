"use client";

import { ReactNode } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "motion/react";

/**
 * Aplica skewY proporcional à velocidade do scroll (clamp ±0.9°) —
 * o conteúdo "cede" com a inércia, como material sob carga dinâmica.
 * Zero em prefers-reduced-motion.
 */
export function SkewGroup({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduced = useReducedMotion();
  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);
  // velocity px/s → skew graus, clampado (±3 * -0.3 = ±0.9°)
  const skewRaw = useTransform(velocity, [-2500, 2500], [0.9, -0.9], {
    clamp: true,
  });
  const skewY = useSpring(skewRaw, { stiffness: 250, damping: 40 });

  return (
    <motion.div className={className} style={{ skewY: reduced ? 0 : skewY }}>
      {children}
    </motion.div>
  );
}
