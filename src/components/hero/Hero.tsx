"use client";

import dynamic from "next/dynamic";
import { motion } from "motion/react";

const BendingBeam = dynamic(
  () => import("./BendingBeam").then((m) => m.BendingBeam),
  {
    ssr: false,
    loading: () => (
      <div className="h-full w-full animate-pulse bg-[var(--color-bg-elevated)]" />
    ),
  },
);

export function Hero() {
  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* Visualização — atrás do conteúdo */}
      <div className="absolute inset-0 z-0">
        <BendingBeam />
      </div>

      {/* Conteúdo — sobreposto */}
      <div className="container-x relative z-10 flex min-h-screen flex-col justify-between py-32 md:py-40">
        <div className="max-w-3xl">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className="caption mb-6 text-[var(--color-fg-muted)]"
          >
            Lucas Fischer Paez · IMT · São Paulo, BR
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="font-display text-5xl tracking-tight md:text-7xl lg:text-[5.5rem]"
            style={{ lineHeight: 1.0, letterSpacing: "-0.02em" }}
          >
            Mechanical engineer.
            <br />
            <span className="text-[var(--color-accent)]">
              Building digital systems
            </span>{" "}
            with the same precision.
          </motion.h1>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.9 }}
          className="flex items-end justify-between gap-6"
        >
          <p className="max-w-md text-[var(--color-fg-muted)]">
            FSAE trainee at Maua Racing. Site builder. Multilingual. Available
            for premium work.
          </p>
          <a
            href="#work"
            className="caption group inline-flex items-center gap-2 text-[var(--color-fg)] transition-colors hover:text-[var(--color-accent)]"
          >
            Scroll
            <span className="inline-block transition-transform group-hover:translate-y-1">
              ↓
            </span>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
