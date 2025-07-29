import { Message, EmbedBuilder } from 'discord.js';

export const data = {
  name: 'invite',
  description: 'Get the bot invite link.',
  aliases: ['invitelink'],
};

const CLIENT_ID = process.env.CLIENT_ID || 'YOUR_CLIENT_ID';
const PERMISSIONS = '8'; // Administrator

export async function execute(message: Message) {
  const inviteUrl = `https://discord.com/oauth2/authorize?client_id=${CLIENT_ID}&permissions=${PERMISSIONS}&scope=bot%20applications.commands`;
  const embed = new EmbedBuilder()
    .setTitle('Invite the Bot')
    .setDescription(`[Click here to invite](${inviteUrl})`)
    .setColor(0x57f287);
  await message.reply({ embeds: [embed] });
}
