

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

export class CommandHandler {
  private client: Client;
  private commands: Collection<string, Command>;
  private aliases: Collection<string, string>;
  private cooldowns: Collection<string, Collection<string, number>>;
  public prefix: string;

  constructor(client: Client, prefix: string = '!') {
    this.client = client;
    this.commands = new Collection();
    this.aliases = new Collection();
    this.cooldowns = new Collection();
    this.prefix = prefix;
  }

  async loadCommands(): Promise<void> {
    // Use a more reliable path resolution that works with ES modules
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    
    // Check if we're running in production (compiled) or development
    const isProduction = __dirname.includes('dist');
    const commandsPath = isProduction 
      ? path.resolve(__dirname, '../commands')  // dist/services -> dist/commands
      : path.resolve(__dirname, '../commands'); // src/services -> src/commands
    
    // Ensure the path exists
    if (!fs.existsSync(commandsPath)) {
      console.error(`❌ Commands directory not found: ${commandsPath}`);
      console.error(`📁 Current directory: ${__dirname}`);
      console.error(`🔧 Is production: ${isProduction}`);
      return;
    }
    
    console.log(`🔍 Loading commands from: ${commandsPath} (${isProduction ? 'production' : 'development'} mode)`);
    console.log(`📁 Current directory: ${__dirname}`);
    console.log(`🔧 Is production: ${isProduction}`);
    await this.loadCommandsRecursive(commandsPath, __dirname);
    console.log(`📦 Loaded ${this.commands.size} commands total`);
  }

  private async loadCommandsRecursive(dirPath: string, baseDirname: string): Promise<void> {
    try {
      const items = fs.readdirSync(dirPath);
      
      for (const item of items) {
        const fullPath = path.join(dirPath, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
          // Recursively load commands from subdirectories
          await this.loadCommandsRecursive(fullPath, baseDirname);
        } else if (item.endsWith('.js') || item.endsWith('.ts')) {
          let relativePath: string;
          try {
            // Use the passed baseDirname instead of recalculating
            relativePath = path.relative(path.resolve(baseDirname, '../'), fullPath);
            const importPath = `../${relativePath.replace(/\\/g, '/')}`;
            const commandModule = await import(importPath);
            
            if (commandModule.data && commandModule.execute) {
              const command: Command = {
                data: commandModule.data,
                execute: commandModule.execute,
                executeSlash: commandModule.executeSlash,
                slashData: commandModule.slashData
              };

              this.commands.set(command.data.name, command);

              // Register aliases
              if (command.data.aliases) {
                for (const alias of command.data.aliases) {
                  this.aliases.set(alias, command.data.name);
                }
              }

              console.log(`✅ Loaded command: ${command.data.name} (${path.relative(path.resolve(baseDirname, '../commands'), fullPath)})`);
            } else {
              console.warn(`⚠️  Command ${item} is missing required data or execute function`);
            }
          } catch (error) {
            console.error(`❌ Failed to load command ${item}:`, error);
            console.error(`   Path: ${fullPath}`);
            console.error(`   Import path: ${relativePath ? relativePath.replace(/\\/g, '/') : 'undefined'}`);
          }
        }
      }
    } catch (error) {
      console.error(`❌ Error reading directory ${dirPath}:`, error);
    }
  }

  async handlePrefixCommand(message: Message): Promise<void> {
    if (!message.content.startsWith(this.prefix) || message.author.bot) return;

    const args = message.content.slice(this.prefix.length).trim().split(/ +/);
    const commandName = args.shift()?.toLowerCase();

    if (!commandName) return;

    const command = this.getCommand(commandName);
    if (!command) return;

    // Check cooldown
    if (this.isOnCooldown(message.author.id, commandName, command.data.cooldown || 0)) {
      const timeLeft = this.getCooldownTimeLeft(message.author.id, commandName, command.data.cooldown || 0);
      await message.reply(`⏰ Please wait ${timeLeft.toFixed(1)} more seconds before using this command again.`);
      return;
    }

    try {
      await command.execute(message, args);
      this.setCooldown(message.author.id, commandName, command.data.cooldown || 0);
    } catch (error) {
      console.error(`Error executing command ${commandName}:`, error);
      await message.reply('❌ There was an error executing this command!');
    }
  }

  async handleSlashCommand(interaction: ChatInputCommandInteraction): Promise<void> {
    const command = this.commands.get(interaction.commandName);
    if (!command || !command.executeSlash) {
      await interaction.reply({ content: 'Command not found!', ephemeral: true });
      return;
    }

    // Check cooldown
    if (this.isOnCooldown(interaction.user.id, interaction.commandName, command.data.cooldown || 0)) {
      const timeLeft = this.getCooldownTimeLeft(interaction.user.id, interaction.commandName, command.data.cooldown || 0);
      await interaction.reply({ 
        content: `⏰ Please wait ${timeLeft.toFixed(1)} more seconds before using this command again.`,
        ephemeral: true 
      });
      return;
    }

    try {
      await command.executeSlash(interaction);
      this.setCooldown(interaction.user.id, interaction.commandName, command.data.cooldown || 0);
    } catch (error) {
      console.error(`Error executing slash command ${interaction.commandName}:`, error);
      const errorMessage = '❌ There was an error executing this command!';
      
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({ content: errorMessage, ephemeral: true });
      } else {
        await interaction.reply({ content: errorMessage, ephemeral: true });
      }
    }
  }

  private getCommand(name: string): Command | undefined {
    return this.commands.get(name) || this.commands.get(this.aliases.get(name) || '');
  }

  private isOnCooldown(userId: string, commandName: string, cooldownAmount: number): boolean {
    if (cooldownAmount <= 0) return false;

    if (!this.cooldowns.has(commandName)) {
      this.cooldowns.set(commandName, new Collection());
    }

    const now = Date.now();
    const timestamps = this.cooldowns.get(commandName)!;
    const cooldownAmountMs = cooldownAmount * 1000;

    if (timestamps.has(userId)) {
      const expirationTime = timestamps.get(userId)! + cooldownAmountMs;
      return now < expirationTime;
    }

    return false;
  }

  private getCooldownTimeLeft(userId: string, commandName: string, cooldownAmount: number): number {
    const now = Date.now();
    const timestamps = this.cooldowns.get(commandName)!;
    const cooldownAmountMs = cooldownAmount * 1000;
    const expirationTime = timestamps.get(userId)! + cooldownAmountMs;
    
    return (expirationTime - now) / 1000;
  }

  private setCooldown(userId: string, commandName: string, cooldownAmount: number): void {
    if (cooldownAmount <= 0) return;

    if (!this.cooldowns.has(commandName)) {
      this.cooldowns.set(commandName, new Collection());
    }

    const timestamps = this.cooldowns.get(commandName)!;
    timestamps.set(userId, Date.now());

    setTimeout(() => timestamps.delete(userId), cooldownAmount * 1000);
  }

  getCommands(): Collection<string, Command> {
    return this.commands;
  }

  getCommandsByCategory(category: CommandCategory): Command[] {
    return Array.from(this.commands.values()).filter(cmd => cmd.data.category === category);
  }
} 
