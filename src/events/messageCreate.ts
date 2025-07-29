import { Message } from 'discord.js';
import { LevelingService } from '../services/levelingService';

const levelingService = new LevelingService();

export default async function messageCreate(message: Message) {
  if (message.author.bot) return;

  // Award XP for every message
  const profile = levelingService.addXP({
    id: message.author.id,
    username: message.author.username,
    avatar: message.author.displayAvatarURL()
  }, 10);

  // Command handling
  // General/Utility commands
  const content = message.content.trim();
  if (content === '!ping') {
    const { execute } = await import('../commands/ping');
    await execute(message);
    return;
  }
  if (content.startsWith('!userinfo')) {
    const args = content.split(' ').slice(1);
    const { execute } = await import('../commands/userinfo');
    await execute(message, args);
    return;
  }
  if (content === '!serverinfo') {
    const { execute } = await import('../commands/serverinfo');
    await execute(message);
    return;
  }
  if (content.startsWith('!avatar')) {
    const args = content.split(' ').slice(1);
    const { execute } = await import('../commands/avatar');
    await execute(message, args);
    return;
  }
  if (content === '!invite') {
    const { execute } = await import('../commands/invite');
    await execute(message);
    return;
  }
  if (content === '!help' || content === '!commands') {
    const { execute } = await import('../commands/help');
    await execute(message);
    return;
  }
  // Existing profile, leaderboard, mcjava commands
  if (content === '!profile') {
    const { execute } = await import('../commands/profile');
    await execute(message);
    return;
  }
  const leaderboardAliases = ['!leaderboard', '!top', '!lb', '!rank', '!levels'];
  if (leaderboardAliases.includes(content.toLowerCase())) {
    const { execute } = await import('../commands/leaderboard');
    await execute(message);
    return;
  }
  if (content.toLowerCase().startsWith('!mcjava')) {
    const args = content.split(' ').slice(1);
    const { execute } = await import('../commands/mcjava');
    await execute(message, args);
    return;
  }
}
