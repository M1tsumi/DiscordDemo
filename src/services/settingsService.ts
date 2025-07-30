import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

export interface ServerSettings {
  guildId: string;
  prefix: string;
  enableLeveling: boolean;
  enableRPG: boolean;
  enableMusic: boolean;
  enableModeration: boolean;
  welcomeMessage: string;
  autoRole: string | null;
  logChannel: string | null;
  modRole: string | null;
  adminRole: string | null;
  enableWelcome: boolean;
  enableGoodbye: boolean;
}

// ES module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SETTINGS_PATH = path.join(__dirname, '../../data/serverSettings.json');

export class SettingsService {
  private settings: Record<string, ServerSettings> = {};

  constructor() {
    this.loadSettings();
  }

  private loadSettings() {
    try {
      if (fs.existsSync(SETTINGS_PATH)) {
        const data = fs.readFileSync(SETTINGS_PATH, 'utf-8');
        this.settings = JSON.parse(data);
      }
    } catch (error) {
      console.error('Error loading server settings:', error);
      this.settings = {};
    }
  }

  private saveSettings() {
    try {
      // Ensure data directory exists
      const dataDir = path.dirname(SETTINGS_PATH);
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }
      
      fs.writeFileSync(SETTINGS_PATH, JSON.stringify(this.settings, null, 2));
    } catch (error) {
      console.error('Error saving server settings:', error);
    }
  }

  getSettings(guildId: string): ServerSettings {
    if (!this.settings[guildId]) {
      this.settings[guildId] = {
        guildId,
        prefix: '!',
        enableLeveling: true,
        enableRPG: true,
        enableMusic: true,
        enableModeration: true,
        welcomeMessage: 'Welcome to the server!',
        autoRole: null,
        logChannel: null,
        modRole: null,
        adminRole: null,
        enableWelcome: false,
        enableGoodbye: false
      };
      this.saveSettings();
    }
    return this.settings[guildId];
  }

  updateSettings(guildId: string, updates: Partial<ServerSettings>): ServerSettings {
    const currentSettings = this.getSettings(guildId);
    this.settings[guildId] = { ...currentSettings, ...updates };
    this.saveSettings();
    return this.settings[guildId];
  }

  getPrefix(guildId: string): string {
    return this.getSettings(guildId).prefix;
  }

  setPrefix(guildId: string, prefix: string): boolean {
    // Validate prefix
    if (!prefix || prefix.length > 5 || prefix.includes(' ')) {
      return false;
    }

    this.updateSettings(guildId, { prefix });
    return true;
  }

  resetSettings(guildId: string): ServerSettings {
    delete this.settings[guildId];
    this.saveSettings();
    return this.getSettings(guildId); // This will create default settings
  }

  getAllSettings(): Record<string, ServerSettings> {
    return { ...this.settings };
  }
} 