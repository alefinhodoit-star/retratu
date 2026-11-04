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
| `npm run dev:all` | **API + frontend juntos** (recomendado) |
| `npm run dev` | só o frontend (Vite) |
| `npm run server` | só a API (porta 3001) |
| `npm run build` | build de produção para `dist/` |
| `npm run start` | serve a API e o build de `dist/` na mesma porta |
| `npm run preview` | serve o build de `dist/` sem API |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc` sobre `jsconfig.json` (sem `checkJs`) |

## Backend

API em **Node + Express 5 + SQLite** (`better-sqlite3`), em `server/`.

```bash
npm run dev:all     # http://localhost:5173 (site) + http://localhost:3001 (API)
```

- A base de dados fica em `data/retratu.db` (criada e semeada no primeiro arranque, ignorada pelo git).
- Os pacotes são semeados a partir de `src/lib/pacotes.js`.
- **O primeiro utilizador registado fica com perfil `admin`**; os seguintes ficam `user`.
- O segredo do JWT vem de `JWT_SECRET` ou é gerado em `data/.jwt-secret`.
- Em produção, `npm run build` e depois `npm run start`: o mesmo processo serve o site e a API.

### Endpoints

| Método | Rota | Acesso |
|---|---|---|
| `GET` | `/api/health` | público |
| `POST` | `/api/auth/register` \| `/login` | público |
| `GET` | `/api/auth/me` | sessão |
| `POST` | `/api/entities/:entidade/query` \| `/count` \| `/aggregate` | catálogo público; resto por sessão |
| `POST` | `/api/entities/:entidade` | leads/pedidos públicos; resto admin |
| `PATCH`/`DELETE` | `/api/entities/:entidade/:id` | admin |
| `POST` | `/api/files` | público (10 MB, JPEG/PNG/WebP) |
| `GET` | `/api/files/:id` | sessão |

### Modo sem servidor

`VITE_API_URL=local` força o adaptador de `localStorage`/`IndexedDB`, útil para demo offline. Sem essa variável, o site usa `/api`.


## Arquitetura

```
src/
├── components/       componentes de UI (site/, admin/, ui/ primitivos Radix)
├── pages/            rotas
├── lib/
│   ├── api/          ← ponto único de acesso a dados
│   │   ├── index.js      escolhe o adaptador e expõe `db`
│   │   ├── http.js       adaptador da API (Node + SQLite)
│   │   └── local/        adaptador offline: localStorage + IndexedDB
│   ├── pacotes.js    catálogo de pacotes (semente da base de dados)
│   └── ...
└── index.css         design system (tokens + utilitários)

server/
├── index.js          rotas Express
├── db.js             SQLite + schema + seed
├── auth.js           PBKDF2 + JWT
└── entities.js       CRUD genérico sobre JSON
```

**Regra:** os componentes importam `db` de `@/lib/api` e nunca falam com um backend diretamente. O adaptador HTTP e o local expõem a mesma forma.

### O que é guardado onde

| Dados | Onde |
|---|---|
| Pacotes, blog, loja, pedidos, leads, pedidos de edição | SQLite (`data/retratu.db`), tabela `registos` em JSON |
| Utilizadores | SQLite, tabela `utilizadores` |
| Imagens carregadas | `data/uploads/` (metadados na tabela `ficheiros`) |
| Sessão no browser | `localStorage` (`retratu:token` — o JWT) |

As palavras-passe são derivadas com **PBKDF2-SHA256** (120 000 iterações, salt por utilizador). A sessão é um **JWT** com validade de 30 dias.

### Limitações assumidas

- **Sem envio de e-mail** — a recuperação de palavra-passe responde 501 e a interface indica para contactar `contacto@retratu.pt`.
- **Sem login com Google** — precisa de um servidor OAuth.
- **Uploads até 10 MB** e apenas JPEG, PNG ou WebP.

## Estrutura de conteúdo

- **Pacotes**: semeados de `src/lib/pacotes.js`; depois editáveis no admin.
- **Blog**: tabela `blog` (vazia por omissão).
- **Loja**: tabelas `loja:categorias` e `loja:produtos`.

## Deploy

O build é estático (`dist/`). Pode ser servido por qualquer hosting estático — Netlify, Vercel, Cloudflare Pages, GitHub Pages ou um servidor próprio.

O `index.html` já inclui `canonical`, Open Graph e Twitter Card apontados para `https://retratu.pt/`, além de `robots.txt` e `sitemap.xml` em `public/`.

## Contactos

`contacto@retratu.pt`
