


export const data = {
  name: 'mute',
  description: 'Mute a user in the server.',
  aliases: [],
  category: CommandCategory.MODERATION,
  usage: '!mute <user> [duration_minutes]',
  cooldown: 5,
  permissions: ['ModerateMembers']
};

export async function execute(message: Message, args: string[]) {
  if (!message.member?.permissions.has('ModerateMembers')) return message.reply('You do not have permission to use this command.');
  const user = message.mentions.members?.first();
  if (!user) return message.reply('Please mention a user to mute.');
  const duration = args[1] ? parseInt(args[1]) * 60 * 1000 : 10 * 60 * 1000; // default 10 min
  await user.timeout(duration);
  await message.reply(`Muted ${user.user.tag} for ${duration / 60000} minutes.`);
}
