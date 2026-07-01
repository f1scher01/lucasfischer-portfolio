import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Fraunces } from "next/font/google";

// Editorial serif real (antes caía no fallback Times) — self-hosted no build.
const fraunces = Fraunces({
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-fraunces",
});
import { SmoothScroll } from "@/components/common/SmoothScroll";
import { Nav } from "@/components/nav/Nav";
import { Grain } from "@/components/common/Grain";
import { SceneLayer } from "@/components/webgl/SceneLayer";
import { Cursor } from "@/components/ui/Cursor";
import { Preloader } from "@/components/preloader/Preloader";
import { LangProvider } from "@/i18n/LangProvider";
import "./globals.css";

// JSON-LD Person — dados estruturados p/ Google (schema.org)
const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Lucas Fischer Paez",
  jobTitle: "Mechanical Engineer & Design Engineer",
  alumniOf: "Instituto Mauá de Tecnologia",
  url: "https://lucasfischer-portfolio.vercel.app",
  sameAs: [
    "https://github.com/lucasf22games-png",
    "https://linkedin.com/in/lucasfischerpaez",
  ],
  knowsLanguage: ["pt-BR", "es", "en", "fr"],
};

export const metadata: Metadata = {
  metadataBase: new URL("https://lucasfischer-portfolio.vercel.app"),
  title: {
    default: "Lucas Fischer — Mechanical Engineer & Design Engineer",
    template: "%s · Lucas Fischer",
  },
  description:
    "Engenheiro mecânico em formação no IMT. Construo experiências digitais com a mesma precisão de uma simulação por elementos finitos.",
  openGraph: {
    title: "Lucas Fischer",
    description: "Mechanical Engineer & Design Engineer",
    type: "website",
    locale: "pt_BR",
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="pt-BR"
      className={`${GeistSans.variable} ${GeistMono.variable} ${fraunces.variable}`}
    >
      <body>
        <script
          type="application/ld+json"
          // conteúdo 100% estático controlado por nós (sem input de usuário)
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        {/* Skip-link — WCAG 2.4.1: pula a nav, visível só no foco */}
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-[var(--color-bg-elevated)] focus:px-4 focus:py-2 focus:text-[var(--color-fg)]"
        >
          Pular para o conteúdo
        </a>
        <SceneLayer />
        <LangProvider>
          <SmoothScroll>
            <Nav />
            <main id="main" className="relative z-10">
              {children}
            </main>
          </SmoothScroll>
          <Grain />
          <Cursor />
          <Preloader />
        </LangProvider>
      </body>
    </html>
  );
}
