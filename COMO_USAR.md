# Como usar este projeto com Claude Code

Guia prático passo a passo. Tempo total estimado da fase 1 (rodar local): **~15 minutos**.

---

## Parte 1 — Instalar o necessário (uma única vez)

Se você já tem Node.js, pnpm e Claude Code, pode pular para a Parte 2.

### 1.1 — Node.js 22 LTS

Baixe e instale de [nodejs.org](https://nodejs.org/) (versão LTS, 22.x).

Verificar:
```powershell
node --version  # deve mostrar v22.x.x
npm --version
```

### 1.2 — pnpm

```powershell
npm install -g pnpm
pnpm --version  # deve mostrar 9.x ou superior
```

### 1.3 — Claude Code

```powershell
npm install -g @anthropic-ai/claude-code
claude --version
```

Na primeira execução pede login (abre browser, faz auth com tua conta Anthropic/Claude).

### 1.4 — Git (se ainda não tiver)

Baixe de [git-scm.com](https://git-scm.com/). Após instalar:
```powershell
git config --global user.name "Lucas Fischer Paez"
git config --global user.email "lucasf22games@gmail.com"
```

### 1.5 — Vercel CLI (para deploy)

```powershell
npm install -g vercel
vercel login
```

---

## Parte 2 — Setup do projeto (uma vez por projeto)

### 2.1 — Descompactar o zip

Onde quiser. Recomendo: `C:\Users\lucas\projects\lucasfischer-portfolio\`

### 2.2 — Abrir terminal na pasta

Abra PowerShell ou Terminal do Windows e:
```powershell
cd C:\Users\lucas\projects\lucasfischer-portfolio
```

### 2.3 — Instalar dependências

```powershell
pnpm install
pnpm add geist
```

Se aparecer warning sobre peer deps, ignora (React 19 ainda tem libs catching up).

### 2.4 — Rodar pela primeira vez

```powershell
pnpm dev
```

Abre `http://localhost:3000`. Se der erro de React Compiler, edite `next.config.ts` e troque `reactCompiler: true` para `reactCompiler: false`, salve e rode `pnpm dev` de novo.

Você deve ver: hero com a viga 3D respondendo ao mouse, navegação no topo, e as seções abaixo.

**Se chegou até aqui, base está funcionando.** Hora do Claude Code.

---

## Parte 3 — Trabalhar com Claude Code

### 3.1 — Abrir Claude Code

Na mesma pasta do projeto (mantém o `pnpm dev` rodando em outra aba):
```powershell
claude
```

Você entra num REPL onde digita o que quer que ele faça. Ele lê os arquivos do projeto automaticamente.

### 3.2 — Comandos úteis do Claude Code (referência rápida)

| Comando | O que faz |
|---|---|
| Digitar e Enter | Manda mensagem |
| `/help` | Ajuda |
| `/init` | Cria/atualiza CLAUDE.md (já temos, mas útil pra entender) |
| `/clear` | Limpa contexto da sessão atual |
| `/cost` | Mostra gasto da sessão |
| `Ctrl+C` (2x) | Sair |

Atalhos importantes:
- **Pressionar Esc** durante uma resposta: interrompe
- **`@arquivo.tsx`** no meio do prompt: força ele a ler aquele arquivo

---

## Parte 4 — A sequência de prompts (cole na ordem)

Cada prompt resolve um pedaço. Não pule a ordem.

### Prompt 1 — Validar o setup

Cole:
> Leia o README.md, SPEC.md e CLAUDE.md do projeto pra entender o contexto. Depois rode `pnpm typecheck` e `pnpm build`. Se houver qualquer erro, corrija antes de seguir. Não mude arquitetura, só conserte o que estiver quebrando.

Espere: ele lê, roda, conserta typos se houver. Quando terminar, confirma "tudo verde".

### Prompt 2 — Melhorar a viga (BendingBeam)

> Leia `src/components/hero/BendingBeam.tsx` e `src/lib/beam-physics.ts`. Quero três melhorias específicas: (a) iluminação melhor — adicione um Environment do drei com preset "city" e suaviza as sombras; (b) performance — não aloque novos THREE.Color a cada frame, reuse uma instância; (c) UX mobile — quando for touch, troque a interação de pointermove para uma animação automática que oscila F entre 0 e F_yield em loop suave. Implemente tudo e teste com `pnpm typecheck`.

### Prompt 3 — Animação de scroll na seção Work

> Na `src/components/sections/Work.tsx`, quero que cada projeto entre com animação stagger ao aparecer na viewport. Use Motion (já importado). Cada projeto: opacity 0→1, y 30→0, duration 0.6s, ease [0.16, 1, 0.3, 1], stagger 0.08s. Mantenha o ScrollReveal externo pro título da seção. Pode usar `motion.li` direto.

### Prompt 4 — OG image dinâmica

> Crie `src/app/opengraph-image.tsx` usando `@vercel/og` com runtime "edge". Design: fundo `oklch(15% 0.01 240)`, nome "Lucas Fischer" em font Geist Sans 96px, headline "Mechanical Engineer · Design Engineer" em 36px, accent `oklch(70% 0.18 60)` num detalhe pequeno (linha ou ponto). Dimensões 1200x630. Sem imagens externas — só texto e formas geométricas.

### Prompt 5 — Form de contato com Server Action

> Substitua o link mailto do `Contact.tsx` por um form completo: campos nome, email, mensagem. Validação com Zod (server-side). Server Action que usa Resend pra enviar email para `process.env.CONTACT_EMAIL`. Estados: idle, loading, success, error. Use `useActionState` do React 19. Estilo: inputs minimalistas com border bottom apenas, sem bg. Quando enviar com sucesso, mostre uma mensagem de agradecimento substituindo o form com fade in.

Pré-requisito: cria conta em [resend.com](https://resend.com/), gera API key, cola em `.env.local`:
```
RESEND_API_KEY=re_xxx
CONTACT_EMAIL=lucasf22games@gmail.com
```

### Prompt 6 — Foto e about refinado

> Quero adicionar uma foto editorial no About. Estrutura: grid 12-col, foto ocupa col 1-4, texto ocupa col 6-12. Imagem em `public/lucas.jpg` (assumo que vou adicionar depois). Use next/image com priority=false e sizes responsivos. Aspect ratio 3:4. Adicione um pequeno detalhe: a foto tem um grain SVG sutil em overlay (opacity 0.05).

### Prompt 7 — Páginas individuais de projetos (MDX)

> Configure MDX no projeto. Instale `@next/mdx`, `@mdx-js/react`, `@mdx-js/loader`, `gray-matter`. Crie `src/app/projects/[slug]/page.tsx` com generateStaticParams lendo de `src/content/projects/*.mdx`. Frontmatter: title, role, year, summary, tech (array), hero (path imagem opcional). Crie um exemplo `src/content/projects/maua-racing.mdx` com conteúdo placeholder. Estilo das pages: container narrow (max 720px), tipografia Fraunces nos H2/H3, voltar pra home no topo.

### Prompt 8 — Performance e A11y pass

> Rode `pnpm build && pnpm start` (em background, porta 3000). Em outra aba, abre Chrome DevTools, roda Lighthouse em Performance + Accessibility (mobile + desktop). Reporta as métricas exatas. Depois, instala `@axe-core/react` em dev e adiciona em `layout.tsx` (só em dev). Lista violations. Conserta as 5 mais críticas. Não toque na arquitetura — só corrige.

### Prompt 9 — Init git + commit + deploy

> Inicializa git nesse projeto se ainda não estiver. Comita tudo com mensagens semânticas separando: chore (configs), feat (hero/beam), feat (sections), feat (contact form), feat (mdx pages), perf, a11y. Use Conventional Commits. Cria repo no GitHub privado chamado `lucasfischer-portfolio` (usa `gh repo create`). Push. Depois, `vercel link` (assume eu já fiz login antes). Por fim, `vercel` para deploy preview e me retorna a URL.

### Prompt 10 — Produção

Depois de aprovar o preview:
> Roda `vercel --prod` e me devolve a URL final. Submete o sitemap ao Google Search Console (me dá o passo a passo manual já que não tenho acesso direto). Lista os 5 sites de submissão pra eu mandar manualmente.

---

## Parte 5 — Workflow diário (depois do v1)

Quando quiser mudar qualquer coisa:

```powershell
# Sempre numa branch nova pra cada feature
git checkout -b feat/animacao-toolkit

claude
# > "Na Toolkit, ao hover no nome de uma ferramenta, anime o texto..."

# Quando estiver bom:
git add . && git commit -m "feat(toolkit): animação hover"
git push -u origin feat/animacao-toolkit
# Cria PR no GitHub (UI ou: gh pr create)
# Vercel cria preview automático
# Merge → produção automática
```

---

## Parte 6 — Quando dar problema

**"Claude Code ficou travado / lento"** — Esc, depois Enter de novo. Se persistir, `/clear` e refaz o último prompt.

**"O build quebrou e não sei por quê"** — cola no Claude Code:
> Roda `pnpm build` e cole o erro completo aqui. Diagnostique a causa real, não tape. Se for incompatibilidade de versão, atualize package.json com cuidado.

**"A viga ficou esquisita / não anima"** — abra DevTools (F12), aba Console. Se houver erro de WebGL, manda pro Claude Code com:
> Erro no console: [colar erro]. Diagnostique se é problema do meu hardware, do código ou de dependência.

**"Mudou algo e quero voltar atrás"**:
```powershell
git status              # ver o que mudou
git diff                # ver as diferenças
git restore arquivo     # desfaz só um arquivo
git reset --hard HEAD   # desfaz TUDO desde último commit (CUIDADO)
```

---

## Parte 7 — Boas práticas com Claude Code

1. **Prompts curtos e específicos** funcionam melhor que longos. Um problema por vez.
2. **Dê contexto do arquivo** — `@src/components/hero/Hero.tsx` força ele a ler aquele arquivo.
3. **Não confie cego** — leia o diff antes de aceitar. Use `git diff` antes de commitar.
4. **Limite o escopo** — "implemente X. Não toque em Y." evita refatorações desnecessárias.
5. **Teste cada mudança** — `pnpm typecheck` + `pnpm dev` antes de seguir pro próximo prompt.
6. **Use /clear entre tarefas diferentes** — evita confusão de contexto entre prompts não relacionados.
7. **Commits pequenos e frequentes** — fica fácil reverter se der ruim.
