"use client";

import { cn } from "@/lib/utils";
import { useLang } from "@/i18n/LangProvider";
import { LANGS, type Lang } from "@/i18n/dictionary";

const SHORT: Record<Lang, string> = { pt: "PT", en: "EN", fr: "FR", es: "ES" };
const NATIVE: Record<Lang, string> = { pt: "Português", en: "English", fr: "Français", es: "Español" };

/** Seletor de idioma: quatro botões curtos, cada um anunciado no próprio idioma. */
export function LanguageSwitch({ className }: { className?: string }) {
  const { lang, setLang, t } = useLang();

  return (
    <div role="group" aria-label={t.nav.language} className={cn("flex items-center gap-0.5", className)}>
      {LANGS.map((l) => (
        <button
          key={l}
          type="button"
          lang={l}
          onClick={() => setLang(l)}
          aria-pressed={lang === l}
          aria-label={NATIVE[l]}
          title={NATIVE[l]}
          data-cursor="link"
          className={cn(
            "caption rounded px-1.5 py-1 transition-colors",
            lang === l
              ? "text-[var(--color-accent)]"
              : "text-[var(--color-fg-muted)] hover:text-[var(--color-fg)]",
          )}
        >
          {SHORT[l]}
        </button>
      ))}
    </div>
  );
}
