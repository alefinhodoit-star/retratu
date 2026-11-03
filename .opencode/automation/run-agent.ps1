# Executa um agente OpenCode de cada vez, em rotação: ui-ux -> perf -> security.
#
# Por execução:
#   1. Checkpoint git (se o repositório existir) + backup local em backups/
#   2. `opencode run --agent <id> --auto` com o prompt de prompts/<id>.md
#   3. `npm run build`
#   4. Se o build falhar: git reset --hard para o checkpoint (backup local como 2.ª rede)
#   5. Se o build passar: commit automático com prefixo auto(<agente>)
#   6. Avança o estado da rotação
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

# Modelo usado pelos agentes automáticos. Sem isto, o `opencode run` usa o modelo
# por omissão, que neste ambiente devolve "This model is not available in your country".
$Modelo = 'opencode-go/deepseek-v4.1-flash'

$TimeoutSegundos = 1800
$ManterBackups   = 10
$Rotacao         = @('ui-ux', 'perf', 'security')

foreach ($d in @($LogDir, $BackupDir)) {
    if (-not (Test-Path $d)) {
        New-Item -ItemType Directory -Path $d -Force | Out-Null
    }
}

# A tarefa agendada arranca em C:\Windows\System32. Sem isto, `npm run build`
# falha com ENOENT (não encontra o package.json) e o OpenCode não vê o projeto.
Set-Location $Root

# --------------------------------------------------------------- utilitários ---
# Executa um comando externo sem deixar que os avisos em stderr (CRLF do git,
# warnings do vite) sejam interpretados como erro fatal pelo ErrorActionPreference.
function Invoke-Externo {
    param(
        [string]$Ficheiro,
        [string[]]$Argumentos
    )
    $anterior = $ErrorActionPreference
    $ErrorActionPreference = 'Continue'
    try {
        $saida = & $Ficheiro @Argumentos 2>&1 | Out-String
        $codigo = $LASTEXITCODE
        if ($null -eq $codigo) { $codigo = 0 }
        return [pscustomobject]@{ Codigo = [int]$codigo; Saida = $saida.Trim() }
    }
    finally {
        $ErrorActionPreference = $anterior
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
    Escrever-Log 'DRY RUN: nenhum agente executado, estado inalterado.'
    Escrever-Log "Prompt que seria usado: $promptPath"
    exit 0
}

$gitDisponivel = Test-Path (Join-Path $Root '.git')
if ($gitDisponivel) {
    Escrever-Log 'Repositório git: sim'
}
else {
    Escrever-Log 'Repositório git: não (apenas backup local)'
}

# --------------------------------------------------------------- checkpoint ---
$checkpoint = $null
if ($gitDisponivel) {
    $add = Invoke-Externo 'git' @('-C', $Root, 'add', '-A')
    $status = Invoke-Externo 'git' @('-C', $Root, 'status', '--porcelain')
    if ($status.Saida) {
        $msg = 'chore(automacao): checkpoint antes de ' + $agenteId
        $commit = Invoke-Externo 'git' @('-C', $Root, 'commit', '-q', '-m', $msg)
        if ($commit.Codigo -eq 0) {
            Escrever-Log 'Trabalho pendente guardado num commit de checkpoint.'
        }
        else {
            Escrever-Log "AVISO: commit de checkpoint falhou — $($commit.Saida)"
        }
    }
    $rev = Invoke-Externo 'git' @('-C', $Root, 'rev-parse', 'HEAD')
    if ($rev.Codigo -eq 0 -and $rev.Saida) {
        $checkpoint = $rev.Saida
        Escrever-Log "Checkpoint git: $checkpoint"
    }
    else {
        Escrever-Log 'AVISO: não foi possível obter o SHA do checkpoint.'
    }
}

# ------------------------------------------------------------------- backup ---
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

$outFile = Join-Path $LogDir "$stamp-$agenteId.out.txt"
$codeFile = Join-Path $LogDir "$stamp-$agenteId.exit.txt"

# O prompt vai como ficheiro anexado: evita passar texto multilinha por cmd.exe.
# O comando é escrito num .cmd próprio porque `Start-Process` com
# -RedirectStandardOutput devolve um ExitCode vazio no PowerShell 5.1.
$argumentos = 'run --agent ' + $agenteId +
    ' --model "' + $Modelo + '"' +
    ' --auto --title "Automacao ' + $agenteId + '"' +
    ' --file "' + $promptPath + '"' +
    ' "Segue as instrucoes do ficheiro anexado e aplica-as."'

$cmdFile = Join-Path $LogDir "$stamp-$agenteId.cmd"
$linhasCmd = @(
    '@echo off',
    ('"' + $OpenCode + '" ' + $argumentos + ' > "' + $outFile + '" 2>&1'),
    ('echo %ERRORLEVEL% > "' + $codeFile + '"')
)
Set-Content -Path $cmdFile -Value $linhasCmd -Encoding ascii

Escrever-Log "A executar: opencode run --agent $agenteId --model $Modelo (limite $TimeoutSegundos s)"

try {
    # -WorkingDirectory é obrigatório: sem ele a tarefa arranca em System32 e o
    # OpenCode não descobre .opencode/agents (erro "Agent not found").
    $proc = Start-Process -FilePath $cmdFile -WorkingDirectory $Root -WindowStyle Hidden -PassThru

    $terminou = $proc.WaitForExit($TimeoutSegundos * 1000)
    if ($terminou) {
        $codigoAgente = -1
        if (Test-Path $codeFile) {
            $bruto = (Get-Content $codeFile -Raw -ErrorAction SilentlyContinue)
            if ($bruto -and $bruto.Trim() -match '^-?\d+$') { $codigoAgente = [int]$bruto.Trim() }
        }
        Escrever-Log "Agente terminou com código $codigoAgente."
    }
    else {
        $proc.Kill()
        Escrever-Log "TIMEOUT: o agente excedeu $TimeoutSegundos segundos e foi interrompido."
    }
}
catch {
    Escrever-Log "ERRO ao executar o agente: $($_.Exception.Message)"
}

foreach ($f in @($outFile)) {
    if (Test-Path $f) {
        $conteudo = Get-Content $f -Raw -Encoding utf8 -ErrorAction SilentlyContinue
        if ($conteudo) { Add-Content -Path $logPath -Value $conteudo -Encoding utf8 }
    }
}

# ----------------------------------------------------------- verificação -----
$build = Invoke-Externo $Npm @('run', 'build')
$buildOk = ($build.Codigo -eq 0)

if ($buildOk) {
    Escrever-Log 'Build OK — alterações mantidas.'
}
else {
    Escrever-Log "Build FALHOU (código $($build.Codigo)) — a reverter."
    Add-Content -Path $logPath -Value $build.Saida -Encoding utf8

    if ($gitDisponivel -and $checkpoint) {
        $reset = Invoke-Externo 'git' @('-C', $Root, 'reset', '--hard', $checkpoint)
        $clean = Invoke-Externo 'git' @('-C', $Root, 'clean', '-fd', '--', 'src')
        if ($reset.Codigo -eq 0) {
            Escrever-Log "git reset --hard $checkpoint concluído."
        }
        else {
            Escrever-Log "AVISO: reset git falhou — $($reset.Saida). A usar o backup local."
            Restaurar-Backup
        }
    }
    else {
        Restaurar-Backup
        Escrever-Log 'Backup local restaurado.'
    }
}

# ------------------------------------------------------------- commit final ---
$commitFeito = $false
if ($gitDisponivel -and $buildOk) {
    $add = Invoke-Externo 'git' @('-C', $Root, 'add', '-A')
    $status = Invoke-Externo 'git' @('-C', $Root, 'status', '--porcelain')
    if ($status.Saida) {
        $msg = 'auto(' + $agenteId + '): melhorias automaticas'
        $commit = Invoke-Externo 'git' @('-C', $Root, 'commit', '-q', '-m', $msg)
        if ($commit.Codigo -eq 0) {
            $commitFeito = $true
            Escrever-Log 'Commit automático criado.'
        }
        else {
            Escrever-Log "AVISO: commit automático falhou — $($commit.Saida)"
        }
    }
    else {
        Escrever-Log 'Sem alterações para commitar.'
    }
}

# ------------------------------------------------------------- novo estado ---
$proximo = ($indice + 1) % $Rotacao.Count
$resultado = 'revertido'
if ($buildOk) { $resultado = 'ok' }

$novoEstado = [pscustomobject]@{
    next       = $proximo
    lastRun    = $agenteId
    lastResult = $resultado
    lastCommit = $commitFeito
    lastAt     = (Get-Date).ToString('o')
}
$novoEstado | ConvertTo-Json | Set-Content -Path $StatePath -Encoding utf8

Escrever-Log "Fim — próximo agente será '$($Rotacao[$proximo])'. Log: $logPath"
