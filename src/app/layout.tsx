import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { SmoothScroll } from "@/components/common/SmoothScroll";
import { Nav } from "@/components/nav/Nav";
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
        <SmoothScroll>
          <Nav />
          <main>{children}</main>
        </SmoothScroll>
      </body>
    </html>
  );
}
