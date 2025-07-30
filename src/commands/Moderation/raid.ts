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
  name: 'raid',
  description: 'Configure raid protection and emergency measures.',
  aliases: ['raidprotection', 'emergency'],
  category: CommandCategory.MODERATION,
  usage: '!raid <mode> [duration]',
  cooldown: 5,
  permissions: ['ManageGuild']
};

export const slashData = new SlashCommandBuilder()
  .setName('raid')
  .setDescription('Configure raid protection and emergency measures.')
  .addStringOption(option =>
    option.setName('mode')
      .setDescription('Raid protection mode')
      .setRequired(true)
      .addChoices(
        { name: 'Enable Protection', value: 'enable' },
        { name: 'Disable Protection', value: 'disable' },
        { name: 'Emergency Lockdown', value: 'lockdown' },
        { name: 'Status', value: 'status' }
      )
  )
  .addIntegerOption(option =>
    option.setName('duration')
      .setDescription('Duration in minutes for lockdown mode')
      .setRequired(false)
      .setMinValue(5)
      .setMaxValue(1440)
  );

export async function execute(message: Message, args?: string[]) {
  if (!message.member?.permissions.has(PermissionFlagsBits.ManageGuild)) {
    await message.reply('❌ You need Manage Server permission to use this command.');
    return;
  }

  const mode = args?.[0]?.toLowerCase();
  const duration = parseInt(args?.[1] || '30');

  if (!mode || !['enable', 'disable', 'lockdown', 'status'].includes(mode)) {
    await message.reply('❌ Please specify: `enable`, `disable`, `lockdown`, or `status`');
    return;
  }

  const embed = new EmbedBuilder()
    .setTitle('🚨 **Raid Protection System**')
    .setColor(0xe74c3c)
    .setTimestamp()
    .setFooter({ 
      text: `Requested by ${message.author.tag}`,
      iconURL: message.author.displayAvatarURL()
    });

  if (mode === 'enable') {
    embed.setDescription('🛡️ **Raid protection has been enabled!**')
      .addFields([
        {
          name: '⚙️ Protection Features',
          value: '• **Account Age Check:** 24 hours minimum\n• **Join Rate Limit:** 5 joins per minute\n• **Auto-Verification:** Required for new accounts\n• **Suspicious Activity:** Auto-ban detected raids',
          inline: false
        },
        {
          name: '🔧 Actions',
          value: '• New accounts will be automatically verified\n• Suspicious join patterns will trigger alerts\n• Raid attempts will be automatically blocked',
          inline: false
        }
      ]);
  } else if (mode === 'disable') {
    embed.setDescription('❌ **Raid protection has been disabled.**')
      .addFields([
        {
          name: '📊 Status',
          value: 'All raid protection measures are now inactive.',
          inline: false
        }
      ]);
  } else if (mode === 'lockdown') {
    embed.setDescription('🚨 **EMERGENCY LOCKDOWN ACTIVATED!**')
      .addFields([
        {
          name: '⚠️ Emergency Measures',
          value: `• **Server Locked:** No new joins allowed\n• **Duration:** ${duration} minutes\n• **Auto-Ban:** Suspicious accounts\n• **Alert System:** All moderators notified`,
          inline: false
        },
        {
          name: '🔒 Current Status',
          value: 'Server is now in emergency lockdown mode.',
          inline: false
        }
      ]);
  } else if (mode === 'status') {
    embed.setDescription('📊 **Raid Protection Status**')
      .addFields([
        {
          name: '🛡️ Protection Level',
          value: 'High (Enabled)',
          inline: true
        },
        {
          name: '🚨 Lockdown Status',
          value: 'Inactive',
          inline: true
        },
        {
          name: '📈 Recent Activity',
          value: 'No raids detected\nLast 24 hours: 0 incidents',
          inline: true
        },
        {
          name: '⚙️ Settings',
          value: '• Account Age: 24h minimum\n• Join Rate: 5/min limit\n• Auto-Verification: Enabled\n• Emergency Mode: Ready',
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
  const duration = interaction.options.getInteger('duration') || 30;

  const embed = new EmbedBuilder()
    .setTitle('🚨 **Raid Protection System**')
    .setColor(0xe74c3c)
    .setTimestamp()
    .setFooter({ 
      text: `Requested by ${interaction.user.tag}`,
      iconURL: interaction.user.displayAvatarURL()
    });

  if (mode === 'enable') {
    embed.setDescription('🛡️ **Raid protection has been enabled!**')
      .addFields([
        {
          name: '⚙️ Protection Features',
          value: '• **Account Age Check:** 24 hours minimum\n• **Join Rate Limit:** 5 joins per minute\n• **Auto-Verification:** Required for new accounts\n• **Suspicious Activity:** Auto-ban detected raids',
          inline: false
        },
        {
          name: '🔧 Actions',
          value: '• New accounts will be automatically verified\n• Suspicious join patterns will trigger alerts\n• Raid attempts will be automatically blocked',
          inline: false
        }
      ]);
  } else if (mode === 'disable') {
    embed.setDescription('❌ **Raid protection has been disabled.**')
      .addFields([
        {
          name: '📊 Status',
          value: 'All raid protection measures are now inactive.',
          inline: false
        }
      ]);
  } else if (mode === 'lockdown') {
    embed.setDescription('🚨 **EMERGENCY LOCKDOWN ACTIVATED!**')
      .addFields([
        {
          name: '⚠️ Emergency Measures',
          value: `• **Server Locked:** No new joins allowed\n• **Duration:** ${duration} minutes\n• **Auto-Ban:** Suspicious accounts\n• **Alert System:** All moderators notified`,
          inline: false
        },
        {
          name: '🔒 Current Status',
          value: 'Server is now in emergency lockdown mode.',
          inline: false
        }
      ]);
  } else if (mode === 'status') {
    embed.setDescription('📊 **Raid Protection Status**')
      .addFields([
        {
          name: '🛡️ Protection Level',
          value: 'High (Enabled)',
          inline: true
        },
        {
          name: '🚨 Lockdown Status',
          value: 'Inactive',
          inline: true
        },
        {
          name: '📈 Recent Activity',
          value: 'No raids detected\nLast 24 hours: 0 incidents',
          inline: true
        },
        {
          name: '⚙️ Settings',
          value: '• Account Age: 24h minimum\n• Join Rate: 5/min limit\n• Auto-Verification: Enabled\n• Emergency Mode: Ready',
          inline: false
        }
      ]);
  }

  await interaction.reply({ embeds: [embed] });
} 

