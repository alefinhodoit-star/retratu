# AGENTS.md

## Project Context

**Retratu** — site de retratos profissionais gerados por IA, com loja de pacotes, blog e área de conta.

Stack: React 18 + Vite, JavaScript (`.jsx`), Tailwind CSS 3.4, Radix UI, `react-router-dom` v6.

O projeto é **independente de plataformas**: não há Base44, Supabase nem qualquer backend remoto. O acesso a dados passa todo por uma camada própria.

## Arquitetura de dados

```
src/lib/api/
├── index.js      escolhe o adaptador e expõe `db`
├── http.js       adaptador da API (Node + SQLite)
└── local/        adaptador offline: localStorage + IndexedDB

server/
├── index.js      rotas Express 5
├── db.js         SQLite + schema + seed
├── auth.js       PBKDF2 + JWT
└── entities.js   CRUD genérico sobre JSON
```

- **Regra**: os componentes importam `db` de `@/lib/api` e nunca chamam `localStorage`, `indexedDB` ou `fetch` diretamente.
- **Contrato**: manter as formas que os componentes já consomem (`{ items }`, `{ rows }`, `{ file_uri }`). Os dois adaptadores expõem a mesma interface.
- **Nunca** introduzir chamadas a serviços externos sem discutir com o utilizador.

## Key Files

- `src/lib/api/index.js`: ponto único de acesso a dados.
- `src/lib/api/http.js`: adaptador da API.
- `src/lib/api/local/`: adaptador offline (mesma forma).
- `server/index.js`: rotas e regras de acesso.
- `server/db.js`: SQLite, schema e seed dos pacotes.
- `src/lib/pacotes.js`: catálogo de pacotes (semente da base de dados).
- `src/index.css`: design system — tokens e utilitários (`.section-shell`, `.section-title`, `.link-quiet`, …).
- `vite.config.js`: Vite com o alias `@` → `src/` e proxy `/api` → `localhost:3001`.

## Working Notes

- Texto visível em **português europeu (PT-PT)**.
- Usar os tokens semânticos (`bg-background`, `text-muted-foreground`, `border-border`, `text-accent`) e os utilitários do design system; nunca `slate-*`/`gray-*` nem hex em `className`.
- Não adicionar dependências sem pedir.
- Correr `npm run lint`, `npm run typecheck` e `npm run build` antes de terminar.
- O build é estático: não introduzir código que exija um servidor sem o dizer explicitamente.

## Agentes disponíveis

- `.opencode/agents/ui-ux.md` — acessibilidade, consistência Tailwind, micro-interações.
- `.opencode/agents/perf.md` — bundle, LCP/INP/CLS, imagens.
- `.opencode/agents/security.md` — XSS, segredos, validação Zod, tipagem JSDoc.

Automação: `.opencode/automation/` corre os três em rotação (ver o README dessa pasta).

## Skills

Instaladas em `.agents/skills/` (fonte de verdade). `skills-lock.json` serve apenas a CLI.

- `vercel-react-best-practices` — performance React.
- `web-design-guidelines` — Web Interface Guidelines (acessibilidade, UX).
- `vercel-composition-patterns` — arquitetura de componentes.

Atualizar: `npx skills update -p -y`.
