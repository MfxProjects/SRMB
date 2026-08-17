param(
  [string]$Source = (Join-Path $PSScriptRoot '..\assets\applogo\download.jpg'),
  [string]$PngOutput = (Join-Path $PSScriptRoot '..\build\icon.png'),
  [string]$IcoOutput = (Join-Path $PSScriptRoot '..\build\icon.ico')
)

$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing

$sourcePath = [System.IO.Path]::GetFullPath($Source)
$pngPath = [System.IO.Path]::GetFullPath($PngOutput)
$icoPath = [System.IO.Path]::GetFullPath($IcoOutput)
$outputDirectory = [System.IO.Path]::GetDirectoryName($icoPath)
[System.IO.Directory]::CreateDirectory($outputDirectory) | Out-Null

$sourceImage = [System.Drawing.Bitmap]::FromFile($sourcePath)
$background = $sourceImage.GetPixel(0, 0)

function New-IconBitmap {
  param([int]$Size)

  $bitmap = [System.Drawing.Bitmap]::new(
    $Size,
    $Size,
    [System.Drawing.Imaging.PixelFormat]::Format32bppArgb
  )
  $graphics = [System.Drawing.Graphics]::FromImage($bitmap)

  try {
    $graphics.Clear($background)
    $graphics.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
    $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality

    $maximumWidth = [int]($Size * 0.88)
    $maximumHeight = [int]($Size * 0.42)
    $scale = [Math]::Min(
      $maximumWidth / $sourceImage.Width,
      $maximumHeight / $sourceImage.Height
    )
    $width = [Math]::Max(1, [int][Math]::Round($sourceImage.Width * $scale))
    $height = [Math]::Max(1, [int][Math]::Round($sourceImage.Height * $scale))
    $x = [int](($Size - $width) / 2)
    $y = [int](($Size - $height) / 2)

    $graphics.DrawImage($sourceImage, $x, $y, $width, $height)
  }
  finally {
    $graphics.Dispose()
  }

  for ($pixelY = 0; $pixelY -lt $Size; $pixelY++) {
    for ($pixelX = 0; $pixelX -lt $Size; $pixelX++) {
      $pixel = $bitmap.GetPixel($pixelX, $pixelY)
      if ($pixel.R -gt 180 -and $pixel.G -gt 130 -and $pixel.B -lt 100) {
        $bitmap.SetPixel($pixelX, $pixelY, $background)
      }
    }
  }

  return $bitmap
}

try {
  $preview = New-IconBitmap -Size 1024
  try {
    $preview.Save($pngPath, [System.Drawing.Imaging.ImageFormat]::Png)
  }
  finally {
    $preview.Dispose()
  }

  $sizes = @(16, 24, 32, 48, 64, 128, 256)
  $images = foreach ($size in $sizes) {
    $bitmap = New-IconBitmap -Size $size
    $stream = [System.IO.MemoryStream]::new()
    try {
      $bitmap.Save($stream, [System.Drawing.Imaging.ImageFormat]::Png)
      [PSCustomObject]@{
        Size = $size
        Bytes = $stream.ToArray()
      }
    }
    finally {
      $stream.Dispose()
      $bitmap.Dispose()
    }
  }

  $fileStream = [System.IO.File]::Open(
    $icoPath,
    [System.IO.FileMode]::Create,
    [System.IO.FileAccess]::Write
  )
  $writer = [System.IO.BinaryWriter]::new($fileStream)

  try {
    $writer.Write([uint16]0)
    $writer.Write([uint16]1)
    $writer.Write([uint16]$images.Count)

    $offset = 6 + (16 * $images.Count)
    foreach ($image in $images) {
      $dimension = if ($image.Size -ge 256) { 0 } else { $image.Size }
      $writer.Write([byte]$dimension)
      $writer.Write([byte]$dimension)
      $writer.Write([byte]0)
      $writer.Write([byte]0)
      $writer.Write([uint16]1)
      $writer.Write([uint16]32)
      $writer.Write([uint32]$image.Bytes.Length)
      $writer.Write([uint32]$offset)
      $offset += $image.Bytes.Length
    }

    foreach ($image in $images) {
      $writer.Write($image.Bytes)
    }
  }
  finally {
    $writer.Dispose()
    $fileStream.Dispose()
  }
}
finally {
  $sourceImage.Dispose()
}

Write-Host "Created $pngPath"
Write-Host "Created $icoPath"
