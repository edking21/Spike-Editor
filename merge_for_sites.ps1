param(
    [string]$IndexFile = "index.html",
    [string]$TrainingCampFile_1 = "Training Camp.html_1",
    [string]$TrainingCampFile = "Training Camp.html",
    [string]$ClassLibraryFile = "Class Library.html",
    [string]$UtilsFile = "utils/utils.js",
    [string]$IndexOutputFile = "utils/index_for_copy_to_sites.html",
    [string]$TrainingCampOutputFile = "utils/training_camp_for_copy_to_sites.html",
    [string]$ClassLibraryOutputFile = "utils/class_library_for_copy_to_sites.html"
)

Write-Host "Merging HTML files with $UtilsFile for Google Sites deployment..." -ForegroundColor Green

function Get-PreferredInputFile {
    param(
        [string]$SourceFile,
        [string]$OutputFile
    )

    if ((Test-Path $OutputFile) -and ((Get-Item $OutputFile).LastWriteTime -gt (Get-Item $SourceFile).LastWriteTime)) {
        Write-Host "Using newer output as input: $OutputFile" -ForegroundColor DarkYellow
        return $OutputFile
    }

    return $SourceFile
}

function Merge-PageWithUtils {
    param(
        [string]$InputFile,
        [string]$OutputFile,
        [string]$UtilsReplacement
    )

    $content = Get-Content $InputFile -Raw -Encoding UTF8

    # Replace external utils.js include when present.
    $patternScriptSrc = '<script src="\.\/(?:utils\/)?utils\.js"><\/script>'
    $updated = $content -replace $patternScriptSrc, $UtilsReplacement

    # If file already has inlined utils block, refresh that block instead.
    if ($updated -eq $content) {
        $patternInlineUtils = '(?s)<script>\s*// Utility functions \(from utils\.js\).*?<\/script>'
        $updated = $content -replace $patternInlineUtils, $UtilsReplacement
    }

    $updated | Set-Content $OutputFile -Encoding UTF8
}

function Ensure-OutputDirectories {
    param(
        [string[]]$OutputFiles
    )

    foreach ($outputFile in $OutputFiles) {
        $parentDir = Split-Path -Path $outputFile -Parent
        if (-not [string]::IsNullOrWhiteSpace($parentDir) -and -not (Test-Path $parentDir)) {
            New-Item -Path $parentDir -ItemType Directory -Force | Out-Null
            Write-Host "Created missing output directory: $parentDir" -ForegroundColor DarkYellow
        }
    }
}

# Check if required files exist
$filesToCheck = @($IndexFile, $TrainingCampFile, $ClassLibraryFile, $UtilsFile)
foreach ($file in $filesToCheck) {
    if (-not (Test-Path $file)) {
        Write-Error "Error: $file not found!"
        exit 1
    }
}

# Ensure output directories exist before writing merged files
Ensure-OutputDirectories -OutputFiles @($IndexOutputFile, $TrainingCampOutputFile, $ClassLibraryOutputFile)

try {
    # Read the utils.js file once
    $utilsContent = Get-Content $UtilsFile -Raw -Encoding UTF8
    
    # Add proper indentation to utils.js content
    $indentedUtils = ($utilsContent -split "`n" | ForEach-Object { "        $_" }) -join "`n"
    
    # Create the replacement content with proper script tags
    $utilsReplacement = "<script>`n        // Utility functions (from utils.js)`n$indentedUtils`n    </script>"
    
    # Process index.html
    Write-Host "Processing $IndexFile..." -ForegroundColor Cyan
    $indexInputFile = Get-PreferredInputFile -SourceFile $IndexFile -OutputFile $IndexOutputFile
    Merge-PageWithUtils -InputFile $indexInputFile -OutputFile $IndexOutputFile -UtilsReplacement $utilsReplacement
    Write-Host "Created $IndexOutputFile" -ForegroundColor Green
    
    # Process Training Camp.html
    Write-Host "Processing $TrainingCampFile..." -ForegroundColor Cyan
    $trainingCampInputFile = Get-PreferredInputFile -SourceFile $TrainingCampFile -OutputFile $TrainingCampOutputFile
    Merge-PageWithUtils -InputFile $trainingCampInputFile -OutputFile $TrainingCampOutputFile -UtilsReplacement $utilsReplacement
    Write-Host "Created $TrainingCampOutputFile" -ForegroundColor Green
    
    # Process Class Library.html
    Write-Host "Processing $ClassLibraryFile..." -ForegroundColor Cyan
    $classLibraryInputFile = Get-PreferredInputFile -SourceFile $ClassLibraryFile -OutputFile $ClassLibraryOutputFile
    Merge-PageWithUtils -InputFile $classLibraryInputFile -OutputFile $ClassLibraryOutputFile -UtilsReplacement $utilsReplacement
    Write-Host "Created $ClassLibraryOutputFile" -ForegroundColor Green
    
    # Display file information
    Write-Host "`nFile Information:" -ForegroundColor Yellow
    Write-Host "$IndexOutputFile size: $((Get-Item $IndexOutputFile).Length) bytes" -ForegroundColor Cyan
    Write-Host "$TrainingCampOutputFile size: $((Get-Item $TrainingCampOutputFile).Length) bytes" -ForegroundColor Cyan
    Write-Host "$ClassLibraryOutputFile size: $((Get-Item $ClassLibraryOutputFile).Length) bytes" -ForegroundColor Cyan
    Write-Host "`nAll files are ready for copy-paste to Google Sites." -ForegroundColor Yellow
    
    # Ask if user wants to open the files
    $response = Read-Host "`nOpen all files in notepad? (y/n)"
    if ($response -eq 'y' -or $response -eq 'Y') {
        Start-Process notepad $IndexOutputFile
        Start-Process notepad $TrainingCampOutputFile
        Start-Process notepad $ClassLibraryOutputFile
    }
    
    # Ask which file to copy to clipboard
    Write-Host "`nWhich file would you like to copy to clipboard?"
    Write-Host "1. $IndexOutputFile (Main/Index)"
    Write-Host "2. $TrainingCampOutputFile (Training Camp)"
    Write-Host "3. $ClassLibraryOutputFile (Class Library)"
    Write-Host "4. Neither"
    $clipboardChoice = Read-Host "Enter choice (1/2/3/4)"
    
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
            Get-Content $ClassLibraryOutputFile -Raw | Set-Clipboard
            Write-Host "$ClassLibraryOutputFile content copied to clipboard!" -ForegroundColor Green
        }
        '4' {
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

Write-Host "`nProcess completed successfully! All files are ready for Google Sites deployment." -ForegroundColor Green

# Keep window open when script is double-clicked
if ($Host.Name -eq "ConsoleHost") {
    Write-Host "`nPress any key to exit..." -ForegroundColor Gray
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
}
