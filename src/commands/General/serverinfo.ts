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
  name: 'serverinfo',
  description: 'Show information about this server.',
  aliases: ['server', 'guildinfo'],
  category: CommandCategory.GENERAL,
  usage: '!serverinfo',
  cooldown: 5
};

export const slashData = new SlashCommandBuilder()
  .setName('serverinfo')
  .setDescription('Show information about this server.');

export async function execute(message: Message) {
  if (!message.guild) return message.reply('❌ This command can only be used in a server.');
  
  const { name, id, memberCount, ownerId, createdAt } = message.guild;
  const owner = await message.guild.fetchOwner();
  const guildIcon = message.guild.iconURL({ size: 256 }) || null;
  
  const embed = new EmbedBuilder()
    .setTitle(`🏰 ${name} Server Info`)
    .setThumbnail(guildIcon)
    .addFields(
      { name: 'Server Name', value: name, inline: true },
      { name: 'Server ID', value: id, inline: true },
      { name: 'Owner', value: `${owner.user.tag}`, inline: true },
      { name: 'Members', value: `${memberCount}`, inline: true },
      { name: 'Created', value: `<t:${Math.floor(createdAt.getTime() / 1000)}:R>`, inline: true },
      { name: 'Channels', value: `${message.guild.channels.cache.size}`, inline: true }
    )
    .setColor(0x5865f2)
    .setFooter({ text: `Requested by ${message.author.tag}`, iconURL: message.author.displayAvatarURL() });
    
  await message.reply({ embeds: [embed] });
}

export async function executeSlash(interaction: ChatInputCommandInteraction) {
  if (!interaction.guild) return interaction.reply({ content: '❌ This command can only be used in a server.', ephemeral: true });
  
  const { name, id, memberCount, ownerId, createdAt } = interaction.guild;
  const owner = await interaction.guild.fetchOwner();
  const guildIcon = interaction.guild.iconURL({ size: 256 }) || null;
  
  const embed = new EmbedBuilder()
    .setTitle(`🏰 ${name} Server Info`)
    .setThumbnail(guildIcon)
    .addFields(
      { name: 'Server Name', value: name, inline: true },
      { name: 'Server ID', value: id, inline: true },
      { name: 'Owner', value: `${owner.user.tag}`, inline: true },
      { name: 'Members', value: `${memberCount}`, inline: true },
      { name: 'Created', value: `<t:${Math.floor(createdAt.getTime() / 1000)}:R>`, inline: true },
      { name: 'Channels', value: `${interaction.guild.channels.cache.size}`, inline: true }
    )
    .setColor(0x5865f2)
    .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() });
    
  await interaction.reply({ embeds: [embed] });
}

