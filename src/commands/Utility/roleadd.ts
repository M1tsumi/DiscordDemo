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
  name: 'roleadd',
  description: 'Add a role to the admin role list (Server Owner Only).',
  aliases: ['addrole', 'adminroleadd'],
  category: CommandCategory.UTILITY,
  usage: '!roleadd @role',
  cooldown: 3,
  permissions: ['Server Owner Only']
};

export const slashData = new SlashCommandBuilder()
  .setName('roleadd')
  .setDescription('Add a role to the admin role list (Server Owner Only).')
  .addRoleOption(option =>
    option.setName('role')
      .setDescription('The role to add as an admin role')
      .setRequired(true)
  );

export async function execute(message: Message, args?: string[]) {
  if (!message.guild) {
    return message.reply('❌ This command can only be used in a server.');
  }

  // Check if user is server owner
  if (message.author.id !== message.guild.ownerId) {
    return message.reply('❌ Only the server owner can use this command.');
  }

  // Get role from mention or argument
  const roleMatch = args?.[0]?.match(/^<@&(\d+)>$|^(\d+)$/);
  const roleId = roleMatch ? (roleMatch[1] || roleMatch[2]) : null;

  if (!roleId) {
    return message.reply('❌ Please mention a valid role or provide a role ID.\nUsage: `!roleadd @role`');
  }

  const role = message.guild.roles.cache.get(roleId);
  if (!role) {
    return message.reply('❌ Role not found! Please make sure the role exists in this server.');
  }

  // Check if role is manageable
  if (role.name === '@everyone') {
    return message.reply('❌ You cannot add the @everyone role as an admin role.');
  }

  if (role.managed) {
    return message.reply('❌ You cannot add bot-managed roles as admin roles.');
  }

  try {
    const { adminService } = await import('../../index');
    const success = adminService.addAdminRole(message.guild.id, roleId);

    if (!success) {
      return message.reply(`❌ The role **${role.name}** is already an admin role!`);
    }

    const settings = adminService.getSettings(message.guild.id);
    const commandCount = settings.allowedCommands[roleId]?.length || 0;

    const embed = new EmbedBuilder()
      .setTitle('✅ **Admin Role Added Successfully!**')
      .setDescription(`The role **${role.name}** has been added to the admin role list.`)
      .addFields([
        { 
          name: '👥 Role Details', 
          value: `**Name:** ${role.name}\n**ID:** ${role.id}\n**Members:** ${role.members.size}`,
          inline: true 
        },
        { 
          name: '⚙️ Permissions Granted', 
          value: `**Default Commands:** ${commandCount}\n**Can use:** All moderation commands\n**Access Level:** Admin`,
          inline: true 
        },
        { 
          name: '🔧 Next Steps', 
          value: `• Use \`!adminset\` to customize permissions\n• Configure command restrictions\n• Set up moderation channels`,
          inline: false 
        }
      ])
      .setColor(0x27ae60)
      .setThumbnail(message.guild.iconURL() || '')
      .setTimestamp()
      .setFooter({ 
        text: `Added by ${message.author.tag}`,
        iconURL: message.author.displayAvatarURL()
      });

    await message.reply({ embeds: [embed] });

  } catch (error) {
    console.error('Error in roleadd command:', error);
    await message.reply('❌ An error occurred while adding the admin role. Please try again.');
  }
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

  const role = interaction.options.getRole('role', true);

  // Check if role is manageable
  if (role.name === '@everyone') {
    return interaction.reply({ 
      content: '❌ You cannot add the @everyone role as an admin role.',
      ephemeral: true 
    });
  }

  if ('managed' in role && role.managed) {
    return interaction.reply({ 
      content: '❌ You cannot add bot-managed roles as admin roles.',
      ephemeral: true 
    });
  }

  try {
    const { adminService } = await import('../../index');
    const success = adminService.addAdminRole(interaction.guild.id, role.id);

    if (!success) {
      return interaction.reply({ 
        content: `❌ The role **${role.name}** is already an admin role!`,
        ephemeral: true 
      });
    }

    const settings = adminService.getSettings(interaction.guild.id);
    const commandCount = settings.allowedCommands[role.id]?.length || 0;
    
    // Get actual role from guild to access members
    const guildRole = interaction.guild.roles.cache.get(role.id);
    const memberCount = guildRole ? guildRole.members.size : 'Unknown';

    const embed = new EmbedBuilder()
      .setTitle('✅ **Admin Role Added Successfully!**')
      .setDescription(`The role **${role.name}** has been added to the admin role list.`)
      .addFields([
        { 
          name: '👥 Role Details', 
          value: `**Name:** ${role.name}\n**ID:** ${role.id}\n**Members:** ${memberCount}`,
          inline: true 
        },
        { 
          name: '⚙️ Permissions Granted', 
          value: `**Default Commands:** ${commandCount}\n**Can use:** All moderation commands\n**Access Level:** Admin`,
          inline: true 
        },
        { 
          name: '🔧 Next Steps', 
          value: `• Use \`/adminset\` to customize permissions\n• Configure command restrictions\n• Set up moderation channels`,
          inline: false 
        }
      ])
      .setColor(0x27ae60)
      .setThumbnail(interaction.guild.iconURL() || '')
      .setTimestamp()
      .setFooter({ 
        text: `Added by ${interaction.user.tag}`,
        iconURL: interaction.user.displayAvatarURL()
      });

    await interaction.reply({ embeds: [embed] });

  } catch (error) {
    console.error('Error in roleadd slash command:', error);
    await interaction.reply({ 
      content: '❌ An error occurred while adding the admin role. Please try again.',
      ephemeral: true 
    });
  }
} 
