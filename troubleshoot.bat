@echo off
title Discord Bot Troubleshooter - Professional Diagnostics
color 0E

cls
echo.
echo    ╔══════════════════════════════════════════════════════════════════════════════╗
echo    ║                                                                            ║
echo    ║                🔧 DISCORD BOT TROUBLESHOOTER 🔧                            ║
echo    ║                                                                            ║
echo    ║                    Developed by quefep!                                    ║
echo    ║                                                                            ║
echo    ╚══════════════════════════════════════════════════════════════════════════════╝
echo.
echo    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.
echo    🔍 This tool will diagnose common Discord bot issues
echo    📋 It will check your system, dependencies, and configuration
echo.
echo    💬 Need help? Join our Discord community!
echo    🔗 https://discord.gg/a3tGyAwVRc
echo.
echo    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.

REM Change to the directory where this batch file is located
cd /d "%~dp0"

echo    📊 SYSTEM DIAGNOSTICS
echo    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.

REM Check Windows version
echo    🔍 Checking Windows version...
for /f "tokens=4-5 delims=. " %%i in ('ver') do set VERSION=%%i.%%j
echo    ✅ Windows Version: %VERSION%

REM Check available memory
echo    🔍 Checking system memory...
wmic computersystem get TotalPhysicalMemory /value | find "TotalPhysicalMemory" > temp.txt
for /f "tokens=2 delims==" %%a in (temp.txt) do set MEMORY=%%a
del temp.txt
set /a MEMORY_GB=%MEMORY:~0,-1%/1073741824
echo    ✅ Available Memory: %MEMORY_GB% GB

REM Check disk space
echo    🔍 Checking disk space...
for /f "tokens=3" %%a in ('dir /-c ^| find "bytes free"') do set DISK_SPACE=%%a
echo    ✅ Free Disk Space: %DISK_SPACE%

echo.
echo    📊 NODE.JS DIAGNOSTICS
echo    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.

REM Check if Node.js is installed
echo    🔍 Checking Node.js installation...
node --version >nul 2>&1
if errorlevel 1 (
    echo    ❌ ERROR: Node.js is not installed or not in PATH!
    echo    💡 Please install Node.js from: https://nodejs.org/
    echo    💡 Make sure to select "Add to PATH" during installation
    echo.
    echo    🛠️  SOLUTION: Download and install Node.js 18+ from https://nodejs.org/
    echo.
) else (
    for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
    echo    ✅ Node.js %NODE_VERSION% is installed
    
    REM Check Node.js version
    for /f "tokens=2 delims=v" %%i in ('node --version') do set NODE_MAJOR=%%i
    for /f "tokens=1 delims=." %%i in ("%NODE_MAJOR%") do set NODE_MAJOR=%%i
    if %NODE_MAJOR% LSS 18 (
        echo    ⚠️  WARNING: Node.js version 18 or higher is required.
        echo    Current version: %NODE_VERSION%
        echo    🛠️  SOLUTION: Update Node.js from https://nodejs.org/
        echo.
    ) else (
        echo    ✅ Node.js version is compatible (18+)
    )
)

REM Check if npm is installed
echo    🔍 Checking npm installation...
npm --version >nul 2>&1
if errorlevel 1 (
    echo    ❌ ERROR: npm is not installed!
    echo    🛠️  SOLUTION: Reinstall Node.js to include npm
    echo.
) else (
    for /f "tokens=*" %%i in ('npm --version') do set NPM_VERSION=%%i
    echo    ✅ npm %NPM_VERSION% is installed
)

echo.
echo    📊 PROJECT DIAGNOSTICS
echo    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.

REM Check if we're in the right directory
echo    🔍 Checking project structure...
if not exist "package.json" (
    echo    ❌ ERROR: package.json not found!
    echo    Current directory: %CD%
    echo    🛠️  SOLUTION: Run this script from the DiscordDemo folder
    echo.
) else (
    echo    ✅ package.json found
)

REM Check for TypeScript files
if not exist "src\commands" (
    echo    ❌ ERROR: src\commands directory not found!
    echo    🛠️  SOLUTION: Ensure you have the complete source code
    echo.
) else (
    echo    ✅ src\commands directory found
    
    REM Count TypeScript files
    set TS_COUNT=0
    for /r "src\commands" %%f in (*.ts) do set /a TS_COUNT+=1
    if %TS_COUNT% EQU 0 (
        echo    ⚠️  WARNING: No TypeScript files found in src\commands\
        echo    This might indicate a problem with the source code.
        echo.
    ) else (
        echo    ✅ Found %TS_COUNT% TypeScript command files
    )
)

REM Check for .env file
echo    🔍 Checking environment configuration...
if not exist ".env" (
    echo    ❌ ERROR: .env file not found!
    echo    🛠️  SOLUTION: Create .env file from template: copy env.template .env
    echo.
) else (
    echo    ✅ .env file found
    
    REM Check if token is configured
    findstr /C:"your_discord_bot_token_here" .env >nul 2>&1
    if not errorlevel 1 (
        echo    ⚠️  WARNING: Discord bot token not configured in .env file!
        echo    🛠️  SOLUTION: Edit .env and replace 'your_discord_bot_token_here' with your actual token
        echo.
    ) else (
        echo    ✅ .env file appears to be configured
    )
)

REM Check for node_modules
echo    🔍 Checking dependencies...
if not exist "node_modules" (
    echo    ❌ ERROR: node_modules directory not found!
    echo    🛠️  SOLUTION: Run 'npm install' to install dependencies
    echo.
) else (
    echo    ✅ node_modules directory found
)

REM Check for dist directory
echo    🔍 Checking compiled files...
if not exist "dist" (
    echo    ⚠️  WARNING: dist directory not found!
    echo    🛠️  SOLUTION: Run 'npm run build' to compile TypeScript
    echo.
) else (
    echo    ✅ dist directory found
    
    REM Count compiled files
    set JS_COUNT=0
    for /r "dist\commands" %%f in (*.js) do set /a JS_COUNT+=1
    if %JS_COUNT% GTR 0 (
        echo    ✅ Found %JS_COUNT% compiled JavaScript files
    ) else (
        echo    ⚠️  WARNING: No compiled JavaScript files found
        echo    🛠️  SOLUTION: Run 'npm run build' to compile TypeScript
        echo.
    )
)

echo.
echo    📊 NETWORK DIAGNOSTICS
echo    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.

REM Check internet connectivity
echo    🔍 Checking internet connectivity...
ping -n 1 discord.com >nul 2>&1
if errorlevel 1 (
    echo    ❌ ERROR: Cannot reach Discord servers!
    echo    🛠️  SOLUTION: Check your internet connection
    echo.
) else (
    echo    ✅ Internet connectivity confirmed
)

REM Check Discord status
echo    🔍 Checking Discord status...
ping -n 1 status.discord.com >nul 2>&1
if errorlevel 1 (
    echo    ⚠️  WARNING: Cannot reach Discord status page
    echo    💡 Check Discord status at: https://status.discord.com/
    echo.
) else (
    echo    ✅ Discord status page accessible
)

echo.
echo    📊 PERMISSION DIAGNOSTICS
echo    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.

REM Check file permissions
echo    🔍 Checking file permissions...
if not exist "setup.sh" (
    echo    ⚠️  WARNING: setup.sh not found (Linux only)
) else (
    echo    ✅ setup.sh found
)

if not exist "start-bot-manager.bat" (
    echo    ❌ ERROR: start-bot-manager.bat not found!
    echo    🛠️  SOLUTION: Ensure you have the complete source code
    echo.
) else (
    echo    ✅ start-bot-manager.bat found
)

echo.
echo    📊 COMMON ISSUES & SOLUTIONS
echo    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.

echo    🔧 CRITICAL: Discord Bot Intents Configuration
echo    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.
echo    To fix the 'disallowed intents' error, you MUST enable these intents:
echo.
echo    1. Go to https://discord.com/developers/applications
echo    2. Select your bot application
echo    3. Go to 'Bot' section in the left sidebar
echo    4. Scroll down to 'Privileged Gateway Intents'
echo    5. Enable ALL THREE intents:
echo       ✅ PRESENCE INTENT
echo       ✅ SERVER MEMBERS INTENT
echo       ✅ MESSAGE CONTENT INTENT
echo    6. Click 'Save Changes'
echo.

echo    🛠️  COMMON SOLUTIONS:
echo    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.
echo    ❌ "Invalid Token" Error:
echo    💡 SOLUTION: Check your .env file has the correct token
echo    💡 Get a fresh token from Discord Developer Portal
echo.
echo    ❌ "Cannot find module" Error:
echo    💡 SOLUTION: Run 'npm install' then 'npm run build'
echo.
echo    ❌ "Permission denied" Error:
echo    💡 SOLUTION: Run as Administrator or check file permissions
echo.
echo    ❌ "Build failed" Error:
echo    💡 SOLUTION: Clear cache: 'npm cache clean --force'
echo    💡 Then: 'rm -rf node_modules && npm install'
echo.
echo    ❌ "Voice features not working":
echo    💡 SOLUTION: Install FFmpeg for voice features
echo.

echo.
echo    ╔══════════════════════════════════════════════════════════════════════════════╗
echo    ║                    🎉 DIAGNOSTICS COMPLETE! 🎉                              ║
echo    ╚══════════════════════════════════════════════════════════════════════════════╝
echo.
echo    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.
echo    💬 Need help? Join our Discord community!
echo    🔗 https://discord.gg/a3tGyAwVRc
echo.
echo    Developed by quefep! 🚀
echo.

pause 