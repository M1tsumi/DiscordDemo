import { 
  Message, 
  EmbedBuilder, 
  SlashCommandBuilder, 
  ChatInputCommandInteraction,
  PermissionFlagsBits,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
  TextChannel
} from 'discord.js';
import { CommandCategory } from '../../types/Command.js';

export const data = {
  name: 'help',
  description: 'List all commands and their usage.',
  aliases: ['commands'],
  category: CommandCategory.GENERAL,
  usage: '!help [command]',
  cooldown: 3
};

export const slashData = new SlashCommandBuilder()
  .setName('help')
  .setDescription('List all commands and their usage.')
  .addStringOption(option =>
    option.setName('command')
      .setDescription('Get detailed info about a specific command')
      .setRequired(false)
  );

export async function execute(message: Message, args?: string[]) {
  try {
    // Import here to avoid circular dependency issues
    const { commandHandler, settingsService } = await import('../../index.js');
    
    const commandName = args?.[0]?.toLowerCase();
    const prefix = message.guild ? settingsService.getPrefix(message.guild.id) : '!';
    
    // Debug information
    const totalCommands = commandHandler.getCommands().size;
    console.log(`🔍 Help command debug: Found ${totalCommands} commands`);
    
    // If no commands are loaded, try to reload them
    if (totalCommands === 0) {
      console.log('🔄 No commands found, attempting to reload...');
      await commandHandler.loadCommands();
      const reloadedCommands = commandHandler.getCommands().size;
      console.log(`🔄 Reloaded ${reloadedCommands} commands`);
    }
    
    if (commandName) {
      // Show specific command help
      const command = commandHandler.getCommands().get(commandName) || 
                     commandHandler.getCommands().find((cmd: any) => cmd.data.aliases?.includes(commandName));
      
      if (!command) {
        await message.reply(`❌ Command \`${commandName}\` not found!\nUse \`${prefix}help\` to see all available commands.`);
        return;
      }

      const embed = new EmbedBuilder()
        .setAuthor({ 
          name: `${command.data.name.toUpperCase()} Command Details`,
          iconURL: message.client.user?.displayAvatarURL()
        })
        .setDescription(`**${command.data.description}**`)
        .addFields([
          { name: '📂 Category', value: `\`${command.data.category}\``, inline: true },
          { name: '⏱️ Cooldown', value: `\`${command.data.cooldown || 0}s\``, inline: true },
          { name: '🔧 Usage', value: `\`${command.data.usage || `${prefix}${command.data.name}`}\``, inline: false }
        ])
        .setColor(0x3498db)
        .setTimestamp()
        .setFooter({ 
          text: `Requested by ${message.author.tag}`,
          iconURL: message.author.displayAvatarURL()
        });

      if (command.data.aliases?.length) {
        embed.addFields([{ 
          name: '🏷️ Aliases', 
          value: command.data.aliases.map(alias => `\`${prefix}${alias}\``).join(', '), 
          inline: false 
        }]);
      }

      if (command.data.permissions?.length) {
        embed.addFields([{ 
          name: '🔒 Required Permissions', 
          value: command.data.permissions.map(perm => `\`${perm}\``).join(', '), 
          inline: false 
        }]);
      }

      await message.reply({ embeds: [embed] });
      return;
    }

    const finalCommandCount = commandHandler.getCommands().size;
    const categories = Object.values(CommandCategory);
    const client = message.client;

    const mainEmbed = new EmbedBuilder()
      .setAuthor({
        name: `${client.user?.username} Help Center`,
        iconURL: client.user?.displayAvatarURL()
      })
      .setTitle('📚 **Command Documentation**')
      .setDescription(`Welcome to the comprehensive command guide! I'm a feature-rich Discord bot with **${finalCommandCount} commands** across multiple categories.\n\n` +
        `**Quick Navigation:**\n` +
        `• Use the dropdown menu below to select a category\n` +
        `• Use \`${prefix}help <command>\` for detailed command information\n` +
        `• Commands work with both prefix (\`${prefix}\`) and slash (\`/\`) formats\n` +
        `• Use \`${prefix}setprefix <new>\` to customize your server's prefix\n\n` +
        `**✨ Featured Commands:** \`${prefix}poll\`, \`${prefix}tictactoe\`, \`${prefix}daily\`, \`${prefix}botstats\``)
      .setColor(0x5865f2)
      .setThumbnail(client.user?.displayAvatarURL())
      .setTimestamp()
      .setFooter({
        text: `${client.user?.username} • Serving ${client.guilds.cache.size} servers`,
        iconURL: client.user?.displayAvatarURL()
      });

    const categoryEmojis = {
      'General': '🛠️',
      'Utility': '🔧',
      'Fun': '🎉',
      'Moderation': '🛡️',
      'Games': '🎮',
      'Information': '📊',
      'Leveling': '💰',
      'Music': '🎵',
      'RPG': '⚔️'
    };

    const categoryDescriptions = {
      'General': 'Essential utility commands for server management and information',
      'Utility': 'Developer and administrative tools',
      'Fun': 'Entertainment commands to keep your server engaging and lively',
      'Moderation': 'Powerful tools for maintaining order and managing your community',
      'Games': 'Interactive games and challenges for server entertainment',
      'Information': 'Data retrieval and informational commands from various sources',
      'Leveling': 'XP tracking, daily rewards, and virtual economy features',
      'Music': 'Audio playback and music management features',
      'RPG': 'Character creation, adventures, and role-playing features'
    };

    // Create category list
    let categoryList = '';
    categories.forEach(category => {
      const categoryCommands = commandHandler.getCommandsByCategory(category);
      if (categoryCommands.length > 0) {
        const emoji = categoryEmojis[category] || '📋';
        categoryList += `${emoji} **${category}** (${categoryCommands.length} commands)\n`;
      }
    });

    mainEmbed.addFields([
      { name: '📂 Categories', value: categoryList, inline: false }
    ]);

    // Create category selection menu
    const categoryOptions = categories
      .filter(category => commandHandler.getCommandsByCategory(category).length > 0)
      .map(category => {
        const emoji = categoryEmojis[category] || '📋';
        return new StringSelectMenuOptionBuilder()
          .setLabel(category)
          .setDescription(categoryDescriptions[category] || 'Various commands for this category')
          .setValue(category)
          .setEmoji(emoji);
      });

    const categorySelect = new StringSelectMenuBuilder()
      .setCustomId('help_category_select')
      .setPlaceholder('Select a category to view commands')
      .addOptions(categoryOptions);

    const categoryRow = new ActionRowBuilder<StringSelectMenuBuilder>()
      .addComponents(categorySelect);

    await message.reply({
      embeds: [mainEmbed],
      components: [categoryRow]
    });

  } catch (error) {
    console.error('Error in help command:', error);
    await message.reply('❌ There was an error loading the help information. Please try again later.');
  }
}

export async function executeSlash(interaction: ChatInputCommandInteraction) {
  try {
    // Import here to avoid circular dependency issues
    const { commandHandler, settingsService } = await import('../../index.js');
    
    const commandName = interaction.options.getString('command')?.toLowerCase();
    const prefix = interaction.guild ? settingsService.getPrefix(interaction.guild.id) : '!';
    
    if (commandName) {
      // Show specific command help
      const command = commandHandler.getCommands().get(commandName) || 
                     commandHandler.getCommands().find((cmd: any) => cmd.data.aliases?.includes(commandName));
      
      if (!command) {
        await interaction.reply({
          content: `❌ Command \`${commandName}\` not found!\nUse \`${prefix}help\` to see all available commands.`,
          ephemeral: true
        });
        return;
      }

      const embed = new EmbedBuilder()
        .setAuthor({ 
          name: `${command.data.name.toUpperCase()} Command Details`,
          iconURL: interaction.client.user?.displayAvatarURL()
        })
        .setDescription(`**${command.data.description}**`)
        .addFields([
          { name: '📂 Category', value: `\`${command.data.category}\``, inline: true },
          { name: '⏱️ Cooldown', value: `\`${command.data.cooldown || 0}s\``, inline: true },
          { name: '🔧 Usage', value: `\`${command.data.usage || `${prefix}${command.data.name}`}\``, inline: false }
        ])
        .setColor(0x3498db)
        .setTimestamp()
        .setFooter({ 
          text: `Requested by ${interaction.user.tag}`,
          iconURL: interaction.user.displayAvatarURL()
        });

      if (command.data.aliases?.length) {
        embed.addFields([{ 
          name: '🏷️ Aliases', 
          value: command.data.aliases.map(alias => `\`${prefix}${alias}\``).join(', '), 
          inline: false 
        }]);
      }

      if (command.data.permissions?.length) {
        embed.addFields([{ 
          name: '🔒 Required Permissions', 
          value: command.data.permissions.map(perm => `\`${perm}\``).join(', '), 
          inline: false 
        }]);
      }

      await interaction.reply({ embeds: [embed], ephemeral: true });
      return;
    }

    const finalCommandCount = commandHandler.getCommands().size;
    const categories = Object.values(CommandCategory);

    const mainEmbed = new EmbedBuilder()
      .setAuthor({
        name: `${interaction.client.user?.username} Help Center`,
        iconURL: interaction.client.user?.displayAvatarURL()
      })
      .setTitle('📚 **Command Documentation**')
      .setDescription(`Welcome to the comprehensive command guide! I'm a feature-rich Discord bot with **${finalCommandCount} commands** across multiple categories.\n\n` +
        `**Quick Navigation:**\n` +
        `• Use the dropdown menu below to select a category\n` +
        `• Use \`${prefix}help <command>\` for detailed command information\n` +
        `• Commands work with both prefix (\`${prefix}\`) and slash (\`/\`) formats\n` +
        `• Use \`${prefix}setprefix <new>\` to customize your server's prefix\n\n` +
        `**✨ Featured Commands:** \`${prefix}poll\`, \`${prefix}tictactoe\`, \`${prefix}daily\`, \`${prefix}botstats\``)
      .setColor(0x5865f2)
      .setThumbnail(interaction.client.user?.displayAvatarURL())
      .setTimestamp()
      .setFooter({
        text: `${interaction.client.user?.username} • Serving ${interaction.client.guilds.cache.size} servers`,
        iconURL: interaction.client.user?.displayAvatarURL()
      });

    const categoryEmojis = {
      'General': '🛠️',
      'Utility': '🔧',
      'Fun': '🎉',
      'Moderation': '🛡️',
      'Games': '🎮',
      'Information': '📊',
      'Leveling': '💰',
      'Music': '🎵',
      'RPG': '⚔️'
    };

    const categoryDescriptions = {
      'General': 'Essential utility commands for server management and information',
      'Utility': 'Developer and administrative tools',
      'Fun': 'Entertainment commands to keep your server engaging and lively',
      'Moderation': 'Powerful tools for maintaining order and managing your community',
      'Games': 'Interactive games and challenges for server entertainment',
      'Information': 'Data retrieval and informational commands from various sources',
      'Leveling': 'XP tracking, daily rewards, and virtual economy features',
      'Music': 'Audio playback and music management features',
      'RPG': 'Character creation, adventures, and role-playing features'
    };

    // Create category list
    let categoryList = '';
    categories.forEach(category => {
      const categoryCommands = commandHandler.getCommandsByCategory(category);
      if (categoryCommands.length > 0) {
        const emoji = categoryEmojis[category] || '📋';
        categoryList += `${emoji} **${category}** (${categoryCommands.length} commands)\n`;
      }
    });

    mainEmbed.addFields([
      { name: '📂 Categories', value: categoryList, inline: false }
    ]);

    // Create category selection menu
    const categoryOptions = categories
      .filter(category => commandHandler.getCommandsByCategory(category).length > 0)
      .map(category => {
        const emoji = categoryEmojis[category] || '📋';
        return new StringSelectMenuOptionBuilder()
          .setLabel(category)
          .setDescription(categoryDescriptions[category] || 'Various commands for this category')
          .setValue(category)
          .setEmoji(emoji);
      });

    const categorySelect = new StringSelectMenuBuilder()
      .setCustomId('help_category_select')
      .setPlaceholder('Select a category to view commands')
      .addOptions(categoryOptions);

    const categoryRow = new ActionRowBuilder<StringSelectMenuBuilder>()
      .addComponents(categorySelect);

    await interaction.reply({
      embeds: [mainEmbed],
      components: [categoryRow],
      ephemeral: true
    });

  } catch (error) {
    console.error('Error in help slash command:', error);
    await interaction.reply({
      content: '❌ There was an error loading the help information. Please try again later.',
      ephemeral: true
    });
  }
}

// Handle help category dropdown interaction
export async function handleHelpCategoryInteraction(interaction: any) {
  try {
    const { commandHandler, settingsService } = await import('../../index.js');
    const selectedCategory = interaction.values[0];
    const prefix = interaction.guild ? settingsService.getPrefix(interaction.guild.id) : '!';
    
    const categoryCommands = commandHandler.getCommandsByCategory(selectedCategory);
    
    if (categoryCommands.length === 0) {
      await interaction.reply({
        content: `❌ No commands found in the ${selectedCategory} category.`,
        ephemeral: true
      });
      return;
    }

    const categoryEmojis: Record<string, string> = {
      'General': '🛠️',
      'Utility': '🔧',
      'Fun': '🎉',
      'Moderation': '🛡️',
      'Games': '🎮',
      'Information': '📊',
      'Leveling': '💰',
      'Music': '🎵'
    };

    const categoryDescriptions: Record<string, string> = {
      'General': 'Essential utility commands for server management and information',
      'Utility': 'Developer and administrative tools',
      'Fun': 'Entertainment commands to keep your server engaging and lively',
      'Moderation': 'Powerful tools for maintaining order and managing your community',
      'Games': 'Interactive games and challenges for server entertainment',
      'Information': 'Data retrieval and informational commands from various sources',
      'Leveling': 'XP tracking, daily rewards, and virtual economy features',
      'Music': 'Audio playback and music management features'
    };

    const emoji = categoryEmojis[selectedCategory] || '📋';
    const description = categoryDescriptions[selectedCategory] || 'Various commands for this category';
    
    // Create command list with descriptions
    const commandList = categoryCommands
      .map((cmd: any) => {
        const cooldownText = cmd.data.cooldown && cmd.data.cooldown > 0 ? ` (${cmd.data.cooldown}s)` : '';
        return `• \`${cmd.data.name}\`${cooldownText} - ${cmd.data.description}`;
      })
      .join('\n');

    const embed = new EmbedBuilder()
      .setTitle(`${emoji} **${selectedCategory} Commands**`)
      .setDescription(`*${description}*\n\n${commandList}`)
      .setColor(getCategoryColor(selectedCategory))
      .addFields([
        { 
          name: '📝 Command Count', 
          value: `${categoryCommands.length} command${categoryCommands.length !== 1 ? 's' : ''}`,
          inline: true 
        },
        { 
          name: '💡 Example', 
          value: `\`${prefix}${categoryCommands[0].data.name}\``,
          inline: true 
        }
      ])
      .setFooter({ 
        text: `Requested by ${interaction.user.tag}`,
        iconURL: interaction.user.displayAvatarURL()
      })
      .setTimestamp();

    await interaction.reply({
      embeds: [embed],
      ephemeral: true
    });

  } catch (error) {
    console.error('Error in help category interaction:', error);
    await interaction.reply({
      content: '❌ There was an error loading the category information. Please try again later.',
      ephemeral: true
    });
  }
}

function getCategoryColor(category: string): number {
  const colors: Record<string, number> = {
    'General': 0x5865f2,
    'Utility': 0x95a5a6,
    'Fun': 0xf1c40f,
    'Moderation': 0xe74c3c,
    'Games': 0x9b59b6,
    'Information': 0x3498db,
    'Leveling': 0x2ecc71,
    'Music': 0xe67e22
  };
  return colors[category] || 0x95a5a6;
}

