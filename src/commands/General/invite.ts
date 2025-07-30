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
  name: 'invite',
  description: 'Get bot invite links and useful information.',
  aliases: ['invitelink', 'invitebot'],
  category: CommandCategory.GENERAL,
  usage: '!invite',
  cooldown: 5
};

export const slashData = new SlashCommandBuilder()
  .setName('invite')
  .setDescription('Get bot invite links and useful information.');

export async function execute(message: Message) {
  const client = message.client;
  const clientId = client.user?.id;

  if (!clientId) {
    return message.reply('❌ Unable to generate invite link. Bot client ID not found.');
  }

  // Different permission sets
  const fullPermissions = '137439267840'; // Full permissions needed for all features
  const basicPermissions = '414467973184'; // Basic permissions for core functionality
  const minimalPermissions = '2147483648'; // Minimal permissions (slash commands only)

  const fullInvite = `https://discord.com/oauth2/authorize?client_id=${clientId}&permissions=${fullPermissions}&scope=bot%20applications.commands`;
  const basicInvite = `https://discord.com/oauth2/authorize?client_id=${clientId}&permissions=${basicPermissions}&scope=bot%20applications.commands`;
  const minimalInvite = `https://discord.com/oauth2/authorize?client_id=${clientId}&permissions=${minimalPermissions}&scope=bot%20applications.commands`;

  const embed = new EmbedBuilder()
    .setTitle('🤖 Invite Me to Your Server!')
    .setDescription('Choose the permission level that works best for your server:')
    .setThumbnail(client.user?.displayAvatarURL() || '')
    .setColor(0x57f287)
    .addFields([
      {
        name: '🌟 **Recommended (Full Features)**',
        value: `All features including moderation, games, and advanced commands.\n[**Invite with Full Permissions**](${fullInvite})`,
        inline: false
      },
      {
        name: '⚡ **Basic (Core Features)**',
        value: `Essential features like help, fun commands, and leveling.\n[**Invite with Basic Permissions**](${basicInvite})`,
        inline: false
      },
      {
        name: '🔒 **Minimal (Slash Commands Only)**',
        value: `Only slash commands, perfect for security-conscious servers.\n[**Invite with Minimal Permissions**](${minimalInvite})`,
        inline: false
      },
      {
        name: '📋 **What I Can Do:**',
        value: '• 25+ Commands across multiple categories\n• Interactive games (Tic-Tac-Toe, Polls)\n• Economy system with daily rewards\n• Leveling system with XP tracking\n• Moderation tools\n• Custom server settings\n• Both prefix and slash commands',
        inline: false
      }
    ])
    .setFooter({ 
      text: 'Thank you for choosing our bot! ❤️',
      iconURL: client.user?.displayAvatarURL()
    });

  // Create buttons for quick access
  const row = new ActionRowBuilder<ButtonBuilder>()
    .addComponents(
      new ButtonBuilder()
        .setLabel('Full Permissions')
        .setStyle(ButtonStyle.Link)
        .setURL(fullInvite)
        .setEmoji('🌟'),
      new ButtonBuilder()
        .setLabel('Basic Permissions')
        .setStyle(ButtonStyle.Link)
        .setURL(basicInvite)
        .setEmoji('⚡'),
      new ButtonBuilder()
        .setLabel('Minimal Permissions')
        .setStyle(ButtonStyle.Link)
        .setURL(minimalInvite)
        .setEmoji('🔒')
    );

  await message.reply({ embeds: [embed], components: [row] });
}

export async function executeSlash(interaction: ChatInputCommandInteraction) {
  const client = interaction.client;
  const clientId = client.user?.id;

  if (!clientId) {
    return interaction.reply({ 
      content: '❌ Unable to generate invite link. Bot client ID not found.',
      ephemeral: true 
    });
  }

  // Different permission sets
  const fullPermissions = '137439267840'; // Full permissions needed for all features
  const basicPermissions = '414467973184'; // Basic permissions for core functionality
  const minimalPermissions = '2147483648'; // Minimal permissions (slash commands only)

  const fullInvite = `https://discord.com/oauth2/authorize?client_id=${clientId}&permissions=${fullPermissions}&scope=bot%20applications.commands`;
  const basicInvite = `https://discord.com/oauth2/authorize?client_id=${clientId}&permissions=${basicPermissions}&scope=bot%20applications.commands`;
  const minimalInvite = `https://discord.com/oauth2/authorize?client_id=${clientId}&permissions=${minimalPermissions}&scope=bot%20applications.commands`;

  const embed = new EmbedBuilder()
    .setTitle('🤖 Invite Me to Your Server!')
    .setDescription('Choose the permission level that works best for your server:')
    .setThumbnail(client.user?.displayAvatarURL() || '')
    .setColor(0x57f287)
    .addFields([
      {
        name: '🌟 **Recommended (Full Features)**',
        value: `All features including moderation, games, and advanced commands.\n[**Invite with Full Permissions**](${fullInvite})`,
        inline: false
      },
      {
        name: '⚡ **Basic (Core Features)**',
        value: `Essential features like help, fun commands, and leveling.\n[**Invite with Basic Permissions**](${basicInvite})`,
        inline: false
      },
      {
        name: '🔒 **Minimal (Slash Commands Only)**',
        value: `Only slash commands, perfect for security-conscious servers.\n[**Invite with Minimal Permissions**](${minimalInvite})`,
        inline: false
      },
      {
        name: '📋 **What I Can Do:**',
        value: '• 25+ Commands across multiple categories\n• Interactive games (Tic-Tac-Toe, Polls)\n• Economy system with daily rewards\n• Leveling system with XP tracking\n• Moderation tools\n• Custom server settings\n• Both prefix and slash commands',
        inline: false
      }
    ])
    .setFooter({ 
      text: 'Thank you for choosing our bot! ❤️',
      iconURL: client.user?.displayAvatarURL()
    });

  // Create buttons for quick access
  const row = new ActionRowBuilder<ButtonBuilder>()
    .addComponents(
      new ButtonBuilder()
        .setLabel('Full Permissions')
        .setStyle(ButtonStyle.Link)
        .setURL(fullInvite)
        .setEmoji('🌟'),
      new ButtonBuilder()
        .setLabel('Basic Permissions')
        .setStyle(ButtonStyle.Link)
        .setURL(basicInvite)
        .setEmoji('⚡'),
      new ButtonBuilder()
        .setLabel('Minimal Permissions')
        .setStyle(ButtonStyle.Link)
        .setURL(minimalInvite)
        .setEmoji('🔒')
    );

  await interaction.reply({ embeds: [embed], components: [row] });
}
