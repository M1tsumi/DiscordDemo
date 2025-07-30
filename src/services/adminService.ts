import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// ES module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export interface AdminSettings {
  guildId: string;
  adminRoles: string[]; // Role IDs that have admin permissions
  allowedCommands: {
    [roleId: string]: string[]; // Commands each role can use
  };
  globalAdminCommands: string[]; // Commands all admin roles can use
  ownerOnlyCommands: string[]; // Commands only server owner can use
  moderationChannels: string[]; // Channels where moderation commands work
  logChannel?: string; // Channel for moderation logs
}

const ADMIN_PATH = path.join(__dirname, '../../data/adminSettings.json');

export class AdminService {
  private settings: Record<string, AdminSettings> = {};

  // Default moderation commands
  private readonly defaultModerationCommands = [
    'ban', 'kick', 'mute', 'unmute', 'warn', 'purge'
  ];

  private readonly ownerOnlyCommands = [
    'adminset', 'roleadd', 'roleremove', 'setlogchannel'
  ];

  constructor() {
    this.loadSettings();
  }

  private loadSettings() {
    try {
      if (fs.existsSync(ADMIN_PATH)) {
        const data = fs.readFileSync(ADMIN_PATH, 'utf-8');
        this.settings = JSON.parse(data);
      }
    } catch (error) {
      console.error('Error loading admin settings:', error);
      this.settings = {};
    }
  }

  private saveSettings() {
    try {
      const dataDir = path.dirname(ADMIN_PATH);
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }
      fs.writeFileSync(ADMIN_PATH, JSON.stringify(this.settings, null, 2));
    } catch (error) {
      console.error('Error saving admin settings:', error);
    }
  }

  getSettings(guildId: string): AdminSettings {
    if (!this.settings[guildId]) {
      this.settings[guildId] = {
        guildId,
        adminRoles: [],
        allowedCommands: {},
        globalAdminCommands: [...this.defaultModerationCommands],
        ownerOnlyCommands: [...this.ownerOnlyCommands],
        moderationChannels: []
      };
      this.saveSettings();
    }
    return this.settings[guildId];
  }

  // Check if user can use a specific command
  canUseCommand(guildId: string, userId: string, userRoles: string[], command: string, isOwner: boolean = false): boolean {
    const settings = this.getSettings(guildId);

    // Server owner can use all commands
    if (isOwner) return true;

    // Check if command is owner-only
    if (settings.ownerOnlyCommands.includes(command)) {
      return false;
    }

    // Check if command is in global admin commands
    if (settings.globalAdminCommands.includes(command)) {
      // User needs at least one admin role
      return userRoles.some(roleId => settings.adminRoles.includes(roleId));
    }

    // Check role-specific permissions
    for (const roleId of userRoles) {
      if (settings.adminRoles.includes(roleId)) {
        const roleCommands = settings.allowedCommands[roleId] || [];
        if (roleCommands.includes(command)) {
          return true;
        }
      }
    }

    return false;
  }

  // Add an admin role
  addAdminRole(guildId: string, roleId: string): boolean {
    const settings = this.getSettings(guildId);
    if (!settings.adminRoles.includes(roleId)) {
      settings.adminRoles.push(roleId);
      // Initialize with default commands
      settings.allowedCommands[roleId] = [...this.defaultModerationCommands];
      this.saveSettings();
      return true;
    }
    return false;
  }

  // Remove an admin role
  removeAdminRole(guildId: string, roleId: string): boolean {
    const settings = this.getSettings(guildId);
    const index = settings.adminRoles.indexOf(roleId);
    if (index > -1) {
      settings.adminRoles.splice(index, 1);
      delete settings.allowedCommands[roleId];
      this.saveSettings();
      return true;
    }
    return false;
  }

  // Update commands for a specific role
  updateRoleCommands(guildId: string, roleId: string, commands: string[]): boolean {
    const settings = this.getSettings(guildId);
    if (settings.adminRoles.includes(roleId)) {
      settings.allowedCommands[roleId] = commands;
      this.saveSettings();
      return true;
    }
    return false;
  }

  // Update global admin commands
  updateGlobalCommands(guildId: string, commands: string[]): void {
    const settings = this.getSettings(guildId);
    settings.globalAdminCommands = commands;
    this.saveSettings();
  }

  // Add command to role
  addCommandToRole(guildId: string, roleId: string, command: string): boolean {
    const settings = this.getSettings(guildId);
    if (settings.adminRoles.includes(roleId)) {
      if (!settings.allowedCommands[roleId]) {
        settings.allowedCommands[roleId] = [];
      }
      if (!settings.allowedCommands[roleId].includes(command)) {
        settings.allowedCommands[roleId].push(command);
        this.saveSettings();
        return true;
      }
    }
    return false;
  }

  // Remove command from role
  removeCommandFromRole(guildId: string, roleId: string, command: string): boolean {
    const settings = this.getSettings(guildId);
    if (settings.adminRoles.includes(roleId)) {
      const commands = settings.allowedCommands[roleId] || [];
      const index = commands.indexOf(command);
      if (index > -1) {
        commands.splice(index, 1);
        this.saveSettings();
        return true;
      }
    }
    return false;
  }

  // Get all available moderation commands
  getAllModerationCommands(): string[] {
    return [...this.defaultModerationCommands, ...this.ownerOnlyCommands];
  }

  // Set moderation log channel
  setLogChannel(guildId: string, channelId: string): void {
    const settings = this.getSettings(guildId);
    settings.logChannel = channelId;
    this.saveSettings();
  }

  // Add moderation channel
  addModerationChannel(guildId: string, channelId: string): boolean {
    const settings = this.getSettings(guildId);
    if (!settings.moderationChannels.includes(channelId)) {
      settings.moderationChannels.push(channelId);
      this.saveSettings();
      return true;
    }
    return false;
  }

  // Remove moderation channel
  removeModerationChannel(guildId: string, channelId: string): boolean {
    const settings = this.getSettings(guildId);
    const index = settings.moderationChannels.indexOf(channelId);
    if (index > -1) {
      settings.moderationChannels.splice(index, 1);
      this.saveSettings();
      return true;
    }
    return false;
  }

  // Check if channel is allowed for moderation
  isChannelAllowed(guildId: string, channelId: string): boolean {
    const settings = this.getSettings(guildId);
    // If no channels specified, allow all channels
    return settings.moderationChannels.length === 0 || settings.moderationChannels.includes(channelId);
  }
} 