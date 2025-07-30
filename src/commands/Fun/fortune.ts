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
  name: 'fortune',
  description: 'Get a personalized fortune cookie based on your Discord activity',
  category: CommandCategory.FUN,
  usage: '!fortune',
  aliases: ['cookie', 'destiny'],
  cooldown: 30
};

export const slashData = new SlashCommandBuilder()
  .setName('fortune')
  .setDescription('Get a personalized fortune cookie based on your Discord activity');

const fortunes = [
  "A mysterious stranger will bring you great joy today.",
  "Your next message will be the most important one you've ever sent.",
  "A server member will surprise you with kindness.",
  "Your Discord avatar will bring you good luck this week.",
  "A new friendship will blossom in your favorite channel.",
  "Your emoji usage will reveal your true personality.",
  "A voice channel adventure awaits you.",
  "Your typing speed will impress someone today.",
  "A role change will bring positive energy.",
  "Your next reaction will be the most meaningful.",
  "A DM conversation will change your perspective.",
  "Your server activity will inspire others.",
  "A new channel will become your favorite.",
  "Your username will attract good fortune.",
  "A bot interaction will bring you wisdom."
];

const personalizedElements = [
  "based on your recent activity",
  "considering your message count",
  "given your server presence",
  "reflecting your engagement",
  "matching your energy level"
];

function generateFortune(user: any, guild: any): string {
  const baseFortune = fortunes[Math.floor(Math.random() * fortunes.length)];
  const personalElement = personalizedElements[Math.floor(Math.random() * personalizedElements.length)];
  
  // Add personalized touches based on user data
  const userAge = Date.now() - user.createdTimestamp;
  const daysSinceCreation = Math.floor(userAge / (1000 * 60 * 60 * 24));
  
  let fortune = baseFortune;
  
  if (daysSinceCreation < 30) {
    fortune += " (You're still new here - exciting times ahead!)";
  } else if (daysSinceCreation > 365) {
    fortune += " (Your experience here will guide others.)";
  }
  
  if (user.presence?.status === 'online') {
    fortune += " Your active presence amplifies this fortune.";
  }
  
  return `${fortune} ${personalElement}.`;
}

export async function execute(message: Message, args?: string[]) {
  try {
    const fortune = generateFortune(message.author, message.guild);
    
    const embed = new EmbedBuilder()
      .setTitle('🥠 Fortune Cookie')
      .setDescription(`**${fortune}**`)
      .setColor(0xFFD700)
      .setThumbnail('https://em-content.zobj.net/source/microsoft-teams/363/fortune-cookie_1f960.png')
      .addFields([
        { 
          name: '📅 Fortune Date', 
          value: new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          }), 
          inline: true 
        },
        { 
          name: '👤 For', 
          value: message.author.username, 
          inline: true 
        },
        { 
          name: '🎯 Luck Level', 
          value: `${Math.floor(Math.random() * 100) + 1}%`, 
          inline: true 
        }
      ])
      .setFooter({ 
        text: 'Remember: Fortune favors the bold!',
        iconURL: message.author.displayAvatarURL()
      })
      .setTimestamp();

    await message.reply({ embeds: [embed] });
  } catch (error) {
    console.error('Fortune command error:', error);
    await message.reply('❌ The fortune cookies are temporarily unavailable. Please try again later.');
  }
}

export async function executeSlash(interaction: ChatInputCommandInteraction) {
  try {
    const fortune = generateFortune(interaction.user, interaction.guild);
    
    const embed = new EmbedBuilder()
      .setTitle('🥠 Fortune Cookie')
      .setDescription(`**${fortune}**`)
      .setColor(0xFFD700)
      .setThumbnail('https://em-content.zobj.net/source/microsoft-teams/363/fortune-cookie_1f960.png')
      .addFields([
        { 
          name: '📅 Fortune Date', 
          value: new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          }), 
          inline: true 
        },
        { 
          name: '👤 For', 
          value: interaction.user.username, 
          inline: true 
        },
        { 
          name: '🎯 Luck Level', 
          value: `${Math.floor(Math.random() * 100) + 1}%`, 
          inline: true 
        }
      ])
      .setFooter({ 
        text: 'Remember: Fortune favors the bold!',
        iconURL: interaction.user.displayAvatarURL()
      })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  } catch (error) {
    console.error('Fortune slash command error:', error);
    await interaction.reply({ 
      content: '❌ The fortune cookies are temporarily unavailable. Please try again later.',
      ephemeral: true 
    });
  }
} 
