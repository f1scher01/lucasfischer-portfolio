"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import type { JSX } from "react";

export interface RevealSegment {
  text: string;
  className?: string; // ex.: accent
  br?: boolean; // quebra de linha ANTES deste segmento
}

interface RevealHeadingProps {
  segments: RevealSegment[];
  as?: keyof Pick<JSX.IntrinsicElements, "h1" | "h2" | "h3" | "p">;
  className?: string;
}

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.025 } },
};

const glyph: Variants = {
  hidden: { clipPath: "inset(0 0 100% 0)", y: "0.18em" },
  visible: {
    clipPath: "inset(0 0 -0.2em 0)",
    y: "0em",
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
  },
};

/**
 * Heading com reveal por GLYPH via clip-path (não translate do bloco) —
 * cada caractere é "impresso" de cima pra baixo em stagger de 25ms.
 * Acessível: aria-label com o texto completo; glyphs aria-hidden.
 * Em prefers-reduced-motion o Motion (MotionConfig reducedMotion="user")
 * entrega o estado final imediatamente.
 */
export function RevealHeading({
  segments,
  as: Tag = "h2",
  className,
}: RevealHeadingProps) {
  const reduced = useReducedMotion();
  const label = segments.map((s) => s.text).join("");

  if (reduced) {
    // estático: texto simples, sem centenas de spans
    return (
      <Tag className={className}>
        {segments.map((s, i) => (
          <span key={i} className={s.className}>
            {s.br ? <br /> : null}
            {s.text}
          </span>
        ))}
      </Tag>
    );
  }

  const MotionTag = motion[Tag];

  return (
    <MotionTag
      className={className}
      aria-label={label}
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-10% 0px" }}
    >
      {segments.map((seg, si) => (
        <span key={si} className={seg.className} aria-hidden>
          {seg.br ? <br /> : null}
          {seg.text.split(/(\s+)/).map((word, wi) =>
            /^\s+$/.test(word) ? (
              " "
            ) : (
              <span key={wi} className="inline-block whitespace-nowrap">
                {Array.from(word).map((ch, ci) => (
                  <motion.span
                    key={ci}
                    variants={glyph}
                    className="inline-block will-change-transform"
                  >
                    {ch}
                  </motion.span>
                ))}
              </span>
            ),
          )}
        </span>
      ))}
    </MotionTag>
  );
}
