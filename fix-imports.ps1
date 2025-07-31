# PowerShell script to fix import statements by adding .js extensions
# This script will find all TypeScript files and update relative import statements

Write-Host "Fixing import statements in TypeScript files..."

# Get all TypeScript files in the src directory
$tsFiles = Get-ChildItem -Path "src" -Filter "*.ts" -Recurse

$totalFiles = 0
$modifiedFiles = 0

foreach ($file in $tsFiles) {
    $totalFiles++
    $content = Get-Content $file.FullName -Raw
    $originalContent = $content
    
    # Fix specific import patterns with proper .js extensions
    # Fix types/Command imports
    $content = $content -replace "from ['`"]\.\./\.\./types/Command['`"]", "from '../../types/Command.js'"
    $content = $content -replace "from ['`"]\.\./types/Command['`"]", "from '../types/Command.js'"
    
    # Fix services imports
    $content = $content -replace "from ['`"]\.\./\.\./services/([^'`"]*)['`"]", "from '../../services/$1.js'"
    $content = $content -replace "from ['`"]\.\./services/([^'`"]*)['`"]", "from '../services/$1.js'"
    
    # Fix index imports
    $content = $content -replace "from ['`"]\.\./\.\./index['`"]", "from '../../index.js'"
    $content = $content -replace "from ['`"]\.\./index['`"]", "from '../index.js'"
    
    # Fix utils imports
    $content = $content -replace "from ['`"]\.\./\.\./utils/([^'`"]*)['`"]", "from '../../utils/$1.js'"
    $content = $content -replace "from ['`"]\.\./utils/([^'`"]*)['`"]", "from '../utils/$1.js'"
    
    # Fix any remaining relative imports that don't have .js extension
    $content = $content -replace "from ['`"](\.[^'`"]*?)(?<!\.js)['`"]", "from '$1.js'"
    
    if ($content -ne $originalContent) {
        Set-Content -Path $file.FullName -Value $content -NoNewline
        $modifiedFiles++
        Write-Host "Fixed imports in: $($file.FullName)"
    }
}

Write-Host "Completed! Modified $modifiedFiles out of $totalFiles files." 