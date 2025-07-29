import { Message, EmbedBuilder, SlashCommandBuilder, ChatInputCommandInteraction, PermissionFlagsBits } from 'discord.js';
import { CommandCategory } from '../../types/Command';

export const data = {
  name: 'setprefix',
  description: 'Change the command prefix for this server.',
  aliases: ['prefix'],
  category: CommandCategory.GENERAL,
  usage: '!setprefix <new_prefix>',
  cooldown: 5,
  permissions: ['ManageGuild']
};

export const slashData = new SlashCommandBuilder()
  .setName('setprefix')
  .setDescription('Change the command prefix for this server.')
  .addStringOption(option =>
    option.setName('prefix')
      .setDescription('The new prefix to use (1-5 characters, no spaces)')
      .setRequired(true)
      .setMaxLength(5)
  )
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild);

export async function execute(message: Message, args?: string[]) {
  // Check if user has permission
  if (!message.member?.permissions.has('ManageGuild')) {
    return message.reply('❌ You need the **Manage Server** permission to use this command.');
  }

  // Check if this is a guild
  if (!message.guild) {
    return message.reply('❌ This command can only be used in a server.');
  }

  // Get the new prefix
  const newPrefix = args?.[0];
  if (!newPrefix) {
    const { settingsService } = await import('../../index');
    const currentPrefix = settingsService.getPrefix(message.guild.id);
    return message.reply(`❓ Please provide a new prefix! Current prefix: \`${currentPrefix}\`\nUsage: \`${currentPrefix}setprefix <new_prefix>\``);
  }

  // Validate prefix
  if (newPrefix.length > 5) {
    return message.reply('❌ Prefix must be 5 characters or less!');
  }

  if (newPrefix.includes(' ')) {
    return message.reply('❌ Prefix cannot contain spaces!');
  }

  // Common invalid prefixes
  const invalidPrefixes = ['@', '#', ':', '```', '`'];
  if (invalidPrefixes.some(invalid => newPrefix.includes(invalid))) {
    return message.reply('❌ Prefix cannot contain special Discord markdown characters!');
  }

  try {
    const { settingsService } = await import('../../index');
    const success = settingsService.setPrefix(message.guild.id, newPrefix);

    if (!success) {
      return message.reply('❌ Invalid prefix! Prefix must be 1-5 characters and cannot contain spaces.');
    }

    const embed = new EmbedBuilder()
      .setTitle('✅ Prefix Updated!')
      .setDescription(`Server prefix has been changed to: \`${newPrefix}\``)
      .addFields([
        { name: 'Example Usage', value: `\`${newPrefix}help\`, \`${newPrefix}ping\`, \`${newPrefix}userinfo\``, inline: false },
        { name: 'Note', value: 'Slash commands (/) will still work regardless of prefix changes.', inline: false }
      ])
      .setColor(0x00ff00)
      .setFooter({ text: `Changed by ${message.author.tag}`, iconURL: message.author.displayAvatarURL() });

    await message.reply({ embeds: [embed] });

  } catch (error) {
    console.error('Error in setprefix command:', error);
    await message.reply('❌ An error occurred while updating the prefix. Please try again.');
  }
}

export async function executeSlash(interaction: ChatInputCommandInteraction) {
  // Check if user has permission
  if (!interaction.memberPermissions?.has('ManageGuild')) {
    return interaction.reply({ 
      content: '❌ You need the **Manage Server** permission to use this command.',
      ephemeral: true 
    });
  }

  // Check if this is a guild
  if (!interaction.guild) {
    return interaction.reply({ 
      content: '❌ This command can only be used in a server.',
      ephemeral: true 
    });
  }

  const newPrefix = interaction.options.getString('prefix', true);

  // Validate prefix
  if (newPrefix.includes(' ')) {
    return interaction.reply({ 
      content: '❌ Prefix cannot contain spaces!',
      ephemeral: true 
    });
  }

  // Common invalid prefixes
  const invalidPrefixes = ['@', '#', ':', '```', '`'];
  if (invalidPrefixes.some(invalid => newPrefix.includes(invalid))) {
    return interaction.reply({ 
      content: '❌ Prefix cannot contain special Discord markdown characters!',
      ephemeral: true 
    });
  }

  try {
    const { settingsService } = await import('../../index');
    const success = settingsService.setPrefix(interaction.guild.id, newPrefix);

    if (!success) {
      return interaction.reply({
        content: '❌ Invalid prefix! Prefix must be 1-5 characters and cannot contain spaces.',
        ephemeral: true
      });
    }

    const embed = new EmbedBuilder()
      .setTitle('✅ Prefix Updated!')
      .setDescription(`Server prefix has been changed to: \`${newPrefix}\``)
      .addFields([
        { name: 'Example Usage', value: `\`${newPrefix}help\`, \`${newPrefix}ping\`, \`${newPrefix}userinfo\``, inline: false },
        { name: 'Note', value: 'Slash commands (/) will still work regardless of prefix changes.', inline: false }
      ])
      .setColor(0x00ff00)
      .setFooter({ text: `Changed by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() });

    await interaction.reply({ embeds: [embed] });

  } catch (error) {
    console.error('Error in setprefix slash command:', error);
    await interaction.reply({
      content: '❌ An error occurred while updating the prefix. Please try again.',
      ephemeral: true
    });
  }
} 