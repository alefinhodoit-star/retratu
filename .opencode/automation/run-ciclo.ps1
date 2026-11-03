# Corre várias execuções seguidas do run-agent.ps1, respeitando a rotação.
#
# Uso:
#   .\run-ciclo.ps1                 # 3 execuções (ui-ux -> perf -> security)
#   .\run-ciclo.ps1 -Vezes 1        # só a próxima
#   .\run-ciclo.ps1 -Tarefa "\Retratu\AgentesOpenCode"
#                                   # reativa a tarefa agendada no fim (útil quando
#                                   # o ciclo é lançado à mão e a tarefa foi suspensa)
#
# Para começar pelo ui-ux, o state.json tem de ter "next": 0.

[CmdletBinding()]
param(
    [int]$Vezes = 3,
    [string]$Tarefa = ''
)

$ErrorActionPreference = 'Continue'
$AutoDir = $PSScriptRoot
$Executor = Join-Path $AutoDir 'run-agent.ps1'

if (-not (Test-Path $Executor)) {
    Write-Host "ERRO: executor não encontrado em $Executor"
    exit 1
}

$inicio = Get-Date
Write-Host "=== Ciclo de $Vezes execuções — início $($inicio.ToString('HH:mm:ss')) ==="

try {
    for ($i = 1; $i -le $Vezes; $i++) {
        Write-Host "=== Execução $i de $Vezes ==="
        & $Executor
    }
}
finally {
    if ($Tarefa) {
        schtasks /Change /TN $Tarefa /ENABLE 2>&1 | Out-Null
        Write-Host "Tarefa agendada reativada: $Tarefa"
    }
    $fim = Get-Date
    $duracao = [int]($fim - $inicio).TotalMinutes
    Write-Host "=== Ciclo concluído às $($fim.ToString('HH:mm:ss')) — $duracao min ==="
}
