import { Message } from 'discord.js';

export const data = {
  name: 'unmute',
  description: 'Unmute a user in the server.',
  aliases: [],
};

export async function execute(message: Message, args: string[]) {
  if (!message.member?.permissions.has('ModerateMembers')) return message.reply('You do not have permission to use this command.');
  const user = message.mentions.members?.first();
  if (!user) return message.reply('Please mention a user to unmute.');
  await user.timeout(null);
  await message.reply(`Unmuted ${user.user.tag}.`);
}
