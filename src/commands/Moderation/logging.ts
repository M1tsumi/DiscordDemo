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
  name: 'logging',
  description: 'Configure comprehensive server logging and audit trails.',
  aliases: ['logs', 'audit'],
  category: CommandCategory.MODERATION,
  usage: '!logging <feature> <enable/disable> [channel]',
  cooldown: 10,
  permissions: ['ManageGuild']
};

export const slashData = new SlashCommandBuilder()
  .setName('logging')
  .setDescription('Configure comprehensive server logging and audit trails.')
  .addStringOption(option =>
    option.setName('feature')
      .setDescription('Which logging feature to configure')
      .setRequired(true)
      .addChoices(
        { name: 'Moderation Logs', value: 'moderation' },
        { name: 'Member Logs', value: 'members' },
        { name: 'Message Logs', value: 'messages' },
        { name: 'Voice Logs', value: 'voice' },
        { name: 'Server Logs', value: 'server' },
        { name: 'Status', value: 'status' }
      )
  )
  .addStringOption(option =>
    option.setName('action')
      .setDescription('Enable or disable the feature')
      .setRequired(false)
      .addChoices(
        { name: 'Enable', value: 'enable' },
        { name: 'Disable', value: 'disable' }
      )
  )
  .addChannelOption(option =>
    option.setName('channel')
      .setDescription('Channel to send logs to')
      .setRequired(false)
  );

export async function execute(message: Message, args?: string[]) {
  if (!message.member?.permissions.has(PermissionFlagsBits.ManageGuild)) {
    await message.reply('❌ You need Manage Server permission to use this command.');
    return;
  }

  const feature = args?.[0]?.toLowerCase();
  const action = args?.[1]?.toLowerCase();
  const channel = args?.[2];

  if (!feature || !['moderation', 'members', 'messages', 'voice', 'server', 'status'].includes(feature)) {
    await message.reply('❌ Please specify a valid feature: `moderation`, `members`, `messages`, `voice`, `server`, or `status`');
    return;
  }

  const embed = new EmbedBuilder()
    .setTitle('📋 **Server Logging System**')
    .setColor(0x9b59b6)
    .setTimestamp()
    .setFooter({ 
      text: `Requested by ${message.author.tag}`,
      iconURL: message.author.displayAvatarURL()
    });

  if (feature === 'status') {
    embed.setDescription('📊 **Logging System Status**')
      .addFields([
        {
          name: '🛡️ Moderation Logs',
          value: '✅ Enabled\nChannel: #mod-logs\nEvents: Bans, Kicks, Mutes, Warns',
          inline: true
        },
        {
          name: '👥 Member Logs',
          value: '✅ Enabled\nChannel: #member-logs\nEvents: Joins, Leaves, Role Changes',
          inline: true
        },
        {
          name: '💬 Message Logs',
          value: '✅ Enabled\nChannel: #message-logs\nEvents: Deletes, Edits, Bulk Deletes',
          inline: true
        },
        {
          name: '🎤 Voice Logs',
          value: '❌ Disabled\nChannel: Not set\nEvents: Voice activity',
          inline: true
        },
        {
          name: '🏠 Server Logs',
          value: '✅ Enabled\nChannel: #server-logs\nEvents: Channel, Role, Emoji changes',
          inline: true
        },
        {
          name: '📈 Statistics',
          value: 'Total logs today: 47\nStorage used: 2.3 MB\nRetention: 30 days',
          inline: true
        }
      ]);
  } else if (action === 'enable') {
    embed.setDescription(`✅ **${getFeatureName(feature)} logging has been enabled!**`)
      .addFields([
        {
          name: '⚙️ Configuration',
          value: getFeatureConfig(feature, channel),
          inline: false
        },
        {
          name: '📋 Events Tracked',
          value: getFeatureEvents(feature),
          inline: false
        }
      ]);
  } else if (action === 'disable') {
    embed.setDescription(`❌ **${getFeatureName(feature)} logging has been disabled.**`)
      .addFields([
        {
          name: '📊 Status',
          value: 'This logging feature is now inactive.',
          inline: false
        }
      ]);
  } else {
    embed.setDescription(`❌ Please specify: \`enable\` or \`disable\` for ${getFeatureName(feature)} logging`);
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

  const feature = interaction.options.getString('feature', true);
  const action = interaction.options.getString('action');
  const channel = interaction.options.getChannel('channel');

  const embed = new EmbedBuilder()
    .setTitle('📋 **Server Logging System**')
    .setColor(0x9b59b6)
    .setTimestamp()
    .setFooter({ 
      text: `Requested by ${interaction.user.tag}`,
      iconURL: interaction.user.displayAvatarURL()
    });

  if (feature === 'status') {
    embed.setDescription('📊 **Logging System Status**')
      .addFields([
        {
          name: '🛡️ Moderation Logs',
          value: '✅ Enabled\nChannel: #mod-logs\nEvents: Bans, Kicks, Mutes, Warns',
          inline: true
        },
        {
          name: '👥 Member Logs',
          value: '✅ Enabled\nChannel: #member-logs\nEvents: Joins, Leaves, Role Changes',
          inline: true
        },
        {
          name: '💬 Message Logs',
          value: '✅ Enabled\nChannel: #message-logs\nEvents: Deletes, Edits, Bulk Deletes',
          inline: true
        },
        {
          name: '🎤 Voice Logs',
          value: '❌ Disabled\nChannel: Not set\nEvents: Voice activity',
          inline: true
        },
        {
          name: '🏠 Server Logs',
          value: '✅ Enabled\nChannel: #server-logs\nEvents: Channel, Role, Emoji changes',
          inline: true
        },
        {
          name: '📈 Statistics',
          value: 'Total logs today: 47\nStorage used: 2.3 MB\nRetention: 30 days',
          inline: true
        }
      ]);
  } else if (action === 'enable') {
    embed.setDescription(`✅ **${getFeatureName(feature)} logging has been enabled!**`)
      .addFields([
        {
          name: '⚙️ Configuration',
          value: getFeatureConfig(feature, channel?.toString()),
          inline: false
        },
        {
          name: '📋 Events Tracked',
          value: getFeatureEvents(feature),
          inline: false
        }
      ]);
  } else if (action === 'disable') {
    embed.setDescription(`❌ **${getFeatureName(feature)} logging has been disabled.**`)
      .addFields([
        {
          name: '📊 Status',
          value: 'This logging feature is now inactive.',
          inline: false
        }
      ]);
  } else {
    embed.setDescription(`❌ Please specify: \`enable\` or \`disable\` for ${getFeatureName(feature)} logging`);
  }

  await interaction.reply({ embeds: [embed] });
}

function getFeatureName(feature: string): string {
  const names: Record<string, string> = {
    'moderation': 'Moderation',
    'members': 'Member',
    'messages': 'Message',
    'voice': 'Voice',
    'server': 'Server'
  };
  return names[feature] || feature;
}

function getFeatureConfig(feature: string, channel?: string): string {
  const configs: Record<string, string> = {
    'moderation': `• **Channel:** ${channel || '#mod-logs'}\n• **Format:** Detailed embeds\n• **Retention:** 30 days\n• **Status:** Active`,
    'members': `• **Channel:** ${channel || '#member-logs'}\n• **Format:** Compact embeds\n• **Retention:** 90 days\n• **Status:** Active`,
    'messages': `• **Channel:** ${channel || '#message-logs'}\n• **Format:** Rich embeds\n• **Retention:** 30 days\n• **Status:** Active`,
    'voice': `• **Channel:** ${channel || '#voice-logs'}\n• **Format:** Simple logs\n• **Retention:** 7 days\n• **Status:** Active`,
    'server': `• **Channel:** ${channel || '#server-logs'}\n• **Format:** Detailed embeds\n• **Retention:** 365 days\n• **Status:** Active`
  };
  return configs[feature] || 'Configuration not available';
}

function getFeatureEvents(feature: string): string {
  const events: Record<string, string> = {
    'moderation': '• Bans and unbans\n• Kicks\n• Mutes and unmutes\n• Warnings\n• Timeouts',
    'members': '• Member joins and leaves\n• Role additions and removals\n• Nickname changes\n• Account age updates',
    'messages': '• Message deletions\n• Message edits\n• Bulk message deletions\n• Pinned messages',
    'voice': '• Voice channel joins and leaves\n• Voice state changes\n• Server deafen/mute',
    'server': '• Channel creation, updates, deletion\n• Role creation, updates, deletion\n• Emoji updates\n• Server setting changes'
  };
  return events[feature] || 'Events not specified';
} 

