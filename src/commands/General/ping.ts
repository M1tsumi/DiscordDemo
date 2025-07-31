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
  name: 'ping',
  description: 'Check the bot latency.',
  aliases: ['latency'],
  category: CommandCategory.GENERAL,
  usage: '!ping',
  cooldown: 5
};

export const slashData = new SlashCommandBuilder()
  .setName('ping')
  .setDescription('Check the bot latency.');

export async function execute(message: Message) {
  const sent = await message.reply('🏓 Pinging...');
  const latency = sent.createdTimestamp - message.createdTimestamp;
  const apiLatency = Math.round(message.client.ws.ping);
  await sent.edit(`🏓 Pong!\n📡 **Bot Latency:** ${latency}ms\n🌐 **API Latency:** ${apiLatency}ms`);
}

export async function executeSlash(interaction: ChatInputCommandInteraction) {
  await interaction.deferReply();
  const reply = await interaction.fetchReply();
  const latency = reply.createdTimestamp - interaction.createdTimestamp;
  const apiLatency = Math.round(interaction.client.ws.ping);
  await interaction.editReply(`🏓 Pong!\n📡 **Bot Latency:** ${latency}ms\n🌐 **API Latency:** ${apiLatency}ms`);
}

