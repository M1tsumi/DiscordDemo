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
  name: 'skip',
  description: 'Skip the current song (Premium Feature)',
  category: CommandCategory.MUSIC,
  usage: '!skip',
  aliases: ['s', 'next'],
  cooldown: 3
};

export const slashData = new SlashCommandBuilder()
  .setName('skip')
  .setDescription('Skip the current song (Premium Feature)');

export async function execute(message: Message, args: string[]) {
  const embed = new EmbedBuilder()
    .setTitle('🎵 **Music Skip - Premium Feature**')
    .setDescription(
      `Currently the **Demo Bot** does not include premium features such as **Music**.\n\n` +
      `**🎧 What's Available in Premium:**\n` +
      `• High-quality music streaming from YouTube\n` +
      `• Spotify integration\n` +
      `• Queue management\n` +
      `• Volume control\n` +
      `• DJ role system\n` +
      `• Music filters and effects\n\n` +
      `**💎 Contact quefep for details on the Premium Bot!**\n` +
      `Get access to all premium features including music, advanced RPG systems, and more!`
    )
    .setColor(0x1db954)
    .setThumbnail('https://cdn.discordapp.com/emojis/1234567890123456789.png')
    .setTimestamp()
    .setFooter({ 
      text: 'Demo Bot - Upgrade to Premium for Music Features',
      iconURL: message.client.user?.displayAvatarURL()
    });

  await message.reply({ embeds: [embed] });
}

export async function executeSlash(interaction: ChatInputCommandInteraction) {
  const embed = new EmbedBuilder()
    .setTitle('🎵 **Music Skip - Premium Feature**')
    .setDescription(
      `Currently the **Demo Bot** does not include premium features such as **Music**.\n\n` +
      `**🎧 What's Available in Premium:**\n` +
      `• High-quality music streaming from YouTube\n` +
      `• Spotify integration\n` +
      `• Queue management\n` +
      `• Volume control\n` +
      `• DJ role system\n` +
      `• Music filters and effects\n\n` +
      `**💎 Contact quefep for details on the Premium Bot!**\n` +
      `Get access to all premium features including music, advanced RPG systems, and more!`
    )
    .setColor(0x1db954)
    .setThumbnail('https://cdn.discordapp.com/emojis/1234567890123456789.png')
    .setTimestamp()
    .setFooter({ 
      text: 'Demo Bot - Upgrade to Premium for Music Features',
      iconURL: interaction.client.user?.displayAvatarURL()
    });

  await interaction.reply({ embeds: [embed], ephemeral: true });
}

