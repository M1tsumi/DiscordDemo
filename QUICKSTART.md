# 🚀 Quick Start Guide - Discord Bot Setup

<div align="center">

[![Discord](https://img.shields.io/badge/Discord-Join%20Community-7289DA?style=for-the-badge&logo=discord&logoColor=white)](https://discord.gg/a3tGyAwVRc)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

**💬 Need help? Join our Discord community!**  
**🔗 https://discord.gg/a3tGyAwVRc**

</div>

---

## ⚡ 5-Minute Setup

### Prerequisites
- **Node.js 18.0.0 or higher** - [Download here](https://nodejs.org/)
- **Discord Bot Token** - Get from [Discord Developer Portal](https://discord.com/developers/applications)

---

## 🪟 Windows Setup (Recommended)

### Step 1: Download & Extract
1. Download the Discord bot files
2. Extract to a folder (e.g., `C:\DiscordBot`)

### Step 2: Run the Launcher
1. **Double-click** `start-bot-manager.bat`
2. The launcher will automatically:
   - Check your system requirements
   - Install dependencies
   - Create configuration files
   - Guide you through setup

### Step 3: Configure Your Bot
1. Edit the `.env` file with your Discord bot token
2. Get your token from: https://discord.com/developers/applications

### Step 4: Start Your Bot
```bash
npm start
```

---

## 🐧 Linux/Mac Setup

### Step 1: Download & Extract
```bash
# Download and extract the files
cd ~/Downloads
tar -xzf DiscordBot.tar.gz
cd DiscordBot
```

### Step 2: Run the Setup Script
```bash
# Make the script executable
chmod +x setup.sh

# Run the setup script
./setup.sh
```

### Step 3: Configure Your Bot
```bash
# Edit the .env file with your token
nano .env
```

### Step 4: Start Your Bot
```bash
npm start
```

---

## 🔧 Manual Setup

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Create Environment File
```bash
cp env.template .env
```

### Step 3: Configure Your Bot
Edit `.env` file:
```env
DISCORD_TOKEN=your_discord_bot_token_here
```

### Step 4: Build the Project
```bash
npm run build
```

### Step 5: Start Your Bot
```bash
npm start
```

---

## ⚠️ Critical: Discord Bot Intents

**You MUST enable these intents in your Discord application:**

1. Go to https://discord.com/developers/applications
2. Select your bot application
3. Go to "Bot" section in the left sidebar
4. Scroll down to "Privileged Gateway Intents"
5. Enable ALL THREE intents:
   - ✅ **PRESENCE INTENT**
   - ✅ **SERVER MEMBERS INTENT**
   - ✅ **MESSAGE CONTENT INTENT**
6. Click "Save Changes"

---

## 🛠️ Troubleshooting

### Common Issues

**❌ "Invalid Token" Error**
- Check your `.env` file has the correct token
- Get a fresh token from Discord Developer Portal

**❌ "Disallowed Intents" Error**
- Enable the three intents listed above in Discord Developer Portal

**❌ "Cannot find module" Error**
- Run: `npm install`
- Run: `npm run build`

**❌ Permission Errors (Linux)**
- Run: `chmod +x setup.sh`
- Run: `chmod +x start-linux.sh`

### Quick Fixes

**🔄 Rebuild Everything:**
```bash
rm -rf node_modules dist
npm install
npm run build
```

**🔄 Development Mode:**
```bash
npm run dev
```

**🔄 Production Mode:**
```bash
npm start
```

---

## 📋 Bot Permissions

Your Discord bot needs these permissions:
- ✅ Send Messages
- ✅ Manage Messages
- ✅ Embed Links
- ✅ Attach Files
- ✅ Use External Emojis
- ✅ Add Reactions
- ✅ Connect (for voice features)
- ✅ Speak (for voice features)
- ✅ Use Voice Activity
- ✅ Ban Members (for moderation)
- ✅ Kick Members (for moderation)
- ✅ Manage Roles (for moderation)

---

## 🎯 Next Steps

1. **Invite your bot to your server**
2. **Test basic commands**: `!help`, `!ping`
3. **Explore features**: Music, RPG, Leveling, Moderation
4. **Customize settings**: Edit configuration files
5. **Join our community**: Get help and share feedback

---

## 🆘 Need Help?

<div align="center">

**💬 Join our Discord community for support!**  
**🔗 https://discord.gg/a3tGyAwVRc**

[![Discord](https://img.shields.io/badge/Discord-Join%20Community-7289DA?style=for-the-badge&logo=discord&logoColor=white)](https://discord.gg/a3tGyAwVRc)

</div>

- **Discord**: @quefep
- **Issues**: GitHub Issues
- **Documentation**: See README.md

---

<div align="center">

**Developed by quefep! 🚀**

[![Discord](https://img.shields.io/badge/Discord-Join%20Community-7289DA?style=for-the-badge&logo=discord&logoColor=white)](https://discord.gg/a3tGyAwVRc)

</div> 