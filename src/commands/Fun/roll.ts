import { Message, EmbedBuilder, SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { CommandCategory } from '../../types/Command';

export const data = {
  name: 'roll',
  description: 'Roll dice with various configurations.',
  aliases: ['dice', 'r'],
  category: CommandCategory.FUN,
  usage: '!roll [NdS] (e.g., !roll 2d6, !roll d20)',
  cooldown: 2
};

export const slashData = new SlashCommandBuilder()
  .setName('roll')
  .setDescription('Roll dice with various configurations.')
  .addStringOption(option =>
    option.setName('dice')
      .setDescription('Dice configuration (e.g., 2d6, d20, 3d8+5)')
      .setRequired(false)
  );

function parseDiceNotation(notation: string): { count: number; sides: number; modifier: number } | null {
  // Match patterns like: d6, 2d6, 1d20+5, 3d8-2
  const match = notation.match(/^(\d+)?d(\d+)([+\-]\d+)?$/i);
  if (!match) return null;

  const count = parseInt(match[1] || '1', 10);
  const sides = parseInt(match[2], 10);
  const modifier = match[3] ? parseInt(match[3], 10) : 0;

  // Validate reasonable ranges
  if (count < 1 || count > 20 || sides < 2 || sides > 1000) {
    return null;
  }

  return { count, sides, modifier };
}

function rollDice(count: number, sides: number): number[] {
  const rolls = [];
  for (let i = 0; i < count; i++) {
    rolls.push(Math.floor(Math.random() * sides) + 1);
  }
  return rolls;
}

export async function execute(message: Message, args?: string[]) {
  let diceNotation = args?.join(' ') || 'd6';
  
  // Default to d6 if no arguments
  if (!diceNotation) {
    diceNotation = 'd6';
  }

  const parsed = parseDiceNotation(diceNotation);
  if (!parsed) {
    return message.reply('🎲 Invalid dice notation! Use formats like: `d6`, `2d20`, `3d6+5`, `1d100-10`');
  }

  const { count, sides, modifier } = parsed;
  const rolls = rollDice(count, sides);
  const sum = rolls.reduce((a, b) => a + b, 0);
  const total = sum + modifier;

  const embed = new EmbedBuilder()
    .setTitle('🎲 Dice Roll')
    .setColor(0xff6b6b)
    .addFields([
      { name: 'Configuration', value: `${count}d${sides}${modifier !== 0 ? (modifier > 0 ? `+${modifier}` : `${modifier}`) : ''}`, inline: true },
      { name: 'Rolls', value: rolls.join(', '), inline: true },
      { name: 'Total', value: `**${total}**`, inline: true }
    ]);

  if (modifier !== 0) {
    embed.addFields([
      { name: 'Breakdown', value: `${sum} (dice) ${modifier > 0 ? '+' : ''}${modifier} (modifier) = ${total}`, inline: false }
    ]);
  }

  await message.reply({ embeds: [embed] });
}

export async function executeSlash(interaction: ChatInputCommandInteraction) {
  const diceNotation = interaction.options.getString('dice') || 'd6';
  
  const parsed = parseDiceNotation(diceNotation);
  if (!parsed) {
    return interaction.reply({ 
      content: '🎲 Invalid dice notation! Use formats like: `d6`, `2d20`, `3d6+5`, `1d100-10`',
      ephemeral: true 
    });
  }

  const { count, sides, modifier } = parsed;
  const rolls = rollDice(count, sides);
  const sum = rolls.reduce((a, b) => a + b, 0);
  const total = sum + modifier;

  const embed = new EmbedBuilder()
    .setTitle('🎲 Dice Roll')
    .setColor(0xff6b6b)
    .addFields([
      { name: 'Configuration', value: `${count}d${sides}${modifier !== 0 ? (modifier > 0 ? `+${modifier}` : `${modifier}`) : ''}`, inline: true },
      { name: 'Rolls', value: rolls.join(', '), inline: true },
      { name: 'Total', value: `**${total}**`, inline: true }
    ]);

  if (modifier !== 0) {
    embed.addFields([
      { name: 'Breakdown', value: `${sum} (dice) ${modifier > 0 ? '+' : ''}${modifier} (modifier) = ${total}`, inline: false }
    ]);
  }

  await interaction.reply({ embeds: [embed] });
} 