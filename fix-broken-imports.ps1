# PowerShell script to fix broken import statements
# This script will fix imports that were incorrectly replaced with just '.js'

Write-Host "Fixing broken import statements in TypeScript files..."

# Get all TypeScript files in the src directory
$tsFiles = Get-ChildItem -Path "src" -Filter "*.ts" -Recurse

$totalFiles = 0
$modifiedFiles = 0

foreach ($file in $tsFiles) {
    $totalFiles++
    $content = Get-Content $file.FullName -Raw
    $originalContent = $content
    
    # Fix broken imports that were replaced with just '.js'
    # Fix types/Command imports
    $content = $content -replace "from ['`"]\.js['`"]", "from '../../types/Command.js'"
    
    # Fix services imports
    $content = $content -replace "from ['`"]\.js['`"]", "from '../../services/rpgService.js'"
    
    # Fix index imports
    $content = $content -replace "from ['`"]\.js['`"]", "from '../../index.js'"
    
    # Fix utils imports
    $content = $content -replace "from ['`"]\.js['`"]", "from '../../utils/playDLInit.js'"
    
    if ($content -ne $originalContent) {
        Set-Content -Path $file.FullName -Value $content -NoNewline
        $modifiedFiles++
        Write-Host "Fixed imports in: $($file.FullName)"
    }
}

Write-Host "Completed! Modified $modifiedFiles out of $totalFiles files." 