"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { dict, type Dict, type Lang } from "./dictionary";

interface LangContextValue {
  lang: Lang;
  t: Dict;
  toggle: () => void;
}

const LangContext = createContext<LangContextValue>({
  lang: "pt",
  t: dict.pt,
  toggle: () => {},
});

/**
 * i18n leve client-side: PT é o default pré-renderizado (SSG preservado);
 * a preferência vive em localStorage + cookie e troca as strings na hidratação.
 */
export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("pt");

  useEffect(() => {
    const stored =
      (localStorage.getItem("lang") as Lang | null) ??
      (document.cookie.match(/(?:^|; )lang=(pt|en)/)?.[1] as Lang | null);
    if (stored === "en" || stored === "pt") setLang(stored);
  }, []);

  const toggle = useCallback(() => {
    setLang((prev) => {
      const next: Lang = prev === "pt" ? "en" : "pt";
      localStorage.setItem("lang", next);
      document.cookie = `lang=${next}; path=/; max-age=31536000; SameSite=Lax; Secure`;
      document.documentElement.lang = next === "pt" ? "pt-BR" : "en";
      return next;
    });
  }, []);

  return (
    <LangContext.Provider value={{ lang, t: dict[lang], toggle }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang(): LangContextValue {
  return useContext(LangContext);
}
