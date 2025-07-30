#!/bin/bash

echo "==========================================="
echo "DISCORD BOT SETUP SCRIPT FOR LINUX"
echo "==========================================="
echo

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "ERROR: package.json not found!"
    echo "Please run this script from the bot's root directory."
    exit 1
fi

# Check for Node.js
echo "Checking Node.js installation..."
if ! command -v node >/dev/null 2>&1; then
    echo "ERROR: Node.js is not installed!"
    echo "Please install Node.js version 18 or higher:"
    echo "  Ubuntu/Mint: sudo apt update && sudo apt install nodejs npm"
    echo "  Or download from: https://nodejs.org/"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "ERROR: Node.js version 18 or higher is required."
    echo "Current version: $(node -v)"
    echo "Please update Node.js from https://nodejs.org/"
    exit 1
fi

echo "✓ Node.js $(node -v) is installed"

# Check for npm
if ! command -v npm >/dev/null 2>&1; then
    echo "ERROR: npm is not installed!"
    exit 1
fi

echo "✓ npm $(npm -v) is installed"

# Check for TypeScript files
echo ""
echo "Checking TypeScript files..."
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

# Install dependencies
echo ""
echo "Installing dependencies..."
if npm install; then
    echo "✓ Dependencies installed successfully"
else
    echo "ERROR: Failed to install dependencies"
    echo "Try running: sudo apt update && sudo apt install build-essential"
    exit 1
fi

# Create .env file from template
echo ""
echo "Setting up environment configuration..."
if [ ! -f ".env" ]; then
    if [ -f "env.template" ]; then
        cp env.template .env
        echo "✓ Created .env file from template"
    else
        echo "Creating basic .env file..."
        cat > .env << EOF
# Discord Bot Configuration
# Get your token from https://discord.com/developers/applications
DISCORD_TOKEN=your_discord_bot_token_here
EOF
        echo "✓ Created basic .env file"
    fi
    echo ""
    echo "IMPORTANT: Please edit .env file with your Discord bot token!"
    echo "1. Open .env in your text editor"
    echo "2. Replace 'your_discord_bot_token_here' with your actual bot token"
    echo "3. Get your token from: https://discord.com/developers/applications"
else
    echo "✓ .env file already exists"
fi

# Validate .env file
echo ""
echo "Validating environment configuration..."
if [ -f ".env" ]; then
    if grep -q "your_discord_bot_token_here" .env; then
        echo "⚠️  WARNING: You still need to set your Discord bot token in .env file!"
        echo "   Edit .env and replace 'your_discord_bot_token_here' with your actual token"
    else
        echo "✓ .env file appears to be configured"
    fi
else
    echo "ERROR: .env file not found!"
    exit 1
fi

# Create data directory
echo ""
echo "Setting up data directory..."
if [ ! -d "data" ]; then
    mkdir -p data
    echo "✓ Created data directory"
else
    echo "✓ Data directory already exists"
fi

# Set proper permissions for Linux
echo ""
echo "Setting file permissions..."
chmod +x setup.sh
if [ -f "launcher.js" ]; then
    chmod +x launcher.js
fi
echo "✓ Set executable permissions"

# Build the project
echo ""
echo "Building project..."
if npm run build; then
    echo "✓ Project built successfully"
    
    # Verify compiled files
    JS_COUNT=$(find dist/commands -name "*.js" | wc -l)
    if [ "$JS_COUNT" -gt 0 ]; then
        echo "✓ Compiled $JS_COUNT JavaScript files"
    else
        echo "WARNING: No compiled JavaScript files found"
    fi
else
    echo "WARNING: Failed to build project"
    echo "You can still run the bot in development mode with 'npm run dev'"
fi

# Test command loading
echo ""
echo "Testing command loading..."
if node --experimental-specifier-resolution=node -e "
import('./dist/index.js').then(() => {
  console.log('✓ Command loading test passed');
}).catch(err => {
  console.error('✗ Command loading test failed:', err.message);
  process.exit(1);
});
" 2>/dev/null; then
    echo "✓ Command loading test passed"
else
    echo "WARNING: Command loading test failed"
    echo "This might indicate an issue with the TypeScript compilation"
    echo "You can still run the bot in development mode with 'npm run dev'"
fi

echo ""
echo "==========================================="
echo "SETUP COMPLETE!"
echo "==========================================="
echo ""
echo "🔧 CRITICAL: Discord Bot Intents Configuration"
echo "==========================================="
echo "To fix the 'disallowed intents' error, you MUST enable these intents in your Discord application:"
echo ""
echo "1. Go to https://discord.com/developers/applications"
echo "2. Select your bot application"
echo "3. Go to 'Bot' section in the left sidebar"
echo "4. Scroll down to 'Privileged Gateway Intents'"
echo "5. Enable ALL THREE intents:"
echo "   ✅ PRESENCE INTENT"
echo "   ✅ SERVER MEMBERS INTENT" 
echo "   ✅ MESSAGE CONTENT INTENT"
echo "6. Click 'Save Changes'"
echo ""
echo "📝 Next steps:"
echo "1. Edit .env file with your Discord bot token"
echo "2. Enable the required intents in Discord Developer Portal"
echo "3. Run 'npm start' to start the bot (production mode)"
echo "4. Run 'npm run dev' for development mode"
echo "5. For Linux-specific issues, try 'npm run start:linux'"
echo ""
echo "🛠️  Troubleshooting:"
echo "- If you get permission errors, try: chmod +x setup.sh"
echo "- If npm install fails, try: sudo apt update && sudo apt install build-essential"
echo "- For voice features, you may need: sudo apt install ffmpeg"
echo "- If TypeScript files aren't loading, check file permissions"
echo "- If you get 'disallowed intents' error, make sure to enable the intents above"
echo "- Run './troubleshoot.sh' for comprehensive diagnostics"
echo ""
echo "For help, contact @quefep on Discord"
echo "" 