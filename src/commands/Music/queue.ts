// src/commands/queue.ts


import { musicSessions } from './play';

export const data = {
  name: 'queue',
  description: 'Show the current music queue',
  category: CommandCategory.MUSIC,
  usage: '!queue',
  aliases: ['q'],
  cooldown: 2
};

export const slashData = new SlashCommandBuilder()
  .setName('queue')
  .setDescription('Show the current music queue');

export async function execute(message: Message, args: string[]) {
  const guildId = message.guild!.id;
  const session = musicSessions.get(guildId);

  if (!session || session.queue.length === 0) {
    return message.reply('❌ No music is currently playing!');
  }

  const embed = new EmbedBuilder()
    .setTitle('🎵 Music Queue')
    .setColor(0x1db954);

  if (session.queue.length === 0) {
    embed.setDescription('No songs in queue');
  } else {
    const queueList = session.queue.map((track, index) => {
      const prefix = index === session.currentTrack ? '▶️' : `${index + 1}.`;
      return `${prefix} **${track.title}** - ${track.duration}`;
    }).join('\n');

    embed.setDescription(queueList);
    embed.addFields([
      { name: '📊 Queue Info', value: `${session.queue.length} songs`, inline: true },
      { name: '🎵 Now Playing', value: `${session.currentTrack + 1}/${session.queue.length}`, inline: true }
    ]);
  }

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

  const embed = new EmbedBuilder()
    .setTitle('🎵 Music Queue')
    .setColor(0x1db954);

  if (session.queue.length === 0) {
    embed.setDescription('No songs in queue');
  } else {
    const queueList = session.queue.map((track, index) => {
      const prefix = index === session.currentTrack ? '▶️' : `${index + 1}.`;
      return `${prefix} **${track.title}** - ${track.duration}`;
    }).join('\n');

    embed.setDescription(queueList);
    embed.addFields([
      { name: '📊 Queue Info', value: `${session.queue.length} songs`, inline: true },
      { name: '🎵 Now Playing', value: `${session.currentTrack + 1}/${session.queue.length}`, inline: true }
    ]);
  }

  await interaction.reply({ embeds: [embed] });
}
