Verificação automática de performance. Trabalha sem pedir confirmação.

Passo 1 — orçamento: corre `npm run build` e confirma que `dist/assets/index-*.js` continua abaixo de 320 kB (gzip abaixo de 100 kB) e que o aviso "Some chunks are larger than 500 kB" não voltou. Regista os números.

Passo 2 — procura UMA regressão concreta, por esta ordem:

1. Rota importada estaticamente em `src/App.jsx` — deve ser `React.lazy`, exceto `Home`, `SiteLayout` e `PageNotFound`.
2. Imagem abaixo da dobra sem `loading="lazy"`, ou imagem do hero sem `priority`/`fetchPriority`.
3. Dependência duplicada com prova de `grep` (ex.: dois sistemas de toast, `moment` + `date-fns`).

Aplica no máximo UMA correção por execução, com medição antes/depois.

Restrições:

- Não adiciones dependências e não alteres `package.json`.
- Não alteres `src/lib/api/` (camada de dados).
- Só alteres `vite.config.js` se tiveres medição que prove ganho real.

Corre `npm run lint`, `npm run typecheck` e `npm run build`; se o build falhar, reverte. Se o orçamento estiver cumprido e não houver regressão, responde "sem alterações" e termina SEM editar.
