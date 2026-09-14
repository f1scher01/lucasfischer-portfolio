"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { dict, HTML_LANG, LANGS, type Dict, type Lang } from "./dictionary";

interface LangContextValue {
  lang: Lang;
  t: Dict;
  setLang: (lang: Lang) => void;
}

const LangContext = createContext<LangContextValue>({
  lang: "pt",
  t: dict.pt,
  setLang: () => {},
});

const isLang = (value: unknown): value is Lang =>
  typeof value === "string" && (LANGS as readonly string[]).includes(value);

/**
 * i18n leve client-side: PT é o default pré-renderizado (SSG preservado);
 * a preferência vive em localStorage + cookie e troca as strings na hidratação.
 */
export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("pt");

  useEffect(() => {
    let stored: string | null | undefined = null;
    try {
      stored = localStorage.getItem("lang");
    } catch {
      /* storage bloqueado: cai no cookie */
    }
    stored ??= document.cookie.match(/(?:^|; )lang=(pt|en|fr|es)/)?.[1];
    if (isLang(stored)) {
      setLangState(stored);
      document.documentElement.lang = HTML_LANG[stored];
    }
  }, []);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    try {
      localStorage.setItem("lang", next);
    } catch {
      /* sem storage: o cookie abaixo mantém a escolha */
    }
    document.cookie = `lang=${next}; path=/; max-age=31536000; SameSite=Lax; Secure`;
    document.documentElement.lang = HTML_LANG[next];
  }, []);

  return (
    <LangContext.Provider value={{ lang, t: dict[lang], setLang }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang(): LangContextValue {
  return useContext(LangContext);
}
