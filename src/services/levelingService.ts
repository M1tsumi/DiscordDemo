import fs from 'fs';
import path from 'path';

export interface UserProfile {
  id: string;
  username: string;
  avatar: string;
  xp: number;
  level: number;
}

export interface LevelInfo {
  level: number;
  title: string;
  color: number;
}

const DATA_PATH = path.join(__dirname, '../../data/levels.json');
const LEVELS_PATH = path.join(__dirname, '../../data/levelInfo.json');

export class LevelingService {
  private profiles: Record<string, UserProfile> = {};
  private levelInfo: LevelInfo[] = [];

  constructor() {
    this.loadProfiles();
    this.loadLevelInfo();
  }

  private loadProfiles() {
    if (fs.existsSync(DATA_PATH)) {
      this.profiles = JSON.parse(fs.readFileSync(DATA_PATH, 'utf-8'));
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

  addXP(user: { id: string; username: string; avatar: string }, amount: number) {
    let profile = this.profiles[user.id];
    if (!profile) {
      profile = {
        id: user.id,
        username: user.username,
        avatar: user.avatar,
        xp: 0,
        level: 1
      };
      this.profiles[user.id] = profile;
    }
    profile.xp += amount;
    const newLevel = this.calculateLevel(profile.xp);
    if (newLevel > profile.level) {
      profile.level = newLevel;
    }
    this.saveProfiles();
    return profile;
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
}
