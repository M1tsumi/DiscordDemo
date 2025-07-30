# PowerShell script to fix Command interface imports
# This removes the Command interface imports since interfaces don't exist in JavaScript

Write-Host "Fixing Command interface imports..." -ForegroundColor Yellow

# Get all TypeScript files in the commands directory
$files = Get-ChildItem -Path "src/commands" -Recurse -Filter "*.ts"

$fixedCount = 0

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    $originalContent = $content
    
    # Remove the Command interface import line
    $content = $content -replace "import \{ Command \} from '\.\./\.\./types/Command';`n", ""
    $content = $content -replace "import \{ Command \} from '\.\./\.\./types/Command';", ""
    
    # If content changed, write it back
    if ($content -ne $originalContent) {
        Set-Content -Path $file.FullName -Value $content
        Write-Host "Fixed: $($file.Name)" -ForegroundColor Green
        $fixedCount++
    }
}

Write-Host "Fixed $fixedCount files!" -ForegroundColor Green
Write-Host "Now run: npm run build" -ForegroundColor Cyan 