@echo off
title Discord Bot Manager - Professional Launcher
color 0B

cls
echo.
echo    ╔══════════════════════════════════════════════════════════════════════════════╗
echo    ║                                                                            ║
echo    ║                    🚀 DISCORD BOT MANAGER LAUNCHER 🚀                      ║
echo    ║                                                                            ║
echo    ║                    Developed by quefep!                                    ║
echo    ║                                                                            ║
echo    ╚══════════════════════════════════════════════════════════════════════════╝
echo.
echo    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.
echo    📋 This launcher will help you start your Discord bot on Windows
echo    🔧 It will check requirements, install dependencies, and launch your bot
echo.
echo    💬 Need help? Join our Discord community!
echo    🔗 https://discord.gg/a3tGyAwVRc
echo.
echo    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.

REM Change to the directory where this batch file is located
cd /d "%~dp0"

REM Check if we're in the right directory
if not exist "package.json" (
    echo    ❌ ERROR: package.json not found!
    echo    Please run this launcher from the DiscordDemo folder.
    echo.
    echo    Current directory: %CD%
    echo.
    pause
    exit /b 1
)

REM Check if Node.js is installed
echo    🔍 Checking Node.js installation...
node --version >nul 2>&1
if errorlevel 1 (
    echo    ❌ ERROR: Node.js is not installed or not in PATH!
    echo.
    echo    💡 Please install Node.js from: https://nodejs.org/
    echo    💡 Make sure to select "Add to PATH" during installation
    echo.
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo    ✅ Node.js %NODE_VERSION% is installed

REM Check Node.js version
for /f "tokens=2 delims=v" %%i in ('node --version') do set NODE_MAJOR=%%i
for /f "tokens=1 delims=." %%i in ("%NODE_MAJOR%") do set NODE_MAJOR=%%i
if %NODE_MAJOR% LSS 18 (
    echo    ❌ ERROR: Node.js version 18 or higher is required.
    echo    Current version: %NODE_VERSION%
    echo    Please update Node.js from https://nodejs.org/
    pause
    exit /b 1
)

REM Check if npm is installed
echo    🔍 Checking npm installation...
npm --version >nul 2>&1
if errorlevel 1 (
    echo    ❌ ERROR: npm is not installed!
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('npm --version') do set NPM_VERSION=%%i
echo    ✅ npm %NPM_VERSION% is installed

REM Check for TypeScript files
echo.
echo    🔍 Checking TypeScript files...
if not exist "src\commands" (
    echo    ❌ ERROR: src\commands directory not found!
    echo    Please ensure you have the complete source code.
    pause
    exit /b 1
)

REM Count TypeScript files
set TS_COUNT=0
for /r "src\commands" %%f in (*.ts) do set /a TS_COUNT+=1
if %TS_COUNT% EQU 0 (
    echo    ⚠️  WARNING: No TypeScript files found in src\commands\
    echo    This might indicate a problem with the source code.
) else (
    echo    ✅ Found %TS_COUNT% TypeScript command files
)

REM Install dependencies
echo.
echo    📦 Installing dependencies...
call npm install
if errorlevel 1 (
    echo    ❌ ERROR: Failed to install dependencies
    echo    Try running: npm cache clean --force
    pause
    exit /b 1
)
echo    ✅ Dependencies installed successfully

REM Create .env file from template
echo.
echo    ⚙️  Setting up environment configuration...
if not exist ".env" (
    if exist "env.template" (
        copy "env.template" ".env" >nul
        echo    ✅ Created .env file from template
    ) else (
        echo    Creating basic .env file...
        (
            echo # Discord Bot Configuration
            echo # Get your token from https://discord.com/developers/applications
            echo DISCORD_TOKEN=your_discord_bot_token_here
        ) > .env
        echo    ✅ Created basic .env file
    )
    echo.
    echo    📝 IMPORTANT: Please edit .env file with your Discord bot token!
    echo    1. Open .env in your text editor
    echo    2. Replace 'your_discord_bot_token_here' with your actual bot token
    echo    3. Get your token from: https://discord.com/developers/applications
) else (
    echo    ✅ .env file already exists
)

REM Validate .env file
echo.
echo    🔍 Validating environment configuration...
findstr /C:"your_discord_bot_token_here" .env >nul 2>&1
if not errorlevel 1 (
    echo    ⚠️  WARNING: You still need to set your Discord bot token in .env file!
    echo       Edit .env and replace 'your_discord_bot_token_here' with your actual token
) else (
    echo    ✅ .env file appears to be configured
)

REM Create data directory
echo.
echo    📁 Setting up data directory...
if not exist "data" (
    mkdir "data"
    echo    ✅ Created data directory
) else (
    echo    ✅ Data directory already exists
)

REM Build the project
echo.
echo    🔨 Building project...
call npm run build
if errorlevel 1 (
    echo    ⚠️  WARNING: Failed to build project
    echo    You can still run the bot in development mode with 'npm run dev'
) else (
    echo    ✅ Project built successfully
    
    REM Verify compiled files
    set JS_COUNT=0
    for /r "dist\commands" %%f in (*.js) do set /a JS_COUNT+=1
    if %JS_COUNT% GTR 0 (
        echo    ✅ Compiled %JS_COUNT% JavaScript files
    ) else (
        echo    ⚠️  WARNING: No compiled JavaScript files found
    )
)

echo.
echo    ╔══════════════════════════════════════════════════════════════════════════════╗
echo    ║                    🎉 SETUP COMPLETE! 🎉                                    ║
echo    ╚══════════════════════════════════════════════════════════════════════════════╝
echo.
echo    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.
echo    🔧 CRITICAL: Discord Bot Intents Configuration
echo    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.
echo    To fix the 'disallowed intents' error, you MUST enable these intents in your Discord application:
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
echo    📝 Next steps:
echo    1. Edit .env file with your Discord bot token
echo    2. Enable the required intents in Discord Developer Portal
echo    3. Run 'npm start' to start the bot (production mode)
echo    4. Run 'npm run dev' for development mode
echo.
echo    🛠️  Troubleshooting:
echo    - If you get permission errors, run as Administrator
echo    - If npm install fails, try: npm cache clean --force
echo    - If TypeScript files aren't loading, check file permissions
echo    - If you get 'disallowed intents' error, make sure to enable the intents above
echo    - Run 'troubleshoot.bat' for comprehensive diagnostics
echo.
echo    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.
echo    💬 Need help? Join our Discord community!
echo    🔗 https://discord.gg/a3tGyAwVRc
echo.
echo    Developed by quefep! 🚀
echo.

REM Start the bot
echo    🚀 Starting Discord Bot Manager...
echo    This will open your browser automatically.
echo.
echo    If the browser doesn't open, go to: http://localhost:3000
echo.
echo    Press Ctrl+C to stop the bot manager.
echo.

REM Check if launcher.js exists
if not exist "launcher.js" (
    echo    ❌ ERROR: launcher.js not found in the current directory!
    echo    Current directory: %CD%
    echo.
    echo    Please make sure you're running this from the DiscordDemo folder.
    pause
    exit /b 1
)

echo    Found launcher.js in: %CD%
echo    Starting Discord Bot Manager...
echo.

node launcher.js

pause 