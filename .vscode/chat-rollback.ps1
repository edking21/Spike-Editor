param(
    [switch]$Exact
)

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

    if (-not (Test-Path $checkpointFile)) {
        throw 'No checkpoint has been saved yet. Run .vscode/chat-checkpoint.ps1 first.'
    }

    $checkpoint = Get-Content -Path $checkpointFile -Raw | ConvertFrom-Json
    $stashHash = [string]$checkpoint.stashHash
    if (-not $stashHash) {
        throw 'Checkpoint metadata is missing the stash hash.'
    }

    $currentStatus = git status --porcelain=v1 --untracked-files=all
    $safetyHash = $null
    if ($currentStatus) {
        $safetyLabel = 'pre-rollback-safety {0}' -f (Get-Date -Format 'yyyy-MM-dd HH:mm:ss')
        git stash push -u -m $safetyLabel | Out-Host
        if ($LASTEXITCODE -ne 0) {
            throw 'Unable to create a safety stash before rollback.'
        }

        $safetyHash = (git rev-parse 'stash@{0}').Trim()
    }

    git restore --source=HEAD --staged --worktree . | Out-Host
    if ($LASTEXITCODE -ne 0) {
        throw 'Unable to reset tracked files before restoring the checkpoint.'
    }

    if ($Exact) {
        git clean -fd | Out-Host
        if ($LASTEXITCODE -ne 0) {
            throw 'Unable to remove untracked files for an exact rollback.'
        }
    }

    git stash apply --index $stashHash | Out-Host
    if ($LASTEXITCODE -ne 0) {
        throw "Unable to restore checkpoint $($checkpoint.label)."
    }

    Write-Host "Restored checkpoint: $($checkpoint.label)"
    if ($safetyHash) {
        Write-Host "Safety backup saved as stash: $safetyHash"
    }

    if (-not $Exact) {
        Write-Host 'Exact rollback note: newly created untracked files remain unless you rerun with -Exact.'
    }
}
finally {
    Pop-Location
}