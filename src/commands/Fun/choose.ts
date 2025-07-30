


export const data = {
  name: 'choose',
  description: 'Let me choose between multiple options for you!',
  aliases: ['pick', 'decide', 'choice'],
  category: CommandCategory.FUN,
  usage: '!choose option1 | option2 | option3',
  cooldown: 2
};

export const slashData = new SlashCommandBuilder()
  .setName('choose')
  .setDescription('Let me choose between multiple options for you!')
  .addStringOption(option =>
    option.setName('options')
      .setDescription('Options separated by | (e.g., pizza | burgers | tacos)')
      .setRequired(true)
  );

const choiceEmojis = ['🎯', '👉', '⭐', '🏆', '💎', '🎪', '🎨', '🎭', '🎪', '🌟'];
const decisionComments = [
  "After careful consideration...",
  "The RNG gods have spoken!",
  "My advanced AI brain says...",
  "After running complex algorithms...",
  "The universe has decided...",
  "My crystal ball reveals...",
  "The magic 8-ball says...",
  "Through scientific analysis...",
  "By the power of randomness...",
  "The cosmic forces align for...",
  "My professional opinion is...",
  "The winner by unanimous decision...",
  "After consulting the ancient texts...",
  "Through pure intuition...",
  "The logical choice is obviously..."
];

const excitementLevels = [
  { chance: 0.1, prefix: "🔥 **ABSOLUTELY**", suffix: "**!!** 🔥", description: "This choice is ON FIRE!" },
  { chance: 0.15, prefix: "✨ **DEFINITELY**", suffix: "**!** ✨", description: "No doubt about it!" },
  { chance: 0.2, prefix: "🎉 **CLEARLY**", suffix: "**!** 🎉", description: "It's so obvious!" },
  { chance: 0.25, prefix: "💯 **OBVIOUSLY**", suffix: "**!** 💯", description: "100% the right choice!" },
  { chance: 1.0, prefix: "I choose", suffix: "!", description: "A solid choice!" }
];

function parseOptions(input: string): string[] {
  // Split by | first, then by commas as fallback
  let options = input.split('|').map(opt => opt.trim()).filter(opt => opt.length > 0);
  
  if (options.length === 1) {
    // Try splitting by commas if no | found
    options = input.split(',').map(opt => opt.trim()).filter(opt => opt.length > 0);
  }
  
  if (options.length === 1) {
    // Try splitting by "or" as last resort
    options = input.split(/\s+or\s+/i).map(opt => opt.trim()).filter(opt => opt.length > 0);
  }
  
  return options;
}

function getExcitementLevel(): { prefix: string; suffix: string; description: string } {
  const random = Math.random();
  for (const level of excitementLevels) {
    if (random <= level.chance) {
      return level;
    }
  }
  return excitementLevels[excitementLevels.length - 1];
}

export async function execute(message: Message, args?: string[]) {
  if (!args || args.length === 0) {
    return message.reply(
      '🤔 Please give me some options to choose from!\n\n' +
      '**Usage examples:**\n' +
      '• `!choose pizza | burgers | tacos`\n' +
      '• `!choose red, blue, green`\n' +
      '• `!choose cats or dogs`\n' +
      '• `!choose stay home | go out | Netflix`'
    );
  }

  const input = args.join(' ');
  const options = parseOptions(input);

  if (options.length < 2) {
    return message.reply('🤷 I need at least 2 options to choose from! Try separating them with `|`, `,`, or `or`.');
  }

  if (options.length > 20) {
    return message.reply('🤯 Whoa! That\'s too many options! Please give me 20 or fewer choices.');
  }

  // Choose a random option
  const chosenOption = options[Math.floor(Math.random() * options.length)];
  const randomEmoji = choiceEmojis[Math.floor(Math.random() * choiceEmojis.length)];
  const randomComment = decisionComments[Math.floor(Math.random() * decisionComments.length)];
  const excitement = getExcitementLevel();

  // Create the options list with the chosen one highlighted
  const optionsList = options.map((option, index) => {
    if (option === chosenOption) {
      return `${randomEmoji} **${option}** ← **CHOSEN!**`;
    }
    return `• ${option}`;
  }).join('\n');

  const embed = new EmbedBuilder()
    .setTitle('🎲 **Decision Maker**')
    .setDescription(
      `${randomComment}\n\n` +
      `${excitement.prefix} **${chosenOption}** ${excitement.suffix}`
    )
    .addFields([
      {
        name: '📋 All Options',
        value: optionsList,
        inline: false
      },
      {
        name: '🎯 Final Decision',
        value: excitement.description,
        inline: false
      }
    ])
    .setColor(0x3498db)
    .setThumbnail('https://cdn.discordapp.com/emojis/692028702406189087.png') // Thinking emoji
    .setFooter({ 
      text: `Decision made for ${message.author.tag} • Choices: ${options.length}`,
      iconURL: message.author.displayAvatarURL()
    })
    .setTimestamp();

  await message.reply({ embeds: [embed] });
}

export async function executeSlash(interaction: ChatInputCommandInteraction) {
  const input = interaction.options.getString('options', true);
  const options = parseOptions(input);

  if (options.length < 2) {
    return interaction.reply({ 
      content: '🤷 I need at least 2 options to choose from! Try separating them with `|`, `,`, or `or`.',
      ephemeral: true 
    });
  }

  if (options.length > 20) {
    return interaction.reply({ 
      content: '🤯 Whoa! That\'s too many options! Please give me 20 or fewer choices.',
      ephemeral: true 
    });
  }

  // Choose a random option
  const chosenOption = options[Math.floor(Math.random() * options.length)];
  const randomEmoji = choiceEmojis[Math.floor(Math.random() * choiceEmojis.length)];
  const randomComment = decisionComments[Math.floor(Math.random() * decisionComments.length)];
  const excitement = getExcitementLevel();

  // Create the options list with the chosen one highlighted
  const optionsList = options.map((option, index) => {
    if (option === chosenOption) {
      return `${randomEmoji} **${option}** ← **CHOSEN!**`;
    }
    return `• ${option}`;
  }).join('\n');

  const embed = new EmbedBuilder()
    .setTitle('🎲 **Decision Maker**')
    .setDescription(
      `${randomComment}\n\n` +
      `${excitement.prefix} **${chosenOption}** ${excitement.suffix}`
    )
    .addFields([
      {
        name: '📋 All Options',
        value: optionsList,
        inline: false
      },
      {
        name: '🎯 Final Decision',
        value: excitement.description,
        inline: false
      }
    ])
    .setColor(0x3498db)
    .setThumbnail('https://cdn.discordapp.com/emojis/692028702406189087.png') // Thinking emoji
    .setFooter({ 
      text: `Decision made for ${interaction.user.tag} • Choices: ${options.length}`,
      iconURL: interaction.user.displayAvatarURL()
    })
    .setTimestamp();

  await interaction.reply({ embeds: [embed] });
} 
