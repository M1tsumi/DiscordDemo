import { Message } from 'discord.js';

export const data = {
  name: 'ban',
  description: 'Ban a user from the server.',
  aliases: [],
};

export async function execute(message: Message, args: string[]) {
  if (!message.member?.permissions.has('BanMembers')) return message.reply('You do not have permission to use this command.');
  const user = message.mentions.members?.first();
  if (!user) return message.reply('Please mention a user to ban.');
  if (!user.bannable) return message.reply('I cannot ban this user.');
  await user.ban();
  await message.reply(`Banned ${user.user.tag}`);
}
