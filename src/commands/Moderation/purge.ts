import { Message, SlashCommandBuilder, ChatInputCommandInteraction, TextChannel, PermissionFlagsBits } from 'discord.js';
import { CommandCategory } from '../../types/Command';

export const data = {
  name: 'purge',
  description: 'Delete a number of messages from a channel.',
  aliases: ['clear', 'delete'],
  category: CommandCategory.MODERATION,
  usage: '!purge <amount>',
  cooldown: 5,
  permissions: ['ManageMessages']
};

export const slashData = new SlashCommandBuilder()
  .setName('purge')
  .setDescription('Delete a number of messages from a channel.')
  .addIntegerOption(option =>
    option.setName('amount')
      .setDescription('Number of messages to delete (1-100)')
      .setRequired(true)
      .setMinValue(1)
      .setMaxValue(100)
  )
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages);

export async function execute(message: Message, args?: string[]) {
  // Check if user has permission
  if (!message.member?.permissions.has('ManageMessages')) {
    return message.reply('❌ You do not have permission to use this command.');
  }

  // Check if this is a guild channel
  if (!message.guild) {
    return message.reply('❌ This command can only be used in a server.');
  }

  // Check if channel supports bulk delete
  if (!message.channel.isTextBased() || message.channel.isDMBased()) {
    return message.reply('❌ This command can only be used in text channels.');
  }

  // Parse amount
  const amount = parseInt(args?.[0] || '0');
  if (isNaN(amount) || amount < 1 || amount > 100) {
    return message.reply('❌ Please provide a number between 1 and 100.');
  }

  try {
    // Delete the command message first
    await message.delete();

    // Bulk delete messages (Discord API limitation: messages older than 14 days can't be bulk deleted)
    const deleted = await (message.channel as TextChannel).bulkDelete(amount, true);
    
    // Send confirmation (and auto-delete after 5 seconds)
    const confirmMessage = await (message.channel as TextChannel).send(
      `🗑️ Successfully deleted ${deleted.size} message(s).`
    );
    
    setTimeout(() => {
      confirmMessage.delete().catch(() => {});
    }, 5000);

  } catch (error) {
    console.error('Error in purge command:', error);
    await message.reply('❌ Failed to delete messages. They might be older than 14 days or I lack permissions.');
  }
}

export async function executeSlash(interaction: ChatInputCommandInteraction) {
  // Check if user has permission
  if (!interaction.memberPermissions?.has('ManageMessages')) {
    return interaction.reply({ content: '❌ You do not have permission to use this command.', ephemeral: true });
  }

  // Check if this is a guild channel
  if (!interaction.guild) {
    return interaction.reply({ content: '❌ This command can only be used in a server.', ephemeral: true });
  }

  // Check if channel supports bulk delete
  if (!interaction.channel?.isTextBased() || interaction.channel.isDMBased()) {
    return interaction.reply({ content: '❌ This command can only be used in text channels.', ephemeral: true });
  }

  const amount = interaction.options.getInteger('amount', true);

  try {
    // Bulk delete messages
    const deleted = await (interaction.channel as TextChannel).bulkDelete(amount, true);
    
    // Reply with confirmation
    await interaction.reply({
      content: `🗑️ Successfully deleted ${deleted.size} message(s).`,
      ephemeral: true
    });

  } catch (error) {
    console.error('Error in purge slash command:', error);
    await interaction.reply({
      content: '❌ Failed to delete messages. They might be older than 14 days or I lack permissions.',
      ephemeral: true
    });
  }
}
