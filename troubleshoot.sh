#!/bin/bash

echo "==========================================="
echo "DISCORD BOT TROUBLESHOOTING SCRIPT"
echo "==========================================="
echo

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ ERROR: package.json not found!"
    echo "Please run this script from the bot's root directory."
    exit 1
fi

echo "🔍 Checking system requirements..."

# Check Node.js
echo "Checking Node.js..."
if command -v node >/dev/null 2>&1; then
    NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -ge 18 ]; then
        echo "✅ Node.js $(node -v) - OK"
    else
        echo "❌ Node.js version too old: $(node -v)"
        echo "   Required: 18.0.0 or higher"
        echo "   Download from: https://nodejs.org/"
    fi
else
    echo "❌ Node.js not installed!"
    echo "   Install from: https://nodejs.org/"
fi

# Check npm
echo "Checking npm..."
if command -v npm >/dev/null 2>&1; then
    echo "✅ npm $(npm -v) - OK"
else
    echo "❌ npm not installed!"
fi

# Check .env file
echo "Checking environment configuration..."
if [ -f ".env" ]; then
    if grep -q "your_discord_bot_token_here" .env; then
        echo "❌ .env file contains placeholder token!"
        echo "   Edit .env and replace with your actual Discord bot token"
    else
        echo "✅ .env file appears to be configured"
    fi
else
    echo "❌ .env file not found!"
    echo "   Run: cp env.template .env"
    echo "   Then edit .env with your bot token"
fi

# Check dependencies
echo "Checking dependencies..."
if [ -d "node_modules" ]; then
    echo "✅ node_modules directory exists"
else
    echo "❌ Dependencies not installed!"
    echo "   Run: npm install"
fi

# Check build
echo "Checking build files..."
if [ -d "dist" ]; then
    JS_COUNT=$(find dist/commands -name "*.js" | wc -l)
    if [ "$JS_COUNT" -gt 0 ]; then
        echo "✅ Build files found ($JS_COUNT compiled files)"
    else
        echo "❌ No compiled files found!"
        echo "   Run: npm run build"
    fi
else
    echo "❌ dist directory not found!"
    echo "   Run: npm run build"
fi

# Check data directory
echo "Checking data directory..."
if [ -d "data" ]; then
    echo "✅ data directory exists"
else
    echo "❌ data directory missing!"
    echo "   Run: mkdir -p data"
fi

echo ""
echo "==========================================="
echo "COMMON ISSUES & SOLUTIONS"
echo "==========================================="
echo

echo "🔧 If you get 'disallowed intents' error:"
echo "1. Go to https://discord.com/developers/applications"
echo "2. Select your bot application"
echo "3. Go to 'Bot' section in the left sidebar"
echo "4. Scroll down to 'Privileged Gateway Intents'"
echo "5. Enable ALL THREE intents:"
echo "   ✅ PRESENCE INTENT"
echo "   ✅ SERVER MEMBERS INTENT"
echo "   ✅ MESSAGE CONTENT INTENT"
echo "6. Click 'Save Changes'"
echo "7. Restart your bot"
echo

echo "🔧 If you get 'Invalid token' error:"
echo "1. Check your .env file has the correct token"
echo "2. Get a fresh token from Discord Developer Portal"
echo "3. Make sure there are no extra spaces or characters"
echo "4. Verify the token is copied correctly"
echo

echo "🔧 If you get 'Cannot find module' error:"
echo "1. Run: npm install"
echo "2. Run: npm run build"
echo "3. Make sure the dist folder exists"
echo

echo "🔧 If voice features don't work:"
echo "1. Install FFmpeg: sudo apt install ffmpeg"
echo "2. Make sure bot has voice permissions"
echo "3. Check if @discordjs/voice is installed"
echo

echo "🔧 If you get permission errors (Linux):"
echo "1. Run: chmod +x setup.sh"
echo "2. Run: chmod +x start-linux.sh"
echo "3. Run: chmod +x troubleshoot.sh"
echo

echo "🔧 If TypeScript files aren't loading:"
echo "1. Run: npm install"
echo "2. Run: npm run build"
echo "3. Try development mode: npm run dev"
echo

echo "==========================================="
echo "QUICK FIXES"
echo "==========================================="
echo

echo "🔄 To rebuild everything:"
echo "rm -rf node_modules dist"
echo "npm install"
echo "npm run build"
echo

echo "🔄 To start in development mode:"
echo "npm run dev"
echo

echo "🔄 To start in production mode:"
echo "npm start"
echo

echo "🔄 To start with Linux-specific settings:"
echo "npm run start:linux"
echo

echo "==========================================="
echo "TESTING YOUR BOT"
echo "==========================================="
echo

echo "🧪 To test if your bot can connect:"
echo "1. Make sure .env has your token"
echo "2. Enable Discord intents (see above)"
echo "3. Run: npm start"
echo "4. Check console for connection messages"
echo

echo "🧪 To test in development mode:"
echo "1. Run: npm run dev"
echo "2. This will auto-restart on file changes"
echo "3. Check console for TypeScript errors"
echo

echo "==========================================="
echo "GETTING HELP"
echo "==========================================="
echo

echo "📞 For additional help:"
echo "- Discord: @quefep"
echo "- GitHub Issues: Create an issue on the repository"
echo "- Check the README.md for detailed documentation"
echo

echo "✅ Troubleshooting complete!"
echo "If you're still having issues, contact @quefep on Discord"
echo 