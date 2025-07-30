// src/commands/skip.ts


import { musicSessions } from './play';

export const data = {
  name: 'skip',
  description: 'Skip the current song',
  category: CommandCategory.MUSIC,
  usage: '!skip',
  aliases: ['s'],
  cooldown: 2
};

export const slashData = new SlashCommandBuilder()
  .setName('skip')
  .setDescription('Skip the current song');

export async function execute(message: Message, args: string[]) {
  const guildId = message.guild!.id;
  const session = musicSessions.get(guildId);

  if (!session || session.queue.length === 0) {
    return message.reply('❌ No music is currently playing!');
  }

  const currentTrack = session.queue[session.currentTrack];
  
  // Stop the current player
  session.player.stop();

  const embed = new EmbedBuilder()
    .setTitle('⏭️ Skipped')
    .setDescription(`**${currentTrack.title}**`)
    .setColor(0x1db954);

  await message.reply({ embeds: [embed] });
}

export async function executeSlash(interaction: ChatInputCommandInteraction) {
  const guildId = interaction.guild!.id;
  const session = musicSessions.get(guildId);

  if (!session || session.queue.length === 0) {
    return interaction.reply({
      content: '❌ No music is currently playing!',
      ephemeral: true
    });
  }

  const currentTrack = session.queue[session.currentTrack];
  
  // Stop the current player
  session.player.stop();

  const embed = new EmbedBuilder()
    .setTitle('⏭️ Skipped')
    .setDescription(`**${currentTrack.title}**`)
    .setColor(0x1db954);

  await interaction.reply({ embeds: [embed] });
}
