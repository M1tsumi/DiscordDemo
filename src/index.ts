import { Client, GatewayIntentBits } from 'discord.js';
import { config } from 'dotenv';
import { CommandHandler } from './services/commandHandler';
import { LevelingService } from './services/levelingService';
import { SettingsService } from './services/settingsService';
import { AdminService } from './services/adminService';
import { RPGService } from './services/rpgService';
import { initializePlayDL } from './utils/playDLInit';
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
  const { handleHangmanMessage } = await import('./commands/Games/hangman');
  const hangmanHandled = await handleHangmanMessage(message);
  
  // Check for trivia answer input
  const { handleTriviaAnswer } = await import('./commands/Fun/trivia');
  const triviaHandled = await handleTriviaAnswer(message);
  
  // Check for wordle answer input
  const { handleWordleAnswer } = await import('./commands/Fun/wordle');
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
    levelingService.trackVoiceJoin(newState.member!.id, newState.guild.id);
  }
  
  // User left a voice channel
  if (oldState.channelId && !newState.channelId) {
    const result = levelingService.trackVoiceLeave(oldState.member!.id);
    
    // Optional: Show voice XP gained
    if (result.xpGained > 0) {
      const embed = new EmbedBuilder()
        .setDescription(`🎤 **${oldState.member!.displayName}** gained **${result.xpGained} XP** from voice activity!`)
        .setColor(0x3498db)
        .setFooter({ text: `Level ${result.profile!.level} • ${result.profile!.xp} total XP` });
      
      // Try to send to a text channel in the same guild
      const textChannel = oldState.guild.channels.cache.find(channel => 
        channel.type === 0 && channel.permissionsFor(client.user!)?.has('SendMessages')
      ) as any;
      
      if (textChannel) {
        const xpMessage = await textChannel.send({ embeds: [embed] });
        setTimeout(() => {
          xpMessage.delete().catch(() => {});
        }, 5000);
      }
    }
  }
});

// Periodic voice XP updates (every 5 minutes)
setInterval(() => {
  levelingService.updateVoiceXP();
}, 5 * 60 * 1000); // 5 minutes

// Handle slash commands and button interactions
client.on('interactionCreate', async (interaction) => {
  if (interaction.isChatInputCommand()) {
    await commandHandler.handleSlashCommand(interaction);
  } else if (interaction.isButton()) {
    // Handle copy translation button
    if (interaction.customId.startsWith('copy_translation_')) {
      const { handleCopyTranslation } = await import('./commands/Utility/translate');
      await handleCopyTranslation(interaction);
      return;
    }
    // Handle button interactions
    if (interaction.customId.startsWith('poll_')) {
      const { handlePollInteraction } = await import('./commands/Fun/poll');
      await handlePollInteraction(interaction);
    }
    // Handle tic-tac-toe button interactions
    else if (interaction.customId.startsWith('ttt_')) {
      const { handleTicTacToeInteraction } = await import('./commands/Games/tictactoe');
      await handleTicTacToeInteraction(interaction);
    }
    // Handle admin panel interactions
    else if (interaction.customId.startsWith('admin_')) {
      const { handleAdminInteraction } = await import('./commands/Utility/adminset');
      await handleAdminInteraction(interaction);
    }
    // Handle would you rather interactions
    else if (interaction.customId.startsWith('wyr_')) {
      const { handleWYRInteraction } = await import('./commands/Fun/wouldyourather');
      await handleWYRInteraction(interaction);
    }
    // Handle hangman interactions
    else if (interaction.customId.startsWith('hangman_')) {
      const { handleHangmanInteraction } = await import('./commands/Games/hangman');
      await handleHangmanInteraction(interaction);
    }
    // Removed RPS and Guess command handlers
  } else if (interaction.isStringSelectMenu()) {
    try {
      // Handle translate language selection
      if (interaction.customId === 'translate_lang') {
        const { handleTranslateInteraction } = await import('./commands/Utility/translate');
        return await handleTranslateInteraction(interaction);
      }
      // Handle help category selection
      else if (interaction.customId === 'help_category') {
        const { handleHelpCategoryInteraction } = await import('./commands/General/help');
        return await handleHelpCategoryInteraction(interaction);
      }
      // Handle character creation
      else if (interaction.customId === 'create_character') {
        const { handleCreateCharacterInteraction } = await import('./commands/RPG/create');
        return await handleCreateCharacterInteraction(interaction);
      }
      // Handle training stat selection
      else if (interaction.customId === 'train_stat') {
        const { handleTrainStatInteraction } = await import('./commands/RPG/train');
        return await handleTrainStatInteraction(interaction);
      }
      // Add other select menu handlers here as else-if blocks
    } catch (error) {
      console.error('Select menu interaction error:', error);
      if (!interaction.replied) {
        await interaction.reply({
          content: '❌ Failed to process this interaction',
          ephemeral: true
        });
      }
    }
  }
});

client.login(process.env['DISCORD_TOKEN']);
