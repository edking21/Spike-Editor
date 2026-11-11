$ErrorActionPreference = 'Stop'
$projectRoot = Split-Path -Path $PSScriptRoot -Parent
$testDirectory = Join-Path ([System.IO.Path]::GetTempPath()) ("spike-merge-test-" + [guid]::NewGuid().ToString())
New-Item -ItemType Directory -Path $testDirectory | Out-Null

function Read-Host {
    param([string]$Prompt)
    return '4'
}

function Set-Clipboard {
    param([Parameter(ValueFromPipeline = $true)][string]$Value)
    process { [System.IO.File]::WriteAllText((Join-Path $testDirectory 'clipboard.html'), $Value) }
}

function Assert-Contains {
    param([string]$Content, [string]$Expected)
    if (-not $Content.Contains($Expected)) {
        throw "Expected generated output to contain: $Expected"
    }
}

try {
    $indexOutput = Join-Path $testDirectory 'index.html'
    $trainingOutput = Join-Path $testDirectory 'training.html'
    $challengesOutput = Join-Path $testDirectory 'challenges.html'
    $roboticsOutput = Join-Path $testDirectory 'robotics.html'
    Set-Content -LiteralPath $roboticsOutput -Value 'stale generated output' -Encoding UTF8
    (Get-Item -LiteralPath $roboticsOutput).LastWriteTime = (Get-Date).AddDays(1)

    & (Join-Path $projectRoot 'utils\merge_for_sites_enhanced.ps1') `
        -IndexOutputFile $indexOutput `
        -TrainingCampOutputFile $trainingOutput `
        -ChallengesLibraryOutputFile $challengesOutput `
        -SensorsPythonOutputFile $roboticsOutput

    $output = Get-Content -LiteralPath $roboticsOutput -Raw -Encoding UTF8
    $clipboardContent = Get-Content -LiteralPath (Join-Path $testDirectory 'clipboard.html') -Raw -Encoding UTF8
    foreach ($content in @($output, $clipboardContent)) {
        foreach ($label in @('Sensors', 'Maze', 'Project 3', 'Project 4', 'Project 5')) {
            Assert-Contains $content ">$label</button>"
        }
        Assert-Contains $content 'id="sensors-project"'
        Assert-Contains $content 'id="maze-project"'
        Assert-Contains $content "document.querySelectorAll('.project-button')"
        if ($content.Contains('class="top-menu"') -or $content.Contains('stale generated output')) {
            throw 'Generated Robotics output retained navigation or used stale output as input.'
        }
    }

    Assert-Contains $clipboardContent 'data:image/png;base64,'
    $mazeImage = [Convert]::ToBase64String([System.IO.File]::ReadAllBytes((Join-Path $projectRoot 'images\maze_runner_4.png')))
    Assert-Contains $clipboardContent "data:image/png;base64,$mazeImage"
    Assert-Contains $clipboardContent 'href="https://edking21.github.io/Spike-Editor/Python/maze_runner_5.py"'
    Assert-Contains $clipboardContent '// Shared script (from scripts/spike-shared.js)'
    Assert-Contains $clipboardContent '// Utility functions (from utils.js)'
    Assert-Contains (Get-Content -LiteralPath $trainingOutput -Raw -Encoding UTF8) 'class="left-column"'
    Assert-Contains (Get-Content -LiteralPath $challengesOutput -Raw -Encoding UTF8) 'class="left-column"'
    Write-Host 'Enhanced merge regression test passed.'
} finally {
    Remove-Item -LiteralPath $testDirectory -Recurse -Force
}
