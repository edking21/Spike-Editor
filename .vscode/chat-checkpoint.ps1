Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

$repoRoot = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
$checkpointFile = Join-Path $repoRoot '.git\copilot-chat-checkpoint.json'

Push-Location $repoRoot
try {
    git rev-parse --is-inside-work-tree 2>$null | Out-Null
    if ($LASTEXITCODE -ne 0) {
        throw "This workspace is not a Git repository: $repoRoot"
    }

    $status = git status --porcelain=v1 --untracked-files=all
    if (-not $status) {
        Write-Host 'No local changes to checkpoint.'
        exit 0
    }

    $label = 'chat-checkpoint {0}' -f (Get-Date -Format 'yyyy-MM-dd HH:mm:ss')

    git stash push -u -m $label | Out-Host
    if ($LASTEXITCODE -ne 0) {
        throw 'Unable to create checkpoint stash.'
    }

    $stashHash = (git rev-parse 'stash@{0}').Trim()
    if (-not $stashHash) {
        throw 'Unable to resolve checkpoint stash hash.'
    }

    git stash apply --index 'stash@{0}' | Out-Host
    if ($LASTEXITCODE -ne 0) {
        throw "Checkpoint was created, but restoring the working tree failed. Re-run: git stash apply --index $stashHash"
    }

    @{
        stashHash = $stashHash
        label = $label
        createdAt = (Get-Date).ToString('o')
    } | ConvertTo-Json | Set-Content -Path $checkpointFile -Encoding UTF8

    Write-Host "Checkpoint saved: $label"
    Write-Host 'Rollback with: powershell -ExecutionPolicy Bypass -File .vscode/chat-rollback.ps1'
}
finally {
    Pop-Location
}