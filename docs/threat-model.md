# Threat model · lucasfischer-portfolio

Site 100 % estático (SSG), sem formulário, sem Server Action, sem banco e sem segredos em
variáveis de ambiente. A superfície de ataque é o próprio HTML e JavaScript servidos.

| Ataque | Vetor | Mitigação |
|---|---|---|
| XSS | Conteúdo injetado | Nenhum input de usuário é renderizado; React escapa por padrão; o único `dangerouslySetInnerHTML` é o JSON-LD estático; CSP com `object-src 'none'` e `base-uri 'self'` |
| Clickjacking | iframe malicioso | `frame-ancestors 'none'` e `X-Frame-Options: DENY` |
| Formulário forjado | POST cross-site | Não há formulário; `form-action 'none'` na CSP |
| Vazamento de segredos | Bundle ou repositório | O site não usa segredos; `.env*` segue no `.gitignore` |
| Supply chain | Dependências comprometidas | Lockfile versionado; HDR, fontes e áudio servidos pelo próprio domínio |

## Trade-off conhecido

**CSP sem nonce.** Nonce exige `headers()` por requisição e tornaria as rotas dinâmicas,
perdendo a geração estática. `'unsafe-inline'` fica restrito a `script-src` e `style-src`,
exigência do App Router e do Tailwind. Sem `'unsafe-eval'`.
