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
  name: 'fact',
  description: 'Get a random interesting fact!',
  aliases: ['funfact', 'randomfact', 'trivia'],
  category: CommandCategory.FUN,
  usage: '!fact',
  cooldown: 5
};

export const slashData = new SlashCommandBuilder()
  .setName('fact')
  .setDescription('Get a random interesting fact!');

const facts = [
  {
    category: "🧠 Brain & Psychology",
    fact: "Your brain uses about 20% of your body's total energy, despite being only 2% of your body weight.",
    color: 0x9b59b6
  },
  {
    category: "🐙 Ocean Life",
    fact: "Octopuses have three hearts and blue blood. Two hearts pump blood to the gills, while the third pumps blood to the rest of the body.",
    color: 0x3498db
  },
  {
    category: "🌍 Earth Science",
    fact: "A day on Venus is longer than its year. Venus rotates so slowly that it takes 243 Earth days to complete one rotation, but only 225 Earth days to orbit the Sun.",
    color: 0xe67e22
  },
  {
    category: "🦈 Animal Kingdom",
    fact: "Sharks have been around longer than trees. Sharks have existed for about 400 million years, while trees have been around for about 350 million years.",
    color: 0x2ecc71
  },
  {
    category: "💻 Technology",
    fact: "The first computer bug was an actual bug. In 1947, Grace Hopper found a moth stuck in a computer relay, coining the term 'computer bug.'",
    color: 0xe74c3c
  },
  {
    category: "🍯 Food Science",
    fact: "Honey never spoils. Archaeologists have found edible honey in ancient Egyptian tombs that's over 3,000 years old.",
    color: 0xf1c40f
  },
  {
    category: "🐧 Antarctica",
    fact: "Antarctica is the world's largest desert. Despite being covered in ice, it's classified as a desert because it receives very little precipitation.",
    color: 0x95a5a6
  },
  {
    category: "🧬 Human Body",
    fact: "You share 50% of your DNA with bananas. Despite the vast differences, humans and bananas have a surprising amount of genetic overlap.",
    color: 0xf39c12
  },
  {
    category: "🌙 Space",
    fact: "The Moon is moving away from Earth. Every year, the Moon drifts about 1.5 inches (3.8 cm) farther away from our planet.",
    color: 0x34495e
  },
  {
    category: "🦒 Animal Facts",
    fact: "Giraffes only need 5-30 minutes of sleep per day, and they often sleep standing up with their eyes open.",
    color: 0xe67e22
  },
  {
    category: "🌊 Water Science",
    fact: "Hot water freezes faster than cold water under certain conditions. This phenomenon is called the Mpemba effect.",
    color: 0x3498db
  },
  {
    category: "🎵 Music",
    fact: "Listening to music releases dopamine in your brain, the same chemical released when eating food you love or falling in love.",
    color: 0x9b59b6
  },
  {
    category: "🕷️ Tiny Creatures",
    fact: "Spiders can't fly, but they can travel hundreds of miles through the air using a technique called 'ballooning' with their silk.",
    color: 0x8e44ad
  },
  {
    category: "🌈 Colors",
    fact: "The color orange was named after the fruit, not the other way around. Before oranges were imported to England, the color was called 'red-yellow.'",
    color: 0xe67e22
  },
  {
    category: "💎 Diamonds",
    fact: "It rains diamonds on Neptune and Uranus. The extreme pressure and temperature conditions can compress carbon into diamond raindrops.",
    color: 0x3498db
  },
  {
    category: "🐚 Ancient Life",
    fact: "Lobsters were once considered poor people's food and were so abundant that feeding them to prisoners more than three times a week was considered cruel and unusual punishment.",
    color: 0xe74c3c
  },
  {
    category: "🧊 Temperature",
    fact: "Hot water weighs more than cold water. As water heats up, its molecules move faster and take up more space, making it less dense but technically heavier.",
    color: 0x95a5a6
  },
  {
    category: "🦎 Lizards",
    fact: "Geckos can walk on any surface, including upside down on glass, because they have millions of tiny hairs called setae that use molecular forces.",
    color: 0x2ecc71
  },
  {
    category: "📚 Language",
    fact: "The word 'set' has the most different meanings in the English language with over 430 distinct definitions.",
    color: 0x34495e
  },
  {
    category: "🌱 Plants",
    fact: "Trees can communicate with each other through underground fungal networks, sharing nutrients and warning signals about threats.",
    color: 0x27ae60
  },
  {
    category: "🎭 Human Behavior",
    fact: "Humans are the only animals that blush, and Charles Darwin called it 'the most peculiar and most human of all expressions.'",
    color: 0xe91e63
  },
  {
    category: "🔥 Fire",
    fact: "Fire doesn't have a shadow. Since fire is composed of hot gases and plasma emitting light, it doesn't block light like solid objects do.",
    color: 0xff5722
  },
  {
    category: "⚡ Lightning",
    fact: "Lightning strikes the Earth about 100 times per second, which equals roughly 8.6 million times per day.",
    color: 0xffc107
  },
  {
    category: "🐝 Bees",
    fact: "A single bee will only produce about 1/12th of a teaspoon of honey in her entire lifetime, but bee colonies can produce up to 60 pounds of honey per year.",
    color: 0xffeb3b
  },
  {
    category: "🍇 Food",
    fact: "Grapes explode when you put them in the microwave. The skin of grapes traps steam, causing them to burst like tiny balloons.",
    color: 0x9c27b0
  }
];

const reactionEmojis = ['🤯', '😲', '🤓', '💡', '🧠', '✨', '🌟', '💭', '🔥', '👀'];

export async function execute(message: Message) {
  const randomFact = facts[Math.floor(Math.random() * facts.length)];
  const randomEmoji = reactionEmojis[Math.floor(Math.random() * reactionEmojis.length)];
  
  const embed = new EmbedBuilder()
    .setTitle(`${randomEmoji} **Did You Know?**`)
    .setDescription(`**${randomFact.category}**\n\n${randomFact.fact}`)
    .setColor(randomFact.color)
    .setThumbnail('https://cdn.discordapp.com/emojis/692028702406189087.png') // Thinking emoji
    .setFooter({ 
      text: `Fact #${Math.floor(Math.random() * 1000) + 1} • Knowledge is power!`,
      iconURL: message.author.displayAvatarURL()
    })
    .setTimestamp();

  // Add a fun reaction field occasionally
  if (Math.random() < 0.3) {
    const reactions = [
      "Mind = Blown! 🤯",
      "That's incredible! 😱",
      "Science is amazing! 🧪",
      "Nature is wild! 🌿",
      "Who knew?! 🤷",
      "The more you know! 📚",
      "Fascinating stuff! 🔍",
      "Universe is crazy! 🌌"
    ];
    const randomReaction = reactions[Math.floor(Math.random() * reactions.length)];
    embed.addFields([{ name: '💭 My Reaction', value: randomReaction, inline: false }]);
  }

  await message.reply({ embeds: [embed] });
}

export async function executeSlash(interaction: ChatInputCommandInteraction) {
  const randomFact = facts[Math.floor(Math.random() * facts.length)];
  const randomEmoji = reactionEmojis[Math.floor(Math.random() * reactionEmojis.length)];
  
  const embed = new EmbedBuilder()
    .setTitle(`${randomEmoji} **Did You Know?**`)
    .setDescription(`**${randomFact.category}**\n\n${randomFact.fact}`)
    .setColor(randomFact.color)
    .setThumbnail('https://cdn.discordapp.com/emojis/692028702406189087.png') // Thinking emoji
    .setFooter({ 
      text: `Fact #${Math.floor(Math.random() * 1000) + 1} • Knowledge is power!`,
      iconURL: interaction.user.displayAvatarURL()
    })
    .setTimestamp();

  // Add a fun reaction field occasionally
  if (Math.random() < 0.3) {
    const reactions = [
      "Mind = Blown! 🤯",
      "That's incredible! 😱",
      "Science is amazing! 🧪",
      "Nature is wild! 🌿",
      "Who knew?! 🤷",
      "The more you know! 📚",
      "Fascinating stuff! 🔍",
      "Universe is crazy! 🌌"
    ];
    const randomReaction = reactions[Math.floor(Math.random() * reactions.length)];
    embed.addFields([{ name: '💭 My Reaction', value: randomReaction, inline: false }]);
  }

  await interaction.reply({ embeds: [embed] });
} 

