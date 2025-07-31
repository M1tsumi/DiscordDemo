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
import { CommandCategory } from '../../types/Command.js';


export const data = {
  name: 'rank',
  description: 'View your RPG rank and achievements (Premium Feature)',
  aliases: ['level', 'stats'],
  category: CommandCategory.RPG,
  usage: '!rank [@user]',
  cooldown: 300
};

export const slashData = new SlashCommandBuilder()
  .setName('rank')
  .setDescription('View your RPG rank and achievements (Premium Feature)')
  .addUserOption(option =>
    option.setName('user')
      .setDescription('User to view rank for (optional)')
      .setRequired(false)
  );

export async function execute(message: Message, args: string[]) {
  const embed = new EmbedBuilder()
    .setTitle('🏆 **RPG Ranking System - Premium Feature**')
    .setDescription(
      `Currently the **Demo Bot** includes basic RPG features, but **Advanced Ranking System** is a premium feature.\n\n` +
      `**🎮 Demo RPG Features Available:**\n` +
      `• Character creation and profiles\n` +
      `• Basic training system\n` +
      `• Daily rewards\n` +
      `• Simple stat progression\n\n` +
      `**💎 Premium Ranking Features:**\n` +
      `• Advanced ranking algorithms\n` +
      `• Seasonal leaderboards\n` +
      `• Achievement systems\n` +
      `• Rank-based rewards\n` +
      `• Competitive rankings\n` +
      `• Rank progression tracking\n\n` +
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
    .setTitle('🏆 **RPG Ranking System - Premium Feature**')
    .setDescription(
      `Currently the **Demo Bot** includes basic RPG features, but **Advanced Ranking System** is a premium feature.\n\n` +
      `**🎮 Demo RPG Features Available:**\n` +
      `• Character creation and profiles\n` +
      `• Basic training system\n` +
      `• Daily rewards\n` +
      `• Simple stat progression\n\n` +
      `**💎 Premium Ranking Features:**\n` +
      `• Advanced ranking algorithms\n` +
      `• Seasonal leaderboards\n` +
      `• Achievement systems\n` +
      `• Rank-based rewards\n` +
      `• Competitive rankings\n` +
      `• Rank progression tracking\n\n` +
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

