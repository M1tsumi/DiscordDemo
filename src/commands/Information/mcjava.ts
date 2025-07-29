import { Message, EmbedBuilder } from 'discord.js';
import { CommandCategory } from '../../types/Command';
const fetch = require('node-fetch');

export const data = {
  name: 'mcjava',
  description: 'Show Minecraft Java user info by username',
  aliases: ['minecraft'],
  category: CommandCategory.INFORMATION,
  usage: '!mcjava <username>',
  cooldown: 10
};

async function fetchMinecraftProfile(username: string) {
  // Mojang API for UUID
  const uuidRes = await fetch(`https://api.mojang.com/users/profiles/minecraft/${username}`);
  if (!uuidRes.ok) return null;
  const uuidData = await uuidRes.json();
  const uuid = uuidData.id;
  // Mojang API for name history (to get creation time)
  const historyRes = await fetch(`https://api.mojang.com/user/profiles/${uuid}/names`);
  const history = historyRes.ok ? await historyRes.json() : [];
  return {
    username: uuidData.name,
    uuid,
    createdAt: history.length > 0 ? new Date(history[0].changedToAt || Date.now()).toLocaleString() : 'Unknown',
    nameHistoryCount: history.length
  };
}

export async function execute(message: Message, args: string[]) {
  const username = args[0];
  if (!username) {
    return message.reply('Please provide a Minecraft Java username. Usage: `!mcjava <username>`');
  }
  const profile = await fetchMinecraftProfile(username);
  if (!profile) {
    return message.reply('Could not find that Minecraft Java user.');
  }
  const embed = new EmbedBuilder()
    .setTitle(`Minecraft Java Profile: ${profile.username}`)
    .addFields(
      { name: 'Username', value: profile.username, inline: true },
      { name: 'UUID', value: profile.uuid, inline: false },
      { name: 'Account Creation', value: profile.createdAt, inline: false },
      { name: 'Name Changes', value: `${profile.nameHistoryCount ?? 'Unknown'}`, inline: true }
    )
    .setColor(0x00c3ff)
    .setFooter({ text: 'Data from Mojang' });
  await message.reply({ embeds: [embed] });
}
