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
  name: 'leaderboard',
  description: 'View the RPG leaderboard (Premium Feature)',
  aliases: ['lb', 'top', 'rankings'],
  category: CommandCategory.RPG,
  usage: '!leaderboard',
  cooldown: 300
};

export const slashData = new SlashCommandBuilder()
  .setName('leaderboard')
  .setDescription('View the RPG leaderboard (Premium Feature)');

export async function execute(message: Message, args: string[]) {
  const embed = new EmbedBuilder()
    .setTitle('🏆 **RPG Leaderboard - Premium Feature**')
    .setDescription(
      `Currently the **Demo Bot** includes basic RPG features, but **Advanced Leaderboard System** is a premium feature.\n\n` +
      `**🎮 Demo RPG Features Available:**\n` +
      `• Character creation and profiles\n` +
      `• Basic training system\n` +
      `• Daily rewards\n` +
      `• Simple stat progression\n\n` +
      `**💎 Premium Leaderboard Features:**\n` +
      `• Real-time leaderboards\n` +
      `• Multiple ranking categories\n` +
      `• Seasonal competitions\n` +
      `• Leaderboard rewards\n` +
      `• Global rankings\n` +
      `• Achievement tracking\n\n` +
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
    .setTitle('🏆 **RPG Leaderboard - Premium Feature**')
    .setDescription(
      `Currently the **Demo Bot** includes basic RPG features, but **Advanced Leaderboard System** is a premium feature.\n\n` +
      `**🎮 Demo RPG Features Available:**\n` +
      `• Character creation and profiles\n` +
      `• Basic training system\n` +
      `• Daily rewards\n` +
      `• Simple stat progression\n\n` +
      `**💎 Premium Leaderboard Features:**\n` +
      `• Real-time leaderboards\n` +
      `• Multiple ranking categories\n` +
      `• Seasonal competitions\n` +
      `• Leaderboard rewards\n` +
      `• Global rankings\n` +
      `• Achievement tracking\n\n` +
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

