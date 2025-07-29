import { Message, EmbedBuilder } from 'discord.js';

export const data = {
  name: 'help',
  description: 'List all commands and their usage.',
  aliases: ['commands'],
};

// This should be dynamically generated in a real bot
const commands = [
  { name: 'help', description: 'List all commands and their usage.' },
  { name: 'ping', description: 'Check the bot latency.' },
  { name: 'userinfo', description: 'Show information about a user.' },
  { name: 'serverinfo', description: 'Show information about this server.' },
  { name: 'avatar', description: 'Show your or another user\'s avatar.' },
  { name: 'invite', description: 'Get the bot invite link.' },
  { name: 'profile', description: 'Show your profile with level and XP.' },
  { name: 'leaderboard', description: 'Show the top users by level and XP.' },
  { name: 'mcjava', description: 'Show Minecraft Java user info by username.' }
];

export async function execute(message: Message) {
  const embed = new EmbedBuilder()
    .setTitle('Help — Command List')
    .setDescription(commands.map(cmd => `**!${cmd.name}** — ${cmd.description}`).join('\n'))
    .setColor(0x5865f2);
  await message.reply({ embeds: [embed] });
}
