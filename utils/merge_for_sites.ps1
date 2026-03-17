param(
    [string]$IndexFile = "index.html",
    [string]$TrainingCampFile = "Training Camp.html",
    [string]$ClassLibraryFile = "Class Library.html",
    [string]$StylesFile = "styles/spike-shared.css",
    [string]$ScriptsFile = "scripts/spike-shared.js",
    [string]$UtilsFile = "utils.js",
    [string]$IndexOutputFile = "index_for_copy_to_sites.html",
    [string]$TrainingCampOutputFile = "training_camp_for_copy_to_sites.html",
    [string]$ClassLibraryOutputFile = "class_library_for_copy_to_sites.html"
)

$ProjectRoot = Split-Path -Path $PSScriptRoot -Parent

function Resolve-PathWithBase {
    param(
        [string]$PathValue,
        [string]$BasePath
    )

    if ([System.IO.Path]::IsPathRooted($PathValue)) {
        return $PathValue
    }

    return Join-Path $BasePath $PathValue
}

$IndexFile = Resolve-PathWithBase -PathValue $IndexFile -BasePath $ProjectRoot
$TrainingCampFile = Resolve-PathWithBase -PathValue $TrainingCampFile -BasePath $ProjectRoot
$ClassLibraryFile = Resolve-PathWithBase -PathValue $ClassLibraryFile -BasePath $ProjectRoot
$StylesFile = Resolve-PathWithBase -PathValue $StylesFile -BasePath $ProjectRoot
$ScriptsFile = Resolve-PathWithBase -PathValue $ScriptsFile -BasePath $ProjectRoot
$UtilsFile = Resolve-PathWithBase -PathValue $UtilsFile -BasePath $PSScriptRoot
$IndexOutputFile = Resolve-PathWithBase -PathValue $IndexOutputFile -BasePath $PSScriptRoot
$TrainingCampOutputFile = Resolve-PathWithBase -PathValue $TrainingCampOutputFile -BasePath $PSScriptRoot
$ClassLibraryOutputFile = Resolve-PathWithBase -PathValue $ClassLibraryOutputFile -BasePath $PSScriptRoot

Write-Host "Merging HTML files with $UtilsFile for Google Sites deployment..." -ForegroundColor Green

function Get-PreferredInputFile {
    param(
        [string]$SourceFile,
        [string]$OutputFile
    )

    if ((Test-Path $OutputFile) -and ((Get-Item $OutputFile).LastWriteTime -gt (Get-Item $SourceFile).LastWriteTime)) {
        $outputPreview = Get-Content $OutputFile -Raw -Encoding UTF8
        if ($outputPreview -match '\$12px\s+2px\s+2px\s+2px;|\$10;') {
            Write-Host "Detected invalid CSS in generated output. Reverting to source input: $SourceFile" -ForegroundColor Yellow
            return $SourceFile
        }

        Write-Host "Using newer output as input: $OutputFile" -ForegroundColor DarkYellow
        return $OutputFile
    }

    return $SourceFile
}

function Update-PageWithUtils {
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

    # Remove mobile/sidebar/top-menu/menu-links/menu-search markup for Google Sites output.
    # Matches elements where class contains mobile-sidebar, mobile-overlay, top-menu, menu-links, or menu-search,
    # including additional class names and arbitrary attribute ordering.

    $patternMobileSidebar = '(?is)<div\b(?=[^>]*\bclass\s*=\s*["''][^"'']*\bmobile-sidebar\b[^"'']*["''])[^>]*>.*?<\/div>\s*'
    $patternMobileOverlay = '(?is)<div\b(?=[^>]*\bclass\s*=\s*["''][^"'']*\bmobile-overlay\b[^"'']*["''])[^>]*>.*?<\/div>\s*'
    $patternTopMenu = '(?is)<div\b(?=[^>]*\bclass\s*=\s*["''][^"'']*\btop-menu\b[^"'']*["''])[^>]*>.*?(?=\s*<div\s+class=["'']left-column["'']|\s*<h1\b)'
    $patternMenuLinks = '(?is)<div\b(?=[^>]*\bclass\s*=\s*["''][^"'']*\bmenu-links\b[^"'']*["''])[^>]*>.*?<\/div>\s*'
    $patternMenuSearchButton = '(?is)<button\b(?=[^>]*\bclass\s*=\s*["''][^"'']*\bmenu-search\b[^"'']*["''])[^>]*>.*?<\/button>\s*'
    $updated = $updated -replace $patternMobileSidebar, ''
    $updated = $updated -replace $patternMobileOverlay, ''
    $updated = $updated -replace $patternTopMenu, ''
    $updated = $updated -replace $patternMenuLinks, ''
    $updated = $updated -replace $patternMenuSearchButton, ''

    # Home-only vertical normalization for Google Sites copy.
    # This keeps GitHub source untouched and aligns Home start position.
    if ([System.IO.Path]::GetFileName($OutputFile) -ieq 'index_for_copy_to_sites.html') {
        $updated = $updated -replace '(?im)(padding:\s*)50px\s+2px\s+2px\s+2px\s*;', '${1}2px 2px 2px 2px;'
        $updated = $updated -replace '(?is)(\.left-column\s*\{[^}]*?\btop:\s*)48px(\s*;)', '${1}0${2}'
        $updated = $updated -replace '(?is)(\.left-column\s*\{[^}]*?\bheight:\s*)calc\(100vh\s*-\s*48px\)(\s*;)', '${1}100vh${2}'
    }

    $updated | Set-Content $OutputFile -Encoding UTF8
}

function New-OutputDirectories {
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

function Inline-SharedCssInOutput {
    param(
        [string]$OutputFile,
        [string]$CssContent
    )

    $content = Get-Content $OutputFile -Raw -Encoding UTF8
    $patternCssLink = '(?im)^\s*<link\s+rel="stylesheet"\s+href="\.\/styles\/spike-shared\.css"\s*>\s*$'
    $inlineCssBlock = "    <style>`n$CssContent`n    </style>"
    $updated = $content -replace $patternCssLink, $inlineCssBlock

    if ($updated -eq $content) {
        Write-Host "No stylesheet link found to inline in $OutputFile" -ForegroundColor Yellow
    } else {
        $updated | Set-Content $OutputFile -Encoding UTF8
        Write-Host "Temporarily inlined spike-shared.css into $OutputFile" -ForegroundColor DarkCyan
    }
}

function Inline-SharedJsInOutput {
    param(
        [string]$OutputFile,
        [string]$JsContent
    )

    $content = Get-Content $OutputFile -Raw -Encoding UTF8
    $patternJsLink = '(?im)^\s*<script\s+src="\.\/scripts\/spike-shared\.js"><\/script>\s*$'
    $inlineJsBlock = "    <script>`n        // Shared script (from scripts/spike-shared.js)`n$JsContent`n    </script>"
    $updated = $content -replace $patternJsLink, $inlineJsBlock

    # If no shared-script tag exists (for example class library output), inject before </body>.
    if ($updated -eq $content) {
        $updated = $content -replace '(?is)</body>', "$inlineJsBlock`n</body>"
    }

    if ($updated -eq $content) {
        Write-Host "No suitable insertion point found to inline JS in $OutputFile" -ForegroundColor Yellow
    } else {
        $updated | Set-Content $OutputFile -Encoding UTF8
        Write-Host "Temporarily inlined spike-shared.js into $OutputFile" -ForegroundColor DarkCyan
    }
}

function Restore-OriginalOutputFiles {
    param(
        [hashtable]$OriginalFiles
    )

    foreach ($filePath in $OriginalFiles.Keys) {
        $OriginalFiles[$filePath] | Set-Content $filePath -Encoding UTF8
        Write-Host "Restored original file: $filePath" -ForegroundColor DarkGreen
    }
}

# Check if required files exist
$filesToCheck = @($IndexFile, $TrainingCampFile, $ClassLibraryFile, $StylesFile, $ScriptsFile, $UtilsFile)
foreach ($file in $filesToCheck) {
    if (-not (Test-Path $file)) {
        Write-Error "Error: $file not found!"
        exit 1
    }
}

# Ensure output directories exist before writing merged files
New-OutputDirectories -OutputFiles @($IndexOutputFile, $TrainingCampOutputFile, $ClassLibraryOutputFile)

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
    Update-PageWithUtils -InputFile $indexInputFile -OutputFile $IndexOutputFile -UtilsReplacement $utilsReplacement
    Write-Host "Created $IndexOutputFile" -ForegroundColor Green
    
    # Process Training Camp.html
    Write-Host "Processing $TrainingCampFile..." -ForegroundColor Cyan
    $trainingCampInputFile = Get-PreferredInputFile -SourceFile $TrainingCampFile -OutputFile $TrainingCampOutputFile
    Update-PageWithUtils -InputFile $trainingCampInputFile -OutputFile $TrainingCampOutputFile -UtilsReplacement $utilsReplacement
    Write-Host "Created $TrainingCampOutputFile" -ForegroundColor Green
    
    # Process Class Library.html
    Write-Host "Processing $ClassLibraryFile..." -ForegroundColor Cyan
    $classLibraryInputFile = Get-PreferredInputFile -SourceFile $ClassLibraryFile -OutputFile $ClassLibraryOutputFile
    Update-PageWithUtils -InputFile $classLibraryInputFile -OutputFile $ClassLibraryOutputFile -UtilsReplacement $utilsReplacement
    Write-Host "Created $ClassLibraryOutputFile" -ForegroundColor Green
    
    # Display file information
    Write-Host "`nFile Information:" -ForegroundColor Yellow
    Write-Host "$IndexOutputFile size: $((Get-Item $IndexOutputFile).Length) bytes" -ForegroundColor Cyan
    Write-Host "$TrainingCampOutputFile size: $((Get-Item $TrainingCampOutputFile).Length) bytes" -ForegroundColor Cyan
    Write-Host "$ClassLibraryOutputFile size: $((Get-Item $ClassLibraryOutputFile).Length) bytes" -ForegroundColor Cyan
    Write-Host "`nAll files are ready for copy-paste to Google Sites." -ForegroundColor Yellow

    # Temporarily inline shared CSS/JS before manual copy for Google Sites embedding.
    $cssContent = Get-Content $StylesFile -Raw -Encoding UTF8
    $jsContent = Get-Content $ScriptsFile -Raw -Encoding UTF8
    $outputFiles = @($IndexOutputFile, $TrainingCampOutputFile, $ClassLibraryOutputFile)
    $originalOutputContent = @{}
    foreach ($outputFile in $outputFiles) {
        $originalOutputContent[$outputFile] = Get-Content $outputFile -Raw -Encoding UTF8
        Inline-SharedCssInOutput -OutputFile $outputFile -CssContent $cssContent
        Inline-SharedJsInOutput -OutputFile $outputFile -JsContent $jsContent
    }
    
    try {
        # Ask if user wants to open the files
        $response = (Read-Host "`nOpen all files in notepad? (y/n)").Trim()
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
        $clipboardChoice = (Read-Host "Enter choice (1/2/3/4)").Trim()

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
    } finally {
        Restore-OriginalOutputFiles -OriginalFiles $originalOutputContent
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
