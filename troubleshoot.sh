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

echo -e "${CYAN}╔══════════════════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║                                                                            ║${NC}"
echo -e "${CYAN}║                🔧 DISCORD BOT TROUBLESHOOTER 🔧                            ║${NC}"
echo -e "${CYAN}║                                                                            ║${NC}"
echo -e "${CYAN}║                    Developed by quefep!                                    ║${NC}"
echo -e "${CYAN}║                                                                            ║${NC}"
echo -e "${CYAN}╚══════════════════════════════════════════════════════════════════════════════╝${NC}"
echo
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo
echo -e "${BLUE}🔍 This tool will diagnose common Discord bot issues${NC}"
echo -e "${BLUE}📋 It will check your system, dependencies, and configuration${NC}"
echo
echo -e "${PURPLE}💬 Need help? Join our Discord community!${NC}"
echo -e "${PURPLE}🔗 https://discord.gg/a3tGyAwVRc${NC}"
echo
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo

# Change to the directory where this script is located
cd "$(dirname "$0")"

echo -e "${BLUE}📊 SYSTEM DIAGNOSTICS${NC}"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo

# Check OS and version
echo -e "${BLUE}🔍 Checking operating system...${NC}"
if [ -f /etc/os-release ]; then
    . /etc/os-release
    echo -e "${GREEN}✅ OS: $PRETTY_NAME${NC}"
else
    echo -e "${GREEN}✅ OS: $(uname -s) $(uname -r)${NC}"
fi

# Check system architecture
echo -e "${BLUE}🔍 Checking system architecture...${NC}"
ARCH=$(uname -m)
echo -e "${GREEN}✅ Architecture: $ARCH${NC}"

# Check available memory
echo -e "${BLUE}🔍 Checking system memory...${NC}"
MEMORY_KB=$(grep MemTotal /proc/meminfo | awk '{print $2}')
MEMORY_GB=$((MEMORY_KB / 1024 / 1024))
echo -e "${GREEN}✅ Available Memory: ${MEMORY_GB}GB${NC}"

# Check disk space
echo -e "${BLUE}🔍 Checking disk space...${NC}"
DISK_SPACE=$(df -h . | awk 'NR==2 {print $4}')
echo -e "${GREEN}✅ Free Disk Space: $DISK_SPACE${NC}"

echo
echo -e "${BLUE}📊 NODE.JS DIAGNOSTICS${NC}"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo

# Check if Node.js is installed
echo -e "${BLUE}🔍 Checking Node.js installation...${NC}"
if ! command -v node >/dev/null 2>&1; then
    echo -e "${RED}❌ ERROR: Node.js is not installed!${NC}"
    echo -e "${YELLOW}💡 Please install Node.js version 18 or higher:${NC}"
    echo -e "${YELLOW}  Ubuntu/Mint: sudo apt update && sudo apt install nodejs npm${NC}"
    echo -e "${YELLOW}  Or download from: https://nodejs.org/${NC}"
    echo
    echo -e "${BLUE}🛠️  SOLUTION: Download and install Node.js 18+ from https://nodejs.org/${NC}"
    echo
else
    NODE_VERSION=$(node -v)
    echo -e "${GREEN}✅ Node.js $NODE_VERSION is installed${NC}"
    
    # Check Node.js version
    NODE_MAJOR=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_MAJOR" -lt 18 ]; then
        echo -e "${YELLOW}⚠️  WARNING: Node.js version 18 or higher is required.${NC}"
        echo -e "${YELLOW}Current version: $NODE_VERSION${NC}"
        echo -e "${BLUE}🛠️  SOLUTION: Update Node.js from https://nodejs.org/${NC}"
        echo
    else
        echo -e "${GREEN}✅ Node.js version is compatible (18+)${NC}"
    fi
fi

# Check if npm is installed
echo -e "${BLUE}🔍 Checking npm installation...${NC}"
if ! command -v npm >/dev/null 2>&1; then
    echo -e "${RED}❌ ERROR: npm is not installed!${NC}"
    echo -e "${BLUE}🛠️  SOLUTION: Reinstall Node.js to include npm${NC}"
    echo
else
    NPM_VERSION=$(npm -v)
    echo -e "${GREEN}✅ npm $NPM_VERSION is installed${NC}"
fi

echo
echo -e "${BLUE}📊 PROJECT DIAGNOSTICS${NC}"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo

# Check if we're in the right directory
echo -e "${BLUE}🔍 Checking project structure...${NC}"
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ ERROR: package.json not found!${NC}"
    echo -e "${BLUE}Current directory: $(pwd)${NC}"
    echo -e "${BLUE}🛠️  SOLUTION: Run this script from the DiscordDemo folder${NC}"
    echo
else
    echo -e "${GREEN}✅ package.json found${NC}"
fi

# Check for TypeScript files
if [ ! -d "src/commands" ]; then
    echo -e "${RED}❌ ERROR: src/commands directory not found!${NC}"
    echo -e "${BLUE}🛠️  SOLUTION: Ensure you have the complete source code${NC}"
    echo
else
    echo -e "${GREEN}✅ src/commands directory found${NC}"
    
    # Count TypeScript files
    TS_COUNT=$(find src/commands -name "*.ts" | wc -l)
    if [ "$TS_COUNT" -eq 0 ]; then
        echo -e "${YELLOW}⚠️  WARNING: No TypeScript files found in src/commands/${NC}"
        echo -e "${YELLOW}This might indicate a problem with the source code.${NC}"
        echo
    else
        echo -e "${GREEN}✅ Found $TS_COUNT TypeScript command files${NC}"
    fi
fi

# Check for .env file
echo -e "${BLUE}🔍 Checking environment configuration...${NC}"
if [ ! -f ".env" ]; then
    echo -e "${RED}❌ ERROR: .env file not found!${NC}"
    echo -e "${BLUE}🛠️  SOLUTION: Create .env file from template: cp env.template .env${NC}"
    echo
else
    echo -e "${GREEN}✅ .env file found${NC}"
    
    # Check if token is configured
    if grep -q "your_discord_bot_token_here" .env; then
        echo -e "${YELLOW}⚠️  WARNING: Discord bot token not configured in .env file!${NC}"
        echo -e "${BLUE}🛠️  SOLUTION: Edit .env and replace 'your_discord_bot_token_here' with your actual token${NC}"
        echo
    else
        echo -e "${GREEN}✅ .env file appears to be configured${NC}"
    fi
fi

# Check for node_modules
echo -e "${BLUE}🔍 Checking dependencies...${NC}"
if [ ! -d "node_modules" ]; then
    echo -e "${RED}❌ ERROR: node_modules directory not found!${NC}"
    echo -e "${BLUE}🛠️  SOLUTION: Run 'npm install' to install dependencies${NC}"
    echo
else
    echo -e "${GREEN}✅ node_modules directory found${NC}"
fi

# Check for dist directory
echo -e "${BLUE}🔍 Checking compiled files...${NC}"
if [ ! -d "dist" ]; then
    echo -e "${YELLOW}⚠️  WARNING: dist directory not found!${NC}"
    echo -e "${BLUE}🛠️  SOLUTION: Run 'npm run build' to compile TypeScript${NC}"
    echo
else
    echo -e "${GREEN}✅ dist directory found${NC}"
    
    # Count compiled files
    JS_COUNT=$(find dist/commands -name "*.js" | wc -l)
    if [ "$JS_COUNT" -gt 0 ]; then
        echo -e "${GREEN}✅ Found $JS_COUNT compiled JavaScript files${NC}"
    else
        echo -e "${YELLOW}⚠️  WARNING: No compiled JavaScript files found${NC}"
        echo -e "${BLUE}🛠️  SOLUTION: Run 'npm run build' to compile TypeScript${NC}"
        echo
    fi
fi

echo
echo -e "${BLUE}📊 NETWORK DIAGNOSTICS${NC}"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo

# Check internet connectivity
echo -e "${BLUE}🔍 Checking internet connectivity...${NC}"
if ping -c 1 discord.com >/dev/null 2>&1; then
    echo -e "${GREEN}✅ Internet connectivity confirmed${NC}"
else
    echo -e "${RED}❌ ERROR: Cannot reach Discord servers!${NC}"
    echo -e "${BLUE}🛠️  SOLUTION: Check your internet connection${NC}"
    echo
fi

# Check Discord status
echo -e "${BLUE}🔍 Checking Discord status...${NC}"
if ping -c 1 status.discord.com >/dev/null 2>&1; then
    echo -e "${GREEN}✅ Discord status page accessible${NC}"
else
    echo -e "${YELLOW}⚠️  WARNING: Cannot reach Discord status page${NC}"
    echo -e "${BLUE}💡 Check Discord status at: https://status.discord.com/${NC}"
    echo
fi

echo
echo -e "${BLUE}📊 PERMISSION DIAGNOSTICS${NC}"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo

# Check file permissions
echo -e "${BLUE}🔍 Checking file permissions...${NC}"
if [ -f "setup.sh" ]; then
    if [ -x "setup.sh" ]; then
        echo -e "${GREEN}✅ setup.sh is executable${NC}"
    else
        echo -e "${YELLOW}⚠️  WARNING: setup.sh is not executable${NC}"
        echo -e "${BLUE}🛠️  SOLUTION: Run 'chmod +x setup.sh'${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  WARNING: setup.sh not found${NC}"
fi

if [ -f "start-linux.sh" ]; then
    if [ -x "start-linux.sh" ]; then
        echo -e "${GREEN}✅ start-linux.sh is executable${NC}"
    else
        echo -e "${YELLOW}⚠️  WARNING: start-linux.sh is not executable${NC}"
        echo -e "${BLUE}🛠️  SOLUTION: Run 'chmod +x start-linux.sh'${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  WARNING: start-linux.sh not found${NC}"
fi

if [ -f "launcher.js" ]; then
    if [ -x "launcher.js" ]; then
        echo -e "${GREEN}✅ launcher.js is executable${NC}"
    else
        echo -e "${YELLOW}⚠️  WARNING: launcher.js is not executable${NC}"
        echo -e "${BLUE}🛠️  SOLUTION: Run 'chmod +x launcher.js'${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  WARNING: launcher.js not found${NC}"
fi

echo
echo -e "${BLUE}📊 COMMON ISSUES & SOLUTIONS${NC}"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo

echo -e "${RED}🔧 CRITICAL: Discord Bot Intents Configuration${NC}"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo
echo -e "${BLUE}To fix the 'disallowed intents' error, you MUST enable these intents:${NC}"
echo
echo -e "${CYAN}1. Go to https://discord.com/developers/applications${NC}"
echo -e "${CYAN}2. Select your bot application${NC}"
echo -e "${CYAN}3. Go to 'Bot' section in the left sidebar${NC}"
echo -e "${CYAN}4. Scroll down to 'Privileged Gateway Intents'${NC}"
echo -e "${CYAN}5. Enable ALL THREE intents:${NC}"
echo -e "${GREEN}   ✅ PRESENCE INTENT${NC}"
echo -e "${GREEN}   ✅ SERVER MEMBERS INTENT${NC}"
echo -e "${GREEN}   ✅ MESSAGE CONTENT INTENT${NC}"
echo -e "${CYAN}6. Click 'Save Changes'${NC}"
echo

echo -e "${BLUE}🛠️  COMMON SOLUTIONS:${NC}"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo

echo -e "${RED}❌ 'Invalid Token' Error:${NC}"
echo -e "${BLUE}💡 SOLUTION: Check your .env file has the correct token${NC}"
echo -e "${BLUE}💡 Get a fresh token from Discord Developer Portal${NC}"
echo

echo -e "${RED}❌ 'Cannot find module' Error:${NC}"
echo -e "${BLUE}💡 SOLUTION: Run 'npm install' then 'npm run build'${NC}"
echo

echo -e "${RED}❌ 'Permission denied' Error:${NC}"
echo -e "${BLUE}💡 SOLUTION: Run 'chmod +x setup.sh' and 'chmod +x start-linux.sh'${NC}"
echo

echo -e "${RED}❌ 'Build failed' Error:${NC}"
echo -e "${BLUE}💡 SOLUTION: Clear cache: 'npm cache clean --force'${NC}"
echo -e "${BLUE}💡 Then: 'rm -rf node_modules && npm install'${NC}"
echo

echo -e "${RED}❌ 'Voice features not working':${NC}"
echo -e "${BLUE}💡 SOLUTION: Install FFmpeg: 'sudo apt install ffmpeg'${NC}"
echo

echo
echo -e "${CYAN}╔══════════════════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║                    🎉 DIAGNOSTICS COMPLETE! 🎉                              ║${NC}"
echo -e "${CYAN}╚══════════════════════════════════════════════════════════════════════════════╝${NC}"
echo
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo
echo -e "${PURPLE}💬 Need help? Join our Discord community!${NC}"
echo -e "${CYAN}🔗 https://discord.gg/a3tGyAwVRc${NC}"
echo
echo -e "${GREEN}Developed by quefep! 🚀${NC}"
echo 