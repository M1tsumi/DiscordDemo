import { Message, EmbedBuilder, SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { CommandCategory } from '../../types/Command';

export const data = {
  name: 'timer',
  description: 'Set a countdown timer',
  category: CommandCategory.UTILITY,
  usage: '!timer <time> [message]',
  aliases: ['countdown', 'alarm'],
  cooldown: 5
};

export const slashData = new SlashCommandBuilder()
  .setName('timer')
  .setDescription('Set a countdown timer')
  .addStringOption(option =>
    option.setName('time')
      .setDescription('Time for countdown (e.g., 5m, 1h, 30s)')
      .setRequired(true)
  )
  .addStringOption(option =>
    option.setName('message')
      .setDescription('Message to display when timer ends')
      .setRequired(false)
  );

const timers = new Map<string, { timeout: NodeJS.Timeout; message: string; endTime: number }>();

function parseTime(timeString: string): number {
  const match = timeString.toLowerCase().match(/^(\d+)(s|m|h|d)$/);
  if (!match) throw new Error('Invalid time format');
  
  const value = parseInt(match[1]);
  const unit = match[2];
  const multipliers = { 's': 1000, 'm': 60000, 'h': 3600000, 'd': 86400000 };
  
  return value * multipliers[unit as keyof typeof multipliers];
}

function formatTimeRemaining(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (days > 0) return `${days}d ${hours % 24}h ${minutes % 60}m`;
  if (hours > 0) return `${hours}h ${minutes % 60}m`;
  if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
  return `${seconds}s`;
}

export async function execute(message: Message, args?: string[]) {
  if (!args || args.length === 0) {
    await message.reply('❌ Please provide a time! Usage: `!timer <time> [message]`');
    return;
  }
  
  try {
    const timeString = args[0];
    const timerMessage = args.slice(1).join(' ') || '⏰ Timer finished!';
    const duration = parseTime(timeString);
    
    if (duration < 1000 || duration > 86400000) { // 1 second to 24 hours
      await message.reply('❌ Timer must be between 1 second and 24 hours!');
      return;
    }
    
    const timerId = `timer_${message.author.id}_${Date.now()}`;
    const endTime = Date.now() + duration;
    
    const timeout = setTimeout(() => {
      timers.delete(timerId);
      if ('send' in message.channel) {
        message.channel.send(`⏰ **${timerMessage}**\nTimer set by ${message.author.toString()}`);
      }
    }, duration);
    
    timers.set(timerId, { timeout, message: timerMessage, endTime });
    
    const embed = new EmbedBuilder()
      .setTitle('⏰ Timer Set')
      .setDescription(`**${timerMessage}**`)
      .setColor(0x4CAF50)
      .addFields([
        { name: '⏱️ Duration', value: formatTimeRemaining(duration), inline: true },
        { name: '🕐 Ends At', value: `<t:${Math.floor(endTime / 1000)}:R>`, inline: true },
        { name: '🆔 Timer ID', value: timerId, inline: true }
      ])
      .setFooter({ text: 'You\'ll be notified when the timer ends!' })
      .setTimestamp();
    
    await message.reply({ embeds: [embed] });
    
  } catch (error) {
    await message.reply('❌ Invalid time format! Use: `30s`, `5m`, `2h`, `1d`');
  }
}

export async function executeSlash(interaction: ChatInputCommandInteraction) {
  const timeString = interaction.options.getString('time')!;
  const timerMessage = interaction.options.getString('message') || '⏰ Timer finished!';
  
  try {
    const duration = parseTime(timeString);
    
    if (duration < 1000 || duration > 86400000) {
      await interaction.reply({ content: '❌ Timer must be between 1 second and 24 hours!', ephemeral: true });
      return;
    }
    
    const timerId = `timer_${interaction.user.id}_${Date.now()}`;
    const endTime = Date.now() + duration;
    
    const timeout = setTimeout(() => {
      timers.delete(timerId);
      if (interaction.channel && 'send' in interaction.channel) {
        interaction.channel.send(`⏰ **${timerMessage}**\nTimer set by ${interaction.user.toString()}`);
      }
    }, duration);
    
    timers.set(timerId, { timeout, message: timerMessage, endTime });
    
    const embed = new EmbedBuilder()
      .setTitle('⏰ Timer Set')
      .setDescription(`**${timerMessage}**`)
      .setColor(0x4CAF50)
      .addFields([
        { name: '⏱️ Duration', value: formatTimeRemaining(duration), inline: true },
        { name: '🕐 Ends At', value: `<t:${Math.floor(endTime / 1000)}:R>`, inline: true },
        { name: '🆔 Timer ID', value: timerId, inline: true }
      ])
      .setFooter({ text: 'You\'ll be notified when the timer ends!' })
      .setTimestamp();
    
    await interaction.reply({ embeds: [embed] });
    
  } catch (error) {
    await interaction.reply({ content: '❌ Invalid time format! Use: `30s`, `5m`, `2h`, `1d`', ephemeral: true });
  }
}

export { timers }; 