import { Message, SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { CommandCategory } from '../../types/Command.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// ES module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const data = {
  name: 'daily',
  description: 'Claim your daily coins reward.',
  aliases: ['dailyreward'],
  category: CommandCategory.LEVELING,
  usage: '!daily',
  cooldown: 3
};

export const slashData = new SlashCommandBuilder()
  .setName('daily')
  .setDescription('Claim your daily coins reward.');

interface UserEconomy {
  userId: string;
  coins: number;
  lastDaily: number;
  totalEarned: number;
  dailyStreak: number;
}

const ECONOMY_PATH = path.join(__dirname, '../../data/economy.json');

class EconomyService {
  private users: Record<string, UserEconomy> = {};

  constructor() {
    this.loadData();
  }

  private loadData() {
    try {
      if (fs.existsSync(ECONOMY_PATH)) {
        const data = fs.readFileSync(ECONOMY_PATH, 'utf-8');
        this.users = JSON.parse(data);
      }
    } catch (error) {
      console.error('Error loading economy data:', error);
      this.users = {};
    }
  }

  private saveData() {
    try {
      const dataDir = path.dirname(ECONOMY_PATH);
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }
      fs.writeFileSync(ECONOMY_PATH, JSON.stringify(this.users, null, 2));
    } catch (error) {
      console.error('Error saving economy data:', error);
    }
  }

  getUser(userId: string): UserEconomy {
    if (!this.users[userId]) {
      this.users[userId] = {
        userId,
        coins: 0,
        lastDaily: 0,
        totalEarned: 0,
        dailyStreak: 0
      };
      this.saveData();
    }
    return this.users[userId];
  }

  canClaimDaily(userId: string): boolean {
    const user = this.getUser(userId);
    const now = Date.now();
    const timeDiff = now - user.lastDaily;
    const hoursElapsed = timeDiff / (1000 * 60 * 60);
    
    return hoursElapsed >= 20; // Can claim every 20 hours
  }

  claimDaily(userId: string): { success: boolean; coins?: number; streak?: number; timeLeft?: string } {
    const user = this.getUser(userId);
    const now = Date.now();
    const timeDiff = now - user.lastDaily;
    const hoursElapsed = timeDiff / (1000 * 60 * 60);

    if (hoursElapsed < 20) {
      const hoursLeft = 20 - hoursElapsed;
      const timeLeft = `${Math.floor(hoursLeft)}h ${Math.floor((hoursLeft % 1) * 60)}m`;
      return { success: false, timeLeft };
    }

    // Calculate streak
    const daysSinceLastClaim = Math.floor(hoursElapsed / 24);
    if (daysSinceLastClaim <= 1) {
      // Maintaining streak
      user.dailyStreak += 1;
    } else {
      // Reset streak
      user.dailyStreak = 1;
    }

    // Calculate reward based on streak
    let baseReward = 100;
    let streakBonus = Math.min(user.dailyStreak * 10, 200); // Max 200 bonus
    let randomBonus = Math.floor(Math.random() * 50); // 0-49 random coins
    
    const totalReward = baseReward + streakBonus + randomBonus;

    // Update user data
    user.coins += totalReward;
    user.totalEarned += totalReward;
    user.lastDaily = now;

    this.saveData();

    return { 
      success: true, 
      coins: totalReward, 
      streak: user.dailyStreak 
    };
  }

  getBalance(userId: string): number {
    return this.getUser(userId).coins;
  }
}

const economyService = new EconomyService();

export async function execute(message: Message) {
  const userId = message.author.id;
  
  if (!economyService.canClaimDaily(userId)) {
    const result = economyService.claimDaily(userId);
    return message.reply(`⏰ You've already claimed your daily reward! Try again in **${result.timeLeft}**.`);
  }

  const result = economyService.claimDaily(userId);
  
  if (!result.success) {
    return message.reply(`⏰ You've already claimed your daily reward! Try again in **${result.timeLeft}**.`);
  }

  const user = economyService.getUser(userId);
  
  const embed = new EmbedBuilder()
    .setTitle('💰 Daily Reward Claimed!')
    .setDescription(`You've received **${result.coins}** coins!`)
    .addFields([
      { name: '💎 Reward Breakdown', value: `Base: 100 💰\nStreak Bonus: ${Math.min((result.streak || 0) * 10, 200)} 💰\nRandom Bonus: ${(result.coins || 0) - 100 - Math.min((result.streak || 0) * 10, 200)} 💰`, inline: true },
      { name: '🔥 Current Streak', value: `${result.streak} day${(result.streak || 0) !== 1 ? 's' : ''}`, inline: true },
      { name: '💰 Total Balance', value: `${user.coins} coins`, inline: true }
    ])
    .setColor(0xffd700)
    .setFooter({ text: 'Come back in 20 hours for your next reward!' })
    .setThumbnail(message.author.displayAvatarURL());

  await message.reply({ embeds: [embed] });
}

export async function executeSlash(interaction: ChatInputCommandInteraction) {
  const userId = interaction.user.id;
  
  if (!economyService.canClaimDaily(userId)) {
    const result = economyService.claimDaily(userId);
    return interaction.reply({ 
      content: `⏰ You've already claimed your daily reward! Try again in **${result.timeLeft}**.`,
      ephemeral: true 
    });
  }

  const result = economyService.claimDaily(userId);
  
  if (!result.success) {
    return interaction.reply({ 
      content: `⏰ You've already claimed your daily reward! Try again in **${result.timeLeft}**.`,
      ephemeral: true 
    });
  }

  const user = economyService.getUser(userId);
  
  const embed = new EmbedBuilder()
    .setTitle('💰 Daily Reward Claimed!')
    .setDescription(`You've received **${result.coins}** coins!`)
    .addFields([
      { name: '💎 Reward Breakdown', value: `Base: 100 💰\nStreak Bonus: ${Math.min((result.streak || 0) * 10, 200)} 💰\nRandom Bonus: ${(result.coins || 0) - 100 - Math.min((result.streak || 0) * 10, 200)} 💰`, inline: true },
      { name: '🔥 Current Streak', value: `${result.streak} day${(result.streak || 0) !== 1 ? 's' : ''}`, inline: true },
      { name: '💰 Total Balance', value: `${user.coins} coins`, inline: true }
    ])
    .setColor(0xffd700)
    .setFooter({ text: 'Come back in 20 hours for your next reward!' })
    .setThumbnail(interaction.user.displayAvatarURL());

  await interaction.reply({ embeds: [embed] });
} 