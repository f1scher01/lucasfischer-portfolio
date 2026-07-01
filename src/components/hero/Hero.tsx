"use client";

import { useEffect, useState } from "react";
import { motion, type Variants } from "motion/react";
import { BeamHUD } from "@/components/hud/BeamHUD";
import { sceneState } from "@/components/webgl/sceneStore";
import { isCoarsePointer } from "@/lib/motion";
import { useLang } from "@/i18n/LangProvider";

const lineContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.15 } },
};
const lineChild: Variants = {
  hidden: { y: "110%" },
  visible: {
    y: "0%",
    transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] },
  },
};

function Line({ children }: { children: React.ReactNode }) {
  return (
    <span className="block overflow-hidden">
      <motion.span variants={lineChild} className="block">
        {children}
      </motion.span>
    </span>
  );
}

export function Hero() {
  const [coarse, setCoarse] = useState(false);
  const [paused, setPaused] = useState(false);
  const { t } = useLang();

  useEffect(() => setCoarse(isCoarsePointer()), []);

  const togglePause = () => {
    sceneState.autoPaused = !sceneState.autoPaused;
    setPaused(sceneState.autoPaused);
  };

  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* HUD — telemetria ao vivo da viga (que vive no Canvas global atrás) */}
      <div className="absolute right-6 top-24 z-10 md:right-12">
        <BeamHUD />
      </div>

      <div className="container-x relative z-10 flex min-h-screen flex-col justify-between py-32 md:py-40">
        <div className="max-w-4xl">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className="caption mb-6 text-[var(--color-fg-muted)]"
          >
            {t.hero.kicker}
          </motion.p>

          <motion.h1
            variants={lineContainer}
            initial="hidden"
            animate="visible"
            className="font-display text-5xl tracking-tight md:text-7xl lg:text-[5.5rem]"
            style={{ lineHeight: 1.0, letterSpacing: "-0.02em" }}
          >
            <Line>{t.hero.l1}</Line>
            <Line>
              <span className="text-[var(--color-accent)]">{t.hero.l2}</span>
            </Line>
            <Line>{t.hero.l3}</Line>
          </motion.h1>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 1 }}
          className="flex items-end justify-between gap-6"
        >
          <p className="max-w-md text-[var(--color-fg-muted)]">{t.hero.sub}</p>
          {coarse ? (
            <button
              type="button"
              onClick={togglePause}
              className="caption rounded-full border border-[var(--color-border-strong)] px-4 py-2 text-[var(--color-fg-muted)]"
            >
              {paused ? t.hero.badgePaused : t.hero.badgeRunning}
            </button>
          ) : (
            <a
              href="#work"
              data-cursor="link"
              className="caption group inline-flex items-center gap-2 text-[var(--color-fg)] transition-colors hover:text-[var(--color-accent)]"
            >
              {t.hero.hint}
              <span className="inline-block transition-transform group-hover:translate-y-1">
                ↓
              </span>
            </a>
          )}
        </motion.div>
      </div>
    </section>
  );
}
