# 🎮 Discord Bot Demo

A feature-rich Discord bot built with TypeScript and Discord.js, featuring advanced leveling systems, RPG mechanics, music playback, moderation tools, and much more!

## 🚀 Quick Start

### Windows Users
[![Windows](https://img.shields.io/badge/Windows-0078D6?style=for-the-badge&logo=windows&logoColor=white)](setup.bat)

**Double-click** `setup.bat` to automatically install and configure your bot!

### Linux/Mac Users
[![Linux](https://img.shields.io/badge/Linux-FCC624?style=for-the-badge&logo=linux&logoColor=black)](setup.sh)
[![macOS](https://img.shields.io/badge/macOS-000000?style=for-the-badge&logo=macos&logoColor=white)](setup.sh)

**Run** `./setup.sh` in your terminal to automatically install and configure your bot!

### 🎮 Bot Manager (Optional)
After setup, you can use the web-based bot manager for easy configuration:

**Windows:** Double-click `start-bot-manager.bat`  
**Linux/Mac:** Run `./start-bot-manager.sh`

This opens a beautiful web interface at `http://localhost:3000` where you can:
- Configure your bot token
- Start/stop your bot
- Monitor bot status
- Manage settings through a user-friendly GUI

---

## ✨ Features

### 🎵 **Music System**
- **YouTube Integration**: Play music directly from YouTube URLs
- **Spotify Support**: Play tracks from Spotify with automatic YouTube conversion
- **Queue Management**: Advanced music queue with skip, pause, and resume functionality
- **High-Quality Audio**: FFmpeg integration for optimal audio quality

### 🏆 **Advanced Leveling System**
- **Dynamic XP Calculation**: Complex formula with random factors (8-15 XP base)
- **Voice Channel Integration**: Earn XP for time spent in voice channels
- **Streak System**: Bonus XP for consecutive days of activity
- **Anti-Spam Protection**: Intelligent cooldown system
- **Message Length Bonuses**: More XP for longer, meaningful messages
- **Daily Bonuses**: Extra XP for first message of the day

### 🎭 **RPG System**
- **Character Creation**: Choose from Warrior, Mage, Archer, or Priest classes
- **Combat Stats**: Strength, Dexterity, Intelligence, Vitality, Wisdom, Charisma
- **Adventure System**: Explore dungeons and battle enemies
- **Training Mechanics**: Improve specific stats through training
- **Quest System**: Complete objectives for rewards
- **Equipment & Inventory**: Manage gear and items
- **Daily Rewards**: Claim daily bonuses and items

### 🛡️ **Moderation Tools**
- **Ban/Kick System**: Advanced user management
- **Mute/Unmute**: Temporary and permanent voice/text mutes
- **Warning System**: Track user warnings with automatic actions
- **Anti-Spam**: Intelligent spam detection and prevention
- **Raid Protection**: Automatic raid detection and response
- **Logging**: Comprehensive action logging

### 🎮 **Fun & Games**
- **Wordle**: Daily word guessing game with 575+ 5-letter words
- **Hangman**: Classic word guessing game
- **Tic-Tac-Toe**: Interactive multiplayer game
- **Trivia**: Knowledge-based questions
- **Polls**: Interactive voting system
- **8-Ball**: Fortune telling
- **Ship Calculator**: Relationship compatibility
- **Roast Generator**: Fun insult generator

### 🛠️ **Utility Commands**
- **Translation**: Multi-language translation support
- **Weather**: Real-time weather information
- **Calculator**: Advanced mathematical operations
- **Reminder System**: Set and manage reminders
- **Webhook Management**: Create and manage webhooks
- **Server Analytics**: Detailed server statistics

### 📊 **Information Commands**
- **User Profiles**: Detailed user information and statistics
- **Server Info**: Comprehensive server analytics
- **Bot Statistics**: Performance and usage metrics
- **Avatar Display**: High-quality avatar viewing

## 🚀 Installation

### Prerequisites
- Node.js 18.0.0 or higher
- npm or yarn package manager
- Discord Bot Token

### Automatic Setup (Recommended)

#### Windows
1. **Download and extract** the bot files
2. **Double-click** `setup.bat`
3. **Follow the prompts** to configure your bot
4. **Start your bot** with `npm start`

#### Linux/Mac
1. **Download and extract** the bot files
2. **Open terminal** in the bot directory
3. **Run** `chmod +x setup.sh && ./setup.sh`
4. **Follow the prompts** to configure your bot
5. **Start your bot** with `npm start`

### Manual Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/advanced-discord-bot.git
   cd advanced-discord-bot
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

5. **Start the bot**
   ```bash
   npm start
   ```

### Development Mode
For development with auto-restart:
```bash
npm run dev
```

## ⚙️ Configuration

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

Your bot needs the following permissions:
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

## 📋 Commands

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
- `!trivia` - Play Trivia
- `!poll <question>` - Create a poll
- `!8ball <question>` - Ask the magic 8-ball
- `!ship <user1> <user2>` - Calculate relationship compatibility

### 🛠️ Utility Commands
- `!translate <text> <language>` - Translate text
- `!weather <location>` - Get weather information
- `!calculator <expression>` - Perform calculations
- `!reminder <time> <message>` - Set a reminder
- `!avatar [@user]` - Display user avatar

### 📊 Information Commands
- `!userinfo [@user]` - Display user information
- `!serverinfo` - Display server information
- `!botstats` - Display bot statistics
- `!help [category]` - Display help information

## 🔧 Advanced Features

### XP System Details
The bot features a sophisticated XP system that rewards various activities:

- **Base XP**: 8-15 XP per message (random)
- **Message Length**: Up to 5 bonus XP for longer messages
- **Streak Bonus**: Up to 10 XP for consecutive days
- **Voice Time**: Up to 5 XP bonus based on voice channel time
- **Daily Bonus**: 5 XP for first message of the day
- **Anti-Spam**: 70% reduction for messages within 30 seconds

### Voice Channel Integration
- **Automatic Tracking**: XP awarded for time spent in voice channels
- **Periodic Updates**: XP awarded every 5 minutes for active voice users
- **Session Bonuses**: Extra XP for longer voice sessions (30+ minutes)

### RPG System Features
- **4 Character Classes**: Warrior, Mage, Archer, Priest
- **6 Core Stats**: Strength, Dexterity, Intelligence, Vitality, Wisdom, Charisma
- **Combat System**: Attack, Defense, Magic Attack, Magic Defense
- **Resource Management**: HP, Mana, Stamina
- **Equipment System**: Weapons, armor, accessories
- **Quest System**: Objectives with requirements and rewards
- **Dungeon System**: Adventure locations with enemies and loot

## 🐛 Troubleshooting

### Common Issues

**npm not found error when starting bot manager**
- **Solution 1**: Run `fix-npm.bat` for automatic npm fixing
- **Solution 2**: Run `install-npm.bat` or `install-npm.ps1` for automated help
- **Solution 3**: Reinstall Node.js from https://nodejs.org/ (includes npm)
- **Solution 4**: Restart your computer after installing Node.js
- **Solution 5**: Run as administrator
- **Solution 6**: Check Windows Defender/firewall settings
- **Solution 7**: Manually add npm to your PATH environment variable

**Bot doesn't respond to commands**
- Check if the bot has proper permissions
- Verify the bot token is correct
- Ensure the bot is online and connected

**Music doesn't play**
- Check if FFmpeg is properly installed
- Verify YouTube/Spotify API credentials
- Ensure the bot has voice permissions

**XP system not working**
- Check if leveling is enabled in server settings
- Verify the bot has message permissions
- Check the data files for corruption

**Voice XP not tracking**
- Ensure the bot has voice state permissions
- Check if users are actually in voice channels
- Verify the voice tracking system is active

### Logs and Debugging
Enable debug mode by setting the environment variable:
```env
DEBUG=true
```

## 🤝 Contributing

We welcome contributions! Please see our [CONTRIBUTING.md](CONTRIBUTING.md) file for detailed guidelines.

### Quick Contributing Steps
1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support & Contact

### Development & Support
For suggestions, concerns, donations, or development inquiries, contact:
- **Discord**: @quefep
- **GitHub Issues**: [Create an issue](https://github.com/M1tsumi/DiscordDemo/issues/new/choose)

### Features Under Development
Some features are still in active development. For the latest updates and feature requests, please contact @quefep on Discord.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Discord.js** - The amazing Discord API library
- **play-dl** - YouTube and Spotify integration
- **FFmpeg** - Audio processing capabilities
- **Community Contributors** - All the amazing people who help improve this bot

## 📈 Roadmap

- [ ] Advanced music filters and effects
- [ ] More RPG classes and abilities
- [ ] Advanced moderation AI
- [ ] Custom command creation system
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] Mobile app companion

---

**⭐ Star this repository if you find it helpful!**

**💖 Consider supporting the development by contacting @quefep on Discord for donation options.** 
