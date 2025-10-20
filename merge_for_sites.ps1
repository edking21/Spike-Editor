param(
    [string]$IndexFile = "index.html",
    [string]$TrainingCampFile = "Training Camp.html",
    [string]$UtilsFile = "utils.js",
    [string]$IndexOutputFile = "index_for_copy_to_sites.html",
    [string]$TrainingCampOutputFile = "training_camp_for_copy_to_sites.html"
)

Write-Host "Merging HTML files with $UtilsFile for Google Sites deployment..." -ForegroundColor Green

# Check if required files exist
$filesToCheck = @($IndexFile, $TrainingCampFile, $UtilsFile)
foreach ($file in $filesToCheck) {
    if (-not (Test-Path $file)) {
        Write-Error "Error: $file not found!"
        exit 1
    }
}

try {
    # Read the utils.js file once
    $utilsContent = Get-Content $UtilsFile -Raw -Encoding UTF8
    
    # Add proper indentation to utils.js content
    $indentedUtils = ($utilsContent -split "`n" | ForEach-Object { "        $_" }) -join "`n"
    
    # Create the replacement content with proper script tags
    $utilsReplacement = "<script>`n        // Utility functions (from utils.js)`n$indentedUtils`n    </script>"
    
    # Pattern to match the utils.js script tag
    $pattern = '<script src="\.\/utils\.js"><\/script>'
    
    # Process index.html
    Write-Host "Processing $IndexFile..." -ForegroundColor Cyan
    $indexContent = Get-Content $IndexFile -Raw -Encoding UTF8
    $mergedIndexContent = $indexContent -replace $pattern, $utilsReplacement
    $mergedIndexContent | Set-Content $IndexOutputFile -Encoding UTF8
    Write-Host "Created $IndexOutputFile" -ForegroundColor Green
    
    # Process Training Camp.html
    Write-Host "Processing $TrainingCampFile..." -ForegroundColor Cyan
    $trainingCampContent = Get-Content $TrainingCampFile -Raw -Encoding UTF8
    $mergedTrainingCampContent = $trainingCampContent -replace $pattern, $utilsReplacement
    $mergedTrainingCampContent | Set-Content $TrainingCampOutputFile -Encoding UTF8
    Write-Host "Created $TrainingCampOutputFile" -ForegroundColor Green
    
    # Display file information
    Write-Host "`nFile Information:" -ForegroundColor Yellow
    Write-Host "$IndexOutputFile size: $((Get-Item $IndexOutputFile).Length) bytes" -ForegroundColor Cyan
    Write-Host "$TrainingCampOutputFile size: $((Get-Item $TrainingCampOutputFile).Length) bytes" -ForegroundColor Cyan
    Write-Host "`nBoth files are ready for copy-paste to Google Sites." -ForegroundColor Yellow
    
    # Ask if user wants to open the files
    $response = Read-Host "`nOpen both files in notepad? (y/n)"
    if ($response -eq 'y' -or $response -eq 'Y') {
        Start-Process notepad $IndexOutputFile
        Start-Process notepad $TrainingCampOutputFile
    }
    
    # Ask which file to copy to clipboard
    Write-Host "`nWhich file would you like to copy to clipboard?"
    Write-Host "1. $IndexOutputFile (Main/Index)"
    Write-Host "2. $TrainingCampOutputFile (Training Camp)"
    Write-Host "3. Neither"
    $clipboardChoice = Read-Host "Enter choice (1/2/3)"
    
    switch ($clipboardChoice) {
        '1' {
            Get-Content $IndexOutputFile -Raw | Set-Clipboard
            Write-Host "$IndexOutputFile content copied to clipboard!" -ForegroundColor Green
        }
        '2' {
            Get-Content $TrainingCampOutputFile -Raw | Set-Clipboard
            Write-Host "$TrainingCampOutputFile content copied to clipboard!" -ForegroundColor Green
        }
        '3' {
            Write-Host "No files copied to clipboard." -ForegroundColor Yellow
        }
        default {
            Write-Host "Invalid choice. No files copied to clipboard." -ForegroundColor Yellow
        }
    }
    
} catch {
    Write-Error "Error occurred during merge process: $($_.Exception.Message)"
    exit 1
}

Write-Host "`nProcess completed successfully! Both files are ready for Google Sites deployment." -ForegroundColor Green

# Keep window open when script is double-clicked
if ($Host.Name -eq "ConsoleHost") {
    Write-Host "`nPress any key to exit..." -ForegroundColor Gray
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
}
