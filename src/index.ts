import { Client, GatewayIntentBits } from 'discord.js';
import { config } from 'dotenv';
import { CommandHandler } from './services/commandHandler.js';
import { LevelingService } from './services/levelingService.js';
import { SettingsService } from './services/settingsService.js';
import { AdminService } from './services/adminService.js';
import { RPGService } from './services/rpgService.js';
import { initializePlayDL } from './utils/playDLInit.js';
import { EmbedBuilder } from 'discord.js';

// Load environment variables
config();

// Validate environment configuration
const token = process.env.DISCORD_TOKEN;
if (!token || token === 'your_discord_bot_token_here') {
  console.error('❌ DISCORD_TOKEN is not set or is using placeholder value!');
  console.error('Please edit your .env file and set your actual Discord bot token.');
  console.error('Get your token from: https://discord.com/developers/applications');
  process.exit(1);
}

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
    console.log(`🔘 Button interaction received: ${interaction.customId}`);
    
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

    // If no handler was found, log it
    console.log(`⚠️  No handler found for button interaction: ${interaction.customId}`);

  } catch (error) {
    console.error('❌ Error handling button interaction:', error);
    console.error(`   Interaction ID: ${interaction.customId}`);
    console.error(`   User: ${interaction.user.tag}`);
    console.error(`   Guild: ${interaction.guild?.name || 'DM'}`);
    
    try {
      if (!interaction.replied && !interaction.deferred) {
        await interaction.reply({ 
          content: '❌ An error occurred while processing your interaction. Please try again later.', 
          ephemeral: true 
        });
      } else {
        await interaction.followUp({ 
          content: '❌ An error occurred while processing your interaction. Please try again later.', 
          ephemeral: true 
        });
      }
    } catch (followUpError) {
      console.error('❌ Failed to send error message to user:', followUpError);
    }
  }
});

// Handle string select menu interactions
client.on('interactionCreate', async (interaction) => {
  if (!interaction.isStringSelectMenu()) return;

  try {
    console.log(`📋 Select menu interaction received: ${interaction.customId}`);
    
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

    // Handle translate language selection
    if (interaction.customId === 'translate_language_select') {
      const { handleTranslateInteraction } = await import('./commands/Utility/translate.js');
      await handleTranslateInteraction(interaction);
      return;
    }

    // If no handler was found, log it
    console.log(`⚠️  No handler found for select menu interaction: ${interaction.customId}`);

  } catch (error) {
    console.error('❌ Error handling string select menu interaction:', error);
    console.error(`   Interaction ID: ${interaction.customId}`);
    console.error(`   User: ${interaction.user.tag}`);
    console.error(`   Guild: ${interaction.guild?.name || 'DM'}`);
    
    try {
      if (!interaction.replied && !interaction.deferred) {
        await interaction.reply({ 
          content: '❌ An error occurred while processing your selection. Please try again later.', 
          ephemeral: true 
        });
      } else {
        await interaction.followUp({ 
          content: '❌ An error occurred while processing your selection. Please try again later.', 
          ephemeral: true 
        });
      }
    } catch (followUpError) {
      console.error('❌ Failed to send error message to user:', followUpError);
    }
  }
});

// Handle modal submissions
client.on('interactionCreate', async (interaction) => {
  if (!interaction.isModalSubmit()) return;

  try {
    console.log(`📝 Modal submission received: ${interaction.customId}`);
    
    // Handle admin settings modal
    if (interaction.customId === 'admin_settings_modal') {
      const { handleAdminInteraction } = await import('./commands/Utility/adminset.js');
      await handleAdminInteraction(interaction);
      return;
    }

    // If no handler was found, log it
    console.log(`⚠️  No handler found for modal submission: ${interaction.customId}`);

  } catch (error) {
    console.error('❌ Error handling modal submission:', error);
    console.error(`   Interaction ID: ${interaction.customId}`);
    console.error(`   User: ${interaction.user.tag}`);
    console.error(`   Guild: ${interaction.guild?.name || 'DM'}`);
    
    try {
      if (!interaction.replied && !interaction.deferred) {
        await interaction.reply({ 
          content: '❌ An error occurred while processing your submission. Please try again later.', 
          ephemeral: true 
        });
      } else {
        await interaction.followUp({ 
          content: '❌ An error occurred while processing your submission. Please try again later.', 
          ephemeral: true 
        });
      }
    } catch (followUpError) {
      console.error('❌ Failed to send error message to user:', followUpError);
    }
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

// Start the bot with better error handling
client.login(token).catch((error) => {
  console.error('❌ Failed to login to Discord:', error.message);
  
  if (error.message.includes('disallowed intents')) {
    console.error('');
    console.error('🔧 SOLUTION: Enable Required Intents in Discord Developer Portal');
    console.error('===========================================');
    console.error('1. Go to https://discord.com/developers/applications');
    console.error('2. Select your bot application');
    console.error('3. Go to "Bot" section in the left sidebar');
    console.error('4. Scroll down to "Privileged Gateway Intents"');
    console.error('5. Enable ALL THREE intents:');
    console.error('   ✅ PRESENCE INTENT');
    console.error('   ✅ SERVER MEMBERS INTENT');
    console.error('   ✅ MESSAGE CONTENT INTENT');
    console.error('6. Click "Save Changes"');
    console.error('7. Restart your bot');
    console.error('');
  } else if (error.message.includes('Invalid token')) {
    console.error('');
    console.error('🔧 SOLUTION: Check Your Bot Token');
    console.error('===========================================');
    console.error('1. Verify your token in the .env file');
    console.error('2. Get a fresh token from: https://discord.com/developers/applications');
    console.error('3. Make sure the token is copied correctly (no extra spaces)');
    console.error('');
  } else {
    console.error('');
    console.error('🔧 GENERAL TROUBLESHOOTING');
    console.error('===========================================');
    console.error('1. Check your internet connection');
    console.error('2. Verify your bot token is correct');
    console.error('3. Make sure your bot is invited to servers with proper permissions');
    console.error('4. Check Discord status: https://status.discord.com/');
    console.error('');
  }
  
  process.exit(1);
});
