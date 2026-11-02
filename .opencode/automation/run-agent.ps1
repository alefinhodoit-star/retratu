# Executa um agente OpenCode de cada vez, em rotação: ui-ux -> perf -> security.
#
# Por execução:
#   1. Backup de src/, index.html, vite.config.js, jsconfig.json e package.json
#   2. `opencode run --agent <id> --auto` com o prompt de prompts/<id>.md
#   3. `npm run build`
#   4. Se o build falhar, restaura o backup e registra a reversão
#   5. Avança o estado da rotação
#
# Uso:
#   .\run-agent.ps1            executa o próximo agente da rotação
#   .\run-agent.ps1 -DryRun    mostra o que faria, sem correr agente nem build

[CmdletBinding()]
param(
    [switch]$DryRun
)

$ErrorActionPreference = 'Stop'

$AutoDir   = $PSScriptRoot
$Root      = Split-Path -Parent (Split-Path -Parent $AutoDir)
$StatePath = Join-Path $AutoDir 'state.json'
$LogDir    = Join-Path $AutoDir 'logs'
$BackupDir = Join-Path $AutoDir 'backups'
$PromptDir = Join-Path $AutoDir 'prompts'

$OpenCode = Join-Path $env:APPDATA 'npm\opencode.cmd'
$Npm      = 'C:\Program Files\nodejs\npm.cmd'

$TimeoutSegundos = 1800
$ManterBackups   = 10
$Rotacao         = @('ui-ux', 'perf', 'security')

foreach ($d in @($LogDir, $BackupDir)) {
    if (-not (Test-Path $d)) {
        New-Item -ItemType Directory -Path $d -Force | Out-Null
    }
}

# ------------------------------------------------------------------ estado ---
$indice = 0
if (Test-Path $StatePath) {
    try {
        $estado = Get-Content $StatePath -Raw -Encoding utf8 | ConvertFrom-Json
        $indice = [int]$estado.next
    }
    catch {
        $indice = 0
    }
}
if ($indice -lt 0 -or $indice -ge $Rotacao.Count) { $indice = 0 }

$agenteId   = $Rotacao[$indice]
$promptPath = Join-Path $PromptDir "$agenteId.md"
$stamp      = Get-Date -Format 'yyyyMMdd-HHmmss'
$logPath    = Join-Path $LogDir "$stamp-$agenteId.log"

function Escrever-Log {
    param([string]$Texto)
    $linha = '[' + (Get-Date -Format 'yyyy-MM-dd HH:mm:ss') + '] ' + $Texto
    Add-Content -Path $logPath -Value $linha -Encoding utf8
    Write-Host $linha
}

Escrever-Log "Início — agente '$agenteId' (posição $($indice + 1) de $($Rotacao.Count))"

if (-not (Test-Path $promptPath)) {
    Escrever-Log "ERRO: prompt não encontrado em $promptPath"
    exit 1
}

if ($DryRun) {
    Escrever-Log "DRY RUN: nenhum agente executado, estado inalterado."
    Escrever-Log "Prompt que seria usado: $promptPath"
    exit 0
}

# ------------------------------------------------------------------ backup ---
$backupPath = Join-Path $BackupDir $stamp
New-Item -ItemType Directory -Path $backupPath -Force | Out-Null

Push-Location $Root
try {
    Copy-Item 'src' -Destination $backupPath -Recurse -Force
    foreach ($f in @('index.html', 'vite.config.js', 'jsconfig.json', 'package.json')) {
        if (Test-Path $f) { Copy-Item $f -Destination $backupPath -Force }
    }
    Escrever-Log "Backup criado em $backupPath"
}
finally {
    Pop-Location
}

Get-ChildItem $BackupDir -Directory |
    Sort-Object Name -Descending |
    Select-Object -Skip $ManterBackups |
    ForEach-Object { Remove-Item $_.FullName -Recurse -Force -ErrorAction SilentlyContinue }

function Restaurar-Backup {
    Push-Location $Root
    try {
        Remove-Item 'src' -Recurse -Force -ErrorAction SilentlyContinue
        Copy-Item (Join-Path $backupPath 'src') -Destination $Root -Recurse -Force
        foreach ($f in @('index.html', 'vite.config.js', 'jsconfig.json', 'package.json')) {
            $origem = Join-Path $backupPath $f
            if (Test-Path $origem) { Copy-Item $origem -Destination $Root -Force }
        }
    }
    finally {
        Pop-Location
    }
}

# ---------------------------------------------------------------- execução ---
if (-not (Test-Path $OpenCode)) {
    Escrever-Log "ERRO: opencode não encontrado em $OpenCode"
    exit 1
}

Escrever-Log "A executar: opencode run --agent $agenteId --auto (limite $TimeoutSegundos s)"

# O prompt vai como ficheiro anexado: evita passar texto multilinha por cmd.exe.
$job = Start-Job -ScriptBlock {
    param($exe, $id, $prompt, $wd)
    Set-Location $wd
    & $exe run --agent $id --auto --title "Automacao $id" --file $prompt 'Segue as instrucoes do ficheiro anexado e aplica-as.'
} -ArgumentList $OpenCode, $agenteId, $promptPath, $Root

$concluiu = Wait-Job $job -Timeout $TimeoutSegundos
if ($concluiu) {
    $saida = Receive-Job $job | Out-String
}
else {
    Stop-Job $job -ErrorAction SilentlyContinue
    $saida = "TIMEOUT: o agente excedeu $TimeoutSegundos segundos e foi interrompido."
}
Remove-Job $job -Force -ErrorAction SilentlyContinue

Add-Content -Path $logPath -Value $saida -Encoding utf8

# ----------------------------------------------------------- verificação -----
$buildOk = $false
$buildSaida = ''
Push-Location $Root
try {
    $buildSaida = & $Npm 'run', 'build' 2>&1 | Out-String
    $buildOk = ($LASTEXITCODE -eq 0)
}
catch {
    $buildSaida = $_.Exception.Message
}
finally {
    Pop-Location
}

if ($buildOk) {
    Escrever-Log 'Build OK — alterações mantidas.'
}
else {
    Escrever-Log "Build FALHOU — a restaurar o backup $stamp."
    Add-Content -Path $logPath -Value $buildSaida -Encoding utf8
    Restaurar-Backup
    Escrever-Log 'Backup restaurado. O projeto volta ao estado anterior.'
}

# ------------------------------------------------------------- novo estado ---
$proximo = ($indice + 1) % $Rotacao.Count
$resultado = 'revertido'
if ($buildOk) { $resultado = 'ok' }

$novoEstado = [pscustomobject]@{
    next       = $proximo
    lastRun    = $agenteId
    lastResult = $resultado
    lastAt     = (Get-Date).ToString('o')
}
$novoEstado | ConvertTo-Json | Set-Content -Path $StatePath -Encoding utf8

Escrever-Log "Fim — próximo agente será '$($Rotacao[$proximo])'. Log: $logPath"
