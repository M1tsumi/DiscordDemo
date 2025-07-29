import { Message, EmbedBuilder } from 'discord.js';

export const data = {
  name: 'userinfo',
  description: 'Show information about a user.',
  aliases: ['user', 'whois'],
};

export async function execute(message: Message, args: string[]) {
  const user = message.mentions.users.first() || message.author;
  const member = message.guild?.members.cache.get(user.id);
  const embed = new EmbedBuilder()
    .setTitle(`${user.username}'s Info`)
    .setThumbnail(user.displayAvatarURL())
    .addFields(
      { name: 'Username', value: user.tag, inline: true },
      { name: 'ID', value: user.id, inline: true },
      { name: 'Created', value: `<t:${Math.floor(user.createdTimestamp / 1000)}:R>`, inline: true },
      { name: 'Joined', value: member ? `<t:${Math.floor(member.joinedTimestamp! / 1000)}:R>` : 'Unknown', inline: true }
    )
    .setColor(0x7289da);
  await message.reply({ embeds: [embed] });
}
