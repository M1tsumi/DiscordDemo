import { Client, GatewayIntentBits } from 'discord.js';
import { config } from 'dotenv';
import { CommandHandler } from './services/commandHandler.js';
import { LevelingService } from './services/levelingService.js';
import { SettingsService } from './services/settingsService.js';
import { AdminService } from './services/adminService.js';
import { RPGService } from './services/rpgService.js';
import { initializePlayDL } from './utils/playDLInit.js';
import { EmbedBuilder } from 'discord.js';

config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildVoiceStates // This is crucial for voice functionality
  ]
});

// Initialize services
export const settingsService = new SettingsService();
export const adminService = new AdminService();
export const commandHandler = new CommandHandler(client);
export const levelingService = new LevelingService();
export const rpgService = new RPGService();

client.once('ready', async () => {
  console.log(`🤖 ${client.user?.tag} is online!`);
  
  // Initialize play-dl for music functionality
  await initializePlayDL();
  
  // Load all commands
  await commandHandler.loadCommands();
  
  console.log('✅ Bot is ready to receive commands!');
});

// Handle message-based commands
client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  // Award XP for every message (only in guilds)
  if (message.guild) {
    const settings = settingsService.getSettings(message.guild.id);
    if (settings.enableLeveling) {
      const result = levelingService.addMessageXP({
        id: message.author.id,
        username: message.author.username,
        avatar: message.author.displayAvatarURL()
      }, message.content.length);
      
      // Optional: Show XP gained (you can remove this if you don't want it)
      if (result.xpGained > 0 && Math.random() < 0.1) { // 10% chance to show XP
        const embed = new EmbedBuilder()
          .setDescription(`💫 **${message.author.username}** gained **${result.xpGained} XP**!`)
          .setColor(0x00ff00)
          .setFooter({ text: `Level ${result.profile.level} • ${result.profile.xp} total XP` });
        
        // Send as a temporary message that deletes after 3 seconds
        const xpMessage = await message.channel.send({ embeds: [embed] });
        setTimeout(() => {
          xpMessage.delete().catch(() => {}); // Ignore errors if message is already deleted
        }, 3000);
      }
    }
  }

  // Check for hangman game input
  const { handleHangmanMessage } = await import('./commands/Games/hangman.js');
  const hangmanHandled = await handleHangmanMessage(message);
  
  // Check for trivia answer input
  const { handleTriviaAnswer } = await import('./commands/Fun/trivia.js');
  const triviaHandled = await handleTriviaAnswer(message);
  
  // Check for wordle answer input
  const { handleWordleAnswer } = await import('./commands/Fun/wordle.js');
  const wordleHandled = await handleWordleAnswer(message);

  // If any game handled the message, don't process it as a command
  if (hangmanHandled || triviaHandled || wordleHandled) {
    return;
  }

  // Handle prefix commands with dynamic prefix
  if (message.guild) {
    const prefix = settingsService.getPrefix(message.guild.id);
    commandHandler.prefix = prefix;
  }

  await commandHandler.handlePrefixCommand(message);
});

// Voice channel tracking
client.on('voiceStateUpdate', async (oldState, newState) => {
  // User joined a voice channel
  if (!oldState.channelId && newState.channelId) {
    console.log(`🎤 ${newState.member?.displayName} joined voice channel: ${newState.channel?.name}`);
  }
  
  // User left a voice channel
  if (oldState.channelId && !newState.channelId) {
    console.log(`👋 ${oldState.member?.displayName} left voice channel: ${oldState.channel?.name}`);
  }
});

// Handle slash commands
client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  try {
    await commandHandler.handleSlashCommand(interaction);
  } catch (error) {
    console.error('Error handling slash command:', error);
  }
});

// Handle button interactions
client.on('interactionCreate', async (interaction) => {
  if (!interaction.isButton()) return;

  try {
    // Handle copy translation button
    if (interaction.customId.startsWith('copy_translation_')) {
      const { handleCopyTranslation } = await import('./commands/Utility/translate.js');
      await handleCopyTranslation(interaction);
      return;
    }

    // Handle poll interactions
    if (interaction.customId.startsWith('poll_')) {
      const { handlePollInteraction } = await import('./commands/Fun/poll.js');
      await handlePollInteraction(interaction);
      return;
    }

    // Handle tic-tac-toe interactions
    if (interaction.customId.startsWith('tictactoe_')) {
      const { handleTicTacToeInteraction } = await import('./commands/Games/tictactoe.js');
      await handleTicTacToeInteraction(interaction);
      return;
    }

    // Handle admin settings interactions
    if (interaction.customId.startsWith('admin_')) {
      const { handleAdminInteraction } = await import('./commands/Utility/adminset.js');
      await handleAdminInteraction(interaction);
      return;
    }

    // Handle would you rather interactions
    if (interaction.customId.startsWith('wyr_')) {
      const { handleWYRInteraction } = await import('./commands/Fun/wouldyourather.js');
      await handleWYRInteraction(interaction);
      return;
    }

    // Handle hangman interactions
    if (interaction.customId.startsWith('hangman_')) {
      const { handleHangmanInteraction } = await import('./commands/Games/hangman.js');
      await handleHangmanInteraction(interaction);
      return;
    }

    // Handle translate interactions
    if (interaction.customId.startsWith('translate_')) {
      const { handleTranslateInteraction } = await import('./commands/Utility/translate.js');
      await handleTranslateInteraction(interaction);
      return;
    }

    // Handle help category interactions
    if (interaction.customId.startsWith('help_category_')) {
      const { handleHelpCategoryInteraction } = await import('./commands/General/help.js');
      await handleHelpCategoryInteraction(interaction);
      return;
    }

    // Handle create character interactions
    if (interaction.customId.startsWith('create_character_')) {
      const { handleCreateCharacterInteraction } = await import('./commands/RPG/create.js');
      await handleCreateCharacterInteraction(interaction);
      return;
    }

    // Handle train stat interactions
    if (interaction.customId.startsWith('train_stat_')) {
      const { handleTrainStatInteraction } = await import('./commands/RPG/train.js');
      await handleTrainStatInteraction(interaction);
      return;
    }

  } catch (error) {
    console.error('Error handling button interaction:', error);
    await interaction.reply({ content: '❌ An error occurred while processing your interaction.', ephemeral: true });
  }
});

// Handle string select menu interactions
client.on('interactionCreate', async (interaction) => {
  if (!interaction.isStringSelectMenu()) return;

  try {
    // Handle help category selection
    if (interaction.customId === 'help_category_select') {
      const { handleHelpCategoryInteraction } = await import('./commands/General/help.js');
      await handleHelpCategoryInteraction(interaction);
      return;
    }

    // Handle create character class selection
    if (interaction.customId === 'create_character_class') {
      const { handleCreateCharacterInteraction } = await import('./commands/RPG/create.js');
      await handleCreateCharacterInteraction(interaction);
      return;
    }

    // Handle train stat selection
    if (interaction.customId === 'train_stat_select') {
      const { handleTrainStatInteraction } = await import('./commands/RPG/train.js');
      await handleTrainStatInteraction(interaction);
      return;
    }

  } catch (error) {
    console.error('Error handling string select menu interaction:', error);
    await interaction.reply({ content: '❌ An error occurred while processing your selection.', ephemeral: true });
  }
});

// Handle modal submissions
client.on('interactionCreate', async (interaction) => {
  if (!interaction.isModalSubmit()) return;

  try {
    // Handle admin settings modal
    if (interaction.customId === 'admin_settings_modal') {
      const { handleAdminInteraction } = await import('./commands/Utility/adminset.js');
      await handleAdminInteraction(interaction);
      return;
    }

  } catch (error) {
    console.error('Error handling modal submission:', error);
    await interaction.reply({ content: '❌ An error occurred while processing your submission.', ephemeral: true });
  }
});

// Error handling
client.on('error', (error) => {
  console.error('Discord client error:', error);
});

process.on('unhandledRejection', (error) => {
  console.error('Unhandled promise rejection:', error);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught exception:', error);
  process.exit(1);
});

// Start the bot
const token = process.env.DISCORD_TOKEN;
if (!token) {
  console.error('❌ DISCORD_TOKEN is not set in environment variables!');
  process.exit(1);
}

client.login(token);
