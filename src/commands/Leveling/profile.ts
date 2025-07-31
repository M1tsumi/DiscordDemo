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

import { MessageFlags, User, StringSelectMenuInteraction, EmbedField } from 'discord.js';

export const data = {
  name: 'profile-level',
  description: 'Show your leveling profile with level and XP',
  aliases: ['profile', 'level', 'rank'],
  category: CommandCategory.LEVELING,
  usage: '!profile-level',
  cooldown: 5
};

export const slashData = new SlashCommandBuilder()
  .setName('profile-level')
  .setDescription('Show your leveling profile with level and XP');

export async function execute(message: Message) {
  const { levelingService } = await import('../../index');
  const user = message.author;
  const profile = levelingService.getProfile(user.id);
  
  if (!profile) {
    return message.reply('📊 No profile found. Send a message to start earning XP!');
  }
  
  const levelInfo = levelingService.getLevelInfo(profile.level);
  const nextLevel = profile.level + 1;
  const nextLevelInfo = levelingService.getLevelInfo(nextLevel);
  const xpForNextLevel = Math.pow(nextLevel - 1, 2) * 100;
  const progress = Math.min(100, Math.floor((profile.xp / xpForNextLevel) * 100));
  const progressBar = `▰`.repeat(Math.floor(progress / 10)) + `▱`.repeat(10 - Math.floor(progress / 10));

  // Format voice time
  const voiceHours = Math.floor(profile.voiceTime / 3600);
  const voiceMinutes = Math.floor((profile.voiceTime % 3600) / 60);
  const voiceTimeFormatted = `${voiceHours}h ${voiceMinutes}m`;

  // Format last active
  const lastActive = new Date(profile.lastActiveDate);
  const lastActiveFormatted = lastActive.toLocaleDateString();

  const embed = new EmbedBuilder()
    .setAuthor({ name: `${user.username}'s Leveling Profile`, iconURL: user.displayAvatarURL() })
    .setThumbnail(user.displayAvatarURL())
    .setColor(levelInfo.color)
    .addFields([
      { name: 'Level', value: `**${profile.level}**`, inline: true },
      { name: 'Title', value: `*${levelInfo.title}*`, inline: true },
      { name: 'Streak', value: `🔥 ${profile.streakDays} days`, inline: true },
      { name: 'XP', value: `${profile.xp} / ${xpForNextLevel} XP`, inline: true },
      { name: 'Progress', value: `${progressBar} (${progress}%)`, inline: true },
      { name: 'Messages', value: `${profile.messageCount} sent`, inline: true },
      { name: 'Voice Time', value: `🎤 ${voiceTimeFormatted}`, inline: true },
      { name: 'Last Active', value: `📅 ${lastActiveFormatted}`, inline: true },
      { name: '\u200B', value: '\u200B', inline: true }
    ])
    .setFooter({ text: `Next Title: ${nextLevelInfo.title}` });
  await message.reply({ embeds: [embed] });
}

export async function executeSlash(interaction: ChatInputCommandInteraction) {
  const { levelingService } = await import('../../index');
  const user = interaction.user;
  const profile = levelingService.getProfile(user.id);
  
  if (!profile) {
    return interaction.reply('📊 No profile found. Send a message to start earning XP!');
  }
  
  const levelInfo = levelingService.getLevelInfo(profile.level);
  const nextLevel = profile.level + 1;
  const nextLevelInfo = levelingService.getLevelInfo(nextLevel);
  const xpForNextLevel = Math.pow(nextLevel - 1, 2) * 100;
  const progress = Math.min(100, Math.floor((profile.xp / xpForNextLevel) * 100));
  const progressBar = `▰`.repeat(Math.floor(progress / 10)) + `▱`.repeat(10 - Math.floor(progress / 10));

  // Format voice time
  const voiceHours = Math.floor(profile.voiceTime / 3600);
  const voiceMinutes = Math.floor((profile.voiceTime % 3600) / 60);
  const voiceTimeFormatted = `${voiceHours}h ${voiceMinutes}m`;

  // Format last active
  const lastActive = new Date(profile.lastActiveDate);
  const lastActiveFormatted = lastActive.toLocaleDateString();

  const embed = new EmbedBuilder()
    .setAuthor({ name: `${user.username}'s Leveling Profile`, iconURL: user.displayAvatarURL() })
    .setThumbnail(user.displayAvatarURL())
    .setColor(levelInfo.color)
    .addFields([
      { name: 'Level', value: `**${profile.level}**`, inline: true },
      { name: 'Title', value: `*${levelInfo.title}*`, inline: true },
      { name: 'Streak', value: `🔥 ${profile.streakDays} days`, inline: true },
      { name: 'XP', value: `${profile.xp} / ${xpForNextLevel} XP`, inline: true },
      { name: 'Progress', value: `${progressBar} (${progress}%)`, inline: true },
      { name: 'Messages', value: `${profile.messageCount} sent`, inline: true },
      { name: 'Voice Time', value: `🎤 ${voiceTimeFormatted}`, inline: true },
      { name: 'Last Active', value: `📅 ${lastActiveFormatted}`, inline: true },
      { name: '\u200B', value: '\u200B', inline: true }
    ])
    .setFooter({ text: `Next Title: ${nextLevelInfo.title}` });
  await interaction.reply({ embeds: [embed] });
}

