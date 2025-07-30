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
  name: 'rate',
  description: 'Rate anything out of 10!',
  aliases: ['rating', 'score'],
  category: CommandCategory.FUN,
  usage: '!rate <something>',
  cooldown: 3
};

export const slashData = new SlashCommandBuilder()
  .setName('rate')
  .setDescription('Rate anything out of 10!')
  .addStringOption(option =>
    option.setName('item')
      .setDescription('What would you like me to rate?')
      .setRequired(true)
  );

const ratingComments = {
  10: [
    "Absolutely perfect! 🌟",
    "Chef's kiss! 💋👌",
    "Pure perfection! ✨",
    "Flawless victory! 🏆",
    "10/10 would recommend! 👏"
  ],
  9: [
    "Nearly perfect! 🌟",
    "Almost there! So close! 💫",
    "Excellent work! 🎯",
    "Top tier quality! 🥇",
    "One point away from greatness! ⭐"
  ],
  8: [
    "Really good! 👍",
    "Solid choice! 💪",
    "Great quality! 📈",
    "Above average for sure! ⬆️",
    "Well done! 🎉"
  ],
  7: [
    "Pretty good! 😊",
    "Not bad at all! 👌",
    "Decent quality! ✅",
    "Respectable! 🙂",
    "Above the norm! 📊"
  ],
  6: [
    "It's alright! 😐",
    "Could be worse! 🤷",
    "Meh... it's okay! 😑",
    "Passable! ✔️",
    "Middle of the road! 🛣️"
  ],
  5: [
    "Right in the middle! ⚖️",
    "Perfectly average! 📊",
    "Neither good nor bad! 🤔",
    "The definition of 'meh'! 😐",
    "Could go either way! ↔️"
  ],
  4: [
    "Below average... 😕",
    "Not great, not terrible! 📉",
    "Needs improvement! 🔧",
    "Could be better! ⬇️",
    "Somewhat disappointing! 😞"
  ],
  3: [
    "Pretty bad... 😬",
    "Yikes... not good! 😰",
    "Major improvements needed! 🚨",
    "Rough around the edges! 😓",
    "Oof... that's rough! 💀"
  ],
  2: [
    "Really bad! 😭",
    "Big oof! 💥",
    "This ain't it, chief! ❌",
    "Needs a complete overhaul! 🔄",
    "Pain and suffering! 😵"
  ],
  1: [
    "Absolutely terrible! 🚫",
    "The worst! 💀",
    "My eyes are bleeding! 👀💔",
    "Please make it stop! 🛑",
    "A crime against humanity! ⚖️"
  ],
  0: [
    "Does not compute! 🤖💥",
    "Error 404: Quality not found! 🔍❌",
    "So bad it broke the scale! 📉💥",
    "Negative infinity out of 10! ♾️❌",
    "The universe is crying! 🌌😭"
  ]
};

const specialRatings = [
  { keywords: ['me', 'myself', 'i'], rating: 10, comment: "You're absolutely amazing! 💖" },
  { keywords: ['bot', 'you', 'this bot'], rating: 10, comment: "Aww, thanks! I'm blushing! 🤖💕" },
  { keywords: ['pizza'], rating: 9, comment: "Pizza is life! 🍕" },
  { keywords: ['coffee'], rating: 8, comment: "Fuel of the gods! ☕" },
  { keywords: ['discord'], rating: 9, comment: "The best way to hang out! 💬" },
  { keywords: ['programming', 'coding', 'code'], rating: 8, comment: "The art of controlled chaos! 💻" },
  { keywords: ['monday', 'mondays'], rating: 2, comment: "Ugh... Mondays... 😫" },
  { keywords: ['friday', 'weekend'], rating: 10, comment: "The light at the end of the tunnel! 🌈" },
  { keywords: ['pineapple pizza'], rating: 1, comment: "The great debate continues... 🍍🍕💀" },
  { keywords: ['cats'], rating: 10, comment: "Purrfection! 🐱" },
  { keywords: ['dogs'], rating: 10, comment: "Good boys and girls! 🐕" }
];

function getRating(input: string): { rating: number; comment: string } {
  const lowerInput = input.toLowerCase();
  
  // Check for special ratings first
  for (const special of specialRatings) {
    if (special.keywords.some(keyword => lowerInput.includes(keyword))) {
      return { rating: special.rating, comment: special.comment };
    }
  }
  
  // Generate a "random" rating based on the input string
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  const rating = Math.abs(hash) % 11; // 0-10
  const comments = ratingComments[rating as keyof typeof ratingComments] || ratingComments[5];
  const comment = comments[Math.abs(hash) % comments.length];
  
  return { rating, comment };
}

function generateStarRating(rating: number): string {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5 ? 1 : 0;
  const emptyStars = 10 - fullStars - halfStar;
  
  return '⭐'.repeat(fullStars) + 
         (halfStar ? '✨' : '') + 
         '⚫'.repeat(emptyStars);
}

export async function execute(message: Message, args?: string[]) {
  if (!args || args.length === 0) {
    return message.reply('📊 Please tell me what you want me to rate!\nUsage: `!rate <something>`\nExample: `!rate pizza`');
  }

  const itemToRate = args.join(' ');
  const { rating, comment } = getRating(itemToRate);
  const starRating = generateStarRating(rating);
  
  // Determine color based on rating
  let color = 0x95a5a6; // Gray for middle ratings
  if (rating >= 8) color = 0x2ecc71; // Green for great
  else if (rating >= 6) color = 0xf1c40f; // Yellow for good
  else if (rating >= 4) color = 0xe67e22; // Orange for okay
  else color = 0xe74c3c; // Red for poor

  const embed = new EmbedBuilder()
    .setTitle('📊 **Rating Results**')
    .setDescription(`Rating: **"${itemToRate}"**`)
    .addFields([
      {
        name: '🏆 Score',
        value: `**${rating}/10**`,
        inline: true
      },
      {
        name: '⭐ Star Rating',
        value: starRating,
        inline: true
      },
      {
        name: '💭 Verdict',
        value: comment,
        inline: false
      }
    ])
    .setColor(color)
    .setThumbnail('https://cdn.discordapp.com/emojis/692028702406189087.png') // Thinking emoji
    .setFooter({ 
      text: `Rated by ${message.author.tag} • Results may vary!`,
      iconURL: message.author.displayAvatarURL()
    })
    .setTimestamp();

  await message.reply({ embeds: [embed] });
}

export async function executeSlash(interaction: ChatInputCommandInteraction) {
  const itemToRate = interaction.options.getString('item', true);
  const { rating, comment } = getRating(itemToRate);
  const starRating = generateStarRating(rating);
  
  // Determine color based on rating
  let color = 0x95a5a6; // Gray for middle ratings
  if (rating >= 8) color = 0x2ecc71; // Green for great
  else if (rating >= 6) color = 0xf1c40f; // Yellow for good
  else if (rating >= 4) color = 0xe67e22; // Orange for okay
  else color = 0xe74c3c; // Red for poor

  const embed = new EmbedBuilder()
    .setTitle('📊 **Rating Results**')
    .setDescription(`Rating: **"${itemToRate}"**`)
    .addFields([
      {
        name: '🏆 Score',
        value: `**${rating}/10**`,
        inline: true
      },
      {
        name: '⭐ Star Rating',
        value: starRating,
        inline: true
      },
      {
        name: '💭 Verdict',
        value: comment,
        inline: false
      }
    ])
    .setColor(color)
    .setThumbnail('https://cdn.discordapp.com/emojis/692028702406189087.png') // Thinking emoji
    .setFooter({ 
      text: `Rated by ${interaction.user.tag} • Results may vary!`,
      iconURL: interaction.user.displayAvatarURL()
    })
    .setTimestamp();

  await interaction.reply({ embeds: [embed] });
} 
