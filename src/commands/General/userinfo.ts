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

import { MessageFlags, User, StringSelectMenuInteraction, EmbedField } from 'discord.js';

export const data = {
  name: 'userinfo',
  description: 'Show information about a user.',
  aliases: ['user', 'whois'],
  category: CommandCategory.GENERAL,
  usage: '!userinfo [@user]',
  cooldown: 3
};

export const slashData = new SlashCommandBuilder()
  .setName('userinfo')
  .setDescription('Show information about a user.')
  .addUserOption(option =>
    option.setName('user')
      .setDescription('The user to get information about')
      .setRequired(false)
  );

export async function execute(message: Message, args?: string[]) {
  const user = message.mentions.users.first() || message.author;
  const member = message.guild?.members.cache.get(user.id);
  
  const embed = new EmbedBuilder()
    .setTitle(`👤 ${user.username}'s Info`)
    .setThumbnail(user.displayAvatarURL())
    .addFields(
      { name: 'Username', value: user.tag, inline: true },
      { name: 'ID', value: user.id, inline: true },
      { name: 'Created', value: `<t:${Math.floor(user.createdTimestamp / 1000)}:R>`, inline: true },
      { name: 'Joined', value: member ? `<t:${Math.floor(member.joinedTimestamp! / 1000)}:R>` : 'Unknown', inline: true }
    )
    .setColor(0x7289da);
    
  if (member?.roles.cache.size && member.roles.cache.size > 1) {
    const roles = member.roles.cache
      .filter(role => role.name !== '@everyone')
      .map(role => `<@&${role.id}>`)
      .join(', ');
    embed.addFields([{ name: 'Roles', value: roles || 'None', inline: false }]);
  }

  await message.reply({ embeds: [embed] });
}

export async function executeSlash(interaction: ChatInputCommandInteraction) {
  const user = interaction.options.getUser('user') || interaction.user;
  const member = interaction.guild?.members.cache.get(user.id);
  
  const embed = new EmbedBuilder()
    .setTitle(`👤 ${user.username}'s Info`)
    .setThumbnail(user.displayAvatarURL())
    .addFields(
      { name: 'Username', value: user.tag, inline: true },
      { name: 'ID', value: user.id, inline: true },
      { name: 'Created', value: `<t:${Math.floor(user.createdTimestamp / 1000)}:R>`, inline: true },
      { name: 'Joined', value: member ? `<t:${Math.floor(member.joinedTimestamp! / 1000)}:R>` : 'Unknown', inline: true }
    )
    .setColor(0x7289da);
    
  if (member?.roles.cache.size && member.roles.cache.size > 1) {
    const roles = member.roles.cache
      .filter(role => role.name !== '@everyone')
      .map(role => `<@&${role.id}>`)
      .join(', ');
    embed.addFields([{ name: 'Roles', value: roles || 'None', inline: false }]);
  }

  await interaction.reply({ embeds: [embed] });
}

