# =====================================================================
#  Erhartova cukrarna - priprava malych nahledu + EXIF metadat
#  ZDROJ JE POUZE CTEN. Nic se v Dropboxu nemeni.
#  Vystup: podslozka "male" + soubor "meta.csv" v teto slozce.
#
#  Spusteni: pravy klik na soubor -> "Run with PowerShell"
#            nebo v PowerShellu:  .\1-priprav-male.ps1
# =====================================================================

$Zdroj    = "C:\Users\proch\Dropbox\Camera Uploads (1)"
$Vystup   = "C:\Users\proch\Claude\AIsefova\fotky"
$Male     = Join-Path $Vystup "male"
$OdDatumu = Get-Date "2026-01-31"
$MaxHrana = 1200      # delsi strana vysledku v px
$Kvalita  = 80        # JPEG kvalita

Add-Type -AssemblyName System.Drawing

if (-not (Test-Path $Male)) { New-Item -ItemType Directory -Path $Male | Out-Null }

# --- pomocne funkce pro EXIF ---------------------------------------
function Get-ExifString {
    param($img, [int]$id)
    try {
        if ($img.PropertyIdList -notcontains $id) { return "" }
        $p = $img.GetPropertyItem($id)
        return ([System.Text.Encoding]::ASCII.GetString($p.Value)).Trim([char]0).Trim()
    } catch { return "" }
}

function Get-ExifRationalTriple {
    param($img, [int]$id)
    try {
        if ($img.PropertyIdList -notcontains $id) { return $null }
        $p = $img.GetPropertyItem($id)
        if ($p.Value.Length -lt 24) { return $null }
        $vals = @()
        for ($i = 0; $i -lt 3; $i++) {
            $num = [System.BitConverter]::ToUInt32($p.Value, $i * 8)
            $den = [System.BitConverter]::ToUInt32($p.Value, $i * 8 + 4)
            if ($den -eq 0) { $vals += 0 } else { $vals += ($num / $den) }
        }
        return $vals
    } catch { return $null }
}

function Get-ExifInt {
    param($img, [int]$id)
    try {
        if ($img.PropertyIdList -notcontains $id) { return 0 }
        $p = $img.GetPropertyItem($id)
        if ($p.Value.Length -ge 2) { return [System.BitConverter]::ToUInt16($p.Value, 0) }
        return 0
    } catch { return 0 }
}

# --- JPEG encoder s nastavitelnou kvalitou -------------------------
$jpegCodec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() |
             Where-Object { $_.MimeType -eq "image/jpeg" }
$encParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
$encParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter(
                          [System.Drawing.Imaging.Encoder]::Quality, [int]$Kvalita)

# --- sber souboru --------------------------------------------------
$vsechny = Get-ChildItem -LiteralPath $Zdroj -File
$jpegy   = $vsechny | Where-Object { $_.Extension -match '^\.(jpg|jpeg)$' }
$rawy    = $vsechny | Where-Object { $_.Extension -match '^\.(nef)$' }

Write-Host "Ve zdroji celkem: $($vsechny.Count) souboru ($($jpegy.Count) JPEG, $($rawy.Count) NEF)"

$vysledky = @()
$preskoceno = 0

foreach ($f in $jpegy) {
    $stream = $null; $img = $null
    try {
        $stream = [System.IO.File]::Open($f.FullName, 'Open', 'Read', 'ReadWrite')
        $img    = [System.Drawing.Image]::FromStream($stream, $false, $false)

        $dtoRaw = Get-ExifString $img 36867          # DateTimeOriginal
        $dto    = $null
        if ($dtoRaw -ne "") {
            try { $dto = [datetime]::ParseExact($dtoRaw, "yyyy:MM:dd HH:mm:ss", $null) } catch { }
        }
        # fallback: datum z nazvu souboru, pak cas zmeny
        if (-not $dto) {
            if ($f.BaseName -match '^(\d{4})-(\d{2})-(\d{2}) (\d{2})\.(\d{2})\.(\d{2})') {
                $dto = Get-Date -Year $Matches[1] -Month $Matches[2] -Day $Matches[3] `
                                -Hour $Matches[4] -Minute $Matches[5] -Second $Matches[6]
            } else { $dto = $f.LastWriteTime }
        }

        if ($dto -lt $OdDatumu) { $preskoceno++; continue }

        $make  = Get-ExifString $img 271
        $model = Get-ExifString $img 272
        $orient = Get-ExifInt $img 274

        $lat = ""; $lon = ""
        $latT = Get-ExifRationalTriple $img 2
        $lonT = Get-ExifRationalTriple $img 4
        if ($latT -and $lonT) {
            $latRef = Get-ExifString $img 1
            $lonRef = Get-ExifString $img 3
            $latD = $latT[0] + $latT[1]/60 + $latT[2]/3600
            $lonD = $lonT[0] + $lonT[1]/60 + $lonT[2]/3600
            if ($latRef -eq "S") { $latD = -$latD }
            if ($lonRef -eq "W") { $lonD = -$lonD }
            $lat = [math]::Round($latD, 6)
            $lon = [math]::Round($lonD, 6)
        }

        $wOrig = $img.Width; $hOrig = $img.Height

        # --- zmenseni -------------------------------------------------
        $scale = [math]::Min($MaxHrana / $wOrig, $MaxHrana / $hOrig)
        if ($scale -gt 1) { $scale = 1 }
        $wNew = [int][math]::Round($wOrig * $scale)
        $hNew = [int][math]::Round($hOrig * $scale)

        $bmp = New-Object System.Drawing.Bitmap($wNew, $hNew)
        $g   = [System.Drawing.Graphics]::FromImage($bmp)
        $g.InterpolationMode  = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
        $g.PixelOffsetMode    = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
        $g.SmoothingMode      = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
        $g.DrawImage($img, 0, 0, $wNew, $hNew)
        $g.Dispose()

        # srovnani podle EXIF orientace
        switch ($orient) {
            3 { $bmp.RotateFlip([System.Drawing.RotateFlipType]::Rotate180FlipNone) }
            6 { $bmp.RotateFlip([System.Drawing.RotateFlipType]::Rotate90FlipNone) }
            8 { $bmp.RotateFlip([System.Drawing.RotateFlipType]::Rotate270FlipNone) }
        }

        $cil = Join-Path $Male ($f.BaseName + ".jpg")
        $bmp.Save($cil, $jpegCodec, $encParams)
        $bmp.Dispose()

        $vysledky += [pscustomobject]@{
            soubor       = $f.Name
            maly_soubor  = (Split-Path $cil -Leaf)
            cas_foceni   = $dto.ToString("yyyy-MM-dd HH:mm:ss")
            zdroj_casu   = if ($dtoRaw -ne "") { "EXIF" } else { "nazev/mtime" }
            vyrobce      = $make
            model        = $model
            gps_lat      = $lat
            gps_lon      = $lon
            px_sirka     = $wOrig
            px_vyska     = $hOrig
            bajtu_orig   = $f.Length
            bajtu_maly   = (Get-Item -LiteralPath $cil).Length
        }
    }
    catch {
        Write-Warning "CHYBA u $($f.Name): $($_.Exception.Message)"
    }
    finally {
        if ($img)    { $img.Dispose() }
        if ($stream) { $stream.Dispose() }
    }
}

# --- RAW soubory bez JPEG dvojnika ---------------------------------
$jmenaJpg = $jpegy | ForEach-Object { $_.BaseName }
$rawBezJpg = $rawy | Where-Object { $jmenaJpg -notcontains $_.BaseName }
if ($rawBezJpg) {
    Write-Host ""
    Write-Host "RAW bez JPEG dvojnika (nezpracovano, nutny export z Lightroomu):"
    $rawBezJpg | ForEach-Object { Write-Host "   $($_.Name)" }
    $rawBezJpg | ForEach-Object { $_.Name } |
        Set-Content -LiteralPath (Join-Path $Vystup "raw-bez-jpg.txt") -Encoding UTF8
}

$vysledky | Sort-Object cas_foceni |
    Export-Csv -LiteralPath (Join-Path $Vystup "meta.csv") -NoTypeInformation -Encoding UTF8

Write-Host ""
Write-Host "HOTOVO."
Write-Host "  zpracovano:  $($vysledky.Count) fotek"
Write-Host "  preskoceno:  $preskoceno (starsi nez $($OdDatumu.ToString('d.M.yyyy')))"
Write-Host "  nahledy:     $Male"
Write-Host "  metadata:    $(Join-Path $Vystup 'meta.csv')"
$gps = ($vysledky | Where-Object { $_.gps_lat -ne "" }).Count
Write-Host "  s GPS:       $gps z $($vysledky.Count)"
