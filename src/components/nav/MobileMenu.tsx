"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useLang } from "@/i18n/LangProvider";

const LINKS = ["about", "work", "toolkit", "credentials", "contact"] as const;

/**
 * Menu mobile full-screen: abre com clip-path circle a partir do canto
 * sup. direito (600ms, out-expo), links grandes em stagger. ESC fecha,
 * foco preso no overlay (trap manual), aria-modal. Só aparece < lg.
 */
export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const reduced = useReducedMotion();
  const { t } = useLang();

  const close = useCallback(() => {
    setOpen(false);
    buttonRef.current?.focus();
  }, []);

  // ESC + focus trap + scroll lock
  useEffect(() => {
    if (!open) return;
    document.documentElement.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        close();
        return;
      }
      if (e.key !== "Tab") return;
      const focusables = overlayRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled])',
      );
      if (!focusables || focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    const timer = window.setTimeout(() => {
      overlayRef.current?.querySelector<HTMLElement>("a[href]")?.focus();
    }, 50);

    return () => {
      document.documentElement.style.overflow = "";
      document.removeEventListener("keydown", onKey);
      window.clearTimeout(timer);
    };
  }, [open, close]);

  return (
    <div className="lg:hidden">
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? t.nav.menuClose : t.nav.menuOpen}
        onClick={() => setOpen((v) => !v)}
        className="relative z-[75] flex h-10 w-10 flex-col items-center justify-center gap-1.5"
      >
        <span
          className={`block h-[2px] w-6 bg-[var(--color-fg)] transition-transform duration-300 ${
            open ? "translate-y-[4px] rotate-45" : ""
          }`}
        />
        <span
          className={`block h-[2px] w-6 bg-[var(--color-fg)] transition-transform duration-300 ${
            open ? "-translate-y-[4px] -rotate-45" : ""
          }`}
        />
      </button>

      <AnimatePresence>
        {open ? (
          <motion.div
            ref={overlayRef}
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label={t.nav.menuLabel}
            className="fixed inset-0 z-[70] flex flex-col justify-center bg-[var(--color-bg)] px-8"
            initial={
              reduced
                ? { opacity: 0 }
                : { clipPath: "circle(0% at calc(100% - 2.5rem) 2.5rem)" }
            }
            animate={
              reduced
                ? { opacity: 1 }
                : { clipPath: "circle(150% at calc(100% - 2.5rem) 2.5rem)" }
            }
            exit={
              reduced
                ? { opacity: 0 }
                : { clipPath: "circle(0% at calc(100% - 2.5rem) 2.5rem)" }
            }
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <nav>
              <ul className="space-y-2">
                {LINKS.map((id, i) => (
                  <motion.li
                    key={id}
                    initial={reduced ? false : { opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: reduced ? 0 : 0.15 + i * 0.06,
                      duration: 0.5,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                  >
                    <a
                      href={`#${id}`}
                      onClick={close}
                      className="font-display block py-2 text-5xl tracking-tight text-[var(--color-fg)] transition-colors hover:text-[var(--color-accent)]"
                    >
                      {t.nav.sections[id]}
                    </a>
                  </motion.li>
                ))}
              </ul>
            </nav>
            <p className="caption absolute bottom-10 left-8 text-[var(--color-fg-muted)]">
              Lucas Fischer Paez · IMT
            </p>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
