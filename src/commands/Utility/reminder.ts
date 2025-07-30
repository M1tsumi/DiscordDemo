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
  name: 'reminder',
  description: 'Set a reminder for yourself or others',
  category: CommandCategory.UTILITY,
  usage: '!reminder <time> <message>',
  aliases: ['remind', 'remindme'],
  cooldown: 5
};

export const slashData = new SlashCommandBuilder()
  .setName('reminder')
  .setDescription('Set a reminder for yourself or others')
  .addStringOption(option =>
    option.setName('time')
      .setDescription('Time until reminder (e.g., 5m, 1h, 2d)')
      .setRequired(true)
  )
  .addStringOption(option =>
    option.setName('message')
      .setDescription('What to remind you about')
      .setRequired(true)
  )
  .addUserOption(option =>
    option.setName('user')
      .setDescription('User to remind (defaults to yourself)')
      .setRequired(false)
  );

interface Reminder {
  id: string;
  userId: string;
  channelId: string;
  message: string;
  expiresAt: number;
  createdAt: number;
}

const reminders = new Map<string, Reminder>();
let reminderCounter = 0;

function parseTime(timeString: string): number {
  const timeStringLower = timeString.toLowerCase();
  const match = timeStringLower.match(/^(\d+)(s|m|h|d|w)$/);
  
  if (!match) {
    throw new Error('Invalid time format. Use: 30s, 5m, 2h, 1d, 1w');
  }
  
  const value = parseInt(match[1]);
  const unit = match[2];
  
  const multipliers: { [key: string]: number } = {
    's': 1000,
    'm': 60 * 1000,
    'h': 60 * 60 * 1000,
    'd': 24 * 60 * 60 * 1000,
    'w': 7 * 24 * 60 * 60 * 1000
  };
  
  return value * multipliers[unit];
}

function formatTimeRemaining(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (days > 0) {
    return `${days}d ${hours % 24}h ${minutes % 60}m`;
  } else if (hours > 0) {
    return `${hours}h ${minutes % 60}m`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`;
  } else {
    return `${seconds}s`;
  }
}

function scheduleReminder(reminder: Reminder, client: any) {
  const timeUntilReminder = reminder.expiresAt - Date.now();
  
  if (timeUntilReminder <= 0) {
    // Reminder is already due
    sendReminder(reminder, client);
    return;
  }
  
  setTimeout(() => {
    sendReminder(reminder, client);
    reminders.delete(reminder.id);
  }, timeUntilReminder);
}

function sendReminder(reminder: Reminder, client: any) {
  const channel = client.channels.cache.get(reminder.channelId);
  if (!channel) return;
  
  const user = client.users.cache.get(reminder.userId);
  if (!user) return;
  
  const embed = new EmbedBuilder()
    .setTitle('⏰ Reminder')
    .setDescription(`**${reminder.message}**`)
    .setColor(0xFF6B6B)
    .addFields([
      { name: '👤 For', value: `<@${reminder.userId}>`, inline: true },
      { name: '📅 Set', value: `<t:${Math.floor(reminder.createdAt / 1000)}:R>`, inline: true },
      { name: '🆔 ID', value: reminder.id, inline: true }
    ])
    .setTimestamp();
  
  channel.send({ content: `<@${reminder.userId}>`, embeds: [embed] });
}

export async function execute(message: Message, args?: string[]) {
  if (!args || args.length < 2) {
    await message.reply('❌ Please provide a time and message! Usage: `!reminder <time> <message>`');
    return;
  }
  
  try {
    const timeString = args[0];
    const reminderMessage = args.slice(1).join(' ');
    const duration = parseTime(timeString);
    
    if (duration < 1000 || duration > 30 * 24 * 60 * 60 * 1000) { // 1 second to 30 days
      await message.reply('❌ Reminder time must be between 1 second and 30 days!');
      return;
    }
    
    const reminderId = `reminder_${++reminderCounter}`;
    const reminder: Reminder = {
      id: reminderId,
      userId: message.author.id,
      channelId: message.channel.id,
      message: reminderMessage,
      expiresAt: Date.now() + duration,
      createdAt: Date.now()
    };
    
    reminders.set(reminderId, reminder);
    scheduleReminder(reminder, message.client);
    
    const embed = new EmbedBuilder()
      .setTitle('⏰ Reminder Set')
      .setDescription(`**${reminderMessage}**`)
      .setColor(0x4CAF50)
      .addFields([
        { name: '⏱️ Time', value: formatTimeRemaining(duration), inline: true },
        { name: '🕐 Due', value: `<t:${Math.floor(reminder.expiresAt / 1000)}:R>`, inline: true },
        { name: '🆔 ID', value: reminderId, inline: true }
      ])
      .setFooter({ text: 'You\'ll be notified when the time is up!' })
      .setTimestamp();
    
    await message.reply({ embeds: [embed] });
    
  } catch (error) {
    if (error instanceof Error && error.message.includes('Invalid time format')) {
      await message.reply('❌ Invalid time format! Use: `30s`, `5m`, `2h`, `1d`, `1w`');
    } else {
      console.error('Reminder command error:', error);
      await message.reply('❌ An error occurred while setting the reminder.');
    }
  }
}

export async function executeSlash(interaction: ChatInputCommandInteraction) {
  const timeString = interaction.options.getString('time')!;
  const reminderMessage = interaction.options.getString('message')!;
  const targetUser = interaction.options.getUser('user') || interaction.user;
  
  try {
    const duration = parseTime(timeString);
    
    if (duration < 1000 || duration > 30 * 24 * 60 * 60 * 1000) { // 1 second to 30 days
      await interaction.reply({ content: '❌ Reminder time must be between 1 second and 30 days!', ephemeral: true });
      return;
    }
    
    const reminderId = `reminder_${++reminderCounter}`;
    const reminder: Reminder = {
      id: reminderId,
      userId: targetUser.id,
      channelId: interaction.channel!.id,
      message: reminderMessage,
      expiresAt: Date.now() + duration,
      createdAt: Date.now()
    };
    
    reminders.set(reminderId, reminder);
    scheduleReminder(reminder, interaction.client);
    
    const embed = new EmbedBuilder()
      .setTitle('⏰ Reminder Set')
      .setDescription(`**${reminderMessage}**`)
      .setColor(0x4CAF50)
      .addFields([
        { name: '⏱️ Time', value: formatTimeRemaining(duration), inline: true },
        { name: '🕐 Due', value: `<t:${Math.floor(reminder.expiresAt / 1000)}:R>`, inline: true },
        { name: '👤 For', value: targetUser.toString(), inline: true },
        { name: '🆔 ID', value: reminderId, inline: true }
      ])
      .setFooter({ text: 'You\'ll be notified when the time is up!' })
      .setTimestamp();
    
    await interaction.reply({ embeds: [embed] });
    
  } catch (error) {
    if (error instanceof Error && error.message.includes('Invalid time format')) {
      await interaction.reply({ content: '❌ Invalid time format! Use: `30s`, `5m`, `2h`, `1d`, `1w`', ephemeral: true });
    } else {
      console.error('Reminder slash command error:', error);
      await interaction.reply({ content: '❌ An error occurred while setting the reminder.', ephemeral: true });
    }
  }
}

// Export for potential list command
export { reminders }; 
