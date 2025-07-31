#!/bin/bash

# Colors for better display
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Clear screen for better presentation
clear

echo -e "${CYAN}╔══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║                                                              ║${NC}"
echo -e "${CYAN}║                    🚀 DISCORD BOT SETUP 🚀                   ║${NC}"
echo -e "${CYAN}║                                                              ║${NC}"
echo -e "${CYAN}║                    Developed by quefep!                      ║${NC}"
echo -e "${CYAN}║                                                              ║${NC}"
echo -e "${CYAN}╚══════════════════════════════════════════════════════════════╝${NC}"
echo
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo
echo -e "${BLUE}📋 This script will help you set up your Discord bot on Linux${NC}"
echo -e "${BLUE}🔧 It will check requirements, install dependencies, and configure your bot${NC}"
echo
echo -e "${PURPLE}💬 Need help? Join our Discord community!${NC}"
echo -e "${PURPLE}🔗 https://discord.gg/a3tGyAwVRc${NC}"
echo
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ ERROR: package.json not found!${NC}"
    echo -e "${RED}Please run this script from the bot's root directory.${NC}"
    exit 1
fi
# Check for Node.js
echo -e "${BLUE}🔍 Checking Node.js installation...${NC}"
if ! command -v node >/dev/null 2>&1; then
    echo -e "${RED}❌ ERROR: Node.js is not installed!${NC}"
    echo -e "${YELLOW}Please install Node.js version 18 or higher:${NC}"
    echo -e "${YELLOW}  Ubuntu/Mint: sudo apt update && sudo apt install nodejs npm${NC}"
    echo -e "${YELLOW}  Or download from: https://nodejs.org/${NC}"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo -e "${RED}❌ ERROR: Node.js version 18 or higher is required.${NC}"
    echo -e "${RED}Current version: $(node -v)${NC}"
    echo -e "${YELLOW}Please update Node.js from https://nodejs.org/${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Node.js $(node -v) is installed${NC}"

# Check for npm
if ! command -v npm >/dev/null 2>&1; then
    echo -e "${RED}❌ ERROR: npm is not installed!${NC}"
    exit 1
fi

echo -e "${GREEN}✅ npm $(npm -v) is installed${NC}"

# Check for TypeScript files
echo ""
echo -e "${BLUE}🔍 Checking TypeScript files...${NC}"
if [ ! -d "src/commands" ]; then
    echo -e "${RED}❌ ERROR: src/commands directory not found!${NC}"
    echo -e "${RED}Please ensure you have the complete source code.${NC}"
    exit 1
fi

# Count TypeScript files
TS_COUNT=$(find src/commands -name "*.ts" | wc -l)
if [ "$TS_COUNT" -eq 0 ]; then
    echo -e "${YELLOW}⚠️  WARNING: No TypeScript files found in src/commands/${NC}"
    echo -e "${YELLOW}This might indicate a problem with the source code.${NC}"
else
    echo -e "${GREEN}✅ Found $TS_COUNT TypeScript command files${NC}"
fi

# Install dependencies
echo ""
echo -e "${BLUE}📦 Installing dependencies...${NC}"
if npm install; then
    echo -e "${GREEN}✅ Dependencies installed successfully${NC}"
else
    echo -e "${RED}❌ ERROR: Failed to install dependencies${NC}"
    echo -e "${YELLOW}Try running: sudo apt update && sudo apt install build-essential${NC}"
    exit 1
fi

# Create .env file from template
echo ""
echo -e "${BLUE}⚙️  Setting up environment configuration...${NC}"
if [ ! -f ".env" ]; then
    if [ -f "env.template" ]; then
        cp env.template .env
        echo -e "${GREEN}✅ Created .env file from template${NC}"
    else
        echo -e "${BLUE}Creating basic .env file...${NC}"
        cat > .env << EOF
# Discord Bot Configuration
# Get your token from https://discord.com/developers/applications
DISCORD_TOKEN=your_discord_bot_token_here
EOF
        echo -e "${GREEN}✅ Created basic .env file${NC}"
    fi
    echo ""
    echo -e "${YELLOW}📝 IMPORTANT: Please edit .env file with your Discord bot token!${NC}"
    echo -e "${YELLOW}1. Open .env in your text editor${NC}"
    echo -e "${YELLOW}2. Replace 'your_discord_bot_token_here' with your actual bot token${NC}"
    echo -e "${YELLOW}3. Get your token from: https://discord.com/developers/applications${NC}"
else
    echo -e "${GREEN}✅ .env file already exists${NC}"
fi

# Validate .env file
echo ""
echo -e "${BLUE}🔍 Validating environment configuration...${NC}"
if [ -f ".env" ]; then
    if grep -q "your_discord_bot_token_here" .env; then
        echo -e "${YELLOW}⚠️  WARNING: You still need to set your Discord bot token in .env file!${NC}"
        echo -e "${YELLOW}   Edit .env and replace 'your_discord_bot_token_here' with your actual token${NC}"
    else
        echo -e "${GREEN}✅ .env file appears to be configured${NC}"
    fi
else
    echo -e "${RED}❌ ERROR: .env file not found!${NC}"
    exit 1
fi

# Create data directory
echo ""
echo -e "${BLUE}📁 Setting up data directory...${NC}"
if [ ! -d "data" ]; then
    mkdir -p data
    echo -e "${GREEN}✅ Created data directory${NC}"
else
    echo -e "${GREEN}✅ Data directory already exists${NC}"
fi

# Set proper permissions for Linux
echo ""
echo -e "${BLUE}🔐 Setting file permissions...${NC}"
chmod +x setup.sh
if [ -f "launcher.js" ]; then
    chmod +x launcher.js
fi
echo -e "${GREEN}✅ Set executable permissions${NC}"

# Build the project
echo ""
echo -e "${BLUE}🔨 Building project...${NC}"
if npm run build; then
    echo -e "${GREEN}✅ Project built successfully${NC}"
    
    # Verify compiled files
    JS_COUNT=$(find dist/commands -name "*.js" | wc -l)
    if [ "$JS_COUNT" -gt 0 ]; then
        echo -e "${GREEN}✅ Compiled $JS_COUNT JavaScript files${NC}"
    else
        echo -e "${YELLOW}⚠️  WARNING: No compiled JavaScript files found${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  WARNING: Failed to build project${NC}"
    echo -e "${YELLOW}You can still run the bot in development mode with 'npm run dev'${NC}"
fi

# Test command loading
echo ""
echo -e "${BLUE}🧪 Testing command loading...${NC}"
if node --experimental-specifier-resolution=node -e "
import('./dist/index.js').then(() => {
  console.log('✅ Command loading test passed');
}).catch(err => {
  console.error('❌ Command loading test failed:', err.message);
  process.exit(1);
});
" 2>/dev/null; then
    echo -e "${GREEN}✅ Command loading test passed${NC}"
else
    echo -e "${YELLOW}⚠️  WARNING: Command loading test failed${NC}"
    echo -e "${YELLOW}This might indicate an issue with the TypeScript compilation${NC}"
    echo -e "${YELLOW}You can still run the bot in development mode with 'npm run dev'${NC}"
fi

echo ""
echo -e "${CYAN}╔══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║                    🎉 SETUP COMPLETE! 🎉                    ║${NC}"
echo -e "${CYAN}╚══════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${RED}🔧 CRITICAL: Discord Bot Intents Configuration${NC}"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${BLUE}To fix the 'disallowed intents' error, you MUST enable these intents in your Discord application:${NC}"
echo ""
echo -e "${CYAN}1. Go to https://discord.com/developers/applications${NC}"
echo -e "${CYAN}2. Select your bot application${NC}"
echo -e "${CYAN}3. Go to 'Bot' section in the left sidebar${NC}"
echo -e "${CYAN}4. Scroll down to 'Privileged Gateway Intents'${NC}"
echo -e "${CYAN}5. Enable ALL THREE intents:${NC}"
echo -e "${GREEN}   ✅ PRESENCE INTENT${NC}"
echo -e "${GREEN}   ✅ SERVER MEMBERS INTENT${NC}" 
echo -e "${GREEN}   ✅ MESSAGE CONTENT INTENT${NC}"
echo -e "${CYAN}6. Click 'Save Changes'${NC}"
echo ""
echo -e "${PURPLE}📝 Next steps:${NC}"
echo -e "${CYAN}1. Edit .env file with your Discord bot token${NC}"
echo -e "${CYAN}2. Enable the required intents in Discord Developer Portal${NC}"
echo -e "${CYAN}3. Run 'npm start' to start the bot (production mode)${NC}"
echo -e "${CYAN}4. Run 'npm run dev' for development mode${NC}"
echo -e "${CYAN}5. For Linux-specific issues, try 'npm run start:linux'${NC}"
echo ""
echo -e "${YELLOW}🛠️  Troubleshooting:${NC}"
echo -e "${CYAN}- If you get permission errors, try: chmod +x setup.sh${NC}"
echo -e "${CYAN}- If npm install fails, try: sudo apt update && sudo apt install build-essential${NC}"
echo -e "${CYAN}- For voice features, you may need: sudo apt install ffmpeg${NC}"
echo -e "${CYAN}- If TypeScript files aren't loading, check file permissions${NC}"
echo -e "${CYAN}- If you get 'disallowed intents' error, make sure to enable the intents above${NC}"
echo -e "${CYAN}- Run './troubleshoot.sh' for comprehensive diagnostics${NC}"
echo ""
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${PURPLE}💬 Need help? Join our Discord community!${NC}"
echo -e "${CYAN}🔗 https://discord.gg/a3tGyAwVRc${NC}"
echo ""
echo -e "${GREEN}Developed by quefep! 🚀${NC}"
echo "" 