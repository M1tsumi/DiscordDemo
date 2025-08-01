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
  name: 'warn',
  description: 'Warn a user.',
  aliases: [],
  category: CommandCategory.MODERATION,
  usage: '!warn <user> [reason]',
  cooldown: 5,
  permissions: ['KickMembers']
};

export async function execute(message: Message, args: string[]) {
  if (!message.member?.permissions.has('KickMembers')) return message.reply('You do not have permission to use this command.');
  const user = message.mentions.users.first();
  if (!user) return message.reply('Please mention a user to warn.');
  const reason = args.slice(1).join(' ') || 'No reason provided.';
  await message.reply(`${user.tag} has been warned. Reason: ${reason}`);
}

