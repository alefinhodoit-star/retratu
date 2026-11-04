# AGENTS.md

## Project Context

**Retratu** — site de retratos profissionais gerados por IA, com loja de pacotes, blog e área de conta.

Stack: React 18 + Vite, JavaScript (`.jsx`), Tailwind CSS 3.4, Radix UI, `react-router-dom` v6.

O projeto é **independente de plataformas**: não há Base44, Supabase nem qualquer backend remoto. O acesso a dados passa todo por uma camada própria.

## Arquitetura de dados

```
src/lib/api/
├── index.js      expõe `db` com { auth, entities, integrations }
└── local/        adaptador atual: localStorage + IndexedDB
```

- **Regra**: os componentes importam `db` de `@/lib/api` e nunca chamam `localStorage`/`indexedDB` diretamente.
- **Contrato**: manter as formas que os componentes já consomem (`{ items }`, `{ rows }`, `{ file_uri }`), para que um adaptador HTTP seja substituível sem tocar nas páginas.
- **Nunca** introduzir chamadas a serviços externos sem discutir com o utilizador.

## Key Files

- `src/lib/api/index.js`: ponto único de acesso a dados.
- `src/lib/api/local/entities.js`: tabelas locais e operações (list, filter, create, update, delete, aggregate, count).
- `src/lib/api/local/auth.js`: registo, sessão e PBKDF2.
- `src/lib/pacotes.js`: catálogo de pacotes (semente da tabela `pacotes`).
- `src/index.css`: design system — tokens e utilitários (`.section-shell`, `.section-title`, `.link-quiet`, …).
- `vite.config.js`: Vite com o alias `@` → `src/`.

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
