@echo off
echo ===========================================
echo DISCORD BOT TROUBLESHOOTING SCRIPT
echo ===========================================
echo.

REM Check if we're in the right directory
if not exist "package.json" (
    echo ❌ ERROR: package.json not found!
    echo Please run this script from the bot's root directory.
    pause
    exit /b 1
)

echo 🔍 Checking system requirements...
echo.

REM Check Node.js
echo Checking Node.js...
node --version >nul 2>&1
if %errorlevel% equ 0 (
    for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
    echo ✅ Node.js %NODE_VERSION% - OK
) else (
    echo ❌ Node.js not installed!
    echo    Install from: https://nodejs.org/
)

REM Check npm
echo Checking npm...
npm --version >nul 2>&1
if %errorlevel% equ 0 (
    for /f "tokens=*" %%i in ('npm --version') do set NPM_VERSION=%%i
    echo ✅ npm %NPM_VERSION% - OK
) else (
    echo ❌ npm not installed!
)

REM Check .env file
echo Checking environment configuration...
if exist ".env" (
    findstr "your_discord_bot_token_here" .env >nul
    if %errorlevel% equ 0 (
        echo ❌ .env file contains placeholder token!
        echo    Edit .env and replace with your actual Discord bot token
    ) else (
        echo ✅ .env file appears to be configured
    )
) else (
    echo ❌ .env file not found!
    echo    Run: copy env.template .env
    echo    Then edit .env with your bot token
)

REM Check dependencies
echo Checking dependencies...
if exist "node_modules" (
    echo ✅ node_modules directory exists
) else (
    echo ❌ Dependencies not installed!
    echo    Run: npm install
)

REM Check build
echo Checking build files...
if exist "dist" (
    dir /b dist\commands\*.js >nul 2>&1
    if %errorlevel% equ 0 (
        for /f %%i in ('dir /b dist\commands\*.js ^| find /c /v ""') do set JS_COUNT=%%i
        echo ✅ Build files found (%JS_COUNT% compiled files)
    ) else (
        echo ❌ No compiled files found!
        echo    Run: npm run build
    )
) else (
    echo ❌ dist directory not found!
    echo    Run: npm run build
)

REM Check data directory
echo Checking data directory...
if exist "data" (
    echo ✅ data directory exists
) else (
    echo ❌ data directory missing!
    echo    Run: mkdir data
)

echo.
echo ===========================================
echo COMMON ISSUES ^& SOLUTIONS
echo ===========================================
echo.

echo 🔧 If you get 'disallowed intents' error:
echo 1. Go to https://discord.com/developers/applications
echo 2. Select your bot application
echo 3. Go to 'Bot' section in the left sidebar
echo 4. Scroll down to 'Privileged Gateway Intents'
echo 5. Enable ALL THREE intents:
echo    ✅ PRESENCE INTENT
echo    ✅ SERVER MEMBERS INTENT
echo    ✅ MESSAGE CONTENT INTENT
echo 6. Click 'Save Changes'
echo 7. Restart your bot
echo.

echo 🔧 If you get 'Invalid token' error:
echo 1. Check your .env file has the correct token
echo 2. Get a fresh token from Discord Developer Portal
echo 3. Make sure there are no extra spaces or characters
echo 4. Verify the token is copied correctly
echo.

echo 🔧 If you get 'Cannot find module' error:
echo 1. Run: npm install
echo 2. Run: npm run build
echo 3. Make sure the dist folder exists
echo.

echo 🔧 If voice features don't work:
echo 1. Install FFmpeg (download from https://ffmpeg.org/)
echo 2. Make sure bot has voice permissions
echo 3. Check if @discordjs/voice is installed
echo.

echo 🔧 If TypeScript files aren't loading:
echo 1. Run: npm install
echo 2. Run: npm run build
echo 3. Try development mode: npm run dev
echo.

echo ===========================================
echo QUICK FIXES
echo ===========================================
echo.

echo 🔄 To rebuild everything:
echo rmdir /s /q node_modules
echo rmdir /s /q dist
echo npm install
echo npm run build
echo.

echo 🔄 To start in development mode:
echo npm run dev
echo.

echo 🔄 To start in production mode:
echo npm start
echo.

echo ===========================================
echo TESTING YOUR BOT
echo ===========================================
echo.

echo 🧪 To test if your bot can connect:
echo 1. Make sure .env has your token
echo 2. Enable Discord intents (see above)
echo 3. Run: npm start
echo 4. Check console for connection messages
echo.

echo 🧪 To test in development mode:
echo 1. Run: npm run dev
echo 2. This will auto-restart on file changes
echo 3. Check console for TypeScript errors
echo.

echo ===========================================
echo GETTING HELP
echo ===========================================
echo.

echo 📞 For additional help:
echo - Discord: @quefep
echo - GitHub Issues: Create an issue on the repository
echo - Check the README.md for detailed documentation
echo.

echo ✅ Troubleshooting complete!
echo If you're still having issues, contact @quefep on Discord
echo.
pause 