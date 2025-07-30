import { 
  Message, 
  EmbedBuilder, 
  SlashCommandBuilder, 
  ChatInputCommandInteraction,
  PermissionFlagsBits,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
  TextChannel
} from 'discord.js';
import { CommandCategory } from '../../types/Command';

import { RPGService } from '../../services/rpgService';

export const data = {
  name: 'daily',
  description: 'Claim your daily rewards and bonuses.',
  aliases: ['claim', 'rewards'],
  category: CommandCategory.RPG,
  usage: '!daily',
  cooldown: 0
};

export const slashData = new SlashCommandBuilder()
  .setName('daily')
  .setDescription('Claim your daily rewards and bonuses.');

export async function execute(message: Message, args?: string[]) {
  try {
    const rpgService = new RPGService();
    const character = rpgService.getCharacter(message.author.id);
    
    if (!character) {
      const embed = new EmbedBuilder()
        .setTitle('❌ Character Not Found!')
        .setDescription('You need to create a character first! Use `!create` to get started.')
        .setColor(0xe74c3c);
      
      await message.reply({ embeds: [embed] });
      return;
    }

    const result = rpgService.claimDaily(message.author.id);
    const embed = new EmbedBuilder()
      .setTitle(result.success ? '🎁 Daily Rewards Claimed!' : '❌ Daily Rewards Failed!')
      .setDescription(result.message)
      .setColor(result.success ? 0x2ecc71 : 0xe74c3c);
    
    if (result.success && result.rewards) {
      embed.addFields([
        { 
          name: '💰 Rewards Received', 
          value: `XP: ${result.rewards.xp}\nGold: ${result.rewards.gold}\nItems: ${result.rewards.items.length}`, 
          inline: true 
        },
        {
          name: '📦 Items Received',
          value: result.rewards.items.map((item: any) => `• ${item.name} x${item.quantity}`).join('\n'),
          inline: true
        }
      ]);
    }
    
    await message.reply({ embeds: [embed] });
    
  } catch (error) {
    console.error('Error in daily command:', error);
    await message.reply('❌ There was an error claiming your daily rewards. Please try again later.');
  }
}

export async function executeSlash(interaction: ChatInputCommandInteraction) {
  try {
    const rpgService = new RPGService();
    const character = rpgService.getCharacter(interaction.user.id);
    
    if (!character) {
      const embed = new EmbedBuilder()
        .setTitle('❌ Character Not Found!')
        .setDescription('You need to create a character first! Use `/create` to get started.')
        .setColor(0xe74c3c);
      
      await interaction.reply({ embeds: [embed], ephemeral: true });
      return;
    }

    const result = rpgService.claimDaily(interaction.user.id);
    const embed = new EmbedBuilder()
      .setTitle(result.success ? '🎁 Daily Rewards Claimed!' : '❌ Daily Rewards Failed!')
      .setDescription(result.message)
      .setColor(result.success ? 0x2ecc71 : 0xe74c3c);
    
    if (result.success && result.rewards) {
      embed.addFields([
        { 
          name: '💰 Rewards Received', 
          value: `XP: ${result.rewards.xp}\nGold: ${result.rewards.gold}\nItems: ${result.rewards.items.length}`, 
          inline: true 
        },
        {
          name: '📦 Items Received',
          value: result.rewards.items.map((item: any) => `• ${item.name} x${item.quantity}`).join('\n'),
          inline: true
        }
      ]);
    }
    
    await interaction.reply({ embeds: [embed], ephemeral: true });
    
  } catch (error) {
    console.error('Error in daily slash command:', error);
    await interaction.reply({ 
      content: '❌ There was an error claiming your daily rewards. Please try again later.',
      ephemeral: true 
    });
  }
} 

