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
  name: 'kick',
  description: 'Kick a user from the server.',
  aliases: [],
  category: CommandCategory.MODERATION,
  usage: '!kick <user> [reason]',
  cooldown: 5,
  permissions: ['KickMembers']
};

export async function execute(message: Message, args: string[]) {
  if (!message.member?.permissions.has('KickMembers')) return message.reply('You do not have permission to use this command.');
  const user = message.mentions.members?.first();
  if (!user) return message.reply('Please mention a user to kick.');
  if (!user.kickable) return message.reply('I cannot kick this user.');
  await user.kick();
  await message.reply(`Kicked ${user.user.tag}`);
}

