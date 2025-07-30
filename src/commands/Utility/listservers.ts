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


export const data = {
  name: 'listservers',
  description: 'List all servers the bot is in with detailed information.',
  aliases: ['servers', 'guilds'],
  category: CommandCategory.UTILITY,
  usage: '!listservers',
  cooldown: 10,
  permissions: ['Administrator']
};

export const slashData = new SlashCommandBuilder()
  .setName('listservers')
  .setDescription('List all servers the bot is in with detailed information.');

export async function execute(message: Message, args?: string[]) {
  const guilds = message.client.guilds.cache;
  
  if (guilds.size === 0) {
    await message.reply('❌ The bot is not in any servers.');
    return;
  }

  const embed = new EmbedBuilder()
    .setTitle('🏠 **Bot Server List**')
    .setDescription(`The bot is currently in **${guilds.size} servers**`)
    .setColor(0x5865f2)
    .setTimestamp()
    .setFooter({ 
      text: `Requested by ${message.author.tag}`,
      iconURL: message.author.displayAvatarURL()
    });

  // Calculate total members across all servers
  const totalMembers = guilds.reduce((total, guild) => total + guild.memberCount, 0);
  
  embed.addFields([
    {
      name: '📊 **Statistics**',
      value: `• **Total Servers:** ${guilds.size}\n• **Total Members:** ${totalMembers.toLocaleString()}\n• **Average Members/Server:** ${Math.round(totalMembers / guilds.size).toLocaleString()}`,
      inline: false
    }
  ]);

  // Group servers by member count ranges
  const smallServers = guilds.filter(g => g.memberCount < 100);
  const mediumServers = guilds.filter(g => g.memberCount >= 100 && g.memberCount < 1000);
  const largeServers = guilds.filter(g => g.memberCount >= 1000 && g.memberCount < 10000);
  const hugeServers = guilds.filter(g => g.memberCount >= 10000);

  if (smallServers.size > 0) {
    embed.addFields({
      name: '🔹 Small Servers (< 100 members)',
      value: `${smallServers.size} servers`,
      inline: true
    });
  }

  if (mediumServers.size > 0) {
    embed.addFields({
      name: '🔸 Medium Servers (100-999 members)',
      value: `${mediumServers.size} servers`,
      inline: true
    });
  }

  if (largeServers.size > 0) {
    embed.addFields({
      name: '🔶 Large Servers (1K-9K members)',
      value: `${largeServers.size} servers`,
      inline: true
    });
  }

  if (hugeServers.size > 0) {
    embed.addFields({
      name: '🔴 Huge Servers (10K+ members)',
      value: `${hugeServers.size} servers`,
      inline: true
    });
  }

  // Show top 10 largest servers
  const topServers = guilds
    .sort((a, b) => b.memberCount - a.memberCount)
    .first(10);

  if (topServers.length > 0) {
    const topServersList = topServers
      .map((guild, index) => {
        const position = index + 1;
        const emoji = position === 1 ? '🥇' : position === 2 ? '🥈' : position === 3 ? '🥉' : '🔹';
        return `${emoji} **${guild.name}** - ${guild.memberCount.toLocaleString()} members`;
      })
      .join('\n');

    embed.addFields({
      name: '🏆 **Top 10 Largest Servers**',
      value: topServersList,
      inline: false
    });
  }

  // Show server list (limited to avoid embed limits)
  const serverList = guilds
    .map(guild => `• **${guild.name}** (${guild.memberCount} members)`)
    .slice(0, 20); // Limit to first 20 to avoid embed limits

  if (serverList.length > 0) {
    embed.addFields({
      name: `📋 **Server List** ${guilds.size > 20 ? `(showing first 20 of ${guilds.size})` : ''}`,
      value: serverList.join('\n'),
      inline: false
    });
  }

  await message.reply({ embeds: [embed] });
}

export async function executeSlash(interaction: ChatInputCommandInteraction) {
  const guilds = interaction.client.guilds.cache;
  
  if (guilds.size === 0) {
    await interaction.reply({ 
      content: '❌ The bot is not in any servers.',
      ephemeral: true 
    });
    return;
  }

  const embed = new EmbedBuilder()
    .setTitle('🏠 **Bot Server List**')
    .setDescription(`The bot is currently in **${guilds.size} servers**`)
    .setColor(0x5865f2)
    .setTimestamp()
    .setFooter({ 
      text: `Requested by ${interaction.user.tag}`,
      iconURL: interaction.user.displayAvatarURL()
    });

  // Calculate total members across all servers
  const totalMembers = guilds.reduce((total, guild) => total + guild.memberCount, 0);
  
  embed.addFields([
    {
      name: '📊 **Statistics**',
      value: `• **Total Servers:** ${guilds.size}\n• **Total Members:** ${totalMembers.toLocaleString()}\n• **Average Members/Server:** ${Math.round(totalMembers / guilds.size).toLocaleString()}`,
      inline: false
    }
  ]);

  // Group servers by member count ranges
  const smallServers = guilds.filter(g => g.memberCount < 100);
  const mediumServers = guilds.filter(g => g.memberCount >= 100 && g.memberCount < 1000);
  const largeServers = guilds.filter(g => g.memberCount >= 1000 && g.memberCount < 10000);
  const hugeServers = guilds.filter(g => g.memberCount >= 10000);

  if (smallServers.size > 0) {
    embed.addFields({
      name: '🔹 Small Servers (< 100 members)',
      value: `${smallServers.size} servers`,
      inline: true
    });
  }

  if (mediumServers.size > 0) {
    embed.addFields({
      name: '🔸 Medium Servers (100-999 members)',
      value: `${mediumServers.size} servers`,
      inline: true
    });
  }

  if (largeServers.size > 0) {
    embed.addFields({
      name: '🔶 Large Servers (1K-9K members)',
      value: `${largeServers.size} servers`,
      inline: true
    });
  }

  if (hugeServers.size > 0) {
    embed.addFields({
      name: '🔴 Huge Servers (10K+ members)',
      value: `${hugeServers.size} servers`,
      inline: true
    });
  }

  // Show top 10 largest servers
  const topServers = guilds
    .sort((a, b) => b.memberCount - a.memberCount)
    .first(10);

  if (topServers.length > 0) {
    const topServersList = topServers
      .map((guild, index) => {
        const position = index + 1;
        const emoji = position === 1 ? '🥇' : position === 2 ? '🥈' : position === 3 ? '🥉' : '🔹';
        return `${emoji} **${guild.name}** - ${guild.memberCount.toLocaleString()} members`;
      })
      .join('\n');

    embed.addFields({
      name: '🏆 **Top 10 Largest Servers**',
      value: topServersList,
      inline: false
    });
  }

  // Show server list (limited to avoid embed limits)
  const serverList = guilds
    .map(guild => `• **${guild.name}** (${guild.memberCount} members)`)
    .slice(0, 20); // Limit to first 20 to avoid embed limits

  if (serverList.length > 0) {
    embed.addFields({
      name: `📋 **Server List** ${guilds.size > 20 ? `(showing first 20 of ${guilds.size})` : ''}`,
      value: serverList.join('\n'),
      inline: false
    });
  }

  await interaction.reply({ embeds: [embed] });
} 

