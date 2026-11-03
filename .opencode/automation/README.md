# Automação de agentes

Executa os agentes OpenCode em rotação, **um de cada vez**, a cada 3 horas.

| Ordem | Agente | Foco |
|---|---|---|
| 1 | `ui-ux` | acessibilidade, contraste, consistência Tailwind, micro-interações |
| 2 | `perf` | orçamento de bundle, LCP/INP/CLS, imagens |
| 3 | `security` | XSS, segredos, validação Zod, tipagem JSDoc |

Depois do `security` volta ao `ui-ux`. Com intervalo de 3 horas, cada agente corre a cada 9 horas.

## Como funciona cada execução

1. **Checkpoint git**: se houver trabalho por commitar, é guardado num commit `chore(automacao): checkpoint antes de <agente>`. Guarda o SHA de partida.
2. **Backup local** de `src/`, `index.html`, `vite.config.js`, `jsconfig.json` e `package.json` para `backups/<timestamp>/` (mantém os últimos 10). É a segunda rede, para o caso de o git falhar.
3. Corre `opencode run --agent <id> --auto` com o prompt de `prompts/<id>.md`.
4. Corre `npm run build`.
5. **Se o build falhar**: `git reset --hard <checkpoint>` + `git clean -fd -- src`, e o backup local como fallback. Nada fica partido.
6. **Se o build passar**: commit automático `auto(<agente>): melhorias automaticas`.
7. Avança `state.json` para o próximo agente.

O prompt vai como ficheiro anexado (`--file`), não como argumento — evita problemas de quoting com texto multilinha no `cmd.exe`.

## Reverter o trabalho de um agente

Cada execução deixa um commit identificável:

```powershell
git log --oneline -10          # procura os commits auto(<agente>)
git revert <sha>               # desfaz esse commit, mantendo o histórico
git show --stat <sha>          # ver o que o agente mudou antes de decidir
```


## Ficheiros

```
.opencode/automation/
├── run-agent.ps1      # o executor (um agente por execução)
├── run-ciclo.ps1      # corre o executor N vezes seguidas
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

# correr o ciclo completo de uma vez (ui-ux -> perf -> security)
powershell -NoProfile -ExecutionPolicy Bypass -File ".\.opencode\automation\run-ciclo.ps1"

# desativar temporariamente
schtasks /Change /TN "\Retratu\AgentesOpenCode" /DISABLE

# reativar
schtasks /Change /TN "\Retratu\AgentesOpenCode" /ENABLE

# remover
schtasks /Delete /TN "\Retratu\AgentesOpenCode" /F

# testar o script sem correr agente nem build
powershell -NoProfile -ExecutionPolicy Bypass -File ".\.opencode\automation\run-agent.ps1" -DryRun
```

`run-ciclo.ps1` respeita a rotação: corre o `run-agent.ps1` N vezes seguidas (3 por omissão).
Para começar pelo `ui-ux`, o `state.json` tem de ter `"next": 0`. O parâmetro `-Tarefa` reativa a
tarefa agendada no fim, útil quando o ciclo é lançado à mão com a tarefa suspensa:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File ".\.opencode\automation\run-ciclo.ps1" -Vezes 3 -Tarefa "\Retratu\AgentesOpenCode"
```

## Editar o comportamento

- **Mudar o que cada agente faz**: edita `prompts/<id>.md`. Não é preciso mexer no script.
- **Mudar a ordem ou adicionar um agente**: altera `$Rotacao` em `run-agent.ps1` e cria o prompt correspondente.
- **Mudar o intervalo**: recria a tarefa com outro `/MO` (por exemplo `/MO 6` para 6 horas).

## Limitações

- A tarefa corre **apenas com a sessão do utilizador iniciada**. Com o computador desligado, em suspensão ou sem sessão, a execução é saltada.
- **Nunca faz push.** Os commits ficam locais; publicar é decisão tua, no GitHub Desktop.
- `backups/`, `logs/` e `state.json` estão no `.gitignore` — o backup contém uma cópia completa de `src/` e não deve entrar no repositório.
- O script grava o `.ps1` em **UTF-8 com BOM**: sem BOM, o PowerShell 5.1 lê os acentos como ANSI e o ficheiro deixa de fazer parse. Se editares o script, mantém o BOM.
- Os agentes têm `--auto`, ou seja, aprovam automaticamente as permissões que não estão explicitamente negadas. Está negado o acesso a `browser` e a lançar subagentes.
- Se um agente não encontrar nada para corrigir, o prompt manda-o responder "sem alterações" e sair sem editar. Isso evita alterações inventadas em execuções repetidas.
