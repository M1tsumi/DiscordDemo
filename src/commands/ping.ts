import { Message } from 'discord.js';

export const data = {
  name: 'ping',
  description: 'Check the bot latency.',
  aliases: ['latency'],
};

export async function execute(message: Message) {
  const sent = await message.reply('Pinging...');
  const latency = sent.createdTimestamp - message.createdTimestamp;
  await sent.edit(`🏓 Pong! Latency: ${latency}ms`);
}
