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
  name: 'createinvite',
  description: 'Create an invite link to any server the bot is in.',
  aliases: ['invite', 'serverinvite'],
  category: CommandCategory.UTILITY,
  usage: '!createinvite <server_id>',
  cooldown: 5,
  permissions: ['Administrator']
};

export const slashData = new SlashCommandBuilder()
  .setName('createinvite')
  .setDescription('Create an invite link to any server the bot is in.')
  .addStringOption(option =>
    option.setName('server_id')
      .setDescription('The ID of the server to create an invite for')
      .setRequired(true)
  );

export async function execute(message: Message, args?: string[]) {
  const serverId = args?.[0];
  
  if (!serverId) {
    await message.reply('❌ Please provide a server ID.\nUsage: `!createinvite <server_id>`');
    return;
  }

  try {
    const guild = message.client.guilds.cache.get(serverId);
    
    if (!guild) {
      await message.reply('❌ Server not found. Make sure the bot is in that server and the server ID is correct.');
      return;
    }

    // Check if bot has permission to create invites
    const botMember = guild.members.cache.get(message.client.user!.id);
    if (!botMember?.permissions.has('CreateInstantInvite')) {
      await message.reply('❌ I don\'t have permission to create invites in that server.');
      return;
    }

    // Find a channel where the bot can create invites
    const channel = guild.channels.cache.find(ch => 
      ch.type === 0 && // Text channel
      ch.permissionsFor(botMember).has('CreateInstantInvite')
    ) as any;

    if (!channel) {
      await message.reply('❌ I don\'t have permission to create invites in any channel in that server.');
      return;
    }

    // Create the invite
    const invite = await (channel as any).createInvite({
      maxAge: 0, // Never expires
      maxUses: 0, // Unlimited uses
      unique: true
    });

    const embed = new EmbedBuilder()
      .setTitle('🔗 **Server Invite Created**')
      .setDescription(`Successfully created an invite for **${guild.name}**`)
      .addFields([
        {
          name: '🏠 Server',
          value: `**${guild.name}** (${guild.id})`,
          inline: true
        },
        {
          name: '👥 Members',
          value: `${guild.memberCount.toLocaleString()}`,
          inline: true
        },
        {
          name: '📊 Owner',
          value: `<@${guild.ownerId}>`,
          inline: true
        },
        {
          name: '🔗 Invite Link',
          value: `https://discord.gg/${invite.code}`,
          inline: false
        }
      ])
      .setColor(0x2ecc71)
      .setThumbnail(guild.iconURL({ size: 256 }))
      .setTimestamp()
      .setFooter({ 
        text: `Created by ${message.author.tag}`,
        iconURL: message.author.displayAvatarURL()
      });

    // Create copy button
    const copyButton = new ButtonBuilder()
      .setCustomId('copy_invite')
      .setLabel('📋 Copy Invite Link')
      .setStyle(ButtonStyle.Primary);

    const row = new ActionRowBuilder<ButtonBuilder>()
      .addComponents(copyButton);

    const response = await message.reply({ 
      embeds: [embed], 
      components: [row] 
    });

    // Create collector for button interactions
    const collector = response.createMessageComponentCollector({ 
      time: 300000 // 5 minutes
    });

    collector.on('collect', async (interaction) => {
      if (interaction.customId === 'copy_invite') {
        await interaction.reply({ 
          content: `🔗 **Invite Link:** https://discord.gg/${invite.code}\n\nYou can copy this link and share it with others!`,
          ephemeral: true 
        });
      }
    });

    collector.on('end', () => {
      // Disable the button after timeout
      copyButton.setDisabled(true);
      response.edit({ components: [row] }).catch(console.error);
    });

  } catch (error) {
    console.error('Error creating invite:', error);
    await message.reply('❌ An error occurred while creating the invite. Please try again.');
  }
}

export async function executeSlash(interaction: ChatInputCommandInteraction) {
  const serverId = interaction.options.getString('server_id');
  
  if (!serverId) {
    await interaction.reply({ 
      content: '❌ Please provide a server ID.',
      ephemeral: true 
    });
    return;
  }

  try {
    const guild = interaction.client.guilds.cache.get(serverId);
    
    if (!guild) {
      await interaction.reply({ 
        content: '❌ Server not found. Make sure the bot is in that server and the server ID is correct.',
        ephemeral: true 
      });
      return;
    }

    // Check if bot has permission to create invites
    const botMember = guild.members.cache.get(interaction.client.user!.id);
    if (!botMember?.permissions.has('CreateInstantInvite')) {
      await interaction.reply({ 
        content: '❌ I don\'t have permission to create invites in that server.',
        ephemeral: true 
      });
      return;
    }

    // Find a channel where the bot can create invites
    const channel = guild.channels.cache.find(ch => 
      ch.type === 0 && // Text channel
      ch.permissionsFor(botMember).has('CreateInstantInvite')
    ) as any;

    if (!channel) {
      await interaction.reply({ 
        content: '❌ I don\'t have permission to create invites in any channel in that server.',
        ephemeral: true 
      });
      return;
    }

    // Create the invite
    const invite = await channel.createInvite({
      maxAge: 0, // Never expires
      maxUses: 0, // Unlimited uses
      unique: true
    });

    const embed = new EmbedBuilder()
      .setTitle('🔗 **Server Invite Created**')
      .setDescription(`Successfully created an invite for **${guild.name}**`)
      .addFields([
        {
          name: '🏠 Server',
          value: `**${guild.name}** (${guild.id})`,
          inline: true
        },
        {
          name: '👥 Members',
          value: `${guild.memberCount.toLocaleString()}`,
          inline: true
        },
        {
          name: '📊 Owner',
          value: `<@${guild.ownerId}>`,
          inline: true
        },
        {
          name: '🔗 Invite Link',
          value: `https://discord.gg/${invite.code}`,
          inline: false
        }
      ])
      .setColor(0x2ecc71)
      .setThumbnail(guild.iconURL({ size: 256 }))
      .setTimestamp()
      .setFooter({ 
        text: `Created by ${interaction.user.username}`,
        iconURL: interaction.user.displayAvatarURL()
      });

    // Create copy button
    const copyButton = new ButtonBuilder()
      .setCustomId('copy_invite')
      .setLabel('📋 Copy Invite Link')
      .setStyle(ButtonStyle.Primary);

    const row = new ActionRowBuilder<ButtonBuilder>()
      .addComponents(copyButton);

    const response = await interaction.reply({ 
      embeds: [embed], 
      components: [row],
      fetchReply: true
    });

    // Create collector for button interactions
    const collector = response.createMessageComponentCollector({ 
      time: 300000 // 5 minutes
    });

    collector.on('collect', async (buttonInteraction) => {
      if (buttonInteraction.customId === 'copy_invite') {
        await buttonInteraction.reply({ 
          content: `🔗 **Invite Link:** https://discord.gg/${invite.code}\n\nYou can copy this link and share it with others!`,
          ephemeral: true 
        });
      }
    });

    collector.on('end', () => {
      // Disable the button after timeout
      copyButton.setDisabled(true);
      response.edit({ components: [row] }).catch(console.error);
    });

  } catch (error) {
    console.error('Error creating invite:', error);
    await interaction.reply({ 
      content: '❌ An error occurred while creating the invite. Please try again.',
      ephemeral: true 
    });
  }
} 
