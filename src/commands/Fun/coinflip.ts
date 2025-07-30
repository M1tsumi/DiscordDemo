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
  name: 'coinflip',
  description: 'Flip a coin and get heads or tails.',
  aliases: ['flip', 'coin'],
  category: CommandCategory.FUN,
  usage: '!coinflip',
  cooldown: 2
};

export const slashData = new SlashCommandBuilder()
  .setName('coinflip')
  .setDescription('Flip a coin and get heads or tails.');

const outcomes = [
  { result: 'Heads', emoji: '🪙', color: 0xFFD700 },
  { result: 'Tails', emoji: '🥈', color: 0xC0C0C0 }
];

export async function execute(message: Message) {
  // Send initial "flipping" message
  const flipMessage = await message.reply('🪙 Flipping coin...');
  
  // Wait a moment for suspense
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  const outcome = outcomes[Math.floor(Math.random() * outcomes.length)];
  
  const embed = new EmbedBuilder()
    .setTitle('🪙 Coin Flip')
    .setDescription(`The coin landed on **${outcome.result}**! ${outcome.emoji}`)
    .setColor(outcome.color)
    .setFooter({ text: 'Better luck next time!' });

  await flipMessage.edit({ content: '', embeds: [embed] });
}

export async function executeSlash(interaction: ChatInputCommandInteraction) {
  await interaction.deferReply();
  
  // Wait a moment for suspense
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  const outcome = outcomes[Math.floor(Math.random() * outcomes.length)];
  
  const embed = new EmbedBuilder()
    .setTitle('🪙 Coin Flip')
    .setDescription(`The coin landed on **${outcome.result}**! ${outcome.emoji}`)
    .setColor(outcome.color)
    .setFooter({ text: 'Better luck next time!' });

  await interaction.editReply({ embeds: [embed] });
} 
