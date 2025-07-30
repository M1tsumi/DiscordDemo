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

import { Command } from '../../types/Command';
export const data = {
  name: 'rank',
  description: 'Show your rank and the top users by level and XP.',
  aliases: ['rank-level', 'top', 'lb', 'levels'],
  category: CommandCategory.LEVELING,
  usage: '!rank',
  cooldown: 5
};

export const slashData = new SlashCommandBuilder()
  .setName('rank')
  .setDescription('Show your rank and the top users by level and XP.')
  .addIntegerOption(option =>
    option.setName('limit')
      .setDescription('Number of users to show (1-25)')
      .setMinValue(1)
      .setMaxValue(25)
      .setRequired(false)
  );

export async function execute(message: Message, args?: string[]) {
  const { levelingService } = await import('../../index');
  const limit = Math.min(parseInt(args?.[0] || '10'), 25);
  const topUsers = levelingService.getTopProfiles(limit);
  
  if (topUsers.length === 0) {
    return message.reply('📊 No users on the leaderboard yet! Start chatting to appear here!');
  }

  // Find user's rank
  const userRank = topUsers.findIndex(user => user.id === message.author.id) + 1;
  const userProfile = levelingService.getProfile(message.author.id);

  const embed = new EmbedBuilder()
    .setTitle('🏆 **Server Leveling Rankings**')
    .setColor(0xf1c40f)
    .setDescription(
      topUsers.map((user, i) => {
        const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `**${i + 1}.**`;
        const levelInfo = levelingService.getLevelInfo(user.level);
        const isCurrentUser = user.id === message.author.id;
        return `${medal} <@${user.id}> — Level ${user.level} (${user.xp.toLocaleString()} XP)\n*${levelInfo.title}*${isCurrentUser ? ' **← YOU**' : ''}`;
      }).join('\n\n')
    )
    .setFooter({ text: `Showing top ${topUsers.length} users • Keep chatting to climb the ranks!` })
    .setThumbnail(message.client.user?.displayAvatarURL())
    .setTimestamp();

  // Add user's rank if they're not in top 10
  if (userRank === 0 && userProfile) {
    const levelInfo = levelingService.getLevelInfo(userProfile.level);
    embed.addFields([
      {
        name: '📊 Your Rank',
        value: `You are not in the top ${limit} users.\nLevel: ${userProfile.level} • XP: ${userProfile.xp.toLocaleString()}\n*${levelInfo.title}*`,
        inline: false
      }
    ]);
  }

  await message.reply({ embeds: [embed] });
}

export async function executeSlash(interaction: ChatInputCommandInteraction) {
  const { levelingService } = await import('../../index');
  const limit = interaction.options.getInteger('limit') || 10;
  const topUsers = levelingService.getTopProfiles(limit);
  
  if (topUsers.length === 0) {
    return interaction.reply('📊 No users on the leaderboard yet! Start chatting to appear here!');
  }

  // Find user's rank
  const userRank = topUsers.findIndex(user => user.id === interaction.user.id) + 1;
  const userProfile = levelingService.getProfile(interaction.user.id);

  const embed = new EmbedBuilder()
    .setTitle('🏆 **Server Leveling Rankings**')
    .setColor(0xf1c40f)
    .setDescription(
      topUsers.map((user, i) => {
        const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `**${i + 1}.**`;
        const levelInfo = levelingService.getLevelInfo(user.level);
        const isCurrentUser = user.id === interaction.user.id;
        return `${medal} <@${user.id}> — Level ${user.level} (${user.xp.toLocaleString()} XP)\n*${levelInfo.title}*${isCurrentUser ? ' **← YOU**' : ''}`;
      }).join('\n\n')
    )
    .setFooter({ text: `Showing top ${topUsers.length} users • Keep chatting to climb the ranks!` })
    .setThumbnail(interaction.client.user?.displayAvatarURL())
    .setTimestamp();

  // Add user's rank if they're not in top 10
  if (userRank === 0 && userProfile) {
    const levelInfo = levelingService.getLevelInfo(userProfile.level);
    embed.addFields([
      {
        name: '📊 Your Rank',
        value: `You are not in the top ${limit} users.\nLevel: ${userProfile.level} • XP: ${userProfile.xp.toLocaleString()}\n*${levelInfo.title}*`,
        inline: false
      }
    ]);
  }

  await interaction.reply({ embeds: [embed] });
} 
