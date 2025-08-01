@echo off
title Discord Bot Manager - Professional Launcher
color 0B

cls
echo.
echo    ================================================================
echo    =                                                             =
echo    =              DISCORD BOT MANAGER LAUNCHER                   =
echo    =                                                             =
echo    =              Developed by quefep!                           =
echo    =                                                             =
echo    ================================================================
echo.
echo    ----------------------------------------------------------------
echo.
echo    This launcher will help you start your Discord bot on Windows
echo    It will check requirements, install dependencies, and launch your bot
echo.
echo    Need help? Join our Discord community!
echo    https://discord.gg/a3tGyAwVRc
echo.
echo    ----------------------------------------------------------------
echo.

REM Change to the directory where this batch file is located
cd /d "%~dp0"

REM Check if we're in the right directory
if not exist "package.json" (
    echo    ERROR: package.json not found!
    echo    Please run this launcher from the DiscordDemo folder.
    echo.
    echo    Current directory: %CD%
    echo.
    pause
    exit /b 1
)

echo    Found package.json - proceeding with setup...

REM Install dependencies
echo.
echo    Installing dependencies...
call npm install
if errorlevel 1 (
    echo    ERROR: Failed to install dependencies
    echo    Try running: npm cache clean --force
    pause
    exit /b 1
)
echo    Dependencies installed successfully

REM Create .env file from template
echo.
echo    Setting up environment configuration...
if not exist ".env" (
    if exist "env.template" (
        copy "env.template" ".env" >nul
        echo    Created .env file from template
    ) else (
        echo    Creating basic .env file...
        (
            echo # Discord Bot Configuration
            echo # Get your token from https://discord.com/developers/applications
            echo DISCORD_TOKEN=your_discord_bot_token_here
        ) > .env
        echo    Created basic .env file
    )
    echo.
    echo    IMPORTANT: Please edit .env file with your Discord bot token!
    echo    1. Open .env in your text editor
    echo    2. Replace 'your_discord_bot_token_here' with your actual bot token
    echo    3. Get your token from: https://discord.com/developers/applications
) else (
    echo    .env file already exists
)

REM Validate .env file
echo.
echo    Validating environment configuration...
findstr /C:"your_discord_bot_token_here" .env >nul 2>&1
if not errorlevel 1 (
    echo    WARNING: You still need to set your Discord bot token in .env file!
    echo       Edit .env and replace 'your_discord_bot_token_here' with your actual token
) else (
    echo    .env file appears to be configured
)

REM Create data directory
echo.
echo    Setting up data directory...
if not exist "data" (
    mkdir "data"
    echo    Created data directory
) else (
    echo    Data directory already exists
)

REM Build the project
echo.
echo    Building project...
call npm run build
if errorlevel 1 (
    echo    WARNING: Failed to build project
    echo    You can still run the bot in development mode with 'npm run dev'
) else (
    echo    Project built successfully
)

echo.
echo    ================================================================
echo    =                    SETUP COMPLETE!                          =
echo    ================================================================
echo.
echo    ----------------------------------------------------------------
echo.
echo    CRITICAL: Discord Bot Intents Configuration
echo    ----------------------------------------------------------------
echo.
echo    To fix the 'disallowed intents' error, you MUST enable these intents in your Discord application:
echo.
echo    1. Go to https://discord.com/developers/applications
echo    2. Select your bot application
echo    3. Go to 'Bot' section in the left sidebar
echo    4. Scroll down to 'Privileged Gateway Intents'
echo    5. Enable ALL THREE intents:
echo       PRESENCE INTENT
echo       SERVER MEMBERS INTENT
echo       MESSAGE CONTENT INTENT
echo    6. Click 'Save Changes'
echo.
echo    Next steps:
echo    1. Edit .env file with your Discord bot token
echo    2. Enable the required intents in Discord Developer Portal
echo    3. The bot will start automatically after setup
echo    4. For development mode, run 'npm run dev'
echo.
echo    Troubleshooting:
echo    - If you get permission errors, run as Administrator
echo    - If npm install fails, try: npm cache clean --force
echo    - If TypeScript files aren't loading, check file permissions
echo    - If you get 'disallowed intents' error, make sure to enable the intents above
echo    - Run 'troubleshoot.bat' for comprehensive diagnostics
echo.
echo    ----------------------------------------------------------------
echo.
echo    Need help? Join our Discord community!
echo    https://discord.gg/a3tGyAwVRc
echo.
echo    Developed by quefep!
echo.

REM Start the bot
echo    Starting Discord Bot...
echo    The bot will connect to Discord and show status messages.
echo.
echo    Press Ctrl+C to stop the bot.
echo.

REM Check if dist/index.js exists
if not exist "dist\index.js" (
    echo    ERROR: dist\index.js not found!
    echo    Current directory: %CD%
    echo.
    echo    Please make sure the project is built: npm run build
    pause
    exit /b 1
)

echo    Found dist\index.js in: %CD%
echo    Starting Discord Bot...
echo.

REM Start the bot using npm start and keep the window open
echo    ================================================================
echo    =                    BOT STARTING...                          =
echo    ================================================================
echo.
echo    If the bot doesn't start or you see errors, check:
echo    1. Your .env file has the correct Discord token
echo    2. You've enabled the required Discord intents
echo    3. Your bot has the correct permissions
echo.
echo    Press any key to start the bot...
pause >nul

REM Start the bot and keep the window open
cmd /k "npm start" 