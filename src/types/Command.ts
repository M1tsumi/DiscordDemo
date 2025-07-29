import { Message, SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';

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