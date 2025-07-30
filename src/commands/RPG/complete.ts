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


export const data = {
  name: 'complete',
  description: 'Complete quests and challenges (Premium Feature)',
  aliases: ['finish', 'done'],
  category: CommandCategory.RPG,
  usage: '!complete',
  cooldown: 300
};

export const slashData = new SlashCommandBuilder()
  .setName('complete')
  .setDescription('Complete quests and challenges (Premium Feature)');

export async function execute(message: Message, args: string[]) {
  const embed = new EmbedBuilder()
    .setTitle('📜 **Quest Completion - Premium Feature**')
    .setDescription(
      `Currently the **Demo Bot** includes basic RPG features, but **Advanced Quests** are a premium feature.\n\n` +
      `**🎮 Demo RPG Features Available:**\n` +
      `• Character creation and profiles\n` +
      `• Basic training system\n` +
      `• Daily rewards\n` +
      `• Simple stat progression\n\n` +
      `**💎 Premium Quest Features:**\n` +
      `• Epic storylines and quest chains\n` +
      `• Advanced quest completion system\n` +
      `• Rare rewards and achievements\n` +
      `• Guild quests and challenges\n` +
      `• Seasonal events\n` +
      `• Quest leaderboards\n\n` +
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
    .setTitle('📜 **Quest Completion - Premium Feature**')
    .setDescription(
      `Currently the **Demo Bot** includes basic RPG features, but **Advanced Quests** are a premium feature.\n\n` +
      `**🎮 Demo RPG Features Available:**\n` +
      `• Character creation and profiles\n` +
      `• Basic training system\n` +
      `• Daily rewards\n` +
      `• Simple stat progression\n\n` +
      `**💎 Premium Quest Features:**\n` +
      `• Epic storylines and quest chains\n` +
      `• Advanced quest completion system\n` +
      `• Rare rewards and achievements\n` +
      `• Guild quests and challenges\n` +
      `• Seasonal events\n` +
      `• Quest leaderboards\n\n` +
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

