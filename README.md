# Retratu

Site de retratos profissionais com IA. React 18 + Vite + Tailwind CSS, **sem backend de plataforma** — os dados vivem no navegador através de uma camada própria.

## Pré-requisitos

1. Clonar o repositório.
2. `npm install`
3. Node 18 ou superior.

## Correr localmente

```bash
npm run dev
```

Abre em `http://localhost:5173`.

## Scripts

| Comando | O que faz |
|---|---|
| `npm run dev` | servidor de desenvolvimento com HMR |
| `npm run build` | build de produção para `dist/` |
| `npm run preview` | serve o build de `dist/` |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc` sobre `jsconfig.json` (sem `checkJs`) |

## Arquitetura

```
src/
├── components/       componentes de UI (site/, admin/, ui/ primitivos Radix)
├── pages/            rotas
├── lib/
│   ├── api/          ← ponto único de acesso a dados
│   │   ├── index.js      expõe `db` com auth, entities, integrations
│   │   └── local/        adaptador atual: localStorage + IndexedDB
│   ├── pacotes.js    catálogo de pacotes (semente do adaptador)
│   └── ...
└── index.css         design system (tokens + utilitários)
```

**Regra:** os componentes importam `db` de `@/lib/api` e nunca falam com um backend diretamente. Trocar de backend = substituir `src/lib/api/local/` por um adaptador HTTP com a mesma forma.

### O que é guardado onde

| Dados | Onde |
|---|---|
| Pacotes | `localStorage` (`retratu:pacotes`), semeado de `src/lib/pacotes.js` |
| Utilizadores e sessão | `localStorage` (`retratu:utilizadores`, `retratu:sessao`) |
| Pedidos, leads, catálogo, blog | `localStorage` |
| Imagens carregadas | `IndexedDB` (`retratu-ficheiros`) |

As palavras-passe são derivadas com **PBKDF2-SHA256** (120 000 iterações, salt por utilizador). A sessão é um token opaco com validade de 30 dias.

### Limitações assumidas (modo local)

- **Sem envio de e-mail** — a recuperação de palavra-passe falha com uma mensagem explícita.
- **Sem login com Google** — precisa de um servidor OAuth.
- **Dados por navegador** — não há sincronização entre dispositivos e limpar os dados do site apaga tudo.
- **Sem admin partilhado** — as contas criadas têm sempre o perfil `user`.

Estas limitações desaparecem quando o backend Node + SQLite entrar: só `src/lib/api/local/` é substituído.

## Estrutura de conteúdo

- **Pacotes**: `src/lib/pacotes.js` (semente; depois editáveis no admin).
- **Blog**: tabela `blog` no `localStorage` (vazia por omissão).
- **Loja**: tabelas `loja:categorias` e `loja:produtos`.

## Deploy

O build é estático (`dist/`). Pode ser servido por qualquer hosting estático — Netlify, Vercel, Cloudflare Pages, GitHub Pages ou um servidor próprio.

O `index.html` já inclui `canonical`, Open Graph e Twitter Card apontados para `https://retratu.pt/`, além de `robots.txt` e `sitemap.xml` em `public/`.

## Contactos

`contacto@retratu.pt`
