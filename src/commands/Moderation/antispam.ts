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
  name: 'antispam',
  description: 'Configure anti-spam protection for the server.',
  aliases: ['spam', 'spamprotection'],
  category: CommandCategory.MODERATION,
  usage: '!antispam <enable/disable> [threshold] [action]',
  cooldown: 10,
  permissions: ['ManageGuild']
};

export const slashData = new SlashCommandBuilder()
  .setName('antispam')
  .setDescription('Configure anti-spam protection for the server.')
  .addStringOption(option =>
    option.setName('action')
      .setDescription('Enable or disable anti-spam protection')
      .setRequired(true)
      .addChoices(
        { name: 'Enable', value: 'enable' },
        { name: 'Disable', value: 'disable' },
        { name: 'Status', value: 'status' }
      )
  )
  .addIntegerOption(option =>
    option.setName('threshold')
      .setDescription('Number of messages in 10 seconds to trigger spam detection')
      .setRequired(false)
      .setMinValue(3)
      .setMaxValue(20)
  )
  .addStringOption(option =>
    option.setName('punishment')
      .setDescription('What action to take against spammers')
      .setRequired(false)
      .addChoices(
        { name: 'Warn', value: 'warn' },
        { name: 'Mute (5 minutes)', value: 'mute' },
        { name: 'Kick', value: 'kick' }
      )
  );

export async function execute(message: Message, args?: string[]) {
  if (!message.member?.permissions.has(PermissionFlagsBits.ManageGuild)) {
    await message.reply('❌ You need Manage Server permission to use this command.');
    return;
  }

  const action = args?.[0]?.toLowerCase();
  const threshold = parseInt(args?.[1] || '5');
  const punishment = args?.[2]?.toLowerCase() || 'warn';

  if (!action || !['enable', 'disable', 'status'].includes(action)) {
    await message.reply('❌ Please specify: `enable`, `disable`, or `status`');
    return;
  }

  const embed = new EmbedBuilder()
    .setTitle('🛡️ **Anti-Spam Protection**')
    .setColor(0xe74c3c)
    .setTimestamp()
    .setFooter({ 
      text: `Requested by ${message.author.tag}`,
      iconURL: message.author.displayAvatarURL()
    });

  if (action === 'enable') {
    embed.setDescription('✅ **Anti-spam protection has been enabled!**')
      .addFields([
        {
          name: '⚙️ Configuration',
          value: `• **Threshold:** ${threshold} messages in 10 seconds\n• **Punishment:** ${punishment}\n• **Status:** Active`,
          inline: false
        },
        {
          name: '🔧 How it works',
          value: 'The bot will monitor message frequency and automatically take action against users who exceed the threshold.',
          inline: false
        }
      ]);
  } else if (action === 'disable') {
    embed.setDescription('❌ **Anti-spam protection has been disabled.**')
      .addFields([
        {
          name: '📊 Status',
          value: 'Spam protection is now inactive. Users can message freely.',
          inline: false
        }
      ]);
  } else if (action === 'status') {
    embed.setDescription('📊 **Anti-spam protection status**')
      .addFields([
        {
          name: '🔄 Current Status',
          value: 'Active (Simulated)',
          inline: true
        },
        {
          name: '⚙️ Settings',
          value: `Threshold: 5 messages\nPunishment: Warn`,
          inline: true
        },
        {
          name: '📈 Statistics',
          value: 'Spam detections: 0\nActions taken: 0',
          inline: true
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

  const action = interaction.options.getString('action', true);
  const threshold = interaction.options.getInteger('threshold') || 5;
  const punishment = interaction.options.getString('punishment') || 'warn';

  const embed = new EmbedBuilder()
    .setTitle('🛡️ **Anti-Spam Protection**')
    .setColor(0xe74c3c)
    .setTimestamp()
    .setFooter({ 
      text: `Requested by ${interaction.user.tag}`,
      iconURL: interaction.user.displayAvatarURL()
    });

  if (action === 'enable') {
    embed.setDescription('✅ **Anti-spam protection has been enabled!**')
      .addFields([
        {
          name: '⚙️ Configuration',
          value: `• **Threshold:** ${threshold} messages in 10 seconds\n• **Punishment:** ${punishment}\n• **Status:** Active`,
          inline: false
        },
        {
          name: '🔧 How it works',
          value: 'The bot will monitor message frequency and automatically take action against users who exceed the threshold.',
          inline: false
        }
      ]);
  } else if (action === 'disable') {
    embed.setDescription('❌ **Anti-spam protection has been disabled.**')
      .addFields([
        {
          name: '📊 Status',
          value: 'Spam protection is now inactive. Users can message freely.',
          inline: false
        }
      ]);
  } else if (action === 'status') {
    embed.setDescription('📊 **Anti-spam protection status**')
      .addFields([
        {
          name: '🔄 Current Status',
          value: 'Active (Simulated)',
          inline: true
        },
        {
          name: '⚙️ Settings',
          value: `Threshold: ${threshold} messages\nPunishment: ${punishment}`,
          inline: true
        },
        {
          name: '📈 Statistics',
          value: 'Spam detections: 0\nActions taken: 0',
          inline: true
        }
      ]);
  }

  await interaction.reply({ embeds: [embed] });
} 

