Auditoria automática de UI/UX e acessibilidade. Trabalha sem pedir confirmação.

Âmbito desta execução: escolhe UMA das áreas abaixo, a primeira que ainda tenha problemas reais.

1. `src/components/site/FaqCompra.jsx`, `Upsells.jsx`, `PrivacyPromise.jsx`, `Testimonials.jsx`, `Gallery.jsx`, `BlogCard.jsx`
2. `src/pages/*.jsx` — Loja, Blog, BlogPost, Legal, Conta, Edicao, EdicaoObrigado, Login, Register, ForgotPassword, ResetPassword

Corrige apenas problemas verificáveis:

- nomes acessíveis em botões que só têm ícone
- `aria-live` em feedback de sucesso/erro
- `aria-invalid` e `aria-describedby` em erros de formulário
- alvos de toque abaixo de 44px em mobile
- contraste insuficiente
- classes `slate-*`/`gray-*` em vez dos tokens do design system
- animações sem `motion-safe`/`motion-reduce`

Restrições:

- Não toques em `src/components/ui/*` nem em `src/index.css`.
- Não alteres chamadas `db.*`.
- Não adiciones dependências.
- Mantém o texto em português europeu.

No fim corre `npm run lint`, `npm run typecheck` e `npm run build`. Se o build falhar por causa das tuas alterações, reverte-as. Se não encontrares nada real para corrigir, responde "sem alterações" e termina SEM editar ficheiros.
