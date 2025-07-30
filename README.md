# 🤖 Advanced Discord Bot

A feature-rich Discord bot with advanced leveling, RPG mechanics, music playback, and moderation tools. Built with TypeScript and Discord.js v14.

<div align="center">

[![Discord](https://img.shields.io/badge/Discord-Join%20Community-7289DA?style=for-the-badge&logo=discord&logoColor=white)](https://discord.gg/a3tGyAwVRc)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Discord.js](https://img.shields.io/badge/Discord.js-14.0+-blue?style=for-the-badge&logo=discord&logoColor=white)](https://discord.js.org/)

**💬 Need help? Join our Discord community!**  
**🔗 https://discord.gg/a3tGyAwVRc**

</div>

---

## ✨ Features

### 🎵 **Music System - Discord Music Bot**
- **YouTube Integration**: Play from URLs or search queries
- **Spotify Support**: Direct Spotify track and playlist playback
- **Queue Management**: Advanced queue with shuffle and loop
- **Voice Controls**: Skip, pause, resume, and volume control
- **High-Quality Audio**: FFmpeg integration for optimal sound

### 🏆 **Leveling System - Discord XP Bot**
- **Message XP**: Earn XP for every message sent
- **Voice XP**: Bonus XP for time spent in voice channels
- **Level Progression**: 100 XP per level with exponential scaling
- **Anti-Spam Protection**: Prevents XP farming
- **Leaderboards**: Server-wide and global rankings
- **Profile Cards**: Beautiful level display with avatars

### 🎭 **RPG System - Discord RPG Bot**
- **4 Character Classes**: Warrior, Mage, Archer, Priest
- **6 Core Stats**: Strength, Dexterity, Intelligence, Vitality, Wisdom, Charisma
- **Adventure System**: Explore dungeons and battle enemies
- **Equipment System**: Weapons, armor, and accessories
- **Training System**: Improve specific stats
- **Daily Rewards**: Claim daily bonuses and rest periods

### 🛡️ **Moderation Tools - Discord Mod Bot**
- **Auto-Moderation**: Anti-spam and raid protection
- **User Management**: Ban, kick, mute, and warn commands
- **Logging System**: Comprehensive action logging
- **Verification System**: Role-based verification
- **Anti-Raid**: Automatic raid detection and response

### 🎮 **Fun & Games - Discord Game Bot**
- **Wordle**: Classic word guessing game
- **Hangman**: Interactive hangman with custom words
- **Tic-Tac-Toe**: Multiplayer tic-tac-toe
- **Trivia**: Quiz system with multiple categories
- **Would You Rather**: Interactive polls
- **Ship Calculator**: Relationship compatibility

### 🛠️ **Utility Commands - Discord Bot Utilities**
- **Translation**: Multi-language translation support
- **Weather**: Real-time weather information
- **Calculator**: Advanced mathematical operations
- **Reminder System**: Set and manage reminders
- **Webhook Management**: Create and manage webhooks
- **Server Analytics**: Detailed server statistics

### 📊 **Information Commands - Discord Bot Info**
- **User Profiles**: Detailed user information and statistics
- **Server Info**: Comprehensive server analytics
- **Bot Statistics**: Performance and usage metrics
- **Avatar Display**: High-quality avatar viewing

---

## 🚀 Quick Start - Discord Bot Setup

### Prerequisites
- Node.js 18.0.0 or higher
- npm or yarn package manager
- Discord Bot Token

### 🪟 Windows Installation

1. **Download and extract** the Discord bot files
2. **Double-click** `start-bot-manager.bat`
3. **Follow the prompts** to configure your Discord bot
4. **Start your bot** with `npm start`

### 🐧 Linux/Mac Installation

1. **Download and extract** the Discord bot files
2. **Open terminal** in the bot directory
3. **Make setup script executable**: `chmod +x setup.sh`
4. **Run the setup script**: `./setup.sh`
5. **Edit the .env file** with your Discord bot token
6. **Start your bot** with `npm start`

**Troubleshooting:**
- If you get permission errors, try: `chmod +x setup.sh`
- If npm install fails, try: `sudo apt update && sudo apt install build-essential`
- For voice features, you may need: `sudo apt install ffmpeg`

### Manual Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/M1tsumi/DiscordDemo.git
   cd DiscordDemo
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.template .env
   ```
   Edit `.env` with your configuration (see Configuration section below)

4. **Build the project**
   ```bash
   npm run build
   ```

5. **Start the Discord bot**
   ```bash
   npm start
   ```

### Development Mode
For development with auto-restart:
```bash
npm run dev
```

---

## ⚙️ Configuration - Discord Bot Settings

### Environment Variables (.env)

```env
# Required: Discord Bot Token
DISCORD_TOKEN=your_discord_bot_token_here

# Optional: Spotify API (for enhanced music features)
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret

# Optional: YouTube API (for enhanced video features)
YOUTUBE_API_KEY=your_youtube_api_key
```

### Bot Permissions

Your Discord bot needs the following permissions:
- **Send Messages**
- **Manage Messages**
- **Embed Links**
- **Attach Files**
- **Use External Emojis**
- **Add Reactions**
- **Connect** (for voice features)
- **Speak** (for voice features)
- **Use Voice Activity**
- **Ban Members** (for moderation)
- **Kick Members** (for moderation)
- **Manage Roles** (for moderation)

### 🔧 CRITICAL: Discord Bot Intents Configuration

**To fix the "disallowed intents" error, you MUST enable these intents in your Discord application:**

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

## 🛠️ Troubleshooting - Common Discord Bot Issues

### ❌ "Disallowed Intents" Error
**Error Message:** `used disallowed intents at websocketshard connection.onclose`

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
**Error Message:** `Invalid token`

**Solution:**
1. Check your `.env` file has the correct token
2. Get a fresh token from Discord Developer Portal
3. Make sure there are no extra spaces or characters
4. Verify the token is copied correctly

### ❌ "Cannot find module" Error
**Error Message:** `Cannot find module './dist/index.js'`

**Solution:**
1. Run `npm run build` to compile TypeScript
2. Make sure the `dist` folder exists
3. Check that all dependencies are installed: `npm install`

### ❌ Permission Errors (Linux)
**Error Message:** `Permission denied`

**Solution:**
```bash
chmod +x setup.sh
chmod +x start-linux.sh
```

### ❌ Voice Features Not Working
**Error Message:** `FFmpeg not found`

**Solution:**
```bash
# Ubuntu/Debian
sudo apt update && sudo apt install ffmpeg

# CentOS/RHEL
sudo yum install ffmpeg

# macOS
brew install ffmpeg
```

### ❌ Node.js Version Issues
**Error Message:** `SyntaxError: Unexpected token`

**Solution:**
1. Update Node.js to version 18 or higher
2. Download from: https://nodejs.org/
3. Verify with: `node --version`

### ❌ Environment Variables Not Loading
**Error Message:** `DISCORD_TOKEN is not set`

**Solution:**
1. Make sure `.env` file exists in the root directory
2. Check the file format (no spaces around `=`)
3. Restart the bot after editing `.env`

### ❌ Build Errors
**Error Message:** TypeScript compilation errors

**Solution:**
1. Clear build cache: `rm -rf dist/`
2. Reinstall dependencies: `rm -rf node_modules && npm install`
3. Rebuild: `npm run build`

### ❌ Runtime Errors
**Error Message:** Various runtime errors

**Solution:**
1. Check Discord status: https://status.discord.com/
2. Verify bot permissions in servers
3. Check console for specific error messages
4. Try development mode: `npm run dev`

---

## 📋 Commands - Discord Bot Commands

### 🎵 Music Commands
- `!play <url/query>` - Play music from YouTube or Spotify
- `!queue` - Display current music queue
- `!skip` - Skip current song
- `!stop` - Stop playback and clear queue

### 🏆 Leveling Commands
- `!profile-level` - View your leveling profile
- `!leaderboard-level` - View server leveling rankings
- `!rank` - View your rank and top users

### 🎭 RPG Commands
- `!create` - Create your RPG character
- `!profile-rpg` - View your RPG character profile
- `!adventure` - Start an adventure in dungeons
- `!train` - Train your character stats
- `!daily` - Claim daily rewards
- `!rest` - Restore HP, Mana, and Stamina
- `!leaderboard-rpg` - View RPG rankings
- `!rank-rpg` - View your RPG rank

### 🛡️ Moderation Commands
- `!ban <user> [reason]` - Ban a user
- `!kick <user> [reason]` - Kick a user
- `!mute <user> [duration] [reason]` - Mute a user
- `!warn <user> [reason]` - Warn a user
- `!purge <amount>` - Delete multiple messages

### 🎮 Fun Commands
- `!wordle` - Play Wordle
- `!hangman` - Play Hangman
- `!tictactoe <@user>` - Play Tic-Tac-Toe
- `!trivia` - Start a trivia game
- `!joke` - Get a random joke
- `!meme` - Get a random meme
- `!quote` - Get an inspirational quote

### 🛠️ Utility Commands
- `!translate <text>` - Translate text
- `!weather <city>` - Get weather information
- `!calculator <expression>` - Calculate math expressions
- `!reminder <time> <message>` - Set a reminder
- `!help` - View all commands

---

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

### Development Setup
1. Fork the repository
2. Install dependencies: `npm install`
3. Set up environment: `cp env.template .env`
4. Start development: `npm run dev`

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🆘 Support

<div align="center">

**💬 Need help? Join our Discord community!**  
**🔗 https://discord.gg/a3tGyAwVRc**

[![Discord](https://img.shields.io/badge/Discord-Join%20Community-7289DA?style=for-the-badge&logo=discord&logoColor=white)](https://discord.gg/a3tGyAwVRc)

</div>

- **Discord**: @quefep
- **Issues**: GitHub Issues
- **Documentation**: See README.md

---

## 🔄 Updates

Stay updated with the latest features and bug fixes by checking our releases regularly.

**Last Updated:** December 2024

---

<div align="center">

**Developed by quefep! 🚀**

[![Discord](https://img.shields.io/badge/Discord-Join%20Community-7289DA?style=for-the-badge&logo=discord&logoColor=white)](https://discord.gg/a3tGyAwVRc)

</div>
