param(
    [string]$IndexFile = "index.html",
    [string]$TrainingCampFile = "training_camp.html",
    [string]$ChallengesLibraryFile = "challenges_library.html",
    [string]$SensorsPythonFile = "lessons/sensor_python.html",
    [string]$StylesFile = "styles/spike-shared.css",
    [string]$ScriptsFile = "scripts/spike-shared.js",
    [string]$UtilsFile = "utils.js",
    [string]$IndexOutputFile = "index_for_copy_to_sites.html",
    [string]$TrainingCampOutputFile = "training_camp_for_copy_to_sites.html",
    [string]$ChallengesLibraryOutputFile = "challenges_library_for_copy_to_sites.html",
    [string]$SensorsPythonOutputFile = "sensor_python_for_copy_to_sites.html",
    [switch]$SkipSensorsPython = $false
)

<#
.SYNOPSIS
    Enhanced Google Sites deployment script for Spike Editor with Sensors Python support
.DESCRIPTION
    This script merges HTML files, CSS, and JavaScript for deployment to Google Sites.
    Now includes support for Sensors Python lesson alongside existing modules.
.PARAMETER SkipSensorsPython
    If set, skips processing the Sensors Python file (for backward compatibility)
.EXAMPLE
    .\merge_for_sites_enhanced.ps1
    .\merge_for_sites_enhanced.ps1 -SkipSensorsPython
#>

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
$ChallengesLibraryFile = Resolve-PathWithBase -PathValue $ChallengesLibraryFile -BasePath $ProjectRoot
$SensorsPythonFile = Resolve-PathWithBase -PathValue $SensorsPythonFile -BasePath $ProjectRoot
$StylesFile = Resolve-PathWithBase -PathValue $StylesFile -BasePath $ProjectRoot
$ScriptsFile = Resolve-PathWithBase -PathValue $ScriptsFile -BasePath $ProjectRoot
$ImagesDirectory = Join-Path $ProjectRoot 'images'
$UtilsFile = Resolve-PathWithBase -PathValue $UtilsFile -BasePath $PSScriptRoot
$IndexOutputFile = Resolve-PathWithBase -PathValue $IndexOutputFile -BasePath $PSScriptRoot
$TrainingCampOutputFile = Resolve-PathWithBase -PathValue $TrainingCampOutputFile -BasePath $PSScriptRoot
$ChallengesLibraryOutputFile = Resolve-PathWithBase -PathValue $ChallengesLibraryOutputFile -BasePath $PSScriptRoot
$SensorsPythonOutputFile = Resolve-PathWithBase -PathValue $SensorsPythonOutputFile -BasePath $PSScriptRoot

Write-Host "╔═══════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║  Spike Editor - Enhanced Google Sites Deployment Tool     ║" -ForegroundColor Cyan
Write-Host "║  Now with Sensors Python Support                          ║" -ForegroundColor Cyan
Write-Host "╚═══════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""
Write-Host "Processing files for Google Sites deployment..." -ForegroundColor Green

function Get-PreferredInputFile {
    param(
        [string]$SourceFile,
        [string]$OutputFile
    )

    if ((Test-Path $OutputFile) -and ((Get-Item $OutputFile).LastWriteTime -gt (Get-Item $SourceFile).LastWriteTime)) {
        $outputPreview = Get-Content $OutputFile -Raw -Encoding UTF8
        if ($outputPreview -match '\$12px\s+2px\s+2px\s+2px;|\$10;') {
            Write-Host "  ⚠️  Detected invalid CSS in generated output. Reverting to source." -ForegroundColor Yellow
            return $SourceFile
        }

        Write-Host "  ℹ️  Using newer output as input: $OutputFile" -ForegroundColor DarkYellow
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

    # Keep generated output using external utils.js, so utils inlining can remain a temporary copy step.
    $updated = $content
    $patternInlineUtils = '(?s)<script>\s*// Utility functions \(from utils\.js\).*?<\/script>'
    $updated = $updated -replace $patternInlineUtils, '    <script src="./utils/utils.js"></script>'

    # Normalize utils.js includes to exactly one tag.
    $patternUtilsSrcAll = '(?im)^\s*<script\s+src="\.\/utils\/utils\.js"><\/script>\s*\r?\n?'
    $updated = [regex]::Replace($updated, $patternUtilsSrcAll, '')

    $patternSharedSrc = '(?im)^\s*<script\s+src="\.\/scripts\/spike-shared\.js"><\/script>\s*$'
    if ([regex]::IsMatch($updated, $patternSharedSrc)) {
        $updated = [regex]::Replace($updated, $patternSharedSrc, '    <script src="./utils/utils.js"></script>' + "`n" + '$0', 1)
    } else {
        $updated = $updated -replace '(?is)</body>', ('    <script src="./utils/utils.js"></script>' + "`n</body>")
    }

    # Remove mobile/sidebar/top-menu/menu-links/menu-search markup for Google Sites output.
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
            Write-Host "  📁 Created output directory: $parentDir" -ForegroundColor DarkYellow
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
        Write-Host "  ⚠️  No stylesheet link found in $OutputFile" -ForegroundColor Yellow
    } else {
        $updated | Set-Content $OutputFile -Encoding UTF8
        Write-Host "  ✓ Inlined spike-shared.css" -ForegroundColor Green
    }
}

function Inline-UtilsJsInOutput {
    param(
        [string]$OutputFile,
        [string]$UtilsContent
    )

    $content = Get-Content $OutputFile -Raw -Encoding UTF8
    $patternUtilsSrc = '(?im)^\s*<script\s+src="\.\/(?:utils\/)?utils\.js"><\/script>\s*$'
    $patternInlineUtils = '(?s)<script>\s*// Utility functions \(from utils\.js\).*?<\/script>'
    $inlineUtilsBlock = "    <script>`n        // Utility functions (from utils.js)`n$UtilsContent`n    </script>"

    $updated = $content -replace $patternUtilsSrc, $inlineUtilsBlock

    if ($updated -eq $content) {
        $updated = $content -replace $patternInlineUtils, $inlineUtilsBlock
    }

    if ($updated -eq $content) {
        $updated = $content -replace '(?is)</body>', "$inlineUtilsBlock`n</body>"
    }

    if ($updated -eq $content) {
        Write-Host "  ⚠️  No suitable insertion point found for utils.js in $OutputFile" -ForegroundColor Yellow
    } else {
        $updated | Set-Content $OutputFile -Encoding UTF8
        Write-Host "  ✓ Inlined utils.js" -ForegroundColor Green
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

    if ($updated -eq $content) {
        $updated = $content -replace '(?is)</body>', "$inlineJsBlock`n</body>"
    }

    if ($updated -eq $content) {
        Write-Host "  ⚠️  No suitable insertion point found for JS in $OutputFile" -ForegroundColor Yellow
    } else {
        $updated | Set-Content $OutputFile -Encoding UTF8
        Write-Host "  ✓ Inlined spike-shared.js" -ForegroundColor Green
    }
}

function Inline-FigureImagesInOutput {
    param(
        [string]$OutputFile,
        [string]$ImagesDirectory
    )

    $content = Get-Content $OutputFile -Raw -Encoding UTF8
    $updated = $content
    $imageCount = 0

    foreach ($imageFile in Get-ChildItem -Path $ImagesDirectory -File -ErrorAction SilentlyContinue | Where-Object Extension -Match '^\.jpe?g$') {
        $relativePath = './images/' + $imageFile.Name
        $base64 = [Convert]::ToBase64String([System.IO.File]::ReadAllBytes($imageFile.FullName))
        $dataUri = "data:image/jpeg;base64,$base64"
        $updated = $updated.Replace("'$relativePath'", "'$dataUri'")
        $updated = $updated.Replace('"' + $relativePath + '"', '"' + $dataUri + '"')
        $imageCount++
    }

    if ($updated -ne $content) {
        $updated | Set-Content $OutputFile -Encoding UTF8
        Write-Host "  ✓ Inlined $imageCount image(s)" -ForegroundColor Green
    }
}

function Restore-OriginalOutputFiles {
    param(
        [hashtable]$OriginalFiles
    )

    foreach ($filePath in $OriginalFiles.Keys) {
        $OriginalFiles[$filePath] | Set-Content $filePath -Encoding UTF8
        Write-Host "  ↺ Restored: $(Split-Path $filePath -Leaf)" -ForegroundColor DarkGreen
    }
}

# Check if required files exist
$filesToCheck = @($IndexFile, $TrainingCampFile, $ChallengesLibraryFile, $StylesFile, $ScriptsFile, $UtilsFile)
if (-not $SkipSensorsPython) {
    $filesToCheck += $SensorsPythonFile
}

foreach ($file in $filesToCheck) {
    if (-not (Test-Path $file)) {
        Write-Error "❌ Error: $file not found!"
        exit 1
    }
}

# Ensure output directories exist
$outputFiles = @($IndexOutputFile, $TrainingCampOutputFile, $ChallengesLibraryOutputFile)
if (-not $SkipSensorsPython) {
    $outputFiles += $SensorsPythonOutputFile
}

New-OutputDirectories -OutputFiles $outputFiles

try {
    # Read the utils.js file once
    $utilsContent = Get-Content $UtilsFile -Raw -Encoding UTF8
    $utilsReplacement = ''
    
    Write-Host "`n📋 Processing files:" -ForegroundColor Yellow
    
    # Process index.html
    Write-Host "  → index.html" -ForegroundColor Cyan
    $indexInputFile = Get-PreferredInputFile -SourceFile $IndexFile -OutputFile $IndexOutputFile
    Update-PageWithUtils -InputFile $indexInputFile -OutputFile $IndexOutputFile -UtilsReplacement $utilsReplacement
    Write-Host "    ✓ Created $(Split-Path $IndexOutputFile -Leaf)" -ForegroundColor Green
    
    # Process training_camp.html
    Write-Host "  → training_camp.html" -ForegroundColor Cyan
    $trainingCampInputFile = Get-PreferredInputFile -SourceFile $TrainingCampFile -OutputFile $TrainingCampOutputFile
    Update-PageWithUtils -InputFile $trainingCampInputFile -OutputFile $TrainingCampOutputFile -UtilsReplacement $utilsReplacement
    Write-Host "    ✓ Created $(Split-Path $TrainingCampOutputFile -Leaf)" -ForegroundColor Green
    
    # Process challenges_library.html
    Write-Host "  → challenges_library.html" -ForegroundColor Cyan
    $challengesLibraryInputFile = Get-PreferredInputFile -SourceFile $ChallengesLibraryFile -OutputFile $ChallengesLibraryOutputFile
    Update-PageWithUtils -InputFile $challengesLibraryInputFile -OutputFile $ChallengesLibraryOutputFile -UtilsReplacement $utilsReplacement
    Write-Host "    ✓ Created $(Split-Path $ChallengesLibraryOutputFile -Leaf)" -ForegroundColor Green
    
    # Process sensor_python.html (if not skipped)
    if (-not $SkipSensorsPython) {
        Write-Host "  → lessons/sensor_python.html" -ForegroundColor Cyan
        $sensorsPythonInputFile = Get-PreferredInputFile -SourceFile $SensorsPythonFile -OutputFile $SensorsPythonOutputFile
        Update-PageWithUtils -InputFile $sensorsPythonInputFile -OutputFile $SensorsPythonOutputFile -UtilsReplacement $utilsReplacement
        Write-Host "    ✓ Created $(Split-Path $SensorsPythonOutputFile -Leaf)" -ForegroundColor Green
    }
    
    # Display file information
    Write-Host "`n📊 File Information:" -ForegroundColor Yellow
    Write-Host "  • $IndexOutputFile" -ForegroundColor Cyan
    Write-Host "    Size: $([math]::Round((Get-Item $IndexOutputFile).Length / 1KB, 2)) KB" -ForegroundColor Gray
    Write-Host "  • $TrainingCampOutputFile" -ForegroundColor Cyan
    Write-Host "    Size: $([math]::Round((Get-Item $TrainingCampOutputFile).Length / 1KB, 2)) KB" -ForegroundColor Gray
    Write-Host "  • $ChallengesLibraryOutputFile" -ForegroundColor Cyan
    Write-Host "    Size: $([math]::Round((Get-Item $ChallengesLibraryOutputFile).Length / 1KB, 2)) KB" -ForegroundColor Gray
    if (-not $SkipSensorsPython) {
        Write-Host "  • $SensorsPythonOutputFile" -ForegroundColor Cyan
        Write-Host "    Size: $([math]::Round((Get-Item $SensorsPythonOutputFile).Length / 1KB, 2)) KB" -ForegroundColor Gray
    }
    
    Write-Host "`n✅ All files are ready for copy-paste to Google Sites." -ForegroundColor Green

    # Temporarily inline utils/shared CSS/shared JS before manual copy for Google Sites embedding.
    Write-Host "`n🔄 Preparing for inline embedding (optional)..." -ForegroundColor Yellow
    
    $cssContent = Get-Content $StylesFile -Raw -Encoding UTF8
    $cssContent = $cssContent -replace '(?im)(\bpadding:\s*)50px\s+2px\s+2px\s+2px\s*;', '${1}0px 2px 2px 2px;'
    $cssContent = $cssContent -replace '(?is)(\.left-column\s*\{[^}]*?\btop:\s*)50px(\s*;)', '${1}0px${2}'
    $jsContent = Get-Content $ScriptsFile -Raw -Encoding UTF8
    
    $allOutputFiles = @($IndexOutputFile, $TrainingCampOutputFile, $ChallengesLibraryOutputFile)
    if (-not $SkipSensorsPython) {
        $allOutputFiles += $SensorsPythonOutputFile
    }
    
    $originalOutputContent = @{}
    foreach ($outputFile in $allOutputFiles) {
        $originalOutputContent[$outputFile] = Get-Content $outputFile -Raw -Encoding UTF8
        Inline-UtilsJsInOutput -OutputFile $outputFile -UtilsContent $utilsContent
        Inline-SharedCssInOutput -OutputFile $outputFile -CssContent $cssContent
        Inline-SharedJsInOutput -OutputFile $outputFile -JsContent $jsContent
    }
    
    foreach ($outputFile in $allOutputFiles) {
        Inline-FigureImagesInOutput -OutputFile $outputFile -ImagesDirectory $ImagesDirectory
    }
    
    try {
        # Step 4: Copy to clipboard (fully automated)
        Write-Host "`n📋 Select file to copy to clipboard:" -ForegroundColor Yellow
        Write-Host "  1. Main Index" -ForegroundColor Cyan
        Write-Host "  2. Training Camp" -ForegroundColor Cyan
        Write-Host "  3. Challenges Library" -ForegroundColor Cyan
        if (-not $SkipSensorsPython) {
            Write-Host "  4. Sensors Python Lesson" -ForegroundColor Cyan
            Write-Host "  5. Skip" -ForegroundColor Cyan
            $maxChoice = '5'
        } else {
            Write-Host "  4. Skip" -ForegroundColor Cyan
            $maxChoice = '4'
        }
        
        $clipboardChoice = (Read-Host "  Enter choice (1-$maxChoice)").Trim()

        switch ($clipboardChoice) {
            '1' {
                Get-Content $IndexOutputFile -Raw | Set-Clipboard
                Write-Host "`n✓ $(Split-Path $IndexOutputFile -Leaf) copied to clipboard!" -ForegroundColor Green
                Write-Host "  Ready to paste into Google Sites" -ForegroundColor Green
            }
            '2' {
                Get-Content $TrainingCampOutputFile -Raw | Set-Clipboard
                Write-Host "`n✓ $(Split-Path $TrainingCampOutputFile -Leaf) copied to clipboard!" -ForegroundColor Green
                Write-Host "  Ready to paste into Google Sites" -ForegroundColor Green
            }
            '3' {
                Get-Content $ChallengesLibraryOutputFile -Raw | Set-Clipboard
                Write-Host "`n✓ $(Split-Path $ChallengesLibraryOutputFile -Leaf) copied to clipboard!" -ForegroundColor Green
                Write-Host "  Ready to paste into Google Sites" -ForegroundColor Green
            }
            '4' {
                if (-not $SkipSensorsPython) {
                    Get-Content $SensorsPythonOutputFile -Raw | Set-Clipboard
                    Write-Host "`n✓ $(Split-Path $SensorsPythonOutputFile -Leaf) copied to clipboard!" -ForegroundColor Green
                    Write-Host "  Ready to paste into Google Sites" -ForegroundColor Green
                } else {
                    Write-Host "`n✓ Skipped clipboard copy." -ForegroundColor Gray
                }
            }
            default {
                Write-Host "`n✓ Skipped clipboard copy." -ForegroundColor Gray
            }
        }
    } catch {
        Write-Host "  ℹ️  Skipping user interaction (headless mode detected)" -ForegroundColor Gray
    }
    
    # Restore original files (remove temp inlined content)
    Write-Host "`n♻️  Restoring original files..." -ForegroundColor Yellow
    Restore-OriginalOutputFiles -OriginalFiles $originalOutputContent
    
    Write-Host "`n🎉 Deployment preparation complete!" -ForegroundColor Green
    Write-Host "`n✅ Your HTML is ready in the clipboard!" -ForegroundColor Green
    Write-Host "`n📝 Next step:" -ForegroundColor Cyan
    Write-Host "  → Paste into your Google Sites page (Ctrl+V)" -ForegroundColor Gray
    Write-Host ""

} catch {
    Write-Error "Error during processing: $_"
    exit 1
}
