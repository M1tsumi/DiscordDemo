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
  name: 'joke',
  description: 'Get a random joke to brighten your day.',
  aliases: ['funny', 'humor'],
  category: CommandCategory.FUN,
  usage: '!joke',
  cooldown: 3
};

export const slashData = new SlashCommandBuilder()
  .setName('joke')
  .setDescription('Get a random joke to brighten your day.');

const jokes = [
  {
    setup: "Why don't scientists trust atoms?",
    punchline: "Because they make up everything!"
  },
  {
    setup: "Why did the programmer quit his job?",
    punchline: "He didn't get arrays!"
  },
  {
    setup: "Why do programmers prefer dark mode?",
    punchline: "Because light attracts bugs!"
  },
  {
    setup: "How many programmers does it take to change a light bulb?",
    punchline: "None. That's a hardware problem!"
  },
  {
    setup: "Why did the database administrator leave his wife?",
    punchline: "She had one-to-many relationships!"
  },
  {
    setup: "What's the object-oriented way to become wealthy?",
    punchline: "Inheritance!"
  },
  {
    setup: "Why do Java developers wear glasses?",
    punchline: "Because they don't C#!"
  },
  {
    setup: "What did the router say to the doctor?",
    punchline: "It hurts when IP!"
  },
  {
    setup: "Why was the JavaScript developer sad?",
    punchline: "Because he didn't know how to 'null' his feelings!"
  },
  {
    setup: "What's a computer's favorite snack?",
    punchline: "Microchips!"
  },
  {
    setup: "Why don't programmers like nature?",
    punchline: "It has too many bugs!"
  },
  {
    setup: "How do you comfort a JavaScript bug?",
    punchline: "You console it!"
  },
  {
    setup: "Why did the programmer go broke?",
    punchline: "Because he used up all his cache!"
  },
  {
    setup: "What's the best thing about a boolean?",
    punchline: "Even if you're wrong, you're only off by a bit!"
  },
  {
    setup: "Why do programmers always mix up Halloween and Christmas?",
    punchline: "Because Oct 31 equals Dec 25!"
  }
];

export async function execute(message: Message) {
  const randomJoke = jokes[Math.floor(Math.random() * jokes.length)];
  
  const embed = new EmbedBuilder()
    .setTitle('😂 Here\'s a joke for you!')
    .setDescription(`**${randomJoke.setup}**\n\n*${randomJoke.punchline}*`)
    .setColor(0xffeb3b)
    .setFooter({ text: '🎭 Hope that made you smile!' });

  await message.reply({ embeds: [embed] });
}

export async function executeSlash(interaction: ChatInputCommandInteraction) {
  const randomJoke = jokes[Math.floor(Math.random() * jokes.length)];
  
  const embed = new EmbedBuilder()
    .setTitle('😂 Here\'s a joke for you!')
    .setDescription(`**${randomJoke.setup}**\n\n*${randomJoke.punchline}*`)
    .setColor(0xffeb3b)
    .setFooter({ text: '🎭 Hope that made you smile!' });

  await interaction.reply({ embeds: [embed] });
} 
