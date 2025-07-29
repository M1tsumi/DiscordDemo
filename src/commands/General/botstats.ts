import { Message, EmbedBuilder, SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { CommandCategory } from '../../types/Command';
import os from 'os';

export const data = {
  name: 'botstats',
  description: 'Display detailed bot statistics and information.',
  aliases: ['stats', 'botinfo', 'info'],
  category: CommandCategory.GENERAL,
  usage: '!botstats',
  cooldown: 5
};

export const slashData = new SlashCommandBuilder()
  .setName('botstats')
  .setDescription('Display detailed bot statistics and information.');

function formatUptime(uptime: number): string {
  const days = Math.floor(uptime / 86400);
  const hours = Math.floor((uptime % 86400) / 3600);
  const minutes = Math.floor((uptime % 3600) / 60);
  const seconds = Math.floor(uptime % 60);

  const parts = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (seconds > 0) parts.push(`${seconds}s`);

  return parts.join(' ') || '0s';
}

function formatBytes(bytes: number): string {
  const sizes = ['B', 'KB', 'MB', 'GB'];
  if (bytes === 0) return '0 B';
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
}

export async function execute(message: Message) {
  const { commandHandler } = await import('../../index');
  const client = message.client;

  // Get system info
  const memoryUsage = process.memoryUsage();
  const systemMemory = os.totalmem();
  const freeMemory = os.freemem();
  const usedMemory = systemMemory - freeMemory;

  // Calculate bot statistics
  const totalGuilds = client.guilds.cache.size;
  const totalUsers = client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0);
  const totalChannels = client.channels.cache.size;
  const totalCommands = commandHandler.getCommands().size;

  const embed = new EmbedBuilder()
    .setTitle('🤖 Bot Statistics')
    .setThumbnail(client.user?.displayAvatarURL() || '')
    .setColor(0x5865f2)
    .addFields([
      {
        name: '📊 Bot Statistics',
        value: `**Servers:** ${totalGuilds.toLocaleString()}\n**Users:** ${totalUsers.toLocaleString()}\n**Channels:** ${totalChannels.toLocaleString()}\n**Commands:** ${totalCommands}`,
        inline: true
      },
      {
        name: '⚡ Performance',
        value: `**Ping:** ${Math.round(client.ws.ping)}ms\n**Uptime:** ${formatUptime(process.uptime())}\n**CPU:** ${os.arch()} ${os.cpus().length} cores\n**Node.js:** ${process.version}`,
        inline: true
      },
      {
        name: '💾 Memory Usage',
        value: `**Bot RAM:** ${formatBytes(memoryUsage.heapUsed)} / ${formatBytes(memoryUsage.heapTotal)}\n**System RAM:** ${formatBytes(usedMemory)} / ${formatBytes(systemMemory)}\n**Free RAM:** ${formatBytes(freeMemory)}`,
        inline: true
      },
      {
        name: '🔧 Technical Info',
        value: `**Platform:** ${os.platform()} ${os.release()}\n**Discord.js:** v${require('discord.js').version}\n**TypeScript:** v${require('typescript').version}\n**Process ID:** ${process.pid}`,
        inline: false
      }
    ])
    .setFooter({ 
      text: `Bot developed with ❤️ | Started at`,
      iconURL: client.user?.displayAvatarURL()
    })
    .setTimestamp(client.readyAt);

  await message.reply({ embeds: [embed] });
}

export async function executeSlash(interaction: ChatInputCommandInteraction) {
  const { commandHandler } = await import('../../index');
  const client = interaction.client;

  // Get system info
  const memoryUsage = process.memoryUsage();
  const systemMemory = os.totalmem();
  const freeMemory = os.freemem();
  const usedMemory = systemMemory - freeMemory;

  // Calculate bot statistics
  const totalGuilds = client.guilds.cache.size;
  const totalUsers = client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0);
  const totalChannels = client.channels.cache.size;
  const totalCommands = commandHandler.getCommands().size;

  const embed = new EmbedBuilder()
    .setTitle('🤖 Bot Statistics')
    .setThumbnail(client.user?.displayAvatarURL() || '')
    .setColor(0x5865f2)
    .addFields([
      {
        name: '📊 Bot Statistics',
        value: `**Servers:** ${totalGuilds.toLocaleString()}\n**Users:** ${totalUsers.toLocaleString()}\n**Channels:** ${totalChannels.toLocaleString()}\n**Commands:** ${totalCommands}`,
        inline: true
      },
      {
        name: '⚡ Performance',
        value: `**Ping:** ${Math.round(client.ws.ping)}ms\n**Uptime:** ${formatUptime(process.uptime())}\n**CPU:** ${os.arch()} ${os.cpus().length} cores\n**Node.js:** ${process.version}`,
        inline: true
      },
      {
        name: '💾 Memory Usage',
        value: `**Bot RAM:** ${formatBytes(memoryUsage.heapUsed)} / ${formatBytes(memoryUsage.heapTotal)}\n**System RAM:** ${formatBytes(usedMemory)} / ${formatBytes(systemMemory)}\n**Free RAM:** ${formatBytes(freeMemory)}`,
        inline: true
      },
      {
        name: '🔧 Technical Info',
        value: `**Platform:** ${os.platform()} ${os.release()}\n**Discord.js:** v${require('discord.js').version}\n**TypeScript:** v${require('typescript').version}\n**Process ID:** ${process.pid}`,
        inline: false
      }
    ])
    .setFooter({ 
      text: `Bot developed with ❤️ | Started at`,
      iconURL: client.user?.displayAvatarURL()
    })
    .setTimestamp(client.readyAt);

  await interaction.reply({ embeds: [embed] });
} 