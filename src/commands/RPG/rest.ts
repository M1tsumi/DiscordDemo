import { 
  Message, 
  EmbedBuilder, 
  SlashCommandBuilder, 
  ChatInputCommandInteraction,
  PermissionFlagsBits,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
  TextChannel
} from 'discord.js';
import { CommandCategory } from '../../types/Command';

import { Command } from '../../types/Command';
export const data = {
  name: 'rest',
  description: 'Rest to recover health and resources (Premium Feature)',
  aliases: ['sleep', 'heal'],
  category: CommandCategory.RPG,
  usage: '!rest',
  cooldown: 300
};

export const slashData = new SlashCommandBuilder()
  .setName('rest')
  .setDescription('Rest to recover health and resources (Premium Feature)');

export async function execute(message: Message, args: string[]) {
  const embed = new EmbedBuilder()
    .setTitle('😴 **Rest System - Premium Feature**')
    .setDescription(
      `Currently the **Demo Bot** includes basic RPG features, but **Advanced Rest System** is a premium feature.\n\n` +
      `**🎮 Demo RPG Features Available:**\n` +
      `• Character creation and profiles\n` +
      `• Basic training system\n` +
      `• Daily rewards\n` +
      `• Simple stat progression\n\n` +
      `**💎 Premium Rest Features:**\n` +
      `• Advanced healing and recovery\n` +
      `• Rest bonuses and buffs\n` +
      `• Inn system with upgrades\n` +
      `• Sleep quality mechanics\n` +
      `• Recovery potions and items\n` +
      `• Rest-based skill improvements\n\n` +
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
    .setTitle('😴 **Rest System - Premium Feature**')
    .setDescription(
      `Currently the **Demo Bot** includes basic RPG features, but **Advanced Rest System** is a premium feature.\n\n` +
      `**🎮 Demo RPG Features Available:**\n` +
      `• Character creation and profiles\n` +
      `• Basic training system\n` +
      `• Daily rewards\n` +
      `• Simple stat progression\n\n` +
      `**💎 Premium Rest Features:**\n` +
      `• Advanced healing and recovery\n` +
      `• Rest bonuses and buffs\n` +
      `• Inn system with upgrades\n` +
      `• Sleep quality mechanics\n` +
      `• Recovery potions and items\n` +
      `• Rest-based skill improvements\n\n` +
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
