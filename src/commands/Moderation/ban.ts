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
  name: 'ban',
  description: 'Ban a user from the server.',
  aliases: [],
  category: CommandCategory.MODERATION,
  usage: '!ban <user> [reason]',
  cooldown: 5,
  permissions: ['BanMembers']
};

export async function execute(message: Message, args: string[]) {
  if (!message.member?.permissions.has('BanMembers')) return message.reply('You do not have permission to use this command.');
  const user = message.mentions.members?.first();
  if (!user) return message.reply('Please mention a user to ban.');
  if (!user.bannable) return message.reply('I cannot ban this user.');
  await user.ban();
  await message.reply(`Banned ${user.user.tag}`);
}
