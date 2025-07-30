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
import { CommandCategory } from '../../types/Command';

import os from 'os';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Command } from '../../types/Command';
// ES module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const data = {
  name: 'cogs',
  description: 'Developer command to view and refresh command cogs.',
  aliases: ['reload'],
  category: CommandCategory.UTILITY,
  usage: '!cogs',
  cooldown: 5,
  permissions: ['Administrator']
};

export const slashData = new SlashCommandBuilder()
  .setName('cogs')
  .setDescription('Developer command to view and refresh command cogs.');

const DEVELOPER_ID = '1051142172130422884';

export async function execute(message: Message, args?: string[]) {
  // Check if user is the developer
  if (message.author.id !== DEVELOPER_ID) {
    await message.reply('❌ This command is only available to the bot developer.');
    return;
  }

  const commandsPath = path.join(__dirname, '../../commands');
  const categories = fs.readdirSync(commandsPath).filter(item => {
    const itemPath = path.join(commandsPath, item);
    return fs.statSync(itemPath).isDirectory();
  });

  const embed = new EmbedBuilder()
    .setTitle('🔧 **Command Cogs Manager**')
    .setDescription(`Found **${categories.length} command categories** with organized structure.`)
    .setColor(0x5865f2)
    .setTimestamp()
    .setFooter({ 
      text: `Developer Tools • ${message.client.user?.username}`,
      iconURL: message.client.user?.displayAvatarURL()
    });

  // Group commands by category with detailed info
  const categoryInfo: Record<string, any[]> = {};
  let totalCommands = 0;
  let totalLines = 0;
  let totalSize = 0;
  
  for (const category of categories) {
    const categoryPath = path.join(commandsPath, category);
    const commandFiles = fs.readdirSync(categoryPath).filter(file => file.endsWith('.ts') || file.endsWith('.js'));
    
    categoryInfo[category] = [];
    totalCommands += commandFiles.length;
    
    for (const file of commandFiles) {
      const filePath = path.join(categoryPath, file);
      const stats = fs.statSync(filePath);
      const content = fs.readFileSync(filePath, 'utf8');
      const lines = content.split('\n').length;
      totalLines += lines;
      totalSize += stats.size;
      
      categoryInfo[category].push({
        name: file.replace('.ts', '').replace('.js', ''),
        path: `${category}/${file}`,
        size: stats.size,
        lines: lines,
        lastModified: stats.mtime,
        fullPath: filePath
      });
    }
  }

  // Add category information to embed with improved formatting
  for (const [category, commands] of Object.entries(categoryInfo)) {
    if (commands.length > 0) {
      const categoryTotalSize = commands.reduce((sum, cmd) => sum + cmd.size, 0);
      const categoryTotalLines = commands.reduce((sum, cmd) => sum + cmd.lines, 0);
      const lastModified = new Date(Math.max(...commands.map(cmd => cmd.lastModified.getTime())));
      
      embed.addFields({
        name: `${getCategoryEmoji(category)} **${category}** (${commands.length} commands)`,
        value: `📁 **Path:** \`src/commands/${category}/\`\n📊 **Size:** ${(categoryTotalSize / 1024).toFixed(2)} KB\n📝 **Lines:** ${categoryTotalLines.toLocaleString()}\n📅 **Last Modified:** ${lastModified.toLocaleDateString()} at ${lastModified.toLocaleTimeString()}\n📋 **Files:** ${commands.map(cmd => `\`${cmd.name}\``).join(', ')}`,
        inline: false
      });
    }
  }

  // Add comprehensive summary statistics
  embed.addFields({
    name: '📊 **Project Statistics**',
    value: `• **Total Categories:** ${categories.length}\n• **Total Commands:** ${totalCommands}\n• **Total Lines:** ${totalLines.toLocaleString()}\n• **Total Size:** ${(totalSize / 1024).toFixed(2)} KB\n• **Average Lines/Command:** ${Math.round(totalLines / totalCommands)}\n• **Average Size/Command:** ${(totalSize / totalCommands / 1024).toFixed(2)} KB`,
    inline: false
  });

  // Add file system information
  const projectStats = getProjectStats(commandsPath);
  embed.addFields({
    name: '💾 **File System Info**',
    value: `• **Project Structure:** Organized by category\n• **File Types:** TypeScript (.ts) files\n• **Total Directories:** ${projectStats.directories}\n• **Total Files:** ${projectStats.files}\n• **Largest Category:** ${projectStats.largestCategory}\n• **Most Recent Update:** ${projectStats.lastModified}`,
    inline: false
  });

  // Create select menu for detailed view
  const selectMenu = new StringSelectMenuBuilder()
    .setCustomId('view_category')
    .setPlaceholder('Select a category to view detailed commands')
    .addOptions(
      categories.map(category => 
        new StringSelectMenuOptionBuilder()
          .setLabel(`${getCategoryEmoji(category)} ${category}`)
          .setDescription(`${categoryInfo[category].length} commands • ${(categoryInfo[category].reduce((sum, cmd) => sum + cmd.size, 0) / 1024).toFixed(2)} KB`)
          .setValue(category)
      )
    );

  // Create refresh button
  const refreshButton = new ButtonBuilder()
    .setCustomId('refresh_cogs')
    .setLabel('🔄 Refresh Cogs')
    .setStyle(ButtonStyle.Primary);

  // Create file explorer button
  const exploreButton = new ButtonBuilder()
    .setCustomId('explore_files')
    .setLabel('📁 File Explorer')
    .setStyle(ButtonStyle.Secondary);

  const row1 = new ActionRowBuilder<StringSelectMenuBuilder>()
    .addComponents(selectMenu);

  const row2 = new ActionRowBuilder<ButtonBuilder>()
    .addComponents(refreshButton, exploreButton);

  const response = await message.reply({ 
    embeds: [embed], 
    components: [row1, row2] 
  });

  // Create collector for interactions
  const collector = response.createMessageComponentCollector({ 
    time: 300000 // 5 minutes
  });

  collector.on('collect', async (interaction) => {
    if (interaction.user.id !== DEVELOPER_ID) {
      await interaction.reply({ 
        content: '❌ Only the bot developer can use this interface.', 
        ephemeral: true 
      });
      return;
    }

    if (interaction.isStringSelectMenu() && interaction.customId === 'view_category') {
      const selectedCategory = interaction.values[0];
      const commands = categoryInfo[selectedCategory];
      
      const detailEmbed = new EmbedBuilder()
        .setTitle(`${getCategoryEmoji(selectedCategory)} **${selectedCategory} Commands**`)
        .setDescription(`Detailed view of **${commands.length} commands** in the ${selectedCategory} category.`)
        .setColor(getCategoryColor(selectedCategory))
        .setTimestamp();

      // Add command details with improved formatting
      for (const cmd of commands) {
        const sizeKB = (cmd.size / 1024).toFixed(2);
        const lastModified = cmd.lastModified.toLocaleDateString() + ' ' + cmd.lastModified.toLocaleTimeString();
        
        detailEmbed.addFields({
          name: `📄 **${cmd.name}**`,
          value: `📁 **Path:** \`src/commands/${cmd.path}\`\n📏 **Size:** ${sizeKB} KB\n📝 **Lines:** ${cmd.lines.toLocaleString()}\n📅 **Modified:** ${lastModified}\n📋 **Category:** ${selectedCategory}`,
          inline: true
        });
      }

      await interaction.reply({ 
        embeds: [detailEmbed], 
        ephemeral: true 
      });
    }

    if (interaction.isButton() && interaction.customId === 'refresh_cogs') {
      await interaction.deferUpdate();
      
      try {
        // Reload commands
        const { commandHandler } = await import('../../index');
        await commandHandler.loadCommands();
        
        const successEmbed = new EmbedBuilder()
          .setTitle('✅ **Cogs Refreshed Successfully**')
          .setDescription('All command cogs have been reloaded and are ready to use.')
          .setColor(0x2ecc71)
          .setTimestamp();
        
        await interaction.followUp({ 
          embeds: [successEmbed], 
          ephemeral: true 
        });
      } catch (error) {
        console.error('Error refreshing cogs:', error);
        
        const errorEmbed = new EmbedBuilder()
          .setTitle('❌ **Error Refreshing Cogs**')
          .setDescription(`An error occurred while refreshing the cogs:\n\`\`\`${error}\`\`\``)
          .setColor(0xe74c3c)
          .setTimestamp();
        
        await interaction.followUp({ 
          embeds: [errorEmbed], 
          ephemeral: true 
        });
      }
    }

    if (interaction.isButton() && interaction.customId === 'explore_files') {
      await interaction.deferUpdate();
      
      const fileExplorerEmbed = new EmbedBuilder()
        .setTitle('📁 **File System Explorer**')
        .setDescription('Detailed file system information for the project.')
        .setColor(0x3498db)
        .setTimestamp();

      const projectStats = getProjectStats(commandsPath);
      
      fileExplorerEmbed.addFields({
        name: '📊 **Directory Structure**',
        value: `• **Root:** \`src/commands/\`\n• **Categories:** ${projectStats.categories.join(', ')}\n• **Total Directories:** ${projectStats.directories}\n• **Total Files:** ${projectStats.files}`,
        inline: false
      });

      fileExplorerEmbed.addFields({
        name: '📈 **Category Breakdown**',
        value: projectStats.categoryBreakdown.map(cat => 
          `• **${cat.name}:** ${cat.files} files, ${cat.lines.toLocaleString()} lines, ${(cat.size / 1024).toFixed(2)} KB`
        ).join('\n'),
        inline: false
      });

      await interaction.followUp({ 
        embeds: [fileExplorerEmbed], 
        ephemeral: true 
      });
    }
  });

  collector.on('end', () => {
    // Disable the components after timeout
    selectMenu.setDisabled(true);
    refreshButton.setDisabled(true);
    exploreButton.setDisabled(true);
    response.edit({ components: [row1, row2] }).catch(console.error);
  });
}

export async function executeSlash(interaction: ChatInputCommandInteraction) {
  // Check if user is the developer
  if (interaction.user.id !== DEVELOPER_ID) {
    await interaction.reply({ 
      content: '❌ This command is only available to the bot developer.',
      ephemeral: true 
    });
    return;
  }

  const commandsPath = path.join(__dirname, '../../commands');
  const categories = fs.readdirSync(commandsPath).filter(item => {
    const itemPath = path.join(commandsPath, item);
    return fs.statSync(itemPath).isDirectory();
  });

  const embed = new EmbedBuilder()
    .setTitle('🔧 **Command Cogs Manager**')
    .setDescription(`Found **${categories.length} command categories** with organized structure.`)
    .setColor(0x5865f2)
    .setTimestamp()
    .setFooter({ 
      text: `Developer Tools • ${interaction.client.user?.username}`,
      iconURL: interaction.client.user?.displayAvatarURL()
    });

  // Group commands by category with detailed info
  const categoryInfo: Record<string, any[]> = {};
  let totalCommands = 0;
  let totalLines = 0;
  let totalSize = 0;
  
  for (const category of categories) {
    const categoryPath = path.join(commandsPath, category);
    const commandFiles = fs.readdirSync(categoryPath).filter(file => file.endsWith('.ts') || file.endsWith('.js'));
    
    categoryInfo[category] = [];
    totalCommands += commandFiles.length;
    
    for (const file of commandFiles) {
      const filePath = path.join(categoryPath, file);
      const stats = fs.statSync(filePath);
      const content = fs.readFileSync(filePath, 'utf8');
      const lines = content.split('\n').length;
      totalLines += lines;
      totalSize += stats.size;
      
      categoryInfo[category].push({
        name: file.replace('.ts', '').replace('.js', ''),
        path: `${category}/${file}`,
        size: stats.size,
        lines: lines,
        lastModified: stats.mtime,
        fullPath: filePath
      });
    }
  }

  // Add category information to embed with improved formatting
  for (const [category, commands] of Object.entries(categoryInfo)) {
    if (commands.length > 0) {
      const categoryTotalSize = commands.reduce((sum, cmd) => sum + cmd.size, 0);
      const categoryTotalLines = commands.reduce((sum, cmd) => sum + cmd.lines, 0);
      const lastModified = new Date(Math.max(...commands.map(cmd => cmd.lastModified.getTime())));
      
      embed.addFields({
        name: `${getCategoryEmoji(category)} **${category}** (${commands.length} commands)`,
        value: `📁 **Path:** \`src/commands/${category}/\`\n📊 **Size:** ${(categoryTotalSize / 1024).toFixed(2)} KB\n📝 **Lines:** ${categoryTotalLines.toLocaleString()}\n📅 **Last Modified:** ${lastModified.toLocaleDateString()} at ${lastModified.toLocaleTimeString()}\n📋 **Files:** ${commands.map(cmd => `\`${cmd.name}\``).join(', ')}`,
        inline: false
      });
    }
  }

  // Add comprehensive summary statistics
  embed.addFields({
    name: '📊 **Project Statistics**',
    value: `• **Total Categories:** ${categories.length}\n• **Total Commands:** ${totalCommands}\n• **Total Lines:** ${totalLines.toLocaleString()}\n• **Total Size:** ${(totalSize / 1024).toFixed(2)} KB\n• **Average Lines/Command:** ${Math.round(totalLines / totalCommands)}\n• **Average Size/Command:** ${(totalSize / totalCommands / 1024).toFixed(2)} KB`,
    inline: false
  });

  // Add file system information
  const projectStats = getProjectStats(commandsPath);
  embed.addFields({
    name: '💾 **File System Info**',
    value: `• **Project Structure:** Organized by category\n• **File Types:** TypeScript (.ts) files\n• **Total Directories:** ${projectStats.directories}\n• **Total Files:** ${projectStats.files}\n• **Largest Category:** ${projectStats.largestCategory}\n• **Most Recent Update:** ${projectStats.lastModified}`,
    inline: false
  });

  // Create select menu for detailed view
  const selectMenu = new StringSelectMenuBuilder()
    .setCustomId('view_category')
    .setPlaceholder('Select a category to view detailed commands')
    .addOptions(
      categories.map(category => 
        new StringSelectMenuOptionBuilder()
          .setLabel(`${getCategoryEmoji(category)} ${category}`)
          .setDescription(`${categoryInfo[category].length} commands • ${(categoryInfo[category].reduce((sum, cmd) => sum + cmd.size, 0) / 1024).toFixed(2)} KB`)
          .setValue(category)
      )
    );

  // Create refresh button
  const refreshButton = new ButtonBuilder()
    .setCustomId('refresh_cogs')
    .setLabel('🔄 Refresh Cogs')
    .setStyle(ButtonStyle.Primary);

  // Create file explorer button
  const exploreButton = new ButtonBuilder()
    .setCustomId('explore_files')
    .setLabel('📁 File Explorer')
    .setStyle(ButtonStyle.Secondary);

  const row1 = new ActionRowBuilder<StringSelectMenuBuilder>()
    .addComponents(selectMenu);

  const row2 = new ActionRowBuilder<ButtonBuilder>()
    .addComponents(refreshButton, exploreButton);

  const response = await interaction.reply({ 
    embeds: [embed], 
    components: [row1, row2],
    fetchReply: true
  });

  // Create collector for interactions
  const collector = response.createMessageComponentCollector({ 
    time: 300000 // 5 minutes
  });

  collector.on('collect', async (buttonInteraction) => {
    if (buttonInteraction.user.id !== DEVELOPER_ID) {
      await buttonInteraction.reply({ 
        content: '❌ Only the bot developer can use this interface.', 
        ephemeral: true 
      });
      return;
    }

    if (buttonInteraction.isStringSelectMenu() && buttonInteraction.customId === 'view_category') {
      const selectedCategory = buttonInteraction.values[0];
      const commands = categoryInfo[selectedCategory];
      
      const detailEmbed = new EmbedBuilder()
        .setTitle(`${getCategoryEmoji(selectedCategory)} **${selectedCategory} Commands**`)
        .setDescription(`Detailed view of **${commands.length} commands** in the ${selectedCategory} category.`)
        .setColor(getCategoryColor(selectedCategory))
        .setTimestamp();

      // Add command details with improved formatting
      for (const cmd of commands) {
        const sizeKB = (cmd.size / 1024).toFixed(2);
        const lastModified = cmd.lastModified.toLocaleDateString() + ' ' + cmd.lastModified.toLocaleTimeString();
        
        detailEmbed.addFields({
          name: `📄 **${cmd.name}**`,
          value: `📁 **Path:** \`src/commands/${cmd.path}\`\n📏 **Size:** ${sizeKB} KB\n📝 **Lines:** ${cmd.lines.toLocaleString()}\n📅 **Modified:** ${lastModified}\n📋 **Category:** ${selectedCategory}`,
          inline: true
        });
      }

      await buttonInteraction.reply({ 
        embeds: [detailEmbed], 
        ephemeral: true 
      });
    }

    if (buttonInteraction.isButton() && buttonInteraction.customId === 'refresh_cogs') {
      await buttonInteraction.deferUpdate();
      
      try {
        // Reload commands
        const { commandHandler } = await import('../../index');
        await commandHandler.loadCommands();
        
        const successEmbed = new EmbedBuilder()
          .setTitle('✅ **Cogs Refreshed Successfully**')
          .setDescription('All command cogs have been reloaded and are ready to use.')
          .setColor(0x2ecc71)
          .setTimestamp();
        
        await buttonInteraction.followUp({ 
          embeds: [successEmbed], 
          ephemeral: true 
        });
      } catch (error) {
        console.error('Error refreshing cogs:', error);
        
        const errorEmbed = new EmbedBuilder()
          .setTitle('❌ **Error Refreshing Cogs**')
          .setDescription(`An error occurred while refreshing the cogs:\n\`\`\`${error}\`\`\``)
          .setColor(0xe74c3c)
          .setTimestamp();
        
        await buttonInteraction.followUp({ 
          embeds: [errorEmbed], 
          ephemeral: true 
        });
      }
    }

    if (buttonInteraction.isButton() && buttonInteraction.customId === 'explore_files') {
      await buttonInteraction.deferUpdate();
      
      const fileExplorerEmbed = new EmbedBuilder()
        .setTitle('📁 **File System Explorer**')
        .setDescription('Detailed file system information for the project.')
        .setColor(0x3498db)
        .setTimestamp();

      const projectStats = getProjectStats(commandsPath);
      
      fileExplorerEmbed.addFields({
        name: '📊 **Directory Structure**',
        value: `• **Root:** \`src/commands/\`\n• **Categories:** ${projectStats.categories.join(', ')}\n• **Total Directories:** ${projectStats.directories}\n• **Total Files:** ${projectStats.files}`,
        inline: false
      });

      fileExplorerEmbed.addFields({
        name: '📈 **Category Breakdown**',
        value: projectStats.categoryBreakdown.map(cat => 
          `• **${cat.name}:** ${cat.files} files, ${cat.lines.toLocaleString()} lines, ${(cat.size / 1024).toFixed(2)} KB`
        ).join('\n'),
        inline: false
      });

      await buttonInteraction.followUp({ 
        embeds: [fileExplorerEmbed], 
        ephemeral: true 
      });
    }
  });

  collector.on('end', () => {
    // Disable the components after timeout
    selectMenu.setDisabled(true);
    refreshButton.setDisabled(true);
    exploreButton.setDisabled(true);
    response.edit({ components: [row1, row2] }).catch(console.error);
  });
}

function getCategoryEmoji(category: string): string {
  const emojis: Record<string, string> = {
    'General': '🛠️',
    'Utility': '🔧',
    'Fun': '🎉',
    'Moderation': '🛡️',
    'Games': '🎮',
    'Information': '📊',
    'Leveling': '💰',
    'Music': '🎵',
    'Uncategorized': '📋'
  };
  return emojis[category] || '📋';
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

function getProjectStats(commandsPath: string) {
  const categories = fs.readdirSync(commandsPath).filter(item => {
    const itemPath = path.join(commandsPath, item);
    return fs.statSync(itemPath).isDirectory();
  });

  let totalFiles = 0;
  let totalLines = 0;
  let totalSize = 0;
  let largestCategory = '';
  let largestCategorySize = 0;
  let lastModified = new Date(0);
  const categoryBreakdown: Array<{name: string, files: number, lines: number, size: number}> = [];

  for (const category of categories) {
    const categoryPath = path.join(commandsPath, category);
    const commandFiles = fs.readdirSync(categoryPath).filter(file => file.endsWith('.ts') || file.endsWith('.js'));
    
    let categorySize = 0;
    let categoryLines = 0;
    
    for (const file of commandFiles) {
      const filePath = path.join(categoryPath, file);
      const stats = fs.statSync(filePath);
      const content = fs.readFileSync(filePath, 'utf8');
      const lines = content.split('\n').length;
      
      categorySize += stats.size;
      categoryLines += lines;
      totalFiles++;
      totalLines += lines;
      totalSize += stats.size;
      
      if (stats.mtime > lastModified) {
        lastModified = stats.mtime;
      }
    }
    
    if (categorySize > largestCategorySize) {
      largestCategorySize = categorySize;
      largestCategory = category;
    }
    
    categoryBreakdown.push({
      name: category,
      files: commandFiles.length,
      lines: categoryLines,
      size: categorySize
    });
  }

  return {
    directories: categories.length,
    files: totalFiles,
    categories: categories,
    largestCategory: largestCategory,
    lastModified: lastModified.toLocaleDateString() + ' ' + lastModified.toLocaleTimeString(),
    categoryBreakdown: categoryBreakdown.sort((a, b) => b.files - a.files)
  };
} 
