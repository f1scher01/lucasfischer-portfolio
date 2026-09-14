# Lucas Fischer Paez · Portfolio

**[lucasfischer-portfolio.vercel.app](https://lucasfischer-portfolio.vercel.app)** · PT · EN · FR · ES

Portfólio de um estudante de Engenharia Mecânica do Instituto Mauá de Tecnologia. O destaque técnico
é a viga do topo: um campo de tensões de flexão calculado pela teoria de Euler-Bernoulli a cada
quadro, a partir da posição do cursor, e renderizado em WebGL.

*Portfolio of a Mechanical Engineering student at Instituto Mauá de Tecnologia, Brazil. The hero is
a simply supported beam whose bending stress field is computed from Euler-Bernoulli theory every
frame and rendered in WebGL.*

## Física da viga

`src/lib/beam-physics.ts` implementa, em TypeScript puro, a viga biapoiada com carga central:
momento de inércia da seção retangular, tensão de flexão na fibra extrema, deflexão no centro e
fator de segurança contra o escoamento do aço 1020 (E = 200 GPa, σ_y = 250 MPa). O painel no canto
superior mostra esses valores em tempo real.

## Stack

Next.js 15 (App Router, geração estática) · React 19 · TypeScript · Tailwind CSS 4 ·
React Three Fiber · Motion · GSAP · Lenis.

- **Idiomas:** dicionário tipado em `src/i18n/dictionary.ts`. O português é pré-renderizado e os
  demais idiomas trocam no cliente, com a escolha salva em `localStorage` e cookie. O tipo `Dict`
  impede que um idioma fique com chave faltando.
- **Segurança:** site sem formulário e sem segredos, CSP e cabeçalhos em `next.config.ts`, modelo
  de ameaças em `docs/threat-model.md`.
- **Acessibilidade:** link para pular a navegação, foco preso no menu mobile e respeito a
  `prefers-reduced-motion`.

## Rodar localmente

```bash
pnpm install
pnpm dev          # http://localhost:3000
pnpm typecheck
pnpm build
```

## Projetos citados no site

- [cetesb-air-quality-sp](https://github.com/f1scher01/cetesb-air-quality-sp): poluição do ar e saúde na RMSP com GOES-19, CETESB, SIH/SUS e QGIS.
- [telemetria-veicular-grafana](https://github.com/f1scher01/telemetria-veicular-grafana): simulador de telemetria com InfluxDB e Grafana.
- [notas-cr-maua-pwa](https://github.com/f1scher01/notas-cr-maua-pwa): aplicativo de notas e coeficiente de rendimento.

Os sons de motor da bancada virtual vêm do Freesound, sob licença CC0.

## Licença

Código: MIT. Textos e conteúdo: © Lucas Fischer Paez.
