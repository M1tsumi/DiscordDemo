import { Message } from 'discord.js';

export const data = {
  name: 'purge',
  description: 'Delete a number of messages from a channel.',
  aliases: ['clear'],
};

export async function execute(message: Message, args: string[]) {
  if (!message.member?.permissions.has('ManageMessages')) return message.reply('You do not have permission to use this command.');
  const amount = parseInt(args[0]);
  if (isNaN(amount) || amount < 1 || amount > 100) return message.reply('Please provide a number between 1 and 100.');
  await message.delete();
  const deleted = await message.channel.bulkDelete(amount, true);
  await message.channel.send(`Deleted ${deleted.size} messages.`);
}
