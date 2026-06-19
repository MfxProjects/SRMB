$ErrorActionPreference = 'Stop'

Add-Type -AssemblyName System.Drawing

$Root = Resolve-Path (Join-Path $PSScriptRoot '..')
$OutDir = Join-Path $Root 'assets\cardImage\generated-png'
New-Item -ItemType Directory -Path $OutDir -Force | Out-Null

$CardWidth = 400
$CardHeight = 600
$ArtHeight = 430
$LabelTop = 430
$LabelHeight = $CardHeight - $LabelTop

function Resolve-Asset([string]$RelativePath) {
  return Join-Path $Root $RelativePath
}

function New-Color([string]$Hex, [int]$Alpha = 255) {
  $value = $Hex.TrimStart('#')
  return [System.Drawing.Color]::FromArgb(
    $Alpha,
    [Convert]::ToInt32($value.Substring(0, 2), 16),
    [Convert]::ToInt32($value.Substring(2, 2), 16),
    [Convert]::ToInt32($value.Substring(4, 2), 16)
  )
}

function New-Rect([int]$X, [int]$Y, [int]$W, [int]$H) {
  return [System.Drawing.Rectangle]::new($X, $Y, $W, $H)
}

function New-RoundPath([System.Drawing.Rectangle]$Rect, [int]$Radius) {
  $path = [System.Drawing.Drawing2D.GraphicsPath]::new()
  $diameter = $Radius * 2
  $path.AddArc($Rect.X, $Rect.Y, $diameter, $diameter, 180, 90)
  $path.AddArc($Rect.Right - $diameter, $Rect.Y, $diameter, $diameter, 270, 90)
  $path.AddArc($Rect.Right - $diameter, $Rect.Bottom - $diameter, $diameter, $diameter, 0, 90)
  $path.AddArc($Rect.X, $Rect.Bottom - $diameter, $diameter, $diameter, 90, 90)
  $path.CloseFigure()
  return $path
}

function Fill-Gradient([System.Drawing.Graphics]$Graphics, [System.Drawing.Rectangle]$Rect, [string]$Top, [string]$Bottom) {
  $brush = [System.Drawing.Drawing2D.LinearGradientBrush]::new(
    $Rect,
    (New-Color $Top),
    (New-Color $Bottom),
    [System.Drawing.Drawing2D.LinearGradientMode]::Vertical
  )
  $Graphics.FillRectangle($brush, $Rect)
  $brush.Dispose()
}

function New-EnhancedImageAttributes {
  $matrix = [System.Drawing.Imaging.ColorMatrix]::new()
  $matrix.Matrix00 = 1.08
  $matrix.Matrix11 = 1.08
  $matrix.Matrix22 = 1.06
  $matrix.Matrix33 = 1
  $matrix.Matrix44 = 1
  $matrix.Matrix40 = 0.018
  $matrix.Matrix41 = 0.018
  $matrix.Matrix42 = 0.014

  $attrs = [System.Drawing.Imaging.ImageAttributes]::new()
  $attrs.SetColorMatrix($matrix, [System.Drawing.Imaging.ColorMatrixFlag]::Default, [System.Drawing.Imaging.ColorAdjustType]::Bitmap)
  return $attrs
}

function Draw-CoverImage([System.Drawing.Graphics]$Graphics, [string]$Path, [System.Drawing.Rectangle]$Dest) {
  $img = [System.Drawing.Image]::FromFile($Path)
  $attrs = New-EnhancedImageAttributes
  try {
    $destRatio = $Dest.Width / $Dest.Height
    $srcRatio = $img.Width / $img.Height

    if ($srcRatio -gt $destRatio) {
      $cropHeight = $img.Height
      $cropWidth = [int][Math]::Round($cropHeight * $destRatio)
      $cropX = [int][Math]::Round(($img.Width - $cropWidth) / 2)
      $cropY = 0
    } else {
      $cropWidth = $img.Width
      $cropHeight = [int][Math]::Round($cropWidth / $destRatio)
      $cropX = 0
      $cropY = [int][Math]::Round(($img.Height - $cropHeight) / 2)
    }

    $src = New-Rect $cropX $cropY $cropWidth $cropHeight
    $Graphics.DrawImage($img, $Dest, $src.X, $src.Y, $src.Width, $src.Height, [System.Drawing.GraphicsUnit]::Pixel, $attrs)
  } finally {
    $attrs.Dispose()
    $img.Dispose()
  }
}

function Draw-ImageSource([System.Drawing.Graphics]$Graphics, [string]$Path, [System.Drawing.Rectangle]$Source, [System.Drawing.Rectangle]$Dest) {
  $img = [System.Drawing.Image]::FromFile($Path)
  $attrs = New-EnhancedImageAttributes
  try {
    $Graphics.DrawImage($img, $Dest, $Source.X, $Source.Y, $Source.Width, $Source.Height, [System.Drawing.GraphicsUnit]::Pixel, $attrs)
  } finally {
    $attrs.Dispose()
    $img.Dispose()
  }
}

function Draw-ImageFit([System.Drawing.Graphics]$Graphics, [string]$Path, [System.Drawing.Rectangle]$Bounds) {
  $img = [System.Drawing.Image]::FromFile($Path)
  $attrs = New-EnhancedImageAttributes
  try {
    $scale = [Math]::Min($Bounds.Width / $img.Width, $Bounds.Height / $img.Height)
    $w = [int][Math]::Round($img.Width * $scale)
    $h = [int][Math]::Round($img.Height * $scale)
    $x = $Bounds.X + [int][Math]::Round(($Bounds.Width - $w) / 2)
    $y = $Bounds.Y + [int][Math]::Round(($Bounds.Height - $h) / 2)
    $Graphics.DrawImage($img, (New-Rect $x $y $w $h), 0, 0, $img.Width, $img.Height, [System.Drawing.GraphicsUnit]::Pixel, $attrs)
  } finally {
    $attrs.Dispose()
    $img.Dispose()
  }
}

function Draw-Overlay([System.Drawing.Graphics]$Graphics, [int]$Alpha = 40) {
  $brush = [System.Drawing.SolidBrush]::new((New-Color '#000000' $Alpha))
  $Graphics.FillRectangle($brush, (New-Rect 0 0 $CardWidth $ArtHeight))
  $brush.Dispose()
}

function Draw-SteelBars([System.Drawing.Graphics]$Graphics, [int]$OffsetY = 0, [int]$Alpha = 255) {
  for ($i = -1; $i -lt 5; $i++) {
    $pen = [System.Drawing.Pen]::new((New-Color '#cfd5d9' $Alpha), 24)
    $pen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
    $pen.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
    $x1 = 20 + ($i * 95)
    $Graphics.DrawLine($pen, $x1, 40 + $OffsetY, $x1 + 190, 395 + $OffsetY)
    $pen.Dispose()

    $darkPen = [System.Drawing.Pen]::new((New-Color '#6d747b' ([Math]::Min($Alpha, 180))), 3)
    for ($j = 0; $j -lt 9; $j++) {
      $x = $x1 + ($j * 19)
      $Graphics.DrawLine($darkPen, $x, 65 + ($j * 35) + $OffsetY, $x + 32, 124 + ($j * 35) + $OffsetY)
    }
    $darkPen.Dispose()
  }
}

function Draw-Plant([System.Drawing.Graphics]$Graphics, [int]$X, [int]$Y, [double]$Scale = 1.0) {
  $stemPen = [System.Drawing.Pen]::new((New-Color '#2d7948'), [float](5 * $Scale))
  $Graphics.DrawLine($stemPen, $X, $Y + [int](70 * $Scale), $X, $Y)
  $Graphics.DrawLine($stemPen, $X, $Y + [int](32 * $Scale), $X - [int](38 * $Scale), $Y + [int](10 * $Scale))
  $Graphics.DrawLine($stemPen, $X, $Y + [int](45 * $Scale), $X + [int](42 * $Scale), $Y + [int](18 * $Scale))
  $stemPen.Dispose()

  $leafBrush = [System.Drawing.SolidBrush]::new((New-Color '#4aad62'))
  $Graphics.FillEllipse($leafBrush, (New-Rect ($X - [int](76 * $Scale)) ($Y - [int](8 * $Scale)) ([int](54 * $Scale)) ([int](32 * $Scale))))
  $Graphics.FillEllipse($leafBrush, (New-Rect ($X + [int](19 * $Scale)) ($Y + [int](2 * $Scale)) ([int](58 * $Scale)) ([int](34 * $Scale))))
  $Graphics.FillEllipse($leafBrush, (New-Rect ($X - [int](22 * $Scale)) ($Y - [int](26 * $Scale)) ([int](44 * $Scale)) ([int](44 * $Scale))))
  $leafBrush.Dispose()
}

function Draw-Avatar([System.Drawing.Graphics]$Graphics, [int]$X, [int]$Y, [string]$Shirt, [int]$Size = 54) {
  $skin = [System.Drawing.SolidBrush]::new((New-Color '#f5b37a'))
  $shirtBrush = [System.Drawing.SolidBrush]::new((New-Color $Shirt))
  $hair = [System.Drawing.SolidBrush]::new((New-Color '#2e2a26'))
  $Graphics.FillEllipse($skin, (New-Rect ($X - [int]($Size * 0.28)) $Y ([int]($Size * 0.56)) ([int]($Size * 0.56))))
  $Graphics.FillPie($hair, (New-Rect ($X - [int]($Size * 0.3)) ($Y - 3) ([int]($Size * 0.6)) ([int]($Size * 0.36))), 180, 180)
  $body = New-RoundPath (New-Rect ($X - [int]($Size * 0.45)) ($Y + [int]($Size * 0.48)) ([int]($Size * 0.9)) ([int]($Size * 0.7))) 18
  $Graphics.FillPath($shirtBrush, $body)
  $body.Dispose()
  $skin.Dispose()
  $shirtBrush.Dispose()
  $hair.Dispose()
}

function Draw-Building([System.Drawing.Graphics]$Graphics, [int]$X, [int]$Y, [int]$W, [int]$H, [string]$Color) {
  $brush = [System.Drawing.SolidBrush]::new((New-Color $Color))
  $Graphics.FillRectangle($brush, (New-Rect $X $Y $W $H))
  $brush.Dispose()

  $windowBrush = [System.Drawing.SolidBrush]::new((New-Color '#e9c76d'))
  for ($row = 0; $row -lt 5; $row++) {
    for ($col = 0; $col -lt 2; $col++) {
      $Graphics.FillRectangle($windowBrush, (New-Rect ($X + 12 + ($col * 26)) ($Y + 16 + ($row * 28)) 13 13))
    }
  }
  $windowBrush.Dispose()
}

function Draw-PlayBadge([System.Drawing.Graphics]$Graphics, [int]$X, [int]$Y, [int]$Size) {
  $circle = [System.Drawing.SolidBrush]::new((New-Color '#f0c65f' 225))
  $Graphics.FillEllipse($circle, (New-Rect $X $Y $Size $Size))
  $circle.Dispose()

  $tri = [System.Drawing.Drawing2D.GraphicsPath]::new()
  $tri.AddPolygon([System.Drawing.Point[]]@(
    [System.Drawing.Point]::new($X + [int]($Size * 0.42), $Y + [int]($Size * 0.30)),
    [System.Drawing.Point]::new($X + [int]($Size * 0.42), $Y + [int]($Size * 0.70)),
    [System.Drawing.Point]::new($X + [int]($Size * 0.72), $Y + [int]($Size * 0.50))
  ))
  $brush = [System.Drawing.SolidBrush]::new((New-Color '#1b1712'))
  $Graphics.FillPath($brush, $tri)
  $brush.Dispose()
  $tri.Dispose()
}

function Draw-Label([System.Drawing.Graphics]$Graphics, [string]$Label) {
  $rect = New-Rect 0 $LabelTop $CardWidth $LabelHeight
  $brush = [System.Drawing.Drawing2D.LinearGradientBrush]::new(
    $rect,
    (New-Color '#dfad50'),
    (New-Color '#81500f'),
    [System.Drawing.Drawing2D.LinearGradientMode]::Vertical
  )
  $blend = [System.Drawing.Drawing2D.ColorBlend]::new()
  $blend.Positions = [float[]]@(0.0, 0.2, 0.62, 1.0)
  $blend.Colors = [System.Drawing.Color[]]@(
    (New-Color '#e9bd5c'),
    (New-Color '#c98c2f'),
    (New-Color '#9b651c'),
    (New-Color '#5f3108')
  )
  $brush.InterpolationColors = $blend
  $Graphics.FillRectangle($brush, $rect)
  $brush.Dispose()

  $format = [System.Drawing.StringFormat]::new()
  $format.Alignment = [System.Drawing.StringAlignment]::Center
  $format.LineAlignment = [System.Drawing.StringAlignment]::Center
  $format.Trimming = [System.Drawing.StringTrimming]::None
  $format.FormatFlags = [System.Drawing.StringFormatFlags]::NoWrap

  $text = $Label
  if ($Label -eq 'GROUP OF COMPANIES') { $text = "GROUP OF`nCOMPANIES" }
  if ($Label -eq 'CUSTOMER TESTIMONY') { $text = "CUSTOMER`nTESTIMONY" }
  if ($Label -eq 'DEFAULT PAGE') { $text = "DEFAULT`nPAGE" }
  if ($Label -eq 'SRMB WE CARE') { $text = "SRMB WE`nCARE" }
  if ($Label -eq 'GAME CORNER') { $text = "GAME`nCORNER" }
  if ($Label -eq 'MEDIA CORNER') { $text = "MEDIA`nCORNER" }

  $box = [System.Drawing.RectangleF]::new(10, ($LabelTop + 18), ($CardWidth - 20), ($LabelHeight - 36))
  $font = [System.Drawing.Font]::new('Georgia', 26, [System.Drawing.FontStyle]::Bold)

  $textBrush = [System.Drawing.SolidBrush]::new((New-Color '#1b1107'))
  $Graphics.DrawString($text, $font, $textBrush, $box, $format)
  $textBrush.Dispose()
  $font.Dispose()
  $format.Dispose()
}

function Draw-CustomerTestimony([System.Drawing.Graphics]$Graphics) {
  Fill-Gradient $Graphics (New-Rect 0 0 $CardWidth $ArtHeight) '#eef3f7' '#d7e1eb'
  Draw-SteelBars $Graphics 100 70

  $panelBrush = [System.Drawing.SolidBrush]::new((New-Color '#ffffff' 235))
  $quotePen = [System.Drawing.Pen]::new((New-Color '#d49a32'), 4)
  $panel = New-RoundPath (New-Rect 38 54 324 206) 18
  $Graphics.FillPath($panelBrush, $panel)
  $Graphics.DrawPath($quotePen, $panel)
  $panel.Dispose()
  $panelBrush.Dispose()
  $quotePen.Dispose()

  $quoteBrush = [System.Drawing.SolidBrush]::new((New-Color '#d49a32'))
  $font = [System.Drawing.Font]::new('Georgia', 92, [System.Drawing.FontStyle]::Bold)
  $Graphics.DrawString('"', $font, $quoteBrush, 58, 50)
  $Graphics.DrawString('"', $font, $quoteBrush, 282, 138)
  $font.Dispose()
  $quoteBrush.Dispose()

  Draw-Avatar $Graphics 120 278 '#274b7d' 70
  Draw-Avatar $Graphics 205 260 '#b4813b' 82
  Draw-Avatar $Graphics 288 278 '#2f6a4f' 70

  $linePen = [System.Drawing.Pen]::new((New-Color '#2f3d4c'), 8)
  $linePen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
  $linePen.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
  $Graphics.DrawLine($linePen, 82, 222, 252, 222)
  $Graphics.DrawLine($linePen, 82, 246, 302, 246)
  $linePen.Dispose()
}

function Draw-Sustainability([System.Drawing.Graphics]$Graphics) {
  $artPath = Resolve-Asset 'assets\cardImage\reference\sustainability-art.png'
  if (Test-Path $artPath) {
    Draw-CoverImage $Graphics $artPath (New-Rect 0 0 $CardWidth $ArtHeight)
    return
  }

  Fill-Gradient $Graphics (New-Rect 0 0 $CardWidth $ArtHeight) '#bde9d0' '#eaf5df'
  $sky = [System.Drawing.SolidBrush]::new((New-Color '#dff7ff' 170))
  $Graphics.FillEllipse($sky, (New-Rect -130 -80 660 260))
  $sky.Dispose()

  $hillBrush = [System.Drawing.SolidBrush]::new((New-Color '#78ba70'))
  $Graphics.FillPie($hillBrush, (New-Rect -80 242 560 230), 180, 180)
  $hillBrush.Dispose()

  $panelBrush = [System.Drawing.SolidBrush]::new((New-Color '#244e65'))
  $panelPen = [System.Drawing.Pen]::new((New-Color '#f0c65f'), 2)
  for ($i = 0; $i -lt 3; $i++) {
    $x = 46 + ($i * 104)
    $Graphics.FillRectangle($panelBrush, (New-Rect $x 244 82 56))
    $Graphics.DrawRectangle($panelPen, (New-Rect $x 244 82 56))
    $Graphics.DrawLine($panelPen, $x + 27, 244, $x + 27, 300)
    $Graphics.DrawLine($panelPen, $x + 55, 244, $x + 55, 300)
    $Graphics.DrawLine($panelPen, $x, 272, $x + 82, 272)
  }
  $panelBrush.Dispose()
  $panelPen.Dispose()

  Draw-Plant $Graphics 200 190 1.55

  $factoryBrush = [System.Drawing.SolidBrush]::new((New-Color '#44505b'))
  $Graphics.FillRectangle($factoryBrush, (New-Rect 48 324 112 68))
  $Graphics.FillRectangle($factoryBrush, (New-Rect 250 314 112 78))
  $Graphics.FillRectangle($factoryBrush, (New-Rect 66 260 26 132))
  $Graphics.FillRectangle($factoryBrush, (New-Rect 300 246 24 146))
  $factoryBrush.Dispose()

  $sun = [System.Drawing.SolidBrush]::new((New-Color '#f0c65f' 230))
  $Graphics.FillEllipse($sun, (New-Rect 292 48 70 70))
  $sun.Dispose()
}

function Draw-Csr([System.Drawing.Graphics]$Graphics) {
  Fill-Gradient $Graphics (New-Rect 0 0 $CardWidth $ArtHeight) '#f8efe3' '#dfead9'
  Draw-SteelBars $Graphics 160 55

  $heart = [System.Drawing.Drawing2D.GraphicsPath]::new()
  $heart.AddBezier(200, 235, 120, 155, 54, 248, 200, 356)
  $heart.AddBezier(200, 356, 346, 248, 280, 155, 200, 235)
  $heart.CloseFigure()
  $heartBrush = [System.Drawing.SolidBrush]::new((New-Color '#cf423c'))
  $Graphics.FillPath($heartBrush, $heart)
  $heartBrush.Dispose()
  $heart.Dispose()

  $crossBrush = [System.Drawing.SolidBrush]::new((New-Color '#ffffff'))
  $Graphics.FillRectangle($crossBrush, (New-Rect 182 234 36 92))
  $Graphics.FillRectangle($crossBrush, (New-Rect 154 262 92 36))
  $crossBrush.Dispose()

  Draw-Avatar $Graphics 84 112 '#2f6a4f' 58
  Draw-Avatar $Graphics 314 112 '#274b7d' 58
  Draw-Avatar $Graphics 118 324 '#b4813b' 52
  Draw-Avatar $Graphics 282 324 '#2f6a4f' 52

  $handBrush = [System.Drawing.SolidBrush]::new((New-Color '#f2b982'))
  $Graphics.FillEllipse($handBrush, (New-Rect 73 244 108 36))
  $Graphics.FillEllipse($handBrush, (New-Rect 219 244 108 36))
  $handBrush.Dispose()
}

function Draw-GameCorner([System.Drawing.Graphics]$Graphics) {
  Fill-Gradient $Graphics (New-Rect 0 0 $CardWidth $ArtHeight) '#1d2435' '#0e121b'
  Draw-SteelBars $Graphics 120 100

  $controller = New-RoundPath (New-Rect 58 132 284 166) 52
  $body = [System.Drawing.SolidBrush]::new((New-Color '#f3f3ef'))
  $Graphics.FillPath($body, $controller)
  $body.Dispose()
  $border = [System.Drawing.Pen]::new((New-Color '#d49a32'), 5)
  $Graphics.DrawPath($border, $controller)
  $border.Dispose()
  $controller.Dispose()

  $dark = [System.Drawing.SolidBrush]::new((New-Color '#141820'))
  $Graphics.FillEllipse($dark, (New-Rect 102 190 24 24))
  $Graphics.FillEllipse($dark, (New-Rect 150 190 24 24))
  $Graphics.FillEllipse($dark, (New-Rect 126 166 24 24))
  $Graphics.FillEllipse($dark, (New-Rect 126 214 24 24))
  $Graphics.FillEllipse($dark, (New-Rect 258 176 24 24))
  $Graphics.FillEllipse($dark, (New-Rect 288 210 24 24))
  $dark.Dispose()

  $boltPen = [System.Drawing.Pen]::new((New-Color '#f0c65f'), 7)
  $Graphics.DrawLine($boltPen, 183, 224, 207, 172)
  $Graphics.DrawLine($boltPen, 207, 172, 196, 216)
  $Graphics.DrawLine($boltPen, 196, 216, 222, 162)
  $boltPen.Dispose()

  $ground = [System.Drawing.SolidBrush]::new((New-Color '#303949'))
  $Graphics.FillRectangle($ground, (New-Rect 0 342 $CardWidth 118))
  $ground.Dispose()
  Draw-Building $Graphics 72 292 68 126 '#455164'
  Draw-Building $Graphics 166 262 78 156 '#596574'
  Draw-Building $Graphics 272 306 60 112 '#455164'
}

function Draw-GroupCompanies([System.Drawing.Graphics]$Graphics) {
  Fill-Gradient $Graphics (New-Rect 0 0 $CardWidth $ArtHeight) '#ecf0f2' '#d6dde3'
  $networkPen = [System.Drawing.Pen]::new((New-Color '#c58d42'), 5)
  $networkPen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
  $networkPen.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
  $Graphics.DrawLine($networkPen, 114, 180, 200, 106)
  $Graphics.DrawLine($networkPen, 286, 180, 200, 106)
  $Graphics.DrawLine($networkPen, 114, 180, 286, 180)
  $Graphics.DrawLine($networkPen, 200, 106, 200, 252)
  $networkPen.Dispose()

  Draw-Building $Graphics 62 190 82 180 '#405064'
  Draw-Building $Graphics 158 126 86 244 '#263346'
  Draw-Building $Graphics 262 190 76 180 '#526171'

  $nodeBrush = [System.Drawing.SolidBrush]::new((New-Color '#f0c65f'))
  foreach ($p in @(@(114,180), @(200,106), @(286,180), @(200,252))) {
    $Graphics.FillEllipse($nodeBrush, (New-Rect ($p[0] - 10) ($p[1] - 10) 20 20))
  }
  $nodeBrush.Dispose()

  Draw-SteelBars $Graphics 292 48
}

function Draw-Feedback([System.Drawing.Graphics]$Graphics) {
  Fill-Gradient $Graphics (New-Rect 0 0 $CardWidth $ArtHeight) '#edf3f7' '#f7ead8'

  $form = New-RoundPath (New-Rect 58 56 284 280) 18
  $paper = [System.Drawing.SolidBrush]::new((New-Color '#ffffff'))
  $Graphics.FillPath($paper, $form)
  $paper.Dispose()
  $formPen = [System.Drawing.Pen]::new((New-Color '#d49a32'), 4)
  $Graphics.DrawPath($formPen, $form)
  $formPen.Dispose()
  $form.Dispose()

  $linePen = [System.Drawing.Pen]::new((New-Color '#aeb7c0'), 8)
  $linePen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
  $linePen.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
  foreach ($y in @(112, 152, 192)) {
    $Graphics.DrawLine($linePen, 104, $y, 292, $y)
  }
  $linePen.Dispose()

  $starBrush = [System.Drawing.SolidBrush]::new((New-Color '#f0c65f'))
  for ($i = 0; $i -lt 5; $i++) {
    Draw-Star $Graphics (88 + ($i * 46)) 250 18 $starBrush
  }
  $starBrush.Dispose()

  $faceBrush = [System.Drawing.SolidBrush]::new((New-Color '#f0c65f'))
  $Graphics.FillEllipse($faceBrush, (New-Rect 144 338 112 112))
  $faceBrush.Dispose()
  $eye = [System.Drawing.SolidBrush]::new((New-Color '#2a210f'))
  $Graphics.FillEllipse($eye, (New-Rect 174 376 13 13))
  $Graphics.FillEllipse($eye, (New-Rect 214 376 13 13))
  $eye.Dispose()
  $smilePen = [System.Drawing.Pen]::new((New-Color '#2a210f'), 5)
  $Graphics.DrawArc($smilePen, (New-Rect 173 386 56 38), 20, 140)
  $smilePen.Dispose()
}

function Draw-Star([System.Drawing.Graphics]$Graphics, [int]$CenterX, [int]$CenterY, [int]$Radius, [System.Drawing.Brush]$Brush) {
  $points = New-Object System.Collections.Generic.List[System.Drawing.Point]
  for ($i = 0; $i -lt 10; $i++) {
    $angle = -[Math]::PI / 2 + $i * [Math]::PI / 5
    $r = if ($i % 2 -eq 0) { $Radius } else { $Radius * 0.46 }
    $points.Add([System.Drawing.Point]::new(
      [int][Math]::Round($CenterX + [Math]::Cos($angle) * $r),
      [int][Math]::Round($CenterY + [Math]::Sin($angle) * $r)
    ))
  }
  $Graphics.FillPolygon($Brush, $points.ToArray())
}

function Draw-DefaultPage([System.Drawing.Graphics]$Graphics) {
  Draw-CoverImage $Graphics (Resolve-Asset 'srmb-home-1920.png') (New-Rect 0 0 $CardWidth $ArtHeight)
  Draw-Overlay $Graphics 18
  $logo = Resolve-Asset 'assets\applogo\download.jpg'
  $box = New-RoundPath (New-Rect 96 94 208 90) 10
  $white = [System.Drawing.SolidBrush]::new((New-Color '#ffffff' 230))
  $Graphics.FillPath($white, $box)
  $white.Dispose()
  $box.Dispose()
  Draw-ImageFit $Graphics $logo (New-Rect 116 112 168 54)
}

function Draw-Gallery([System.Drawing.Graphics]$Graphics) {
  Fill-Gradient $Graphics (New-Rect 0 0 $CardWidth $ArtHeight) '#1d2435' '#0f151f'
  $posters = @(
    'assets\gallery\posters\gallery-1.png',
    'assets\gallery\posters\gallery-2.png',
    'assets\gallery\posters\gallery-3.png',
    'assets\gallery\posters\gallery-4.png'
  )
  $rects = @(
    (New-Rect 28 42 160 112),
    (New-Rect 212 42 160 112),
    (New-Rect 28 188 160 112),
    (New-Rect 212 188 160 112)
  )
  for ($i = 0; $i -lt 4; $i++) {
    Draw-CoverImage $Graphics (Resolve-Asset $posters[$i]) $rects[$i]
    $pen = [System.Drawing.Pen]::new((New-Color '#f0c65f'), 3)
    $Graphics.DrawRectangle($pen, $rects[$i])
    $pen.Dispose()
    Draw-PlayBadge $Graphics ($rects[$i].X + 56) ($rects[$i].Y + 34) 48
  }
  $filmPen = [System.Drawing.Pen]::new((New-Color '#f0c65f'), 10)
  $filmPen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
  $filmPen.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
  $Graphics.DrawLine($filmPen, 74, 360, 326, 360)
  $Graphics.DrawLine($filmPen, 112, 395, 288, 395)
  $filmPen.Dispose()
}

function Draw-CertificateArt([System.Drawing.Graphics]$Graphics) {
  Fill-Gradient $Graphics (New-Rect 0 0 $CardWidth $ArtHeight) '#f6f1dc' '#e8ddad'
  Draw-ImageFit $Graphics (Resolve-Asset 'assets\Certificate\ic_certificate_bis_1786_frame.png') (New-Rect 70 36 260 344)
  $sealBrush = [System.Drawing.SolidBrush]::new((New-Color '#b92e2d'))
  $Graphics.FillEllipse($sealBrush, (New-Rect 172 330 56 56))
  $sealBrush.Dispose()
  Draw-SteelBars $Graphics 370 42
}

function Draw-AwardsArt([System.Drawing.Graphics]$Graphics) {
  Fill-Gradient $Graphics (New-Rect 0 0 $CardWidth $ArtHeight) '#fff5c8' '#ded18f'
  Draw-ImageFit $Graphics (Resolve-Asset 'assets\Awards\awd1_frame.png') (New-Rect 74 32 252 322)
  $trophyBrush = [System.Drawing.SolidBrush]::new((New-Color '#d49a32'))
  $Graphics.FillRectangle($trophyBrush, (New-Rect 178 356 44 38))
  $Graphics.FillRectangle($trophyBrush, (New-Rect 150 394 100 18))
  $Graphics.FillEllipse($trophyBrush, (New-Rect 142 308 116 64))
  $trophyBrush.Dispose()
}

function Draw-Card([string]$FileName, [string]$Label, [scriptblock]$Art) {
  $bitmap = [System.Drawing.Bitmap]::new($CardWidth, $CardHeight, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
  $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
  try {
    $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $graphics.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit

    $customArt = Join-Path $Root (Join-Path 'assets\cardImage\reference\custom-card-art' $FileName)
    if (Test-Path $customArt) {
      Draw-CoverImage $graphics $customArt (New-Rect 0 0 $CardWidth $ArtHeight)
    } else {
      & $Art $graphics
    }
    Draw-Label $graphics $Label

    $borderPen = [System.Drawing.Pen]::new((New-Color '#251b10'), 2)
    $graphics.DrawRectangle($borderPen, (New-Rect 0 0 ($CardWidth - 1) ($CardHeight - 1)))
    $borderPen.Dispose()

    $path = Join-Path $OutDir $FileName
    $bitmap.Save($path, [System.Drawing.Imaging.ImageFormat]::Png)
  } finally {
    $graphics.Dispose()
    $bitmap.Dispose()
  }
}

Draw-Card 'default-page.png' 'DEFAULT PAGE' { param($g) Draw-DefaultPage $g }
Draw-Card 'about-us.png' 'ABOUT US' { param($g) Draw-ImageSource $g (Resolve-Asset 'assets\cardImage\reference\about-us-style.png') (New-Rect 0 0 400 430) (New-Rect 0 0 $CardWidth $ArtHeight) }
Draw-Card 'infrastructure.png' 'INFRASTRUCTURE' { param($g) Draw-ImageSource $g (Resolve-Asset 'assets\cardImage\2 INFRA.png') (New-Rect 0 0 400 460) (New-Rect 0 0 $CardWidth $ArtHeight) }
Draw-Card 'media-corner.png' 'MEDIA CORNER' { param($g) Draw-ImageSource $g (Resolve-Asset 'assets\cardImage\1 ABOUT US.png') (New-Rect 0 0 400 460) (New-Rect 0 0 $CardWidth $ArtHeight) }
Draw-Card 'customer-testimony.png' 'CUSTOMER TESTIMONY' { param($g) Draw-CustomerTestimony $g }
Draw-Card 'products.png' 'PRODUCTS' { param($g) Draw-ImageSource $g (Resolve-Asset 'assets\cardImage\3 products.png') (New-Rect 0 0 400 460) (New-Rect 0 0 $CardWidth $ArtHeight) }
Draw-Card 'projects.png' 'PROJECTS' { param($g) Draw-ImageSource $g (Resolve-Asset 'assets\cardImage\4 OurProduct.png') (New-Rect 0 0 400 460) (New-Rect 0 0 $CardWidth $ArtHeight) }
Draw-Card 'certificates.png' 'CERTIFICATES' { param($g) Draw-CertificateArt $g }
Draw-Card 'sustainability.png' 'SUSTAINABILITY' { param($g) Draw-Sustainability $g }
Draw-Card 'csr.png' 'SRMB WE CARE' { param($g) Draw-Csr $g }
Draw-Card 'awards.png' 'AWARDS' { param($g) Draw-AwardsArt $g }
Draw-Card 'gallery.png' 'GALLERY' { param($g) Draw-Gallery $g }
Draw-Card 'game-corner.png' 'GAME CORNER' { param($g) Draw-GameCorner $g }
Draw-Card 'group-companies.png' 'GROUP OF COMPANIES' { param($g) Draw-GroupCompanies $g }
Draw-Card 'feedback.png' 'FEEDBACK' { param($g) Draw-Feedback $g }

Write-Host "Generated 15 offline card images in $OutDir"
