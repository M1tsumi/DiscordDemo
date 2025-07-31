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
  name: 'adminset',
  description: 'Configure admin roles and command permissions (Server Owner Only).',
  aliases: ['adminconfig', 'modconfig'],
  category: CommandCategory.UTILITY,
  usage: '!adminset',
  cooldown: 5,
  permissions: ['Server Owner Only']
};

export const slashData = new SlashCommandBuilder()
  .setName('adminset')
  .setDescription('Configure admin roles and command permissions (Server Owner Only).');

export async function execute(message: Message) {
  if (!message.guild) {
    return message.reply('❌ This command can only be used in a server.');
  }

  // Check if user is server owner
  if (message.author.id !== message.guild.ownerId) {
    return message.reply('❌ Only the server owner can use this command.');
  }

  await showAdminPanel(message, 'message');
}

export async function executeSlash(interaction: ChatInputCommandInteraction) {
  if (!interaction.guild) {
    return interaction.reply({ 
      content: '❌ This command can only be used in a server.',
      ephemeral: true 
    });
  }

  // Check if user is server owner
  if (interaction.user.id !== interaction.guild.ownerId) {
    return interaction.reply({ 
      content: '❌ Only the server owner can use this command.',
      ephemeral: true 
    });
  }

  await showAdminPanel(interaction, 'interaction');
}

async function showAdminPanel(source: Message | ChatInputCommandInteraction, type: 'message' | 'interaction') {
  const { adminService } = await import('../../index');
  const guild = source.guild!;
  const settings = adminService.getSettings(guild.id);

  // Create main admin panel embed
  const embed = new EmbedBuilder()
    .setAuthor({ 
      name: `${guild.name} - Admin Configuration Panel`,
      iconURL: guild.iconURL() || undefined
    })
    .setTitle('🛡️ **Moderation Command Management**')
    .setDescription(
      `**Welcome to the Admin Configuration Panel!**\n\n` +
      `Here you can manage which roles have access to moderation commands and customize permissions for your server.\n\n` +
      `**Current Configuration:**`
    )
    .setColor(0xe74c3c)
    .setThumbnail(source.client.user?.displayAvatarURL())
    .setTimestamp()
    .setFooter({ 
      text: `Server Owner: ${guild.members.cache.get(guild.ownerId)?.user.tag || 'Unknown'}`,
      iconURL: guild.members.cache.get(guild.ownerId)?.user.displayAvatarURL()
    });

  // Show current admin roles
  let adminRolesText = 'None configured';
  if (settings.adminRoles.length > 0) {
    const roleNames = settings.adminRoles
      .map(roleId => {
        const role = guild.roles.cache.get(roleId);
        return role ? `<@&${roleId}>` : `Unknown Role (${roleId})`;
      })
      .join(', ');
    adminRolesText = roleNames;
  }

  // Show global commands
  const globalCommandsText = settings.globalAdminCommands.length > 0 
    ? settings.globalAdminCommands.map(cmd => `\`${cmd}\``).join(', ')
    : 'None';

  embed.addFields([
    {
      name: '👥 **Admin Roles**',
      value: adminRolesText,
      inline: false
    },
    {
      name: '🌐 **Global Admin Commands**',
      value: `Commands all admin roles can use:\n${globalCommandsText}`,
      inline: false
    },
    {
      name: '📊 **Statistics**',
      value: `• **Admin Roles:** ${settings.adminRoles.length}\n• **Global Commands:** ${settings.globalAdminCommands.length}\n• **Moderation Channels:** ${settings.moderationChannels.length || 'All channels allowed'}`,
      inline: true
    }
  ]);

  // Create action buttons
  const mainButtons = new ActionRowBuilder<ButtonBuilder>()
    .addComponents(
      new ButtonBuilder()
        .setCustomId('admin_manage_roles')
        .setLabel('Manage Admin Roles')
        .setStyle(ButtonStyle.Primary)
        .setEmoji('👥'),
      new ButtonBuilder()
        .setCustomId('admin_manage_commands')
        .setLabel('Manage Commands')
        .setStyle(ButtonStyle.Secondary)
        .setEmoji('⚙️'),
      new ButtonBuilder()
        .setCustomId('admin_manage_channels')
        .setLabel('Manage Channels')
        .setStyle(ButtonStyle.Secondary)
        .setEmoji('📝')
    );

  const utilityButtons = new ActionRowBuilder<ButtonBuilder>()
    .addComponents(
      new ButtonBuilder()
        .setCustomId('admin_view_permissions')
        .setLabel('View All Permissions')
        .setStyle(ButtonStyle.Success)
        .setEmoji('📋'),
      new ButtonBuilder()
        .setCustomId('admin_reset_config')
        .setLabel('Reset Configuration')
        .setStyle(ButtonStyle.Danger)
        .setEmoji('🔄'),
      new ButtonBuilder()
        .setCustomId('admin_close_panel')
        .setLabel('Close Panel')
        .setStyle(ButtonStyle.Secondary)
        .setEmoji('❌')
    );

  const components = [mainButtons, utilityButtons];

  if (type === 'message') {
    await (source as Message).reply({ embeds: [embed], components });
  } else {
    await (source as ChatInputCommandInteraction).reply({ embeds: [embed], components });
  }
}

export async function handleAdminInteraction(interaction: any) {
  if (!interaction.isButton() && !interaction.isStringSelectMenu()) return;
  
  const { adminService } = await import('../../index');
  const guild = interaction.guild;
  
  if (!guild) {
    return interaction.reply({ content: '❌ This can only be used in a server.', ephemeral: true });
  }

  // Check if user is server owner
  if (interaction.user.id !== guild.ownerId) {
    return interaction.reply({ 
      content: '❌ Only the server owner can use this panel.',
      ephemeral: true 
    });
  }

  const customId = interaction.customId;

  if (customId === 'admin_manage_roles') {
    await showRoleManagement(interaction, adminService, guild);
  } else if (customId === 'admin_manage_commands') {
    await showCommandManagement(interaction, adminService, guild);
  } else if (customId === 'admin_manage_channels') {
    await showChannelManagement(interaction, adminService, guild);
  } else if (customId === 'admin_view_permissions') {
    await showPermissionOverview(interaction, adminService, guild);
  } else if (customId === 'admin_reset_config') {
    await showResetConfirmation(interaction, adminService, guild);
  } else if (customId === 'admin_close_panel') {
    await interaction.update({ 
      embeds: [
        new EmbedBuilder()
          .setTitle('🛡️ Admin Panel Closed')
          .setDescription('The admin configuration panel has been closed.')
          .setColor(0x95a5a6)
          .setTimestamp()
      ], 
      components: [] 
    });
  }
}

async function showRoleManagement(interaction: any, adminService: any, guild: any) {
  const settings = adminService.getSettings(guild.id);
  
  const embed = new EmbedBuilder()
    .setTitle('👥 **Admin Role Management**')
    .setDescription(
      `Manage which roles have administrative permissions in your server.\n\n` +
      `**Current Admin Roles:**`
    )
    .setColor(0x3498db);

  if (settings.adminRoles.length === 0) {
    embed.addFields([{ name: 'No Admin Roles', value: 'No roles are currently configured as admin roles.', inline: false }]);
  } else {
         const roleList = settings.adminRoles.map((roleId: string) => {
       const role = guild.roles.cache.get(roleId);
       const commandCount = settings.allowedCommands[roleId]?.length || 0;
       return role ? `<@&${roleId}> - ${commandCount} commands` : `Unknown Role (${roleId})`;
     }).join('\n');
    
    embed.addFields([{ name: 'Admin Roles', value: roleList, inline: false }]);
  }

  // Create role selection menu
  const availableRoles = guild.roles.cache
    .filter((role: any) => 
      role.name !== '@everyone' && 
      !role.managed && 
      !settings.adminRoles.includes(role.id)
    )
    .sort((a: any, b: any) => b.position - a.position)
    .first(20); // Discord limit for select menu options

  const components = [];

  if (availableRoles.length > 0) {
    const roleSelect = new ActionRowBuilder<StringSelectMenuBuilder>()
      .addComponents(
        new StringSelectMenuBuilder()
          .setCustomId('admin_add_role_select')
          .setPlaceholder('Select a role to add as admin')
          .addOptions(
            availableRoles.map((role: any) => 
              new StringSelectMenuOptionBuilder()
                .setLabel(role.name)
                .setDescription(`Add ${role.name} as an admin role`)
                .setValue(role.id)
                .setEmoji('👥')
            )
          )
      );
    components.push(roleSelect);
  }

  if (settings.adminRoles.length > 0) {
    const removeRoleSelect = new ActionRowBuilder<StringSelectMenuBuilder>()
      .addComponents(
        new StringSelectMenuBuilder()
          .setCustomId('admin_remove_role_select')
          .setPlaceholder('Select a role to remove from admin')
          .addOptions(
                         settings.adminRoles.slice(0, 20).map((roleId: string) => {
               const role = guild.roles.cache.get(roleId);
               return new StringSelectMenuOptionBuilder()
                 .setLabel(role ? role.name : 'Unknown Role')
                 .setDescription(`Remove this role from admin roles`)
                 .setValue(roleId)
                 .setEmoji('🗑️');
             })
          )
      );
    components.push(removeRoleSelect);
  }

  const backButton = new ActionRowBuilder<ButtonBuilder>()
    .addComponents(
      new ButtonBuilder()
        .setCustomId('admin_back_to_main')
        .setLabel('Back to Main Panel')
        .setStyle(ButtonStyle.Secondary)
        .setEmoji('⬅️')
    );
  components.push(backButton);

  await interaction.update({ embeds: [embed], components });
}

async function showCommandManagement(interaction: any, adminService: any, guild: any) {
  const settings = adminService.getSettings(guild.id);
  
  const embed = new EmbedBuilder()
    .setTitle('⚙️ **Command Permission Management**')
    .setDescription(
      `Configure which commands admin roles can use.\n\n` +
      `**Global Commands** are available to all admin roles.\n` +
      `**Role-Specific Commands** are customized per role.`
    )
    .setColor(0x9b59b6);

     // Show global commands
   const globalCommands = settings.globalAdminCommands.length > 0 
     ? settings.globalAdminCommands.map((cmd: string) => `\`${cmd}\``).join(', ')
     : 'None';

  embed.addFields([
    { 
      name: '🌐 Global Admin Commands', 
      value: globalCommands,
      inline: false 
    }
  ]);

  // Show role-specific commands
  if (settings.adminRoles.length > 0) {
         const roleCommandsText = settings.adminRoles.map((roleId: string) => {
       const role = guild.roles.cache.get(roleId);
       const commands = settings.allowedCommands[roleId] || [];
       const roleName = role ? role.name : 'Unknown Role';
       const commandList = commands.length > 0 ? commands.map((cmd: string) => `\`${cmd}\``).join(', ') : 'None';
       return `**${roleName}:** ${commandList}`;
     }).join('\n\n');

    embed.addFields([
      { 
        name: '🎯 Role-Specific Commands', 
        value: roleCommandsText || 'No role-specific commands configured.',
        inline: false 
      }
    ]);
  }

  const components = [
    new ActionRowBuilder<ButtonBuilder>()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('admin_edit_global_commands')
          .setLabel('Edit Global Commands')
          .setStyle(ButtonStyle.Primary)
          .setEmoji('🌐'),
        new ButtonBuilder()
          .setCustomId('admin_edit_role_commands')
          .setLabel('Edit Role Commands')
          .setStyle(ButtonStyle.Secondary)
          .setEmoji('🎯')
      ),
    new ActionRowBuilder<ButtonBuilder>()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('admin_back_to_main')
          .setLabel('Back to Main Panel')
          .setStyle(ButtonStyle.Secondary)
          .setEmoji('⬅️')
      )
  ];

  await interaction.update({ embeds: [embed], components });
}

async function showChannelManagement(interaction: any, adminService: any, guild: any) {
  const settings = adminService.getSettings(guild.id);
  
  const embed = new EmbedBuilder()
    .setTitle('📝 **Channel Management**')
    .setDescription(
      `Configure moderation settings for channels.\n\n` +
      `**Moderation Channels:** Channels where moderation commands can be used.\n` +
      `**Log Channel:** Where moderation actions are logged.`
    )
    .setColor(0xf39c12);

  // Show moderation channels
  let modChannelsText = 'All channels allowed';
     if (settings.moderationChannels.length > 0) {
     modChannelsText = settings.moderationChannels
       .map((channelId: string) => `<#${channelId}>`)
       .join(', ');
   }

  // Show log channel
  const logChannelText = settings.logChannel 
    ? `<#${settings.logChannel}>` 
    : 'Not configured';

  embed.addFields([
    { 
      name: '📝 Moderation Channels', 
      value: modChannelsText,
      inline: false 
    },
    { 
      name: '📋 Log Channel', 
      value: logChannelText,
      inline: false 
    }
  ]);

  const components = [
    new ActionRowBuilder<ButtonBuilder>()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('admin_manage_mod_channels')
          .setLabel('Manage Mod Channels')
          .setStyle(ButtonStyle.Primary)
          .setEmoji('📝'),
        new ButtonBuilder()
          .setCustomId('admin_set_log_channel')
          .setLabel('Set Log Channel')
          .setStyle(ButtonStyle.Secondary)
          .setEmoji('📋')
      ),
    new ActionRowBuilder<ButtonBuilder>()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('admin_back_to_main')
          .setLabel('Back to Main Panel')
          .setStyle(ButtonStyle.Secondary)
          .setEmoji('⬅️')
      )
  ];

  await interaction.update({ embeds: [embed], components });
}

async function showPermissionOverview(interaction: any, adminService: any, guild: any) {
  const settings = adminService.getSettings(guild.id);
  
  const embed = new EmbedBuilder()
    .setTitle('📋 **Permission Overview**')
    .setDescription('Complete overview of all admin permissions and settings.')
    .setColor(0x27ae60);

  // Add detailed fields for each aspect
     const adminRolesText = settings.adminRoles.length > 0 
     ? settings.adminRoles.map((roleId: string) => {
         const role = guild.roles.cache.get(roleId);
         return role ? `• ${role.name}` : `• Unknown Role (${roleId})`;
       }).join('\n')
     : 'None configured';

  embed.addFields([
    { name: '👥 Admin Roles', value: adminRolesText, inline: true },
    { name: '🌐 Global Commands', value: settings.globalAdminCommands.join(', ') || 'None', inline: true },
    { name: '🔒 Owner-Only Commands', value: settings.ownerOnlyCommands.join(', '), inline: true }
  ]);

  const backButton = new ActionRowBuilder<ButtonBuilder>()
    .addComponents(
      new ButtonBuilder()
        .setCustomId('admin_back_to_main')
        .setLabel('Back to Main Panel')
        .setStyle(ButtonStyle.Secondary)
        .setEmoji('⬅️')
    );

  await interaction.update({ embeds: [embed], components: [backButton] });
}

async function showResetConfirmation(interaction: any, adminService: any, guild: any) {
  const embed = new EmbedBuilder()
    .setTitle('🔄 **Reset Configuration**')
    .setDescription(
      `⚠️ **Warning!** This will reset all admin configuration to defaults.\n\n` +
      `This action will:\n` +
      `• Remove all admin roles\n` +
      `• Reset command permissions\n` +
      `• Clear channel restrictions\n` +
      `• Remove log channel settings\n\n` +
      `**This action cannot be undone!**`
    )
    .setColor(0xe74c3c);

  const confirmButtons = new ActionRowBuilder<ButtonBuilder>()
    .addComponents(
      new ButtonBuilder()
        .setCustomId('admin_confirm_reset')
        .setLabel('Yes, Reset Everything')
        .setStyle(ButtonStyle.Danger)
        .setEmoji('✅'),
      new ButtonBuilder()
        .setCustomId('admin_cancel_reset')
        .setLabel('Cancel')
        .setStyle(ButtonStyle.Secondary)
        .setEmoji('❌')
    );

  await interaction.update({ embeds: [embed], components: [confirmButtons] });
} 

