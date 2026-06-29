# Mega Prompt — Executa tudo em uma lapada

Cola exatamente o texto abaixo no Claude Code (depois de rodar `claude` na pasta do projeto). Faz o ciclo completo: validação, melhorias, build, git, GitHub, deploy preview. Pausa apenas em 3 momentos onde precisa de input humano.

---

## Como usar

1. Abre PowerShell na pasta do projeto descompactado
2. Roda os comandos de setup uma vez:
   ```powershell
   pnpm install
   pnpm add geist
   ```
3. Roda `claude` (entra no Claude Code)
4. Cola o texto da seção **PROMPT** abaixo (inteiro, de uma vez)
5. Vai responder perguntas só quando ele pausar e pedir

---

## PROMPT (cole tudo a partir daqui)

```
Você está dentro do meu portfólio pessoal premium (Lucas Fischer Paez, engenheiro mecânico + design engineer). Antes de começar, LEIA estes arquivos pra contexto completo: README.md, SPEC.md, CLAUDE.md, COMO_USAR.md.

Vou te pedir uma sequência grande de tarefas. Execute na ordem, sem pular. Após cada milestone, me dê um status de uma linha e siga. Quando atingir os pontos marcados como [PAUSA], pare e me peça o que precisa.

Princípios:
- Stack canônica do projeto. Não introduza libs novas sem necessidade.
- TypeScript estrito. `pnpm typecheck` deve passar entre cada milestone.
- Conventional Commits, commits pequenos e atômicos.
- Não faça refatorações fora do escopo de cada tarefa.
- Se algo falhar, diagnostique a causa real antes de "tapar". Se não souber, pergunte.

---

MILESTONE 1 — Validação inicial
- Rode `pnpm typecheck` e `pnpm build`.
- Se houver erros, conserte (sem mudar arquitetura).
- Confirme com status "✅ build limpo".

MILESTONE 2 — Refinar BendingBeam
Em `src/components/hero/BendingBeam.tsx`:
- (a) Adicione `<Environment preset="city" />` do drei. Suavize sombras (shadow-mapSize 2048).
- (b) Performance: NÃO aloque `new THREE.Color()` dentro do `useFrame`. Reuse uma instância. Mesma coisa para qualquer alocação por frame.
- (c) UX mobile: detecte touch device (`matchMedia('(pointer: coarse)')`). Se touch, substitua a interação por animação automática suave que oscila F entre 0 e `forceAtYield(STEEL_1020)` em senoide com período de 4s.
- Teste com `pnpm typecheck`. Commit "feat(hero): refina BendingBeam — env, perf, mobile loop".

MILESTONE 3 — Stagger animação em Work
Em `src/components/sections/Work.tsx`:
- Troque o `<li>` por `motion.li`.
- Cada item: opacity 0→1, y 30→0, duration 0.6s, ease [0.16, 1, 0.3, 1], staggerChildren 0.08s no parent `<ul>` (use Motion `variants` com `initial`/`whileInView`, `viewport={{ once: true, margin: "-15% 0px" }}`).
- Remova o `ScrollReveal` envolvendo cada item (mas mantenha o do título da seção).
- Commit "feat(work): stagger animation".

MILESTONE 4 — OG Image dinâmica
- Crie `src/app/opengraph-image.tsx` usando `@vercel/og` (já está no package.json).
- Runtime "edge". Dimensões 1200x630.
- Design: fundo oklch(15% 0.01 240). Texto "Lucas Fischer" em Geist Sans 96px peso 600, "Mechanical Engineer · Design Engineer" em 36px peso 400 cor fg-muted. Linha horizontal accent oklch(70% 0.18 60) 80px x 4px abaixo do nome.
- Atualize `metadata.openGraph.images` no `layout.tsx` para usar a OG dinâmica.
- Sem imagens externas, só texto e formas. Commit "feat(seo): OG image dinâmica".

MILESTONE 5 — Páginas de projetos MDX
- Instale: `pnpm add @next/mdx @mdx-js/loader @mdx-js/react gray-matter remark-gfm`.
- Configure `next.config.ts` para MDX.
- Crie `src/app/projects/[slug]/page.tsx`:
  - `generateStaticParams` lendo arquivos de `src/content/projects/*.mdx`.
  - `generateMetadata` com base no frontmatter.
  - Layout: container narrow (max-w-3xl), back-link no topo (← Back to work), hero com title + role + year, body MDX com tipografia Fraunces em h2/h3.
- Crie exemplo `src/content/projects/maua-racing.mdx` com frontmatter:
  ```
  title: "Maua Racing — Vehicle Dynamics"
  role: "Trainee · FSAE"
  year: 2026
  summary: "Análise de suspensão e telemetria do protótipo."
  tech: ["Telemetry", "MATLAB", "Ansys"]
  ```
  E ~200 palavras de placeholder em PT-BR sobre o contexto (não invente dados específicos — use placeholders genéricos sobre análise de suspensão e aquisição de dados, evidenciando que é placeholder).
- Atualize `src/components/sections/Work.tsx` para que cada projeto seja `<Link href={`/projects/${slug}`}>`.
- Commit "feat(projects): MDX pages + maua-racing example".

MILESTONE 6 — Performance e A11y pass
- Rode `pnpm build`. Liste o tamanho de cada chunk principal.
- Verifique se BendingBeam está em dynamic import — ele já está, confirme.
- Adicione `priority` à primeira imagem above-the-fold (se houver) — atualmente não há, então skip.
- Instale `@axe-core/react`: `pnpm add -D @axe-core/react`.
- Adicione no `layout.tsx` apenas em desenvolvimento:
  ```tsx
  if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
    import('react-dom').then(ReactDOM => {
      import('@axe-core/react').then(axe => axe.default(React, ReactDOM, 1000));
    });
  }
  ```
  (Ajuste para a forma correta com React 19 / Next 15 App Router — provavelmente um Client Component wrapper.)
- Rode `pnpm dev` em background e abra http://localhost:3000. Capture os warnings do axe no console (se não puder ler console do browser, instrua o usuário a fazê-lo).
- Liste no chat as 5 violações mais críticas (se houver) e corrija.
- Commit "chore(a11y): axe-core dev + fixes".

MILESTONE 7 — Inicializar git e GitHub
- Se ainda não foi inicializado: `git init`, `git add .`, primeiro commit "chore: initial commit".
- Os commits anteriores dos milestones devem ter sido feitos. Verifique com `git log --oneline`.

[PAUSA] Antes de criar o repo no GitHub, eu preciso ter rodado `gh auth login` no terminal. Pergunte: "Você já autenticou no GitHub CLI? Se não, rode `gh auth login` em outra aba e me avise."

- Após confirmação, crie repo privado: `gh repo create lucasfischer-portfolio --private --source=. --remote=origin`.
- `git push -u origin main`.
- Commit "chore(github): push initial".

MILESTONE 8 — Deploy Vercel preview

[PAUSA] Pergunte: "Já rodou `vercel login`? Se não, rode em outra aba e me avise quando terminar."

- Após confirmação: `vercel link --yes` (cria projeto sem perguntar).
- `vercel` (sem --prod) para gerar preview.
- Capture a URL retornada e me devolva.

MILESTONE 9 — Form de contato com Resend (OPCIONAL)

[PAUSA] Pergunte: "Quer o form de contato funcional agora (precisa de uma RESEND_API_KEY) ou prefere pular essa etapa e deixar o link mailto por enquanto?"

Se SIM:
- Peça a API key e o email destino.
- Crie `.env.local` com `RESEND_API_KEY=...` e `CONTACT_EMAIL=...`.
- Em `src/components/sections/Contact.tsx`, substitua os botões mailto por um form com Server Action.
- Validação Zod (nome ≥ 2 chars, email válido, mensagem ≥ 10 chars).
- Server Action em `src/app/actions/contact.ts` usando `resend.emails.send`.
- `useActionState` do React 19 para estado idle/loading/success/error.
- Inputs minimalistas (border-bottom only). Sucesso → fade in mensagem de agradecimento.
- Adicione `RESEND_API_KEY` e `CONTACT_EMAIL` em variáveis do projeto Vercel: `vercel env add RESEND_API_KEY` (etc).
- Commit "feat(contact): form com Resend + Server Action".
- Re-deploy: `vercel`.

Se NÃO: pule pro próximo milestone.

MILESTONE 10 — Deploy produção

[PAUSA] Mostre a URL do preview e pergunte: "Aprova o preview? Se sim, vou rodar deploy de produção."

- Após aprovação: `vercel --prod`.
- Capture URL final e me devolva.

MILESTONE 11 — Resumo final
- Liste tudo que foi feito (1 linha por milestone).
- Liste URLs: repo GitHub, preview Vercel, produção.
- Liste os 5 links de submit a awards (com URL direto do formulário):
  - Awwwards (https://www.awwwards.com/submit/)
  - Godly (https://godly.website/submit)
  - SiteInspire (https://www.siteinspire.com/contact)
  - Lapa Ninja (https://www.lapa.ninja/contact/)
  - Httpster (https://httpster.net/contact/)
- Tarefas que o Lucas precisa fazer manualmente:
  1. Adicionar foto em `public/lucas.jpg`
  2. Revisar copy de cada seção (atualmente placeholder)
  3. Atualizar lista de projetos com casos reais
  4. Submeter sitemap ao Google Search Console
  5. Submeter a pelo menos 2 dos 5 sites de discovery
- Despeço com status final.

---

REGRAS GERAIS:
- Sempre que rodar comando que demora (build, deploy, install), avise no chat antes.
- Se algum comando falhar com erro de permissão / path no Windows, sugira solução (PowerShell admin, mover pra pasta sem espaço/acento, etc).
- NUNCA delete arquivos sem perguntar.
- Se inferir que estou no Windows (verifique platform), use os comandos compatíveis.
- Pode usar `gh`, `git`, `vercel`, `pnpm` livremente.
- Resuma cada milestone em 1 frase ao terminar.

Comece pelo Milestone 1.
```

---

## O que esperar

Tempo total: **30 a 60 minutos** (dependendo de internet e velocidade do PC). Maior parte dele rodando builds/installs.

Você vai ser chamado nestes momentos:
1. **GitHub login** (`gh auth login` numa aba separada)
2. **Vercel login** (`vercel login` numa aba separada)
3. **Form de contato** — sim/não, e se sim, API key da Resend
4. **Aprovação do preview Vercel** antes do deploy de produção

No fim, ele te entrega:
- Site em produção numa URL Vercel
- Repo GitHub privado com histórico de commits semânticos
- Lista de tarefas manuais que sobraram pra você

---

## Se algo der ruim no meio

Você não perde o trabalho. Cada milestone gerou um commit. Pra retomar do ponto que parou:

```powershell
git log --oneline    # vê onde parou
```

E manda no Claude Code:
> Retoma do Milestone X. O último commit foi "feat(...)". Continua daí.
