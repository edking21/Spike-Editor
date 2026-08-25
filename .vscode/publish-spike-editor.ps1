$ErrorActionPreference = "Stop"

git add .
git commit -m "Publish-Spike-Editor" 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "INFO: No new changes to commit." -ForegroundColor Yellow
}

git push origin main
Write-Host "SUCCESS: Published all 4 tabs!" -ForegroundColor Green
