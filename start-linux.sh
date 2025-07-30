#!/bin/bash

echo "==========================================="
echo "DISCORD BOT LAUNCHER FOR LINUX"
echo "==========================================="
echo

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "ERROR: package.json not found!"
    echo "Please run this script from the bot's root directory."
    exit 1
fi

# Check for .env file
if [ ! -f ".env" ]; then
    echo "ERROR: .env file not found!"
    echo "Please run setup.sh first to create the .env file."
    exit 1
fi

# Check if DISCORD_TOKEN is set
if ! grep -q "DISCORD_TOKEN=" .env || grep -q "your_discord_bot_token_here" .env; then
    echo "ERROR: Discord token not configured!"
    echo "Please edit .env file and add your Discord bot token."
    exit 1
fi

# Check if we should run in development mode
if [ "$1" = "dev" ] || [ "$1" = "--dev" ] || [ "$1" = "-d" ]; then
    echo "🚀 Starting bot in DEVELOPMENT mode..."
    echo "This mode will automatically reload when files change."
    echo ""
    
    # Check if TypeScript files exist
    if [ ! -d "src/commands" ]; then
        echo "ERROR: src/commands directory not found!"
        echo "Please ensure you have the complete source code."
        exit 1
    fi
    
    # Count TypeScript files
    TS_COUNT=$(find src/commands -name "*.ts" | wc -l)
    if [ "$TS_COUNT" -eq 0 ]; then
        echo "WARNING: No TypeScript files found in src/commands/"
        echo "This might indicate a problem with the source code."
    else
        echo "✓ Found $TS_COUNT TypeScript command files"
    fi
    
    # Start in development mode
    npm run dev
else
    echo "🚀 Starting bot in PRODUCTION mode..."
    echo ""
    
    # Check if compiled files exist
    if [ ! -d "dist" ] || [ ! -f "dist/index.js" ]; then
        echo "WARNING: Compiled files not found!"
        echo "Building project first..."
        if npm run build; then
            echo "✓ Project built successfully"
        else
            echo "ERROR: Failed to build project"
            echo "Try running: npm run build"
            exit 1
        fi
    fi
    
    # Count compiled JavaScript files
    JS_COUNT=$(find dist/commands -name "*.js" | wc -l)
    if [ "$JS_COUNT" -gt 0 ]; then
        echo "✓ Found $JS_COUNT compiled JavaScript files"
    else
        echo "WARNING: No compiled JavaScript files found"
    fi
    
    # Start in production mode
    npm start
fi 