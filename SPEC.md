# Lucas Fischer — Portfolio Premium · Specification

> Documento mestre. Lê-se uma vez no início, consulta-se durante todo o projeto.

## 1. Visão

Portfólio pessoal de Lucas Fischer Paez — engenheiro mecânico em formação (IMT) que constrói experiências digitais de alto nível. O site é a primeira impressão para sponsors, empresas, professores, futuros colegas e potenciais clientes.

**Posicionamento de uma frase:** *"Engenheiro mecânico que constrói experiências digitais com a mesma precisão de uma simulação por elementos finitos."*

**Objetivo de negócio:** captar oportunidades — estágio premium, freelance de site premium, network de motorsport/indústria, exposure em comunidade de design engineers.

## 2. Audiências (em ordem de prioridade)

1. **Recrutadores técnicos** de engenharia (Maua Racing partners, autopeças, hardware startups)
2. **Clientes potenciais** de site premium (estúdios, marcas premium, FSAE teams)
3. **Pares técnicos** (design engineers internacionais, comunidade R3F/motion)
4. **Professores e mentores** acadêmicos
5. **Curiosos** que chegaram via Awwwards/Twitter/LinkedIn

## 3. Mensagens-chave

- Lucas é um híbrido raro: engenheiro de verdade + dev de verdade
- A precisão técnica do CAD/CAE/simulação aparece no código e no design
- Já tem repertório de projetos sólidos, não é "iniciante"
- Multilíngue (PT, ES, EN, FR) → trabalha global
- Comunica resultados com objetividade, não buzz

## 4. Arquitetura de informação (Sitemap)

```
/
├── #hero           (Bending Beam interativa + nome + headline)
├── #about          (2 parágrafos densos + foto editorial)
├── #work           (3–5 projetos selecionados em grid editorial)
├── #toolkit        (CAD/CAE + Programming + Manufacturing — bars animadas)
├── #credentials    (Certificações + idiomas — layout tipográfico)
└── #contact        (CTA único: email + form com Server Action)

/projects/[slug]    (página individual de cada projeto — MDX)
/manifesto          (opcional fase 2 — declaração de princípios técnicos)
/uses              (opcional fase 2 — setup/tooling do Lucas)
```

## 5. Wow moment — Bending Beam (Hero)

### Conceito

Visualização 3D de uma viga em apoio-apoio (bi-apoiada) com força concentrada no centro. Usuário arrasta um ponto na viga → força aplica → viga deforma com **deflexão real (Euler-Bernoulli)** → cor varia em **heatmap de tensão de flexão** (von Mises simplificado a σ_xx).

### Física (resumo)

**Viga retangular bi-apoiada de comprimento L, seção b×h, módulo E.**

Momento de inércia: `I = b·h³ / 12`

Para força F no centro, x ∈ [0, L/2]:
- Momento: `M(x) = F·x / 2`
- Tensão máxima na fibra: `σ(x) = M(x)·(h/2) / I`
- Deflexão: `y(x) = -F·x·(3L² - 4x²) / (48·E·I)`

Por simetria, espelhar para x ∈ [L/2, L].

### Implementação técnica

- `BoxGeometry` segmentado (~32 segmentos no comprimento) gerado uma vez
- Shader vertex: aplica `y(x)` ao Y de cada vértice
- Atributo `stress` por vértice (calculado em CPU ou via shader)
- Shader fragment: mapeia `stress` para cor via colormap viridis/inferno
- Interação: ponteiro mapeia para `F ∈ [0, F_max]`; spring com `useSpring` para suavizar
- Mobile: substitui interação por animação automática que oscila F

### Restrições

- **F_max** calibrada para tensão de escoamento de aço estrutural (250 MPa) — cor satura no limite. Honesto fisicamente.
- Material default: Aço 1020, E = 200 GPa, σ_y = 250 MPa
- Dimensões: L = 1 m, b = 30 mm, h = 50 mm
- Painel lateral mostra valores em tempo real: F (N), σ_max (MPa), δ_centro (mm), fator de segurança

## 6. Wow secundário — Toolkit animado

Em vez de logos chapados (CAD, Python, etc.), uma matriz animada:

- Cada ferramenta é um cubo 3D (R3F) que rotaciona suavemente
- Hover: cubo se expande e mostra anos de uso + projeto onde aplicou
- Layout: grid 3×3 (CAD/CAE 3, Programming 2, Manufacturing 2, Languages 2)

## 7. Design system

### Cores

```css
/* Mode: dark default */
--bg:              oklch(15% 0.01 240);   /* near-black com matiz azul */
--bg-elevated:     oklch(20% 0.015 240);
--fg:              oklch(95% 0.005 240);
--fg-muted:        oklch(70% 0.01 240);
--fg-dim:          oklch(50% 0.01 240);

--accent:          oklch(70% 0.18 60);    /* laranja calibrado — referência a tensão de viga */
--accent-strong:   oklch(80% 0.22 50);

--success:         oklch(75% 0.15 145);
--warning:         oklch(80% 0.16 80);
--danger:          oklch(65% 0.22 25);

--border:          oklch(25% 0.01 240);
--border-strong:   oklch(40% 0.01 240);
```

Light mode reverte: `--bg: oklch(98% 0.005 240)`, `--fg: oklch(15% 0.01 240)`. Toggle no canto sup. direito.

### Tipografia

- **Display/Headlines:** [Cal Sans](https://github.com/calblueprint/cal-sans) ou **Söhne Schmal** (alternativa elegante: **Geist Sans** da Vercel — grátis)
- **Body:** **Geist Sans** (Vercel — free, performático, tem variable)
- **Mono:** **Geist Mono** ou **JetBrains Mono**
- **Editorial accent:** **Fraunces** (variable, slab moderno) — para citações e números

Escala (rem):

```
display-2xl: 6.5rem  / 1.0  / -2%  /* só hero */
display-xl:  4.5rem  / 1.05 / -1.5%
display-lg:  3.5rem  / 1.1  / -1%
display-md:  2.5rem  / 1.15
display-sm:  1.875rem / 1.2
body-lg:     1.125rem / 1.6
body:        1rem     / 1.6
body-sm:     0.875rem / 1.5
caption:     0.75rem  / 1.4   /* uppercase + 4% letter-spacing */
```

### Espaçamento

Base 4px. Stack: 8/12/16/24/32/48/64/96/128. Container max 1280px (max-w-7xl), gutter 24px mobile / 48px desktop.

### Grid

12-col desktop, 4-col mobile. Use CSS Grid, não Bootstrap-style.

### Motion principles

- **Easing default:** `cubic-bezier(0.65, 0, 0.35, 1)` (out expo suave)
- **Durations:** 200ms (micro), 400ms (UI), 700ms (entrance), 1200ms (hero reveal)
- **Respeite `prefers-reduced-motion`:** skip animações pesadas
- **No bounce em UI séria.** Spring só onde simula física (tipo a viga).

## 8. Copy (rascunho — refinar com Lucas)

### Hero
> **Lucas Fischer Paez**
> Engenheiro mecânico em formação. Constrói experiências digitais com a mesma precisão de uma simulação por elementos finitos.
> [Arraste a viga ▶]

### About
> Aluno de Engenharia Mecânica no Instituto Mauá de Tecnologia (IMT). Trainee na Maua Racing, focado em vehicle dynamics. Trabalho em projetos de extensão universitária aplicando CAD/CAE a tecnologias assistivas.
>
> Fora do laboratório, construo sites premium para marcas que querem aparência e performance no mesmo nível. A precisão que aplico em um modelo de elementos finitos é a mesma que aplico em uma transição de 200ms.

### Work (cards)
- **Maua Racing — Vehicle Dynamics** (FSAE, telemetria, suspensão)
- **Projeto Extensão — Tecnologia Assistiva** (CAD para acessibilidade)
- **Sites — Design Engineering** (3 últimos sites com link/print)
- **(opcional) Trabalho acadêmico de impacto**

### Toolkit
> Sem buzzword. Cada ferramenta com anos de uso e ONDE foi aplicada.

CAD/CAE: SolidWorks · NX · CATIA 3DExperience · Fusion 360 · AutoCAD · Ansys Workbench
Programming: Python · MATLAB · TypeScript · React · Three.js
Manufacturing: 3D printing · CNC machining
Idiomas: PT (nativo) · ES (nativo/avançado) · EN (C1) · FR (B1)

### Contact
> **Vamos construir algo.**
> [seu-email@] — Disponível para FSAE/automotive/hardware partners, freelance premium de site e parcerias acadêmicas.

## 9. Performance budget (não-negociável)

| Métrica | Alvo | Limite |
|---|---|---|
| LCP | < 1.2s | < 1.8s |
| INP | < 100ms | < 200ms |
| CLS | < 0.05 | < 0.1 |
| Total JS (transfer) | < 150kb | < 250kb |
| Total CSS | < 30kb | < 60kb |
| Lighthouse Performance | 95+ | 90+ |
| Lighthouse Accessibility | 100 | 95+ |

Estratégias:
- `BendingBeam` lazy-loaded com `next/dynamic` + `ssr: false`
- Skeleton no SSR (apenas o nome + headline aparecem instantâneos)
- Preconnect a fontes
- Variable fonts via `next/font/local` (sem network call em runtime)
- Imagens: AVIF/WebP via next/image, `priority` no LCP
- Bundle analyzer rodando em cada build

## 10. SEO

- `generateMetadata` em cada página
- OG image dinâmica via `@vercel/og` (runtime: 'edge')
- Sitemap.xml + robots.txt
- Schema.org Person + ProfilePage
- Open Graph + Twitter Card

## 11. Acessibilidade

- WCAG 2.2 AA
- Foco visível com outline custom
- Navegação por teclado completa (incluindo skip-link)
- Alt em todas imagens
- ARIA só onde HTML semântico não basta
- Teste com VoiceOver/NVDA antes do deploy
- `prefers-reduced-motion`: skip Lenis, skip animações com transform > 50px, viga fica estática

## 12. Roadmap de implementação (8 fases)

| Fase | Duração | Saída |
|---|---|---|
| 1. Setup | 1 dia | Repo, configs, fontes, tokens |
| 2. Layout base | 1 dia | Nav, footer, Lenis, layout responsive |
| 3. Hero + BendingBeam | 3 dias | Wow moment funcional, mobile fallback |
| 4. About + Work + Toolkit | 2 dias | Conteúdo + animações de scroll reveal |
| 5. Credentials + Contact | 1 dia | Form com Server Action |
| 6. Project pages (MDX) | 2 dias | 3 projects publicados |
| 7. Performance + A11y pass | 2 dias | LH 95+, axe limpo |
| 8. Deploy + submit | 1 dia | Vercel + Awwwards/godly/siteinspire |

Total: ~13 dias de trabalho focado.

## 13. Stack final (resumo)

- Next.js 15 + React 19 + TypeScript 5
- Tailwind CSS v4 + shadcn/ui
- Motion (ex-Framer Motion) v12
- GSAP + ScrollTrigger
- Lenis
- React Three Fiber + Drei + postprocessing
- MDX (next-mdx-remote / @next/mdx)
- Resend + Server Actions
- Vercel deploy + Speed Insights + Analytics
- pnpm

## 14. O que NÃO está incluso (anti-escopo)

- Blog completo com CMS (fase 2)
- Multilingua i18n (fase 2 — começa em PT, EN opcional)
- Sistema de comentários
- Chat / IA assistente
- Dashboard admin
- E-commerce / pagamentos
