# ⚡ Quick Start Guide

Get your Discord bot running in 5 minutes!

## 🚀 Super Quick Setup

### 1. Prerequisites
- Node.js 18+ installed
- Discord Bot Token ready

### 2. One-Command Setup

**Windows:**
```bash
start-bot-manager.bat
```

**Linux/Mac:**
```bash
chmod +x setup.sh
./setup.sh
```

### 3. Configure Your Bot

Edit the `.env` file:
```env
DISCORD_TOKEN=your_bot_token_here
```

### 4. 🔧 CRITICAL: Enable Discord Bot Intents

**This is the MOST IMPORTANT step to fix the "disallowed intents" error:**

1. Go to https://discord.com/developers/applications
2. Select your bot application
3. Go to "Bot" section in the left sidebar
4. Scroll down to "Privileged Gateway Intents"
5. Enable ALL THREE intents:
   - ✅ **PRESENCE INTENT**
   - ✅ **SERVER MEMBERS INTENT**
   - ✅ **MESSAGE CONTENT INTENT**
6. Click "Save Changes"

**Without this step, your bot will get the "disallowed intents" error!**

### 5. Start the Bot

**Production:**
```bash
npm start
```

**Development (with auto-restart):**
```bash
npm run dev
```

## 🎯 What You Get

✅ **71 Commands** across 8 categories  
✅ **Advanced Leveling System** with voice XP  
✅ **RPG System** with 4 character classes  
✅ **Music Playback** from YouTube & Spotify  
✅ **Moderation Tools** with anti-spam  
✅ **Fun Games** like Wordle, Hangman, Tic-Tac-Toe  
✅ **Utility Commands** for server management  

## 🔧 Essential Commands

| Command | Description |
|---------|-------------|
| `!help` | View all commands |
| `!profile-level` | Check your level |
| `!create` | Start RPG character |
| `!play <url>` | Play music |
| `!wordle` | Play Wordle |

## 🛠️ Customization

### Bot Prefix
Edit `.env`:
```env
BOT_PREFIX=!
```

### Enable/Disable Features
Use admin commands:
- `!adminset` - Configure bot settings
- `!setprefix` - Change server prefix

## 🚨 Troubleshooting

### ❌ "Disallowed Intents" Error
**This is the most common error!**

**Error:** `used disallowed intents at websocketshard connection.onclose`

**Solution:**
1. Go to https://discord.com/developers/applications
2. Select your bot application
3. Go to "Bot" section
4. Enable all three Privileged Gateway Intents:
   - ✅ PRESENCE INTENT
   - ✅ SERVER MEMBERS INTENT
   - ✅ MESSAGE CONTENT INTENT
5. Click "Save Changes"
6. Restart your bot

### ❌ "Invalid Token" Error
1. Check your `.env` file has the correct token
2. Get a fresh token from Discord Developer Portal
3. Make sure there are no extra spaces

### ❌ Other Issues
Run the troubleshooting script:
- **Windows:** `troubleshoot.bat`
- **Linux/Mac:** `./troubleshoot.sh`

## 📞 Need Help?

- **Discord**: @quefep
- **Issues**: GitHub Issues
- **Documentation**: See README.md

## 🎮 Advanced Features

### XP System
- **8-15 XP** per message (random)
- **Voice channel XP** for time spent
- **Streak bonuses** for daily activity
- **Anti-spam protection**

### RPG System
- **4 Classes**: Warrior, Mage, Archer, Priest
- **6 Stats**: Strength, Dexterity, Intelligence, Vitality, Wisdom, Charisma
- **Adventures**: Explore dungeons and battle enemies
- **Training**: Improve specific stats
- **Equipment**: Weapons, armor, accessories

### Music System
- **YouTube URLs** and search
- **Spotify integration**
- **Queue management**
- **Voice controls**

## 🔄 Quick Commands

### Setup Commands
```bash
# Install dependencies
npm install

# Build the project
npm run build

# Start in production
npm start

# Start in development
npm run dev

# Troubleshoot issues
./troubleshoot.sh  # Linux/Mac
troubleshoot.bat   # Windows
```

### Bot Commands
```
!help              # View all commands
!profile-level     # Check your level
!create            # Start RPG character
!play <url>        # Play music
!wordle            # Play Wordle
!adminset          # Configure bot settings
```

## 🎯 Success Checklist

- [ ] Node.js 18+ installed
- [ ] Dependencies installed (`npm install`)
- [ ] Project built (`npm run build`)
- [ ] `.env` file configured with bot token
- [ ] **Discord intents enabled** (most important!)
- [ ] Bot invited to server with proper permissions
- [ ] Bot responds to `!help` command

**If you follow these steps, your bot should work perfectly!** 