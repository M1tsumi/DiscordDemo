// src/services/musicService.ts
import { AudioPlayer, VoiceConnection } from '@discordjs/voice';

export interface MusicSession {
  queue: Array<{ title: string; url: string; duration: string }>;
  currentTrack: number;
  player: AudioPlayer;
  connection: VoiceConnection;
}

export const musicSessions = new Map<string, MusicSession>();

export function getMusicSession(guildId: string): MusicSession | undefined {
  return musicSessions.get(guildId);
}

export function setMusicSession(guildId: string, session: MusicSession): void {
  musicSessions.set(guildId, session);
}

export function deleteMusicSession(guildId: string): void {
  musicSessions.delete(guildId);
}
