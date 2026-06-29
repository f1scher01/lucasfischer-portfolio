# Lucas Fischer — Portfolio (Design Engineer)

Portfólio pessoal premium. Stack: **Next.js 15 · React 19 · TypeScript · Tailwind v4 · Motion · GSAP · R3F**.

Wow moment: **viga em flexão interativa** com cálculo real de tensão e deflexão (Euler-Bernoulli) renderizada em WebGL.

## Pré-requisitos

- Node.js 20+ (recomendo 22 LTS)
- pnpm 9+ (`npm install -g pnpm`)
- Git
- Conta na Vercel (deploy) — gratuita
- (Opcional) Conta na Resend (form de contato) — gratuita até 3000 emails/mês

## Setup inicial

```bash
# 1. Instalar deps
pnpm install

# 2. Adicionar Geist Fonts (Vercel) — pacote separado
pnpm add geist

# 3. Copiar env
cp .env.example .env.local
# editar .env.local com tua RESEND_API_KEY (opcional)

# 4. Rodar dev
pnpm dev
# abre http://localhost:3000
```

Se der erro na primeira execução por causa do React Compiler (experimental), comente em `next.config.ts`:

```ts
experimental: { reactCompiler: false },
```

## Estrutura

```
src/
├── app/
│   ├── layout.tsx        # Root layout — fontes, providers
│   ├── page.tsx          # Home — composição das seções
│   └── globals.css       # Tokens (Tailwind v4) + reset
├── components/
│   ├── hero/
│   │   ├── Hero.tsx        # Composição do hero
│   │   └── BendingBeam.tsx # 🔥 wow moment — R3F + física real
│   ├── nav/
│   │   └── Nav.tsx
│   ├── sections/         # About, Work, Toolkit, Credentials, Contact
│   ├── ui/
│   │   └── MagneticButton.tsx
│   └── common/
│       ├── SmoothScroll.tsx  # Lenis
│       ├── ScrollReveal.tsx  # In-view fade-up
│       └── Footer.tsx
└── lib/
    ├── beam-physics.ts   # Cálculos de viga (puro TS, testável)
    └── utils.ts          # cn, clamp, lerp
```

## Workflow recomendado com Claude Code

Abre o repo no Claude Code (`claude` na pasta do projeto). Use estes prompts como ponto de partida:

### 1. Validar setup

> "Roda `pnpm typecheck` e `pnpm build`. Se houver erro, corrige antes de seguir."

### 2. Refinar o BendingBeam

> "Lê `src/components/hero/BendingBeam.tsx` e `src/lib/beam-physics.ts`. Sugere 3 melhorias específicas: (a) visual (iluminação, environment), (b) performance (reduzir alocações no useFrame), (c) UX (touch em mobile, slider opcional). Implementa as duas mais impactantes."

### 3. Implementar OG image dinâmica

> "Cria `app/opengraph-image.tsx` usando `@vercel/og` com runtime edge. Design: nome do Lucas em Geist Sans grande, headline curta, background dark com gradient sutil. Aspect ratio 1200x630."

### 4. Adicionar projetos como MDX

> "Cria `src/app/projects/[slug]/page.tsx` com generateStaticParams + MDX. Crie 1 projeto exemplo em `src/content/projects/maua-racing.mdx` com frontmatter (title, role, year, summary, tech, gallery)."

### 5. Form de contato com Server Action

> "Substitui o link mailto do `Contact.tsx` por um form com Server Action que usa Resend para enviar email. Validar com Zod (nome, email, mensagem). Mostrar estado loading/success/error."

### 6. Performance pass

> "Roda `pnpm build && pnpm start` e abra `http://localhost:3000` em outra aba. Roda Lighthouse no Chrome DevTools (Performance + Accessibility). Reporta as métricas e propõe 5 otimizações concretas."

### 7. Acessibilidade pass

> "Instala `@axe-core/react`. Adiciona em dev mode no `layout.tsx`. Lista todas as violações encontradas e propõe fixes."

### 8. Deploy

> "Comita tudo com mensagem 'feat: initial portfolio v1'. Roda `vercel` para deploy preview. Quando aprovar, `vercel --prod`."

## Convenções de código

- **TypeScript estrito**: nunca `any` sem comentário justificando
- **Server Components por default**, `"use client"` só quando precisa de hook/event/browser API
- **Path alias `@/`** para `src/`
- **Tailwind v4**: tokens em `globals.css` (`@theme`), não em config JS
- **Motion** importado de `motion/react`, não `framer-motion` (renomeação 2025)
- **Imports**: relativos para mesma pasta, alias `@/` para fora

## Performance budget

| Métrica | Alvo |
|---|---|
| LCP | < 1.2s |
| INP | < 100ms |
| CLS | < 0.05 |
| Lighthouse Performance | 95+ |
| Lighthouse A11y | 100 |

## Deploy

```bash
# Conectar Vercel uma única vez
vercel link

# Deploy preview
vercel

# Production
vercel --prod

# Domain custom
vercel domains add fischer.engineer
```

## Submissão a awards (após deploy)

1. [Awwwards](https://www.awwwards.com/submit/) — submit. Aim: Honors first, então Site of the Day.
2. [Godly Website](https://godly.website/submit) — discovery rápido
3. [SiteInspire](https://www.siteinspire.com/contact) — alta curadoria
4. [Lapa Ninja](https://www.lapa.ninja/contact/) — landing pages
5. [Httpster](https://httpster.net/contact/) — discovery diário

## Roadmap (depois do v1)

- [ ] OG image dinâmica
- [ ] Páginas individuais de projetos (MDX)
- [ ] Form de contato com Server Action + Resend
- [ ] Light mode toggle
- [ ] i18n PT/EN
- [ ] /uses e /manifesto
- [ ] Blog (próxima iteração)
- [ ] Submissão Awwwards

## Licença

Código fonte: MIT. Conteúdo (textos, fotos, casos): © Lucas Fischer Paez.
