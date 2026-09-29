# PowerShell script to automatically extract the best static PNG frame for GIFs
Add-Type -AssemblyName System.Drawing

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$projectRoot = Split-Path -Parent $scriptDir

# Check public/icons and public/logo-gif
$dirs = @(
    (Join-Path $projectRoot 'public\icons'),
    (Join-Path $projectRoot 'public\logo-gif')
)

$totalGifs = 0
$totalCount = 0

foreach ($dir in $dirs) {
    if (-not (Test-Path $dir)) {
        continue
    }

    Write-Host "Checking GIF icons in: $dir"
    $gifs = Get-ChildItem -Path $dir -Filter '*.gif'
    $totalGifs += $gifs.Count

    foreach ($g in $gifs) {
        $pngName = $g.BaseName + '-static.png'
        $pngPath = Join-Path $dir $pngName

        # Regenerate if file missing or if existing frame is blank (< 500 bytes)
        $needGenerate = -not (Test-Path $pngPath)
        if (-not $needGenerate) {
            $existing = Get-Item $pngPath
            if ($existing.Length -lt 500) {
                $needGenerate = $true
            }
        }

        if ($needGenerate) {
            try {
                $img = [System.Drawing.Image]::FromFile($g.FullName)
                $frameCount = $img.GetFrameCount([System.Drawing.Imaging.FrameDimension]::Time)

                # Test frame 0 size
                [void]$img.SelectActiveFrame([System.Drawing.Imaging.FrameDimension]::Time, 0)
                $ms = New-Object System.IO.MemoryStream
                $img.Save($ms, [System.Drawing.Imaging.ImageFormat]::Png)

                # If frame 0 is empty (< 500 bytes) and there are multiple frames, use last frame
                if ($ms.Length -lt 500 -and $frameCount -gt 1) {
                    [void]$img.SelectActiveFrame([System.Drawing.Imaging.FrameDimension]::Time, $frameCount - 1)
                }
                $ms.Dispose()

                $img.Save($pngPath, [System.Drawing.Imaging.ImageFormat]::Png)
                $img.Dispose()
                Write-Host "  [+] Generated static frame: $pngName"
                $totalCount++
            } catch {
                Write-Host "  [-] Failed to process $($g.Name): $_"
            }
        } else {
            Write-Host "  [=] Static frame exists: $pngName"
        }
    }
}

Write-Host "Done! Processed $totalGifs GIF(s), generated $totalCount new static frame(s)."
