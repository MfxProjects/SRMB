$ErrorActionPreference = 'Stop'

$distRoot = [System.IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..\dist'))
$distPrefix = $distRoot + [System.IO.Path]::DirectorySeparatorChar

function Remove-DistItem {
  param(
    [Parameter(Mandatory)]
    [string]$RelativePath
  )

  $targetPath = [System.IO.Path]::GetFullPath((Join-Path $distRoot $RelativePath))
  if (-not $targetPath.StartsWith($distPrefix, [System.StringComparison]::OrdinalIgnoreCase)) {
    throw "Refusing to remove a path outside dist: $targetPath"
  }

  if (Test-Path -LiteralPath $targetPath) {
    Remove-Item -LiteralPath $targetPath -Recurse -Force
    Write-Host "Removed duplicate packaged asset: $RelativePath"
  }
}

# Infrastructure and Gallery used identical copies of the same video. Both
# screens now reference the Gallery copy, so the duplicate is not packaged.
Remove-DistItem 'assets\infrastructure'

# This legacy press-video filename is not referenced; the app uses
# press-release-news9.mp4 instead.
Remove-DistItem 'assets\Media Corner\Press Released\Ashish Beriwala Driving India’s Steel & Infrastructure Growth  Visionaries of Viksit Bharat #vovb - NEWS9 Live (1080p, h264).mp4'
