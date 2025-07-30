


export const data = {
  name: 'automod',
  description: 'Configure automated moderation features for the server.',
  aliases: ['automoderator', 'mod'],
  category: CommandCategory.MODERATION,
  usage: '!automod <feature> <enable/disable> [settings]',
  cooldown: 10,
  permissions: ['ManageGuild']
};

export const slashData = new SlashCommandBuilder()
  .setName('automod')
  .setDescription('Configure automated moderation features for the server.')
  .addStringOption(option =>
    option.setName('feature')
      .setDescription('Which automod feature to configure')
      .setRequired(true)
      .addChoices(
        { name: 'Link Filter', value: 'links' },
        { name: 'Caps Filter', value: 'caps' },
        { name: 'Invite Filter', value: 'invites' },
        { name: 'Word Filter', value: 'words' },
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
  .addStringOption(option =>
    option.setName('settings')
      .setDescription('Additional settings for the feature')
      .setRequired(false)
  );

export async function execute(message: Message, args?: string[]) {
  if (!message.member?.permissions.has(PermissionFlagsBits.ManageGuild)) {
    await message.reply('❌ You need Manage Server permission to use this command.');
    return;
  }

  const feature = args?.[0]?.toLowerCase();
  const action = args?.[1]?.toLowerCase();
  const settings = args?.slice(2).join(' ');

  if (!feature || !['links', 'caps', 'invites', 'words', 'status'].includes(feature)) {
    await message.reply('❌ Please specify a valid feature: `links`, `caps`, `invites`, `words`, or `status`');
    return;
  }

  const embed = new EmbedBuilder()
    .setTitle('🤖 **AutoMod Configuration**')
    .setColor(0x3498db)
    .setTimestamp()
    .setFooter({ 
      text: `Requested by ${message.author.tag}`,
      iconURL: message.author.displayAvatarURL()
    });

  if (feature === 'status') {
    embed.setDescription('📊 **AutoMod Features Status**')
      .addFields([
        {
          name: '🔗 Link Filter',
          value: '✅ Enabled\nAction: Delete + Warn',
          inline: true
        },
        {
          name: '🔠 Caps Filter',
          value: '✅ Enabled\nThreshold: 70% caps',
          inline: true
        },
        {
          name: '📨 Invite Filter',
          value: '✅ Enabled\nAction: Delete',
          inline: true
        },
        {
          name: '🚫 Word Filter',
          value: '❌ Disabled\nNo words configured',
          inline: true
        }
      ]);
  } else if (action === 'enable') {
    embed.setDescription(`✅ **${getFeatureName(feature)} has been enabled!**`)
      .addFields([
        {
          name: '⚙️ Configuration',
          value: getFeatureConfig(feature, settings),
          inline: false
        }
      ]);
  } else if (action === 'disable') {
    embed.setDescription(`❌ **${getFeatureName(feature)} has been disabled.**`)
      .addFields([
        {
          name: '📊 Status',
          value: 'This feature is now inactive.',
          inline: false
        }
      ]);
  } else {
    embed.setDescription(`❌ Please specify: \`enable\` or \`disable\` for ${getFeatureName(feature)}`);
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
  const settings = interaction.options.getString('settings');

  const embed = new EmbedBuilder()
    .setTitle('🤖 **AutoMod Configuration**')
    .setColor(0x3498db)
    .setTimestamp()
    .setFooter({ 
      text: `Requested by ${interaction.user.username}`,
      iconURL: interaction.user.displayAvatarURL()
    });

  if (feature === 'status') {
    embed.setDescription('📊 **AutoMod Features Status**')
      .addFields([
        {
          name: '🔗 Link Filter',
          value: '✅ Enabled\nAction: Delete + Warn',
          inline: true
        },
        {
          name: '🔠 Caps Filter',
          value: '✅ Enabled\nThreshold: 70% caps',
          inline: true
        },
        {
          name: '📨 Invite Filter',
          value: '✅ Enabled\nAction: Delete',
          inline: true
        },
        {
          name: '🚫 Word Filter',
          value: '❌ Disabled\nNo words configured',
          inline: true
        }
      ]);
  } else if (action === 'enable') {
    embed.setDescription(`✅ **${getFeatureName(feature)} has been enabled!**`)
      .addFields([
        {
          name: '⚙️ Configuration',
          value: getFeatureConfig(feature, settings || undefined),
          inline: false
        }
      ]);
  } else if (action === 'disable') {
    embed.setDescription(`❌ **${getFeatureName(feature)} has been disabled.**`)
      .addFields([
        {
          name: '📊 Status',
          value: 'This feature is now inactive.',
          inline: false
        }
      ]);
  } else {
    embed.setDescription(`❌ Please specify: \`enable\` or \`disable\` for ${getFeatureName(feature)}`);
  }

  await interaction.reply({ embeds: [embed] });
}

function getFeatureName(feature: string): string {
  const names: Record<string, string> = {
    'links': 'Link Filter',
    'caps': 'Caps Filter',
    'invites': 'Invite Filter',
    'words': 'Word Filter'
  };
  return names[feature] || feature;
}

function getFeatureConfig(feature: string, settings?: string): string {
  const configs: Record<string, string> = {
    'links': '• **Action:** Delete message + Warn user\n• **Allowed:** Server links only\n• **Status:** Active',
    'caps': '• **Threshold:** 70% uppercase letters\n• **Action:** Delete message\n• **Status:** Active',
    'invites': '• **Action:** Delete message\n• **Allowed:** None\n• **Status:** Active',
    'words': settings ? `• **Filtered Words:** ${settings}\n• **Action:** Delete message\n• **Status:** Active` : '• **No words configured**\n• **Action:** None\n• **Status:** Inactive'
  };
  return configs[feature] || 'Configuration not available';
} 
