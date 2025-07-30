# Fix import statements in TypeScript files to use .js extensions for ES modules
$files = Get-ChildItem -Path "src" -Recurse -Filter "*.ts"

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    
    # Fix import statements that reference .ts files to .js files (ES module standard)
    $content = $content -replace "from '\.\./\.\./types/Command\.ts'", "from '../../types/Command.js'"
    $content = $content -replace "from '\.\./types/Command\.ts'", "from '../types/Command.js'"
    $content = $content -replace "from '\./types/Command\.ts'", "from './types/Command.js'"
    
    # Fix service imports
    $content = $content -replace "from '\.\./\.\./services/([^']+)\.ts'", "from '../../services/`$1.js'"
    $content = $content -replace "from '\.\./services/([^']+)\.ts'", "from '../services/`$1.js'"
    $content = $content -replace "from '\./services/([^']+)\.ts'", "from './services/`$1.js'"
    
    # Fix utils imports
    $content = $content -replace "from '\.\./\.\./utils/([^']+)\.ts'", "from '../../utils/`$1.js'"
    $content = $content -replace "from '\.\./utils/([^']+)\.ts'", "from '../utils/`$1.js'"
    $content = $content -replace "from '\./utils/([^']+)\.ts'", "from './utils/`$1.js'"
    
    # Fix command imports in index.ts
    $content = $content -replace "from '\./commands/([^']+)\.ts'", "from './commands/`$1.js'"
    $content = $content -replace "from '\.\./index\.ts'", "from '../../index.js'"
    
    # Remove any corrupted import statements
    $content = $content -replace "import '[^']*\.ts';", ""
    
    Set-Content $file.FullName $content -NoNewline
}

Write-Host "Import statements fixed to use .js extensions for ES modules!" 