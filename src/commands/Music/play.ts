import {
  Message,
  EmbedBuilder,
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  VoiceChannel,
  GuildMember,
  TextChannel
} from 'discord.js';

import {
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
  AudioPlayerStatus,
  VoiceConnectionStatus,
  AudioPlayer,
  VoiceConnection
} from '@discordjs/voice';

import play from 'play-dl';


// Active music sessions
const musicSessions = new Map<string, {
  queue: Array<{ title: string; url: string; duration: string; thumbnail?: string; videoId?: string; videoInfo?: any }>;
  currentTrack: number;
  player: AudioPlayer;
  connection: VoiceConnection;
  textChannel: TextChannel;
}>();

export const data = {
  name: 'play',
  description: 'Play music from YouTube',
  category: CommandCategory.MUSIC,
  usage: '!play [song name or YouTube URL]',
  aliases: ['p', 'music'],
  cooldown: 3
};

export const slashData = new SlashCommandBuilder()
  .setName('play')
  .setDescription('Play music from YouTube')
  .addStringOption(option =>
    option.setName('query')
      .setDescription('Song name or YouTube URL')
      .setRequired(true)
  );

function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remaining = seconds % 60;
  return `${minutes}:${remaining.toString().padStart(2, '0')}`;
}

function isYouTubeURL(url: string): boolean {
  return url.includes('youtube.com') || url.includes('youtu.be');
}

async function getYouTubeInfo(url: string) {
  const info = await play.video_info(url);
  const videoDetails = info.video_details;

  return {
    title: videoDetails.title || 'Unknown Title',
    duration: formatDuration(videoDetails.durationInSec || 0),
    thumbnail: videoDetails.thumbnails?.[0]?.url,
    url: videoDetails.url || url,
    videoId: videoDetails.id,
    videoInfo: info
  };
}

async function searchYouTube(query: string) {
  const results = await play.search(query, { limit: 1 });
  if (!results.length) throw new Error('No videos found');
  const video = results[0];
  const info = await play.video_info(video.url);

  return {
    title: video.title || 'Unknown Title',
    duration: formatDuration(video.durationInSec || 0),
    thumbnail: video.thumbnails?.[0]?.url,
    url: video.url,
    videoId: video.id,
    videoInfo: info
  };
}

async function playSong(guildId: string, context: Message | ChatInputCommandInteraction) {
  const session = musicSessions.get(guildId);
  if (!session || session.queue.length === 0) return;

  const track = session.queue[session.currentTrack];

  try {
    console.log(`🎵 Now playing: ${track.title}`);
    console.log(`🎵 Track URL: ${track.url}`);
    
    // Get the stream directly from the video URL
    console.log('🔄 Getting audio stream...');
    const stream = await play.stream(track.url);
    console.log('✅ Audio stream obtained');
    
    const resource = createAudioResource(stream.stream, { 
      inputType: stream.type,
      inlineVolume: true
    });
    
    // Set volume to 50%
    resource.volume?.setVolume(0.5);
    console.log('🔊 Audio resource created with volume set');
    
    session.player.play(resource);
    console.log('▶️ Audio playback started');

    const embed = new EmbedBuilder()
      .setTitle('🎵 Now Playing')
      .setDescription(`**${track.title}**`)
      .addFields([
        { name: '⏱️ Duration', value: track.duration, inline: true },
        { name: '📊 Queue Position', value: `${session.currentTrack + 1}/${session.queue.length}`, inline: true }
      ])
      .setColor(0x1db954);

    if (track.thumbnail) embed.setThumbnail(track.thumbnail);

    await session.textChannel.send({ embeds: [embed] });

  } catch (error) {
    console.error('❌ Play song error:', error);
    await session.textChannel.send(`❌ Failed to play the song: ${error instanceof Error ? error.message : 'Unknown error'}`);
    playNext(guildId, context);
  }
}

function playNext(guildId: string, context: Message | ChatInputCommandInteraction) {
  const session = musicSessions.get(guildId);
  if (!session) return;

  session.currentTrack++;

  if (session.currentTrack >= session.queue.length) {
    session.connection.destroy();
    musicSessions.delete(guildId);

    const reply = '🎵 Queue finished!';
    if (context instanceof Message) {
      if (context.channel.isTextBased() && 'send' in context.channel) {
        (context.channel as any).send(reply);
      }
    } else {
      context.followUp(reply);
    }
  } else {
    playSong(guildId, context);
  }
}

async function processQuery(query: string) {
  if (isYouTubeURL(query)) return await getYouTubeInfo(query);
  return await searchYouTube(query);
}

export async function execute(message: Message, args: string[]) {
  const query = args.join(' ');
  if (!query) return message.reply('❌ Provide a song name or YouTube URL!');

  const member = message.member as GuildMember;
  const voiceChannel = member.voice.channel as VoiceChannel;
  if (!voiceChannel) return message.reply('❌ Join a voice channel first!');

  try {
    const loadingMsg = await message.reply('🔍 Searching...');
    console.log(`🎵 Processing query: ${query}`);
    
    const trackInfo = await processQuery(query);
    console.log(`✅ Found track: ${trackInfo.title}`);
    
    const guildId = message.guild!.id;

    if (!musicSessions.has(guildId)) {
      console.log(`🎤 Creating new music session for guild: ${guildId}`);
      const player = createAudioPlayer();
      const connection = joinVoiceChannel({
        channelId: voiceChannel.id,
        guildId: message.guild!.id,
        adapterCreator: message.guild!.voiceAdapterCreator,
      });

      musicSessions.set(guildId, {
        queue: [],
        currentTrack: 0,
        player,
        connection,
        textChannel: message.channel as TextChannel
      });

      player.on(AudioPlayerStatus.Idle, () => {
        console.log('🎵 Audio player idle, playing next track');
        playNext(guildId, message);
      });
      
      player.on('error', (error) => {
        console.error('🎵 Audio player error:', error);
        if (message.channel.isTextBased() && 'send' in message.channel) {
          (message.channel as any).send('❌ Audio player error occurred');
        }
      });
      
      connection.on(VoiceConnectionStatus.Disconnected, () => {
        console.log(`🎤 Voice connection disconnected for guild: ${guildId}`);
        musicSessions.delete(guildId);
      });
      
      connection.subscribe(player);
      console.log('✅ Voice connection established and subscribed to player');
    }

    const session = musicSessions.get(guildId)!;
    session.queue.push(trackInfo);

    const embed = new EmbedBuilder()
      .setTitle('🎵 Added to Queue')
      .setDescription(`**${trackInfo.title}**`)
      .addFields([
        { name: '⏱️ Duration', value: trackInfo.duration, inline: true },
        { name: '📊 Position', value: `${session.queue.length}`, inline: true }
      ])
      .setColor(0x1db954);

    if (trackInfo.thumbnail) embed.setThumbnail(trackInfo.thumbnail);

    await loadingMsg.edit({ content: '', embeds: [embed] });

    if (session.queue.length === 1) {
      console.log('🎵 Starting playback of first track');
      await playSong(guildId, message);
    }

  } catch (err) {
    console.error('Play command error:', err);
    const msg = err instanceof Error ? err.message : 'Unknown error';
    await message.reply(`❌ Error: ${msg}`);
  }
}

export async function executeSlash(interaction: ChatInputCommandInteraction) {
  const query = interaction.options.getString('query')!;
  const member = interaction.member as GuildMember;
  const voiceChannel = member.voice.channel as VoiceChannel;

  if (!voiceChannel) {
    return interaction.reply({
      content: '❌ You must be in a voice channel!',
      ephemeral: true
    });
  }

  await interaction.deferReply();

  try {
    const trackInfo = await processQuery(query);
    const guildId = interaction.guild!.id;

    if (!musicSessions.has(guildId)) {
      const player = createAudioPlayer();
      const connection = joinVoiceChannel({
        channelId: voiceChannel.id,
        guildId: interaction.guild!.id,
        adapterCreator: interaction.guild!.voiceAdapterCreator,
      });

      musicSessions.set(guildId, {
        queue: [],
        currentTrack: 0,
        player,
        connection,
        textChannel: interaction.channel as TextChannel
      });

      player.on(AudioPlayerStatus.Idle, () => playNext(guildId, interaction));
      connection.on(VoiceConnectionStatus.Disconnected, () => musicSessions.delete(guildId));
      connection.subscribe(player);
    }

    const session = musicSessions.get(guildId)!;
    session.queue.push(trackInfo);

    const embed = new EmbedBuilder()
      .setTitle('🎵 Added to Queue')
      .setDescription(`**${trackInfo.title}**`)
      .addFields([
        { name: '⏱️ Duration', value: trackInfo.duration, inline: true },
        { name: '📊 Position', value: `${session.queue.length}`, inline: true }
      ])
      .setColor(0x1db954);

    if (trackInfo.thumbnail) embed.setThumbnail(trackInfo.thumbnail);

    await interaction.editReply({ embeds: [embed] });

    if (session.queue.length === 1) {
      await playSong(guildId, interaction);
    }

  } catch (err) {
    console.error('Play slash command error:', err);
    const msg = err instanceof Error ? err.message : 'Unknown error';
    await interaction.editReply(`❌ Error: ${msg}`);
  }
}

export { musicSessions };
