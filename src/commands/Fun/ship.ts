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


export const data = {
  name: 'ship',
  description: 'Calculate the compatibility between two users!',
  aliases: ['compatibility', 'love'],
  category: CommandCategory.FUN,
  usage: '!ship @user1 @user2',
  cooldown: 5
};

export const slashData = new SlashCommandBuilder()
  .setName('ship')
  .setDescription('Calculate the compatibility between two users!')
  .addUserOption(option =>
    option.setName('user1')
      .setDescription('The first user')
      .setRequired(true)
  )
  .addUserOption(option =>
    option.setName('user2')
      .setDescription('The second user (optional, defaults to you)')
      .setRequired(false)
  );

const compatibilityLevels = [
  { min: 90, max: 100, level: "Soul Mates", emoji: "💕", description: "Perfect match! You two were made for each other!" },
  { min: 80, max: 89, level: "True Love", emoji: "💖", description: "Amazing compatibility! This could be the real deal!" },
  { min: 70, max: 79, level: "Great Match", emoji: "💗", description: "You two work really well together!" },
  { min: 60, max: 69, level: "Good Vibes", emoji: "💘", description: "There's definitely something here worth exploring!" },
  { min: 50, max: 59, level: "Potential", emoji: "💝", description: "With some effort, this could work out!" },
  { min: 40, max: 49, level: "Complicated", emoji: "💔", description: "It's... complicated. Mixed signals everywhere!" },
  { min: 30, max: 39, level: "Rough Waters", emoji: "😕", description: "This might need some serious work..." },
  { min: 20, max: 29, level: "Oil & Water", emoji: "😬", description: "You two are like opposite magnets!" },
  { min: 10, max: 19, level: "Disaster Zone", emoji: "💥", description: "This is a recipe for chaos!" },
  { min: 0, max: 9, level: "Absolutely Not", emoji: "🚫", description: "Run. Just run." }
];

const shipNames = [
  "💕 Lovey McLovers 💕",
  "🌟 StarCrossed Duo 🌟", 
  "💖 Heartbeat Heroes 💖",
  "🎭 Dynamic Pair 🎭",
  "🌙 Moonlight Match 🌙",
  "⚡ Electric Connection ⚡",
  "🦋 Butterfly Effect 🦋",
  "🌈 Rainbow Romance 🌈",
  "🔥 Fire & Passion 🔥",
  "❄️ Ice & Spice ❄️"
];

function calculateCompatibility(id1: string, id2: string): number {
  // Create a deterministic "random" number based on user IDs
  const combined = id1 + id2;
  let hash = 0;
  
  for (let i = 0; i < combined.length; i++) {
    const char = combined.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  // Convert to a percentage (0-100)
  return Math.abs(hash) % 101;
}

function getCompatibilityLevel(percentage: number) {
  return compatibilityLevels.find(level => percentage >= level.min && percentage <= level.max) 
    || compatibilityLevels[compatibilityLevels.length - 1];
}

function createShipName(name1: string, name2: string): string {
  // Create a simple ship name by combining parts of both names
  const part1 = name1.slice(0, Math.ceil(name1.length / 2));
  const part2 = name2.slice(Math.floor(name2.length / 2));
  return part1 + part2;
}

function generateProgressBar(percentage: number): string {
  const barLength = 20;
  const filledLength = Math.round((percentage / 100) * barLength);
  const emptyLength = barLength - filledLength;
  
  const heartBar = "💖".repeat(Math.max(0, filledLength));
  const emptyBar = "🤍".repeat(Math.max(0, emptyLength));
  
  return heartBar + emptyBar;
}

export async function execute(message: Message, args?: string[]) {
  const mentions = message.mentions.users;
  let user1, user2;

  if (mentions.size === 0) {
    return message.reply('💝 Please mention at least one user to ship!\nUsage: `!ship @user1 @user2` or `!ship @user` (to ship with yourself)');
  } else if (mentions.size === 1) {
    user1 = message.author;
    user2 = mentions.first()!;
  } else {
    const mentionArray = Array.from(mentions.values());
    user1 = mentionArray[0];
    user2 = mentionArray[1];
  }

  if (user1.id === user2.id) {
    return message.reply('💝 You can\'t ship someone with themselves! (Unless you\'re into that... 😏)');
  }

  const compatibility = calculateCompatibility(user1.id, user2.id);
  const level = getCompatibilityLevel(compatibility);
  const shipName = createShipName(user1.username, user2.username);
  const progressBar = generateProgressBar(compatibility);
  const randomShipName = shipNames[Math.floor(Math.random() * shipNames.length)];

  const embed = new EmbedBuilder()
    .setTitle(`💘 **Ship Calculator** 💘`)
    .setDescription(`**${user1.username}** 💕 **${user2.username}**`)
    .addFields([
      {
        name: '🚢 Ship Name',
        value: `**${shipName}**`,
        inline: true
      },
      {
        name: '💫 Special Title', 
        value: randomShipName,
        inline: true
      },
      {
        name: '💯 Compatibility Score',
        value: `**${compatibility}%**`,
        inline: true
      },
      {
        name: '📊 Love Meter',
        value: progressBar,
        inline: false
      },
      {
        name: `${level.emoji} ${level.level}`,
        value: level.description,
        inline: false
      }
    ])
    .setColor(compatibility >= 70 ? 0xff69b4 : compatibility >= 40 ? 0xffa500 : 0x808080)
    .setThumbnail(`https://cdn.discordapp.com/emojis/656598065532239892.png`) // Heart eyes emoji
    .setFooter({ 
      text: `💕 Calculated by Cupid's Algorithm™ • Requested by ${message.author.tag}`,
      iconURL: message.author.displayAvatarURL()
    })
    .setTimestamp();

  await message.reply({ embeds: [embed] });
}

export async function executeSlash(interaction: ChatInputCommandInteraction) {
  const user1Option = interaction.options.getUser('user1', true);
  const user2Option = interaction.options.getUser('user2') || interaction.user;

  if (user1Option.id === user2Option.id) {
    return interaction.reply({ 
      content: '💝 You can\'t ship someone with themselves! (Unless you\'re into that... 😏)',
      ephemeral: true 
    });
  }

  const compatibility = calculateCompatibility(user1Option.id, user2Option.id);
  const level = getCompatibilityLevel(compatibility);
  const shipName = createShipName(user1Option.username, user2Option.username);
  const progressBar = generateProgressBar(compatibility);
  const randomShipName = shipNames[Math.floor(Math.random() * shipNames.length)];

  const embed = new EmbedBuilder()
    .setTitle(`💘 **Ship Calculator** 💘`)
    .setDescription(`**${user1Option.username}** 💕 **${user2Option.username}**`)
    .addFields([
      {
        name: '🚢 Ship Name',
        value: `**${shipName}**`,
        inline: true
      },
      {
        name: '💫 Special Title', 
        value: randomShipName,
        inline: true
      },
      {
        name: '💯 Compatibility Score',
        value: `**${compatibility}%**`,
        inline: true
      },
      {
        name: '📊 Love Meter',
        value: progressBar,
        inline: false
      },
      {
        name: `${level.emoji} ${level.level}`,
        value: level.description,
        inline: false
      }
    ])
    .setColor(compatibility >= 70 ? 0xff69b4 : compatibility >= 40 ? 0xffa500 : 0x808080)
    .setThumbnail(`https://cdn.discordapp.com/emojis/656598065532239892.png`) // Heart eyes emoji
    .setFooter({ 
      text: `💕 Calculated by Cupid's Algorithm™ • Requested by ${interaction.user.tag}`,
      iconURL: interaction.user.displayAvatarURL()
    })
    .setTimestamp();

  await interaction.reply({ embeds: [embed] });
} 

