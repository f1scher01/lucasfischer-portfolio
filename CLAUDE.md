# CLAUDE.md

Instruções persistentes para Claude Code rodando neste repo.

## Posicionamento
Este é o portfólio pessoal premium do Lucas Fischer Paez — engenheiro mecânico (IMT) + design engineer.
O site representa nível premium (faixa R$ 30k+ se fosse cliente). Tudo precisa estar à altura.

## Stack canônica (não desviar sem pedir)
- Next.js 15 App Router + React 19 + TypeScript estrito
- Tailwind CSS v4 (tokens em `globals.css` com `@theme`)
- Motion (ex-Framer Motion) v12 — import `motion/react`
- GSAP + ScrollTrigger (para timelines complexas)
- Lenis (smooth scroll)
- React Three Fiber + Drei + postprocessing (para o BendingBeam e futuros 3D)
- pnpm

## Princípios
1. Server Component por default. `"use client"` só quando necessário.
2. TypeScript estrito. Sem `any` sem comentário justificando.
3. Acessibilidade não é opcional. WCAG 2.2 AA mínimo.
4. Performance é parte do produto. LH Performance 95+, A11y 100.
5. `prefers-reduced-motion` respeitado em toda animação não-essencial.
6. Mobile-first sempre.

## Padrões
- Path alias `@/` para `src/`
- Components em PascalCase, um por arquivo
- Hooks em camelCase começando com `use`
- Arquivos de física/cálculo em `src/lib/` — puros, testáveis
- Imports do mesmo dir = relativo. Cross-dir = alias.

## O BendingBeam é sagrado
`src/components/hero/BendingBeam.tsx` é o wow moment. Antes de mudar:
1. Leia `src/lib/beam-physics.ts` para entender a física.
2. Qualquer mudança visual NÃO pode comprometer a precisão física.
3. Performance: o `useFrame` é hot path — não alocar dentro dele.

## Antes de PR / commit grande
- `pnpm typecheck` deve passar
- `pnpm build` deve passar
- `pnpm lint` deve passar
- Lighthouse: Performance 90+, A11y 100

## Sobre o Lucas
- 1º ano Eng. Mec. IMT, vem do Maua Racing (FSAE)
- Fala PT/ES/EN/FR
- Prefere explicações diretas, sem filler
- Quer entender o "porquê", não só copiar receita
