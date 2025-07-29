# 🤝 Contributing to Advanced Discord Bot

Thank you for your interest in contributing to our Discord bot! This document provides guidelines and information for contributors.

## 📋 Table of Contents

- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Code Style](#code-style)
- [Pull Request Process](#pull-request-process)
- [Feature Requests](#feature-requests)
- [Bug Reports](#bug-reports)
- [Contact](#contact)

## 🚀 Getting Started

### Prerequisites

- Node.js 18.0.0 or higher
- npm or yarn package manager
- Git
- Discord Bot Token (for testing)
- (Optional) Spotify API credentials
- (Optional) YouTube API key

### Development Setup

1. **Fork the repository**
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
   # Edit .env with your tokens
   ```

4. **Start development mode**
   ```bash
   npm run dev
   ```

## 🔧 Development Setup

### Project Structure

```
src/
├── commands/          # Bot commands organized by category
│   ├── Fun/          # Fun and entertainment commands
│   ├── Games/        # Game commands (Wordle, Hangman, etc.)
│   ├── General/      # General utility commands
│   ├── Information/  # Information and lookup commands
│   ├── Leveling/     # Leveling system commands
│   ├── Moderation/   # Moderation commands
│   ├── Music/        # Music playback commands
│   ├── RPG/          # RPG system commands
│   └── Utility/      # Utility and admin commands
├── events/           # Discord event handlers
├── services/         # Core services (leveling, RPG, etc.)
├── types/            # TypeScript type definitions
└── utils/            # Utility functions and helpers
```

### Adding New Commands

1. **Create a new command file** in the appropriate category folder
2. **Follow the command template**:

```typescript
import { Message, EmbedBuilder, SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { CommandCategory } from '../../types/Command';

export const data = {
  name: 'command-name',
  description: 'Description of what the command does',
  aliases: ['alias1', 'alias2'],
  category: CommandCategory.CATEGORY,
  usage: '!command-name [options]',
  cooldown: 5
};

export const slashData = new SlashCommandBuilder()
  .setName('command-name')
  .setDescription('Description of what the command does');

export async function execute(message: Message, args?: string[]) {
  // Command logic here
}

export async function executeSlash(interaction: ChatInputCommandInteraction) {
  // Slash command logic here
}
```

3. **Test your command** thoroughly
4. **Update documentation** if needed

### Adding New Features

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Implement the feature** following the code style guidelines

3. **Add tests** if applicable

4. **Update documentation** and README

5. **Submit a pull request**

## 📝 Code Style

### TypeScript Guidelines

- Use **strict TypeScript** configuration
- **Type everything** - avoid `any` when possible
- Use **interfaces** for object shapes
- Use **enums** for constants
- **Export types** from `src/types/`

### Naming Conventions

- **Files**: `camelCase.ts` (e.g., `userProfile.ts`)
- **Functions**: `camelCase` (e.g., `getUserProfile`)
- **Constants**: `UPPER_SNAKE_CASE` (e.g., `MAX_LEVEL`)
- **Interfaces**: `PascalCase` (e.g., `UserProfile`)
- **Classes**: `PascalCase` (e.g., `LevelingService`)

### Code Organization

- **One command per file**
- **Group related commands** in folders
- **Use services** for complex logic
- **Keep functions small** and focused
- **Add comments** for complex logic

### Error Handling

- **Always handle errors** in async functions
- **Use try-catch blocks** for external API calls
- **Log errors** appropriately
- **Provide user-friendly error messages**

## 🔄 Pull Request Process

### Before Submitting

1. **Test your changes** thoroughly
2. **Run the linter** (if configured)
3. **Update documentation** if needed
4. **Check for conflicts** with main branch

### Pull Request Guidelines

1. **Use descriptive titles** (e.g., "Add user profile command")
2. **Provide detailed descriptions** of changes
3. **Include screenshots** for UI changes
4. **Reference issues** if applicable
5. **Add tests** for new features

### Review Process

- **Code review** by maintainers
- **Automated checks** must pass
- **Manual testing** may be required
- **Documentation updates** if needed

## 💡 Feature Requests

### Suggesting Features

1. **Check existing issues** first
2. **Use the feature request template**
3. **Provide detailed descriptions**
4. **Include use cases** and examples
5. **Consider implementation complexity**

### Feature Request Template

```markdown
## Feature Request: [Feature Name]

### Description
Brief description of the feature

### Use Cases
- Use case 1
- Use case 2

### Proposed Implementation
How you think it should work

### Additional Context
Any other relevant information
```

## 🐛 Bug Reports

### Reporting Bugs

1. **Check existing issues** first
2. **Use the bug report template**
3. **Include reproduction steps**
4. **Provide error logs**
5. **Include system information**

### Bug Report Template

```markdown
## Bug Report: [Brief Description]

### Description
What happened vs what was expected

### Steps to Reproduce
1. Step 1
2. Step 2
3. Step 3

### Error Logs
```
Error message here
```

### System Information
- Node.js version:
- Operating system:
- Bot version:

### Additional Context
Any other relevant information
```

## 📞 Contact

### Getting Help

- **Discord**: @quefep
- **GitHub Issues**: [Create an issue](https://github.com/yourusername/advanced-discord-bot/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/advanced-discord-bot/discussions)

### Development Support

For development questions, feature discussions, or collaboration:

- **Discord**: @quefep
- **Email**: (if provided)
- **GitHub**: [Profile](https://github.com/yourusername)

## 🙏 Acknowledgments

Thank you to all contributors who help improve this bot! Your contributions make the Discord community better for everyone.

---

**Remember**: Be respectful, patient, and helpful to other contributors. We're all here to make something great together! 🚀 