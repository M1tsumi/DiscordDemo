# PowerShell script to fix all broken import statements
# This script will systematically fix all the broken imports

Write-Host "Fixing all broken import statements in TypeScript files..."

# Get all TypeScript files in the src directory
$tsFiles = Get-ChildItem -Path "src" -Filter "*.ts" -Recurse

$totalFiles = 0
$modifiedFiles = 0

foreach ($file in $tsFiles) {
    $totalFiles++
    $content = Get-Content $file.FullName -Raw
    $originalContent = $content
    
    # Fix all the broken imports systematically
    
    # Fix types/Command imports (most common)
    $content = $content -replace "from ['`"]\.js['`"]", "from '../../types/Command.js'"
    
    # Fix specific service imports
    $content = $content -replace "import \{ RPGService \} from '\.js';", "import { RPGService } from '../../services/rpgService.js';"
    
    # Fix index imports
    $content = $content -replace "import \{ ([^}]+) \} from '\.\./\.\./index';", "import { `$1 } from '../../index.js';"
    $content = $content -replace "import \{ ([^}]+) \} from '\.\./index';", "import { `$1 } from '../index.js';"
    
    # Fix service imports
    $content = $content -replace "import \{ ([^}]+) \} from '\.\./\.\./services/([^']+)';", "import { `$1 } from '../../services/`$2.js';"
    $content = $content -replace "import \{ ([^}]+) \} from '\.\./services/([^']+)';", "import { `$1 } from '../services/`$2.js';"
    
    # Fix utils imports
    $content = $content -replace "import \{ ([^}]+) \} from '\.\./\.\./utils/([^']+)';", "import { `$1 } from '../../utils/`$2.js';"
    $content = $content -replace "import \{ ([^}]+) \} from '\.\./utils/([^']+)';", "import { `$1 } from '../utils/`$2.js';"
    
    if ($content -ne $originalContent) {
        Set-Content -Path $file.FullName -Value $content -NoNewline
        $modifiedFiles++
        Write-Host "Fixed imports in: $($file.FullName)"
    }
}

Write-Host "Completed! Modified $modifiedFiles out of $totalFiles files." 