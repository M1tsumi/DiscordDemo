@echo off
title Discord Bot Manager
color 0A

echo.
echo ===========================================
echo    DISCORD BOT MANAGER LAUNCHER
echo ===========================================
echo.

echo Starting Bot Manager...
echo This will open your browser automatically.
echo.
echo If the browser doesn't open, go to: http://localhost:3000
echo.
echo Press Ctrl+C to stop the bot manager.
echo.

REM Change to the directory where this batch file is located
cd /d "%~dp0"

REM Check if launcher.js exists
if not exist "launcher.js" (
    echo ERROR: launcher.js not found in the current directory!
    echo Current directory: %CD%
    echo.
    echo Please make sure you're running this from the DiscordDemo folder.
    pause
    exit /b 1
)

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed or not in PATH!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo Found launcher.js in: %CD%
echo Starting Discord Bot Manager...
echo.

node launcher.js

pause 