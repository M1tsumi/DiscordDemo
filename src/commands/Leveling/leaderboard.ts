import { Message, EmbedBuilder, SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { CommandCategory } from '../../types/Command';

export const data = {
  name: 'leaderboard-level',
  description: 'Show the top users by level and XP.',
  aliases: ['top', 'lb', 'rank', 'levels', 'leaderboard'],
  category: CommandCategory.LEVELING,
  usage: '!leaderboard-level',
  cooldown: 5
};

export const slashData = new SlashCommandBuilder()
  .setName('leaderboard-level')
  .setDescription('Show the top users by level and XP.')
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

  const embed = new EmbedBuilder()
    .setTitle('🏆 **Server Leveling Leaderboard**')
    .setColor(0xf1c40f)
    .setDescription(
      topUsers.map((user, i) => {
        const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `**${i + 1}.**`;
        const levelInfo = levelingService.getLevelInfo(user.level);
        return `${medal} <@${user.id}> — Level ${user.level} (${user.xp.toLocaleString()} XP)\n*${levelInfo.title}*`;
      }).join('\n\n')
    )
    .setFooter({ text: `Showing top ${topUsers.length} users • Keep chatting to climb the ranks!` })
    .setThumbnail(message.client.user?.displayAvatarURL())
    .setTimestamp();

  await message.reply({ embeds: [embed] });
}

export async function executeSlash(interaction: ChatInputCommandInteraction) {
  const { levelingService } = await import('../../index');
  const limit = interaction.options.getInteger('limit') || 10;
  const topUsers = levelingService.getTopProfiles(limit);
  
  if (topUsers.length === 0) {
    return interaction.reply('📊 No users on the leaderboard yet! Start chatting to appear here!');
  }

  const embed = new EmbedBuilder()
    .setTitle('🏆 **Server Leveling Leaderboard**')
    .setColor(0xf1c40f)
    .setDescription(
      topUsers.map((user, i) => {
        const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `**${i + 1}.**`;
        const levelInfo = levelingService.getLevelInfo(user.level);
        return `${medal} <@${user.id}> — Level ${user.level} (${user.xp.toLocaleString()} XP)\n*${levelInfo.title}*`;
      }).join('\n\n')
    )
    .setFooter({ text: `Showing top ${topUsers.length} users • Keep chatting to climb the ranks!` })
    .setThumbnail(interaction.client.user?.displayAvatarURL())
    .setTimestamp();

  await interaction.reply({ embeds: [embed] });
}
