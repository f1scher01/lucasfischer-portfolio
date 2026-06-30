"use client";

import { ReactNode, useEffect } from "react";
import { MotionConfig } from "motion/react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { sceneState } from "@/components/webgl/sceneStore";
import { prefersReducedMotion } from "@/lib/motion";
import { lenisRef } from "./lenisRef";

let pluginsRegistered = false;

export function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (!pluginsRegistered) {
      gsap.registerPlugin(ScrollTrigger);
      pluginsRegistered = true;
    }

    if (prefersReducedMotion()) {
      // sem smooth scroll; ScrollTrigger ainda funciona no scroll nativo
      sceneState.reducedMotion = true;
      return;
    }

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    lenisRef.current = lenis;

    lenis.on("scroll", ScrollTrigger.update);
    lenis.on("scroll", (e: { velocity: number }) => {
      sceneState.scrollVelocity = Math.min(Math.abs(e.velocity) / 28, 1);
    });

    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    // decaimento da velocidade quando o scroll para
    const decay = () => {
      sceneState.scrollVelocity *= 0.9;
    };
    gsap.ticker.add(decay);

    return () => {
      gsap.ticker.remove(raf);
      gsap.ticker.remove(decay);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
