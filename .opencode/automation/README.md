# Automação de agentes

Executa os agentes OpenCode em rotação, **um de cada vez**, a cada 3 horas.

| Ordem | Agente | Foco |
|---|---|---|
| 1 | `ui-ux` | acessibilidade, contraste, consistência Tailwind, micro-interações |
| 2 | `perf` | orçamento de bundle, LCP/INP/CLS, imagens |
| 3 | `security` | XSS, segredos, validação Zod, tipagem JSDoc |

Depois do `security` volta ao `ui-ux`. Com intervalo de 3 horas, cada agente corre a cada 9 horas.

## Como funciona cada execução

1. **Backup** de `src/`, `index.html`, `vite.config.js`, `jsconfig.json` e `package.json` para `backups/<timestamp>/` (mantém os últimos 10).
2. Corre `opencode run --agent <id> --auto` com o prompt de `prompts/<id>.md`.
3. Corre `npm run build`.
4. **Se o build falhar, restaura o backup automaticamente** e registra a reversão no log.
5. Avança `state.json` para o próximo agente.

O prompt vai como ficheiro anexado (`--file`), não como argumento — evita problemas de quoting com texto multilinha no `cmd.exe`.

## Ficheiros

```
.opencode/automation/
├── run-agent.ps1      # o executor
├── state.json         # índice do próximo agente (criado na 1.ª execução)
├── prompts/           # um prompt por agente
│   ├── ui-ux.md
│   ├── perf.md
│   └── security.md
├── logs/              # um .log por execução (UTF-8)
└── backups/           # snapshots antes de cada execução
```

## Comandos

```powershell
# ver a tarefa
schtasks /Query /TN "\Retratu\AgentesOpenCode" /V /FO LIST

# correr agora, sem esperar pelo horário
schtasks /Run /TN "\Retratu\AgentesOpenCode"

# desativar temporariamente
schtasks /Change /TN "\Retratu\AgentesOpenCode" /DISABLE

# reativar
schtasks /Change /TN "\Retratu\AgentesOpenCode" /ENABLE

# remover
schtasks /Delete /TN "\Retratu\AgentesOpenCode" /F

# testar o script sem correr agente nem build
powershell -NoProfile -ExecutionPolicy Bypass -File ".\.opencode\automation\run-agent.ps1" -DryRun
```

## Editar o comportamento

- **Mudar o que cada agente faz**: edita `prompts/<id>.md`. Não é preciso mexer no script.
- **Mudar a ordem ou adicionar um agente**: altera `$Rotacao` em `run-agent.ps1` e cria o prompt correspondente.
- **Mudar o intervalo**: recria a tarefa com outro `/MO` (por exemplo `/MO 6` para 6 horas).

## Limitações

- A tarefa corre **apenas com a sessão do utilizador iniciada**. Com o computador desligado, em suspensão ou sem sessão, a execução é saltada.
- **O projeto não é um repositório git.** Os backups em `backups/` são a única rede de segurança — não os apagues.
- O script grava o `.ps1` em **UTF-8 com BOM**: sem BOM, o PowerShell 5.1 lê os acentos como ANSI e o ficheiro deixa de fazer parse. Se editares o script, mantém o BOM.
- Os agentes têm `--auto`, ou seja, aprovam automaticamente as permissões que não estão explicitamente negadas. Está negado o acesso a `browser` e a lançar subagentes.
- Se um agente não encontrar nada para corrigir, o prompt manda-o responder "sem alterações" e sair sem editar. Isso evita alterações inventadas em execuções repetidas.
