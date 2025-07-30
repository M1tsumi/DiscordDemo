# Fix import statements in TypeScript files
$files = Get-ChildItem -Path "src" -Recurse -Filter "*.ts"

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    
    # Fix import statements that reference .js files to .ts files
    $content = $content -replace "from '\.\./\.\./types/Command\.js'", "from '../../types/Command.ts'"
    $content = $content -replace "from '\.\./types/Command\.js'", "from '../types/Command.ts'"
    $content = $content -replace "from '\./types/Command\.js'", "from './types/Command.ts'"
    
    # Fix service imports
    $content = $content -replace "from '\.\./\.\./services/([^']+)\.js'", "from '../../services/`$1.ts'"
    $content = $content -replace "from '\.\./services/([^']+)\.js'", "from '../services/`$1.ts'"
    $content = $content -replace "from '\./services/([^']+)\.js'", "from './services/`$1.ts'"
    
    # Fix utils imports
    $content = $content -replace "from '\.\./\.\./utils/([^']+)\.js'", "from '../../utils/`$1.ts'"
    $content = $content -replace "from '\.\./utils/([^']+)\.js'", "from '../utils/`$1.ts'"
    $content = $content -replace "from '\./utils/([^']+)\.js'", "from './utils/`$1.ts'"
    
    # Fix command imports in index.ts
    $content = $content -replace "from '\./commands/([^']+)\.js'", "from './commands/`$1.ts'"
    
    # Remove any corrupted import statements
    $content = $content -replace "import '[^']*\.ts';", ""
    
    Set-Content $file.FullName $content -NoNewline
}

Write-Host "Import statements fixed in all TypeScript files!" 