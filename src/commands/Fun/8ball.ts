import { Message, EmbedBuilder, SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { CommandCategory } from '../../types/Command';

export const data = {
  name: '8ball',
  description: 'Ask the magic 8-ball a question and get a prediction.',
  aliases: ['eightball', 'magic8ball'],
  category: CommandCategory.FUN,
  usage: '!8ball <question>',
  cooldown: 3
};

export const slashData = new SlashCommandBuilder()
  .setName('8ball')
  .setDescription('Ask the magic 8-ball a question and get a prediction.')
  .addStringOption(option =>
    option.setName('question')
      .setDescription('Your question for the magic 8-ball')
      .setRequired(true)
  );

const responses = [
  // Positive responses
  'It is certain.',
  'It is decidedly so.',
  'Without a doubt.',
  'Yes definitely.',
  'You may rely on it.',
  'As I see it, yes.',
  'Most likely.',
  'Outlook good.',
  'Yes.',
  'Signs point to yes.',
  
  // Neutral responses
  'Reply hazy, try again.',
  'Ask again later.',
  'Better not tell you now.',
  'Cannot predict now.',
  'Concentrate and ask again.',
  
  // Negative responses
  'Don\'t count on it.',
  'My reply is no.',
  'My sources say no.',
  'Outlook not so good.',
  'Very doubtful.'
];

export async function execute(message: Message, args?: string[]) {
  if (!args || args.length === 0) {
    return message.reply('🎱 Please ask me a question! Usage: `!8ball <question>`');
  }

  const question = args.join(' ');
  const response = responses[Math.floor(Math.random() * responses.length)];
  
  const embed = new EmbedBuilder()
    .setTitle('🎱 Magic 8-Ball')
    .addFields(
      { name: 'Question', value: question, inline: false },
      { name: 'Answer', value: `*${response}*`, inline: false }
    )
    .setColor(0x000000)
    .setFooter({ text: 'The magic 8-ball has spoken!' });

  await message.reply({ embeds: [embed] });
}

export async function executeSlash(interaction: ChatInputCommandInteraction) {
  const question = interaction.options.getString('question', true);
  const response = responses[Math.floor(Math.random() * responses.length)];
  
  const embed = new EmbedBuilder()
    .setTitle('🎱 Magic 8-Ball')
    .addFields(
      { name: 'Question', value: question, inline: false },
      { name: 'Answer', value: `*${response}*`, inline: false }
    )
    .setColor(0x000000)
    .setFooter({ text: 'The magic 8-ball has spoken!' });

  await interaction.reply({ embeds: [embed] });
} 