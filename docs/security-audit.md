# Security audit log

## 2026-06-30 — Sprint C

- `pnpm audit --prod`: **1 moderate** — `postcss@8.4.31` (GHSA-qx2v-qp2m-jg93),
  transitiva de `next@15.5.19` e `geist`. Sem patch disponível sem major bump
  do Next; risco real baixo (parser CSS em build, não em runtime de produção).
  Reavaliar a cada bump do Next.
- Grep de segredos em `src/`: limpo (nenhum `re_`, `sk_`, `xoxb`, `Bearer`).
- `console.log` em `src/`: nenhum.
- `dangerouslySetInnerHTML`: nenhum (JSON-LD usa `<script>` com string
  serializada controlada por nós — sem input de usuário).
- Bundle client (`.next/`): verificado sem `RESEND_API_KEY`/`UPSTASH`/
  `TURNSTILE_SECRET` (ver comando no PR do Sprint C).
