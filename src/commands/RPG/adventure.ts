

import {
  Message,
  EmbedBuilder,
  SlashCommandBuilder,
  ChatInputCommandInteraction
} from 'discord.js';

export const data = {
  name: 'adventure',
  description: 'Go on an adventure to earn XP and rewards (Premium Feature)',
  aliases: ['adv', 'explore', 'quest'],
  category: CommandCategory.RPG,
  usage: '!adventure',
  cooldown: 300
};

export const slashData = new SlashCommandBuilder()
  .setName('adventure')
  .setDescription('Go on an adventure to earn XP and rewards (Premium Feature)');

export async function execute(message: Message, args: string[]) {
  const embed = new EmbedBuilder()
    .setTitle('🗺️ **RPG Adventure System - Premium Feature**')
    .setDescription(
      `Currently the **Demo Bot** includes basic RPG features, but **Advanced Adventures** are a premium feature.\n\n` +
      `**🎮 Demo RPG Features Available:**\n` +
      `• Character creation and profiles\n` +
      `• Basic training system\n` +
      `• Daily rewards\n` +
      `• Simple stat progression\n\n` +
      `**💎 Premium Adventure Features:**\n` +
      `• Epic quests and storylines\n` +
      `• Advanced combat system\n` +
      `• Rare item drops\n` +
      `• Boss battles\n` +
      `• Guild adventures\n` +
      `• PvP arenas\n\n` +
      `**💎 Contact quefep for details on the Premium Bot!**\n` +
      `Get access to all premium features including advanced RPG systems, music, and more!`
    )
    .setColor(0x9b59b6)
    .setThumbnail('https://cdn.discordapp.com/emojis/1234567890123456789.png')
    .setTimestamp()
    .setFooter({ 
      text: 'Demo Bot - Try !create, !profile, !daily, !train for basic RPG features',
      iconURL: message.client.user?.displayAvatarURL()
    });

  await message.reply({ embeds: [embed] });
}

export async function executeSlash(interaction: ChatInputCommandInteraction) {
  const embed = new EmbedBuilder()
    .setTitle('🗺️ **RPG Adventure System - Premium Feature**')
    .setDescription(
      `Currently the **Demo Bot** includes basic RPG features, but **Advanced Adventures** are a premium feature.\n\n` +
      `**🎮 Demo RPG Features Available:**\n` +
      `• Character creation and profiles\n` +
      `• Basic training system\n` +
      `• Daily rewards\n` +
      `• Simple stat progression\n\n` +
      `**💎 Premium Adventure Features:**\n` +
      `• Epic quests and storylines\n` +
      `• Advanced combat system\n` +
      `• Rare item drops\n` +
      `• Boss battles\n` +
      `• Guild adventures\n` +
      `• PvP arenas\n\n` +
      `**💎 Contact quefep for details on the Premium Bot!**\n` +
      `Get access to all premium features including advanced RPG systems, music, and more!`
    )
    .setColor(0x9b59b6)
    .setThumbnail('https://cdn.discordapp.com/emojis/1234567890123456789.png')
    .setTimestamp()
    .setFooter({ 
      text: 'Demo Bot - Try /create, /profile, /daily, /train for basic RPG features',
      iconURL: interaction.client.user?.displayAvatarURL()
    });

  await interaction.reply({ embeds: [embed], ephemeral: true });
} 
