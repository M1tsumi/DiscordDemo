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

# Create data directory
echo ""
echo "Setting up data directory..."
if [ ! -d "data" ]; then
    mkdir -p data
    echo "✓ Created data directory"
else
    echo "✓ Data directory already exists"
fi

# Build the project
echo ""
echo "Building project..."
if npm run build; then
    echo "✓ Project built successfully"
else
    echo "WARNING: Failed to build project"
    echo "You can still run the bot in development mode with 'npm run dev'"
fi

echo ""
echo "==========================================="
echo "SETUP COMPLETE!"
echo "==========================================="
echo ""
echo "Next steps:"
echo "1. Edit .env file with your Discord bot token"
echo "2. Run 'npm start' to start the bot"
echo "3. For development, use 'npm run dev'"
echo ""
echo "Troubleshooting:"
echo "- If you get permission errors, try: chmod +x setup.sh"
echo "- If npm install fails, try: sudo apt update && sudo apt install build-essential"
echo "- For voice features, you may need: sudo apt install ffmpeg"
echo ""
echo "For help, contact @quefep on Discord"
echo "" 