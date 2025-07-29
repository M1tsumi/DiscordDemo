import { Message, EmbedBuilder } from 'discord.js';
import { LevelingService } from '../services/levelingService';

const levelingService = new LevelingService();

export const data = {
  name: 'leaderboard',
  description: 'Show the top users by level and XP',
  aliases: ['top', 'lb', 'rank', 'levels']
};

export async function execute(message: Message) {
  const topUsers = levelingService.getTopProfiles(10);
  if (topUsers.length === 0) {
    return message.reply('No users on the leaderboard yet!');
  }
  const embed = new EmbedBuilder()
    .setTitle('🏆 Server Leaderboard')
    .setColor(0xf1c40f)
    .setDescription(
      topUsers.map((user, i) =>
        `**${i + 1}.** <@${user.id}> — Level ${user.level} (${user.xp} XP)\n*${levelingService.getLevelInfo(user.level).title}*`
      ).join('\n')
    )
    .setFooter({ text: 'Keep chatting to climb the ranks!' });
  await message.reply({ embeds: [embed] });
}
