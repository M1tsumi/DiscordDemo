import { Message, EmbedBuilder } from 'discord.js';

export const data = {
  name: 'serverinfo',
  description: 'Show information about this server.',
  aliases: ['server', 'guildinfo'],
};

export async function execute(message: Message) {
  if (!message.guild) return message.reply('This command can only be used in a server.');
  const { name, id, memberCount, ownerId, createdAt, iconURL } = message.guild;
  const embed = new EmbedBuilder()
    .setTitle(`${name} Server Info`)
    .setThumbnail(iconURL() || '')
    .addFields(
      { name: 'Server Name', value: name, inline: true },
      { name: 'Server ID', value: id, inline: true },
      { name: 'Owner', value: `<@${ownerId}>`, inline: true },
      { name: 'Members', value: `${memberCount}`, inline: true },
      { name: 'Created', value: `<t:${Math.floor(createdAt.getTime() / 1000)}:R>`, inline: true }
    )
    .setColor(0x5865f2);
  await message.reply({ embeds: [embed] });
}
