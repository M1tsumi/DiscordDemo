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
  name: 'roast',
  description: 'Get roasted or roast someone else',
  category: CommandCategory.FUN,
  usage: '!roast [@user]',
  aliases: ['insult', 'burn'],
  cooldown: 30
};

export const slashData = new SlashCommandBuilder()
  .setName('roast')
  .setDescription('Get roasted or roast someone else')
  .addUserOption(option =>
    option.setName('target')
      .setDescription('User to roast (optional)')
      .setRequired(false)
  );

const roasts = [
  "Your Discord avatar looks like it was drawn by a 5-year-old with a broken crayon.",
  "I've seen better usernames in a kindergarten class.",
  "Your typing speed is slower than a snail carrying a backpack.",
  "You probably think 'LOL' is still cool to use.",
  "Your server activity is as exciting as watching paint dry.",
  "I bet your favorite emoji is the crying face because you use it so much.",
  "Your Discord status is probably 'online' because you have no life.",
  "You're the type of person who says 'gg ez' after losing.",
  "Your profile picture is so generic, I've seen it 50 times today.",
  "You probably think being a Discord moderator is a real job.",
  "Your message history is just you asking for help with everything.",
  "I bet you still use the default Discord theme.",
  "Your nickname is probably something embarrassing like 'Gamer123'.",
  "You're the kind of person who types 'xD' unironically.",
  "Your server list is probably just 50 dead servers you forgot to leave."
];

export async function execute(message: Message, args?: string[]) {
  const target = message.mentions.users.first() || message.author;
  
  if (target.id === message.client.user?.id) {
    await message.reply("Nice try, but I'm immune to your weak roasts! 🔥");
    return;
  }
  
  const roast = roasts[Math.floor(Math.random() * roasts.length)];
  
  const embed = new EmbedBuilder()
    .setTitle('🔥 Roast Session')
    .setDescription(`**${roast}**`)
    .setColor(0xFF4500)
    .addFields([
      { name: '🎯 Target', value: target.toString(), inline: true },
      { name: '🔥 Roaster', value: message.author.toString(), inline: true }
    ])
    .setFooter({ text: 'All in good fun! 😄' })
    .setTimestamp();
  
  await message.reply({ embeds: [embed] });
}

export async function executeSlash(interaction: ChatInputCommandInteraction) {
  const target = interaction.options.getUser('target') || interaction.user;
  
  if (target.id === interaction.client.user?.id) {
    await interaction.reply({ content: "Nice try, but I'm immune to your weak roasts! 🔥", ephemeral: true });
    return;
  }
  
  const roast = roasts[Math.floor(Math.random() * roasts.length)];
  
  const embed = new EmbedBuilder()
    .setTitle('🔥 Roast Session')
    .setDescription(`**${roast}**`)
    .setColor(0xFF4500)
    .addFields([
      { name: '🎯 Target', value: target.toString(), inline: true },
      { name: '🔥 Roaster', value: interaction.user.toString(), inline: true }
    ])
    .setFooter({ text: 'All in good fun! 😄' })
    .setTimestamp();
  
  await interaction.reply({ embeds: [embed] });
} 
