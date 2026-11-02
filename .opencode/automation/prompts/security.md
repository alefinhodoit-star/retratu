Auditoria automática de segurança. Trabalha sem pedir confirmação.

Âmbito desta execução: escolhe UMA das superfícies abaixo, a primeira que ainda tenha problemas reais.

1. Formulários `src/components/site/Contact.jsx` e `B2B.jsx` — validar com Zod (já instalado), no padrão de `src/lib/edicao/esquema.js`. Limites de comprimento, `trim`, e-mail válido e erros em português europeu.
2. Leituras de `localStorage` (`src/lib/cart.jsx`, `src/lib/edicao/pedidoService.js`) — validar a forma dos dados com Zod antes de usar.
3. Tipagem: `// @ts-check` num módulo de `src/lib` (`pricing.js`, `pacotes.js`, `loja.js`, `blogCovers.js`) com typedefs JSDoc. Se o ficheiro falhar no typecheck, retira a diretiva e registra como pendente.

Regras:

- Nunca imprimas segredos.
- Não adiciones dependências.
- Não enfraqueças `safeReturnTo` nem a validação de uploads.
- Não alteres `src/components/ui/*`, `base44/` nem chamadas `db.*`.

Corre `npm run lint`, `npm run typecheck` e `npm run build`; se o build falhar, reverte. Se não encontrares nada real, responde "sem alterações" e termina SEM editar.
