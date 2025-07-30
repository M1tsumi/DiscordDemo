import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

export interface UserProfile {
  id: string;
  username: string;
  avatar: string;
  xp: number;
  level: number;
  voiceTime: number; // Total time spent in voice channels (in seconds)
  lastVoiceJoin: number; // Timestamp when user last joined voice
  messageCount: number; // Total messages sent
  lastMessageTime: number; // Timestamp of last message
  streakDays: number; // Consecutive days active
  lastActiveDate: number; // Last active date (for streak calculation)
}

export interface LevelInfo {
  level: number;
  title: string;
  color: number;
}

// ES module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_PATH = path.join(__dirname, '../../data/levels.json');
const LEVELS_PATH = path.join(__dirname, '../../data/levelInfo.json');

export class LevelingService {
  private profiles: Record<string, UserProfile> = {};
  private levelInfo: LevelInfo[] = [];
  private voiceStates: Map<string, { guildId: string; joinTime: number }> = new Map();

  constructor() {
    this.loadProfiles();
    this.loadLevelInfo();
  }

  private loadProfiles() {
    if (fs.existsSync(DATA_PATH)) {
      const data = JSON.parse(fs.readFileSync(DATA_PATH, 'utf-8'));
      // Migrate old profiles to new format
      this.profiles = {};
      for (const [id, profile] of Object.entries(data)) {
        if (typeof profile === 'object' && profile !== null) {
          const oldProfile = profile as any; // Type assertion for migration
          this.profiles[id] = {
            id: oldProfile.id || id,
            username: oldProfile.username || 'Unknown',
            avatar: oldProfile.avatar || '',
            xp: oldProfile.xp || 0,
            level: oldProfile.level || 1,
            voiceTime: oldProfile.voiceTime || 0,
            lastVoiceJoin: oldProfile.lastVoiceJoin || 0,
            messageCount: oldProfile.messageCount || 0,
            lastMessageTime: oldProfile.lastMessageTime || 0,
            streakDays: oldProfile.streakDays || 0,
            lastActiveDate: oldProfile.lastActiveDate || 0
          };
        }
      }
    }
  }

  private saveProfiles() {
    fs.writeFileSync(DATA_PATH, JSON.stringify(this.profiles, null, 2));
  }

  private loadLevelInfo() {
    if (fs.existsSync(LEVELS_PATH)) {
      this.levelInfo = JSON.parse(fs.readFileSync(LEVELS_PATH, 'utf-8'));
    } else {
      // Default level info
      this.levelInfo = [
        { level: 1, title: 'Novice', color: 0x95a5a6 },
        { level: 5, title: 'Apprentice', color: 0x3498db },
        { level: 10, title: 'Adept', color: 0x2ecc71 },
        { level: 20, title: 'Expert', color: 0xf1c40f },
        { level: 30, title: 'Master', color: 0xe67e22 },
        { level: 50, title: 'Legend', color: 0xe74c3c }
      ];
      fs.writeFileSync(LEVELS_PATH, JSON.stringify(this.levelInfo, null, 2));
    }
  }

  // Complex XP calculation with multiple factors
  private calculateMessageXP(user: { id: string; username: string; avatar: string }, messageLength: number): number {
    const profile = this.profiles[user.id];
    if (!profile) return 0;

    const now = Date.now();
    const timeSinceLastMessage = now - profile.lastMessageTime;
    
    // Base XP with randomness
    let baseXP = Math.floor(Math.random() * 8) + 8; // 8-15 XP base
    
    // Message length bonus (longer messages get more XP)
    const lengthBonus = Math.min(messageLength / 10, 5); // Max 5 XP for length
    baseXP += lengthBonus;
    
    // Streak bonus (consecutive days active)
    const streakBonus = Math.min(profile.streakDays * 0.5, 10); // Max 10 XP for streak
    baseXP += streakBonus;
    
    // Time-based bonus (more XP for first message of the day)
    const today = new Date().toDateString();
    const lastActiveDate = new Date(profile.lastActiveDate).toDateString();
    if (today !== lastActiveDate) {
      baseXP += 5; // Daily bonus
    }
    
    // Voice time bonus (users who spend time in voice get more XP)
    const voiceBonus = Math.min(profile.voiceTime / 3600, 5); // Max 5 XP for voice time
    baseXP += voiceBonus;
    
    // Random multiplier (0.8x to 1.3x)
    const randomMultiplier = 0.8 + (Math.random() * 0.5);
    baseXP = Math.floor(baseXP * randomMultiplier);
    
    // Cooldown system (less XP if spamming)
    if (timeSinceLastMessage < 30000) { // 30 seconds
      baseXP = Math.floor(baseXP * 0.3); // 70% reduction for spam
    } else if (timeSinceLastMessage < 60000) { // 1 minute
      baseXP = Math.floor(baseXP * 0.7); // 30% reduction
    }
    
    return Math.max(baseXP, 1); // Minimum 1 XP
  }

  // Voice channel XP calculation
  private calculateVoiceXP(userId: string, timeSpent: number): number {
    const profile = this.profiles[userId];
    if (!profile) return 0;

    // Voice XP is more consistent but lower than message XP
    let voiceXP = Math.floor(timeSpent / 60) * 2; // 2 XP per minute
    
    // Bonus for longer sessions
    if (timeSpent > 1800) { // 30 minutes
      voiceXP += Math.floor(timeSpent / 1800) * 5; // 5 bonus XP per 30 minutes
    }
    
    // Random bonus
    voiceXP += Math.floor(Math.random() * 3);
    
    return voiceXP;
  }

  addMessageXP(user: { id: string; username: string; avatar: string }, messageLength: number) {
    let profile = this.profiles[user.id];
    if (!profile) {
      profile = {
        id: user.id,
        username: user.username,
        avatar: user.avatar,
        xp: 0,
        level: 1,
        voiceTime: 0,
        lastVoiceJoin: 0,
        messageCount: 0,
        lastMessageTime: 0,
        streakDays: 0,
        lastActiveDate: 0
      };
      this.profiles[user.id] = profile;
    }

    const xpGained = this.calculateMessageXP(user, messageLength);
    profile.xp += xpGained;
    profile.messageCount++;
    profile.lastMessageTime = Date.now();

    // Update streak
    const today = new Date().toDateString();
    const lastActiveDate = new Date(profile.lastActiveDate).toDateString();
    if (today !== lastActiveDate) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayString = yesterday.toDateString();
      
      if (lastActiveDate === yesterdayString) {
        profile.streakDays++;
      } else if (today !== lastActiveDate) {
        profile.streakDays = 1; // Reset streak
      }
      profile.lastActiveDate = Date.now();
    }

    const newLevel = this.calculateLevel(profile.xp);
    if (newLevel > profile.level) {
      profile.level = newLevel;
    }
    
    this.saveProfiles();
    return { profile, xpGained };
  }

  // Track voice channel joins
  trackVoiceJoin(userId: string, guildId: string) {
    this.voiceStates.set(userId, { guildId, joinTime: Date.now() });
    
    let profile = this.profiles[userId];
    if (profile) {
      profile.lastVoiceJoin = Date.now();
      this.saveProfiles();
    }
  }

  // Track voice channel leaves and award XP
  trackVoiceLeave(userId: string): { profile: UserProfile | null; xpGained: number } {
    const voiceState = this.voiceStates.get(userId);
    if (!voiceState) return { profile: null, xpGained: 0 };

    const timeSpent = Date.now() - voiceState.joinTime;
    const profile = this.profiles[userId];
    
    if (profile && timeSpent > 30000) { // Only award XP for sessions longer than 30 seconds
      const xpGained = this.calculateVoiceXP(userId, timeSpent);
      profile.xp += xpGained;
      profile.voiceTime += timeSpent / 1000; // Convert to seconds
      
      const newLevel = this.calculateLevel(profile.xp);
      if (newLevel > profile.level) {
        profile.level = newLevel;
      }
      
      this.saveProfiles();
      this.voiceStates.delete(userId);
      return { profile, xpGained };
    }
    
    this.voiceStates.delete(userId);
    return { profile: null, xpGained: 0 };
  }

  // Periodic voice XP update (call this every 5 minutes)
  updateVoiceXP() {
    const now = Date.now();
    for (const [userId, voiceState] of this.voiceStates.entries()) {
      const timeSpent = now - voiceState.joinTime;
      if (timeSpent > 300000) { // 5 minutes
        const profile = this.profiles[userId];
        if (profile) {
          const xpGained = this.calculateVoiceXP(userId, 300000); // 5 minutes worth
          profile.xp += xpGained;
          profile.voiceTime += 300; // 5 minutes in seconds
          
          const newLevel = this.calculateLevel(profile.xp);
          if (newLevel > profile.level) {
            profile.level = newLevel;
          }
          
          voiceState.joinTime = now; // Reset timer
        }
      }
    }
    this.saveProfiles();
  }

  getProfile(userId: string) {
    return this.profiles[userId] || null;
  }

  getLevelInfo(level: number): LevelInfo {
    let info = this.levelInfo[0];
    for (const lvl of this.levelInfo) {
      if (level >= lvl.level) info = lvl;
    }
    return info;
  }

  getTopProfiles(limit: number = 10) {
    return Object.values(this.profiles)
      .sort((a, b) => b.level === a.level ? b.xp - a.xp : b.level - a.level)
      .slice(0, limit);
  }

  private calculateLevel(xp: number) {
    return Math.floor(0.1 * Math.sqrt(xp)) + 1;
  }

  // Get voice state for a user
  getVoiceState(userId: string) {
    return this.voiceStates.get(userId);
  }

  // Get all voice states
  getAllVoiceStates() {
    return this.voiceStates;
  }
}
