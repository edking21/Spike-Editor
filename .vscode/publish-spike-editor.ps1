$ErrorActionPreference = "Stop"

if (!(Test-Path "docs")) {
    New-Item -Path "docs" -ItemType Directory | Out-Null
}

if (!(Test-Path "docs/utils")) {
    New-Item -Path "docs/utils" -ItemType Directory -Force | Out-Null
}

function Sync-ByNewest {
    param(
        [string]$RootPath,
        [string]$DocsPath
    )

    $rootExists = Test-Path $RootPath
    $docsExists = Test-Path $DocsPath

    if (-not $rootExists -and -not $docsExists) {
        throw "Missing both files: '$RootPath' and '$DocsPath'"
    }

    if ($rootExists -and -not $docsExists) {
        Copy-Item $RootPath $DocsPath -Force
        return
    }

    if ($docsExists -and -not $rootExists) {
        Copy-Item $DocsPath $RootPath -Force
        return
    }

    $rootTime = (Get-Item $RootPath).LastWriteTimeUtc
    $docsTime = (Get-Item $DocsPath).LastWriteTimeUtc

    if ($docsTime -gt $rootTime) {
        Copy-Item $DocsPath $RootPath -Force
    } else {
        Copy-Item $RootPath $DocsPath -Force
    }
}

Sync-ByNewest -RootPath "index.html" -DocsPath "docs/index.html"
Sync-ByNewest -RootPath "Training Camp.html" -DocsPath "docs/Training Camp.html"
Sync-ByNewest -RootPath "Class Library.html" -DocsPath "docs/Class Library.html"
Sync-ByNewest -RootPath "Videos.html" -DocsPath "docs/Videos.html"
Sync-ByNewest -RootPath "utils/utils.js" -DocsPath "docs/utils/utils.js"

# Publish lowercase alias to support links that use class library.html
if (!(Test-Path "docs/class-library")) {
    New-Item -Path "docs/class-library" -ItemType Directory -Force | Out-Null
}
Copy-Item "Class Library.html" "docs/class-library/index.html" -Force

git add .
git commit -m "Publish-Spike-Editor" 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "INFO: No new changes to commit." -ForegroundColor Yellow
}

git push origin main
Write-Host "SUCCESS: Published all 4 tabs!" -ForegroundColor Green
