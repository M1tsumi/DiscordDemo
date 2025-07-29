# TypeScript Discord Bot

This project is a template for a high-efficiency, utility-focused, and fast Discord bot using TypeScript and Discord.js.

## Prerequisites
- Node.js (v18+ recommended)
- Discord bot token (from the Discord Developer Portal)

## Setup
1. Copy your bot token into the `.env` file:
   ```env
   DISCORD_TOKEN=your-bot-token-here
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the bot in development mode:
   ```sh
   npm run dev
   ```
4. Build for production:
   ```sh
   npm run build
   ```
5. Start the built bot:
   ```sh
   npm start
   ```

## Project Structure
- `src/index.ts`: Main entry point
- `src/commands/`: Command modules
- `src/events/`: Event handlers

## Notes
- Use TypeScript for all source files.
- Organize commands and events for scalability.
