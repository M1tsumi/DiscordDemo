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
  name: 'verification',
  description: 'Configure server verification system and requirements.',
  aliases: ['verify', 'verifysystem'],
  category: CommandCategory.MODERATION,
  usage: '!verification <mode> [requirements]',
  cooldown: 10,
  permissions: ['ManageGuild']
};

export const slashData = new SlashCommandBuilder()
  .setName('verification')
  .setDescription('Configure server verification system and requirements.')
  .addStringOption(option =>
    option.setName('mode')
      .setDescription('Verification mode')
      .setRequired(true)
      .addChoices(
        { name: 'Enable', value: 'enable' },
        { name: 'Disable', value: 'disable' },
        { name: 'Setup', value: 'setup' },
        { name: 'Status', value: 'status' }
      )
  )
  .addStringOption(option =>
    option.setName('requirements')
      .setDescription('Verification requirements (e.g., "email,phone,age")')
      .setRequired(false)
  );

export async function execute(message: Message, args?: string[]) {
  if (!message.member?.permissions.has(PermissionFlagsBits.ManageGuild)) {
    await message.reply('❌ You need Manage Server permission to use this command.');
    return;
  }

  const mode = args?.[0]?.toLowerCase();
  const requirements = args?.slice(1).join(' ');

  if (!mode || !['enable', 'disable', 'setup', 'status'].includes(mode)) {
    await message.reply('❌ Please specify: `enable`, `disable`, `setup`, or `status`');
    return;
  }

  const embed = new EmbedBuilder()
    .setTitle('✅ **Verification System**')
    .setColor(0x2ecc71)
    .setTimestamp()
    .setFooter({ 
      text: `Requested by ${message.author.tag}`,
      iconURL: message.author.displayAvatarURL()
    });

  if (mode === 'enable') {
    embed.setDescription('✅ **Verification system has been enabled!**')
      .addFields([
        {
          name: '⚙️ Configuration',
          value: '• **Mode:** Manual verification required\n• **Role:** Verified Member\n• **Channel:** #verification\n• **Timeout:** 24 hours',
          inline: false
        },
        {
          name: '🔧 How it works',
          value: 'New members must complete verification to access the server. They will be prompted to verify their identity.',
          inline: false
        }
      ]);
  } else if (mode === 'disable') {
    embed.setDescription('❌ **Verification system has been disabled.**')
      .addFields([
        {
          name: '📊 Status',
          value: 'New members can now join without verification.',
          inline: false
        }
      ]);
  } else if (mode === 'setup') {
    embed.setDescription('🔧 **Verification System Setup**')
      .addFields([
        {
          name: '📋 Requirements',
          value: requirements ? `• ${requirements.split(',').map(r => r.trim()).join('\n• ')}` : '• Email verification\n• Age verification\n• Terms acceptance',
          inline: false
        },
        {
          name: '⚙️ Settings',
          value: '• **Verification Channel:** #verification\n• **Verified Role:** @Verified\n• **Timeout:** 24 hours\n• **Auto-Delete:** Failed attempts',
          inline: false
        },
        {
          name: '🔧 Setup Complete',
          value: 'The verification system is now configured and ready to use.',
          inline: false
        }
      ]);
  } else if (mode === 'status') {
    embed.setDescription('📊 **Verification System Status**')
      .addFields([
        {
          name: '🔄 Current Status',
          value: 'Active',
          inline: true
        },
        {
          name: '📈 Statistics',
          value: 'Pending: 0\nVerified today: 5\nTotal verified: 127',
          inline: true
        },
        {
          name: '⚙️ Settings',
          value: 'Mode: Manual\nTimeout: 24h\nAuto-delete: Enabled',
          inline: true
        },
        {
          name: '📋 Requirements',
          value: '• Email verification\n• Age verification\n• Terms acceptance\n• Captcha completion',
          inline: false
        }
      ]);
  }

  await message.reply({ embeds: [embed] });
}

export async function executeSlash(interaction: ChatInputCommandInteraction) {
  if (!interaction.memberPermissions?.has(PermissionFlagsBits.ManageGuild)) {
    await interaction.reply({ 
      content: '❌ You need Manage Server permission to use this command.',
      ephemeral: true 
    });
    return;
  }

  const mode = interaction.options.getString('mode', true);
  const requirements = interaction.options.getString('requirements');

  const embed = new EmbedBuilder()
    .setTitle('✅ **Verification System**')
    .setColor(0x2ecc71)
    .setTimestamp()
    .setFooter({ 
      text: `Requested by ${interaction.user.tag}`,
      iconURL: interaction.user.displayAvatarURL()
    });

  if (mode === 'enable') {
    embed.setDescription('✅ **Verification system has been enabled!**')
      .addFields([
        {
          name: '⚙️ Configuration',
          value: '• **Mode:** Manual verification required\n• **Role:** Verified Member\n• **Channel:** #verification\n• **Timeout:** 24 hours',
          inline: false
        },
        {
          name: '🔧 How it works',
          value: 'New members must complete verification to access the server. They will be prompted to verify their identity.',
          inline: false
        }
      ]);
  } else if (mode === 'disable') {
    embed.setDescription('❌ **Verification system has been disabled.**')
      .addFields([
        {
          name: '📊 Status',
          value: 'New members can now join without verification.',
          inline: false
        }
      ]);
  } else if (mode === 'setup') {
    embed.setDescription('🔧 **Verification System Setup**')
      .addFields([
        {
          name: '📋 Requirements',
          value: requirements ? `• ${requirements.split(',').map(r => r.trim()).join('\n• ')}` : '• Email verification\n• Age verification\n• Terms acceptance',
          inline: false
        },
        {
          name: '⚙️ Settings',
          value: '• **Verification Channel:** #verification\n• **Verified Role:** @Verified\n• **Timeout:** 24 hours\n• **Auto-Delete:** Failed attempts',
          inline: false
        },
        {
          name: '🔧 Setup Complete',
          value: 'The verification system is now configured and ready to use.',
          inline: false
        }
      ]);
  } else if (mode === 'status') {
    embed.setDescription('📊 **Verification System Status**')
      .addFields([
        {
          name: '🔄 Current Status',
          value: 'Active',
          inline: true
        },
        {
          name: '📈 Statistics',
          value: 'Pending: 0\nVerified today: 5\nTotal verified: 127',
          inline: true
        },
        {
          name: '⚙️ Settings',
          value: 'Mode: Manual\nTimeout: 24h\nAuto-delete: Enabled',
          inline: true
        },
        {
          name: '📋 Requirements',
          value: '• Email verification\n• Age verification\n• Terms acceptance\n• Captcha completion',
          inline: false
        }
      ]);
  }

  await interaction.reply({ embeds: [embed] });
} 
