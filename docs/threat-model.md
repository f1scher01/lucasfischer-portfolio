# Threat model — lucasfischer-portfolio

Site estático + 1 Server Action (form de contato). Superfície pequena; o
objetivo é não ser o alvo fácil.

| Ataque | Vetor | Mitigação |
|---|---|---|
| XSS | Conteúdo refletido/injetado | Sem `dangerouslySetInnerHTML`; React escapa por padrão; email de contato enviado como TEXTO (nunca HTML); CSP com `object-src 'none'`, `base-uri 'self'` |
| Spam / bots no form | POST automatizado | Honeypot (`company`), timestamp mínimo 3 s (`_ts`), rate limit 3/10 min por IP (Upstash ou in-memory), Turnstile invisível (quando configurado), Zod estrito server-side |
| Header injection no email | `\r\n` no nome → headers extras | Schema remove `\r\n` do nome; subject truncado em 140 chars |
| CSRF | POST cross-site na action | Server Actions do Next validam origin por padrão; checagem extra `origin === host`; `form-action 'self'` na CSP |
| Clickjacking | iframe malicioso | `frame-ancestors 'none'` + `X-Frame-Options: DENY` |
| Brute force / flood | Repetição de envios | Rate limit por IP; fallback in-memory é por instância serverless (trade-off aceito para portfólio; Upstash resolve quando configurado) |
| Vazamento de segredos | Bundle client | Segredos só em Server Action (`server-only` no rate-limit); grep do `.next/` no CI manual; `.env*` no gitignore |
| SSRF via OG/fetch | URLs controladas pelo usuário | Nenhum fetch server-side usa input do usuário (Turnstile verify usa URL fixa da Cloudflare) |
| Supply chain | Deps comprometidas | `pnpm audit` no sprint de segurança; lockfile commitado; assets (HDR, fontes, áudio) self-hosted — zero CDN de terceiro em runtime |

## Decisões e trade-offs

- **CSP sem nonce**: nonce exige `headers()` por request → torna todas as
  rotas dinâmicas e mata o SSG (perf). Mantido `'unsafe-inline'` APENAS em
  `script-src`/`style-src` (exigência do App Router/Tailwind). Sem
  `'unsafe-eval'`. Revisitar se o Next estabilizar CSP estática com hashes.
- **Rate limit in-memory** (sem envs Upstash): estado por instância — um
  atacante distribuído entre instâncias escapa parcialmente. Aceito para
  portfólio; Upstash ativa automaticamente ao definir as envs.
- **Turnstile opcional**: sem `TURNSTILE_SECRET_KEY` a etapa é pulada e os
  demais guards seguram. Com as envs, widget + verificação server ligam sem
  mudança de código.
