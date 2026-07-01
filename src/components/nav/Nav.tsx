"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { MobileMenu } from "./MobileMenu";

const SECTIONS = ["about", "work", "toolkit", "credentials", "contact"];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Active section via IntersectionObserver
  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    SECTIONS.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActive(id);
        },
        { rootMargin: "-40% 0px -50% 0px" },
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className={cn(
        "fixed top-0 z-50 w-full transition-colors duration-300",
        scrolled
          ? "border-b border-[var(--color-border)] bg-[var(--color-bg)]/80 backdrop-blur-md"
          : "border-b border-transparent",
      )}
    >
      <div className="container-x flex h-16 items-center justify-between">
        <a
          href="#hero"
          className="font-display text-lg tracking-tight hover:text-[var(--color-accent)] transition-colors"
        >
          LF.
        </a>

        <ul className="hidden gap-8 md:flex">
          {SECTIONS.map((s) => (
            <li key={s}>
              <a
                href={`#${s}`}
                aria-current={active === s ? "true" : undefined}
                className={cn(
                  "caption underline-offset-4 transition-colors hover:text-[var(--color-fg)]",
                  active === s
                    ? "text-[var(--color-accent)] underline"
                    : "text-[var(--color-fg-muted)]",
                )}
              >
                {s}
              </a>
            </li>
          ))}
        </ul>

        <a
          href="#contact"
          data-cursor="link"
          className="caption hidden text-[var(--color-fg)] underline-offset-4 hover:underline md:inline"
        >
          Get in touch ↗
        </a>

        <MobileMenu />
      </div>
    </motion.nav>
  );
}
