import { Message, ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';

export interface Command {
  data: {
    name: string;
    description: string;
    aliases?: string[];
    category: CommandCategory;
    usage?: string;
    permissions?: string[];
    cooldown?: number;
  };
  execute: (message: Message, args?: string[]) => Promise<void>;
  executeSlash?: (interaction: ChatInputCommandInteraction) => Promise<void>;
  slashData?: SlashCommandBuilder;
}

export enum CommandCategory {
  UTILITY = 'Utility',
  FUN = 'Fun',
  MODERATION = 'Moderation',
  GAMES = 'Games',
  INFORMATION = 'Information',
  GENERAL = 'General',
  LEVELING = 'Leveling',
  MUSIC = 'Music',
  RPG = 'RPG'
}

// Export a Command class for runtime use
export class CommandClass {
  data: {
    name: string;
    description: string;
    aliases?: string[];
    category: CommandCategory;
    usage?: string;
    permissions?: string[];
    cooldown?: number;
  };
  execute: (message: Message, args?: string[]) => Promise<void>;
  executeSlash?: (interaction: ChatInputCommandInteraction) => Promise<void>;
  slashData?: SlashCommandBuilder;

  constructor(data: Command['data'], execute: Command['execute'], executeSlash?: Command['executeSlash'], slashData?: SlashCommandBuilder) {
    this.data = data;
    this.execute = execute;
    this.executeSlash = executeSlash;
    this.slashData = slashData;
  }
} 
