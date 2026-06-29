"use client";

import { useEffect } from "react";

/**
 * Reporter de acessibilidade — SOMENTE em desenvolvimento.
 * Roda @axe-core/react no client e loga violações no console do browser.
 * Em produção o efeito sai cedo e nada é carregado (tree-shaken do bundle).
 */
export function AxeReporter() {
  useEffect(() => {
    if (process.env.NODE_ENV === "production") return;
    let cancelled = false;
    (async () => {
      try {
        const [React, ReactDOM, axe] = await Promise.all([
          import("react"),
          import("react-dom"),
          import("@axe-core/react"),
        ]);
        if (cancelled) return;
        await axe.default(React, ReactDOM, 1000);
      } catch (err) {
        console.warn("[a11y] axe-core não pôde iniciar:", err);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return null;
}
