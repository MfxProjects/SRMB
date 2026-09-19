param(
  [switch]$Force
)

$ErrorActionPreference = 'Stop'

$projectRoot = Split-Path -Parent $PSScriptRoot
$deckPath = Join-Path $projectRoot 'assets\pfd\PFD.ppt'
$slidesPath = Join-Path $projectRoot 'assets\pfd\slides'
$existingSlides = @(Get-ChildItem -LiteralPath $slidesPath -Filter 'Slide*.PNG' -ErrorAction SilentlyContinue)
$needsExport = $Force -or $existingSlides.Count -eq 0

function Write-SlideManifest {
  $renderedSlides = @(
    Get-ChildItem -LiteralPath $slidesPath -Filter 'Slide*.PNG' |
      Sort-Object { [int]($_.BaseName -replace '\D', '') } |
      ForEach-Object { "/assets/pfd/slides/$($_.Name)" }
  )

  if ($renderedSlides.Count -eq 0) {
    throw "No rendered PFD slides were found in: $slidesPath"
  }

  $manifest = @{ slides = $renderedSlides } | ConvertTo-Json
  Set-Content -LiteralPath (Join-Path $slidesPath 'manifest.json') -Value $manifest -Encoding UTF8
  Write-Host "PFD manifest contains $($renderedSlides.Count) slides."
}

if (-not (Test-Path -LiteralPath $deckPath)) {
  if ($existingSlides.Count -gt 0) {
    Write-Host "PFD source deck was not found, using existing rendered slides."
    Write-SlideManifest
    exit 0
  }

  throw "PFD source deck was not found: $deckPath"
}

if (-not $needsExport) {
  $newestSlide = $existingSlides | Sort-Object LastWriteTime -Descending | Select-Object -First 1
  $needsExport = (Get-Item -LiteralPath $deckPath).LastWriteTime -gt $newestSlide.LastWriteTime
}

if (-not $needsExport) {
  Write-Host "PFD slides are current ($($existingSlides.Count) slides)."
  Write-SlideManifest
  exit 0
}

$powerPoint = $null
$presentation = $null

try {
  New-Item -ItemType Directory -Path $slidesPath -Force | Out-Null
  $powerPoint = New-Object -ComObject PowerPoint.Application
  $presentation = $powerPoint.Presentations.Open($deckPath, $true, $false, $false)
  $presentation.Export($slidesPath, 'PNG', 1920, 1080)
  Write-Host "Exported $($presentation.Slides.Count) PFD slides at 1920x1080."
}
catch {
  if ($existingSlides.Count -gt 0) {
    throw "PFD.ppt is newer than its rendered slides, but PowerPoint automation is unavailable. Open the deck in PowerPoint and export PNG slides to '$slidesPath', or run this script on a machine with PowerPoint installed. $($_.Exception.Message)"
  }

  throw
}
finally {
  if ($null -ne $presentation) {
    $presentation.Close()
    [System.Runtime.InteropServices.Marshal]::ReleaseComObject($presentation) | Out-Null
  }

  if ($null -ne $powerPoint) {
    $powerPoint.Quit()
    [System.Runtime.InteropServices.Marshal]::ReleaseComObject($powerPoint) | Out-Null
  }
}

Write-SlideManifest
