import { CommandInteraction, Message, EmbedBuilder } from 'discord.js';
import { LevelingService } from '../services/levelingService';

const levelingService = new LevelingService();

export const data = {
  name: 'profile',
  description: 'Show your profile with level and XP',
};

export async function execute(message: Message) {
  const user = message.author;
  const profile = levelingService.getProfile(user.id);
  if (!profile) {
    return message.reply('No profile found. Send a message to start earning XP!');
  }
  const levelInfo = levelingService.getLevelInfo(profile.level);
  const nextLevel = profile.level + 1;
  const nextLevelInfo = levelingService.getLevelInfo(nextLevel);
  const xpForNextLevel = Math.pow(nextLevel - 1, 2) * 100;
  const progress = Math.min(100, Math.floor((profile.xp / xpForNextLevel) * 100));
  const progressBar = `▰`.repeat(Math.floor(progress / 10)) + `▱`.repeat(10 - Math.floor(progress / 10));

  const embed = new EmbedBuilder()
    .setAuthor({ name: `${user.username}'s Profile`, iconURL: user.displayAvatarURL() })
    .setThumbnail(user.displayAvatarURL())
    .setColor(levelInfo.color)
    .addFields(
      { name: 'Level', value: `**${profile.level}**`, inline: true },
      { name: 'Title', value: `*${levelInfo.title}*`, inline: true },
      { name: '\u200B', value: '\u200B', inline: true },
      { name: 'XP', value: `${profile.xp} / ${xpForNextLevel} XP`, inline: true },
      { name: 'Progress', value: `${progressBar} (${progress}%)`, inline: true },
      { name: '\u200B', value: '\u200B', inline: true }
    )
    .setFooter({ text: `Next Title: ${nextLevelInfo.title}` });
  await message.reply({ embeds: [embed] });
}
