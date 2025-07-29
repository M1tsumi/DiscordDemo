import { Message, EmbedBuilder } from 'discord.js';

export const data = {
  name: 'avatar',
  description: 'Show your or another user\'s avatar.',
  aliases: ['pfp'],
};

export async function execute(message: Message, args: string[]) {
  const user = message.mentions.users.first() || message.author;
  const embed = new EmbedBuilder()
    .setTitle(`${user.username}'s Avatar`)
    .setImage(user.displayAvatarURL({ size: 512 }))
    .setColor(0x3498db);
  await message.reply({ embeds: [embed] });
}
