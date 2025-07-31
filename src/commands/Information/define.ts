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
  name: 'define',
  description: 'Get definitions for words',
  category: CommandCategory.INFORMATION,
  usage: '!define <word>',
  aliases: ['dictionary', 'dict'],
  cooldown: 10
};

export const slashData = new SlashCommandBuilder()
  .setName('define')
  .setDescription('Get definitions for words')
  .addStringOption(option =>
    option.setName('word')
      .setDescription('Word to define')
      .setRequired(true)
  );

// Mock dictionary data (in a real implementation, you'd use a dictionary API)
const dictionary: { [key: string]: { definition: string; partOfSpeech: string; example?: string } } = {
  'hello': {
    definition: 'Used as a greeting or to begin a phone conversation.',
    partOfSpeech: 'interjection',
    example: 'Hello, how are you today?'
  },
  'world': {
    definition: 'The earth, together with all of its countries, peoples, and natural features.',
    partOfSpeech: 'noun',
    example: 'The world is a beautiful place.'
  },
  'discord': {
    definition: 'A communication platform designed for creating communities.',
    partOfSpeech: 'noun',
    example: 'We use Discord to chat with our friends.'
  },
  'bot': {
    definition: 'A computer program that performs automated tasks.',
    partOfSpeech: 'noun',
    example: 'This Discord bot helps manage our server.'
  },
  'awesome': {
    definition: 'Extremely impressive or daunting; inspiring great admiration.',
    partOfSpeech: 'adjective',
    example: 'That was an awesome performance!'
  },
  'epic': {
    definition: 'Particularly impressive or remarkable.',
    partOfSpeech: 'adjective',
    example: 'That was an epic battle!'
  },
  'cool': {
    definition: 'Of or at a fairly low temperature; not hot or warm.',
    partOfSpeech: 'adjective',
    example: 'The weather is cool today.'
  },
  'amazing': {
    definition: 'Causing great surprise or wonder; astonishing.',
    partOfSpeech: 'adjective',
    example: 'The view was absolutely amazing.'
  },
  'fantastic': {
    definition: 'Extraordinarily good or attractive.',
    partOfSpeech: 'adjective',
    example: 'You did a fantastic job!'
  },
  'incredible': {
    definition: 'Impossible to believe; extraordinary.',
    partOfSpeech: 'adjective',
    example: 'The story was incredible.'
  }
};

function getDefinition(word: string): { definition: string; partOfSpeech: string; example?: string } | null {
  const lowerWord = word.toLowerCase();
  return dictionary[lowerWord] || null;
}

function getRandomDefinition(): { word: string; definition: string; partOfSpeech: string } {
  const words = Object.keys(dictionary);
  const randomWord = words[Math.floor(Math.random() * words.length)];
  const def = dictionary[randomWord];
  return { word: randomWord, definition: def.definition, partOfSpeech: def.partOfSpeech };
}

export async function execute(message: Message, args?: string[]) {
  if (!args || args.length === 0) {
    const randomDef = getRandomDefinition();
    const embed = new EmbedBuilder()
      .setTitle('📚 Word of the Day')
      .setDescription(`**${randomDef.word}**`)
      .setColor(0x9C27B0)
      .addFields([
        { name: '📖 Definition', value: randomDef.definition, inline: false },
        { name: '🔤 Part of Speech', value: randomDef.partOfSpeech, inline: true }
      ])
      .setFooter({ text: 'Try !define <word> to look up a specific word!' })
      .setTimestamp();
    
    await message.reply({ embeds: [embed] });
    return;
  }
  
  const word = args.join(' ').toLowerCase();
  const definition = getDefinition(word);
  
  if (!definition) {
    await message.reply(`❌ Sorry, I couldn't find a definition for "${word}". Try another word!`);
    return;
  }
  
  const embed = new EmbedBuilder()
    .setTitle(`📚 Definition: ${word.charAt(0).toUpperCase() + word.slice(1)}`)
    .setDescription(definition.definition)
    .setColor(0x9C27B0)
    .addFields([
      { name: '🔤 Part of Speech', value: definition.partOfSpeech, inline: true }
    ])
    .setFooter({ text: 'Dictionary powered by Discord Bot' })
    .setTimestamp();
  
  if (definition.example) {
    embed.addFields([{ name: '💡 Example', value: definition.example, inline: false }]);
  }
  
  await message.reply({ embeds: [embed] });
}

export async function executeSlash(interaction: ChatInputCommandInteraction) {
  const word = interaction.options.getString('word')!.toLowerCase();
  const definition = getDefinition(word);
  
  if (!definition) {
    await interaction.reply({ content: `❌ Sorry, I couldn't find a definition for "${word}". Try another word!`, ephemeral: true });
    return;
  }
  
  const embed = new EmbedBuilder()
    .setTitle(`📚 Definition: ${word.charAt(0).toUpperCase() + word.slice(1)}`)
    .setDescription(definition.definition)
    .setColor(0x9C27B0)
    .addFields([
      { name: '🔤 Part of Speech', value: definition.partOfSpeech, inline: true }
    ])
    .setFooter({ text: 'Dictionary powered by Discord Bot' })
    .setTimestamp();
  
  if (definition.example) {
    embed.addFields([{ name: '💡 Example', value: definition.example, inline: false }]);
  }
  
  await interaction.reply({ embeds: [embed] });
} 

