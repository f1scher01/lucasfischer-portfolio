import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { SmoothScroll } from "@/components/common/SmoothScroll";
import { Nav } from "@/components/nav/Nav";
import { AxeReporter } from "@/components/common/AxeReporter";
import { Grain } from "@/components/common/Grain";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://fischer.engineer"),
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
    <html lang="pt-BR" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body>
        {/* Skip-link — WCAG 2.4.1: pula a nav, visível só no foco */}
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-[var(--color-bg-elevated)] focus:px-4 focus:py-2 focus:text-[var(--color-fg)]"
        >
          Pular para o conteúdo
        </a>
        <SmoothScroll>
          <Nav />
          <main id="main">{children}</main>
        </SmoothScroll>
        <Grain />
        <AxeReporter />
      </body>
    </html>
  );
}
