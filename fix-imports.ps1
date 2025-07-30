# PowerShell script to add missing imports for Node.js modules and additional Discord.js types

Write-Host "Adding missing imports..." -ForegroundColor Green

# Function to add missing imports to a file
function Add-MissingImports {
    param([string]$FilePath)
    
    $content = Get-Content $FilePath -Raw
    $originalContent = $content
    
    # Check what imports are needed based on file content
    $needsOS = $content -match "os\."
    $needsFS = $content -match "fs\."
    $needsPath = $content -match "path\."
    $needsFileURLToPath = $content -match "fileURLToPath"
    $needsAxios = $content -match "axios\."
    $needsMessageFlags = $content -match "MessageFlags"
    $needsUser = $content -match ": User"
    $needsStringSelectMenuInteraction = $content -match "StringSelectMenuInteraction"
    $needsEmbedField = $content -match "EmbedField"
    $needsRPGService = $content -match "RPGService"
    $needsCommand = $content -match ": Command"
    
    # Build additional imports
    $additionalImports = @()
    
    if ($needsOS -or $needsFS -or $needsPath -or $needsFileURLToPath) {
        $additionalImports += "import os from 'os';"
        $additionalImports += "import fs from 'fs';"
        $additionalImports += "import path from 'path';"
        $additionalImports += "import { fileURLToPath } from 'url';"
    }
    
    if ($needsAxios) {
        $additionalImports += "import axios from 'axios';"
    }
    
    if ($needsMessageFlags -or $needsUser -or $needsStringSelectMenuInteraction -or $needsEmbedField) {
        $additionalImports += "import { MessageFlags, User, StringSelectMenuInteraction, EmbedField } from 'discord.js';"
    }
    
    if ($needsRPGService) {
        $additionalImports += "import { RPGService } from '../../services/rpgService';"
    }
    
    if ($needsCommand) {
        $additionalImports += "import { Command } from '../../types/Command';"
    }
    
    if ($additionalImports.Count -gt 0) {
        # Add the additional imports after the existing imports
        $importsToAdd = $additionalImports -join "`n"
        $content = $content -replace "import \{ CommandCategory \} from '../../types/Command';", "import { CommandCategory } from '../../types/Command';`n`n$importsToAdd"
        
        # Write back if changed
        if ($content -ne $originalContent) {
            Set-Content $FilePath $content -NoNewline
            Write-Host "Added missing imports to: $FilePath" -ForegroundColor Yellow
        }
    }
}

# Get all TypeScript command files
$commandFiles = Get-ChildItem -Path "src/commands" -Recurse -Filter "*.ts"

foreach ($file in $commandFiles) {
    Add-MissingImports -FilePath $file.FullName
}

Write-Host "Missing imports added!" -ForegroundColor Green 