import { Message, EmbedBuilder, SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { CommandCategory } from '../../types/Command';
import { RPGService } from '../../services/rpgService';

export const data = {
  name: 'leaderboard-rpg',
  description: 'View the top RPG players in the server.',
  aliases: ['top', 'rankings', 'lb', 'leaderboard'],
  category: CommandCategory.RPG,
  usage: '!leaderboard-rpg',
  cooldown: 10
};

export const slashData = new SlashCommandBuilder()
  .setName('leaderboard-rpg')
  .setDescription('View the top RPG players in the server.');

export async function execute(message: Message, args?: string[]) {
  try {
    const rpgService = new RPGService();
    const topCharacters = rpgService.getTopCharacters(10);
    
    if (topCharacters.length === 0) {
      const embed = new EmbedBuilder()
        .setTitle('📊 RPG Leaderboard')
        .setDescription('No characters found! Be the first to create one with `!create`!')
        .setColor(0x5865f2)
        .setTimestamp();
      
      await message.reply({ embeds: [embed] });
      return;
    }

    const embed = new EmbedBuilder()
      .setTitle('🏆 RPG Leaderboard')
      .setDescription('Top adventurers in the realm')
      .setColor(0xf1c40f)
      .setThumbnail(message.client.user?.displayAvatarURL())
      .setTimestamp()
      .setFooter({ 
        text: `Requested by ${message.author.tag}`,
        iconURL: message.author.displayAvatarURL()
      });

    const classEmojis: Record<string, string> = {
      'Warrior': '⚔️',
      'Mage': '🔮',
      'Archer': '🏹',
      'Priest': '⛪'
    };

    let leaderboardText = '';
    topCharacters.forEach((character: any, index: number) => {
      const rank = index + 1;
      const medal = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : `${rank}.`;
      const emoji = classEmojis[character.class] || '🎭';
      
      leaderboardText += `${medal} **${character.username}** ${emoji}\n`;
      leaderboardText += `   Level ${character.level} • ${character.xp} XP • ${character.gold} Gold\n`;
      leaderboardText += `   Class: ${character.class}\n\n`;
    });

    embed.addFields([
      {
        name: '🏅 Top Adventurers',
        value: leaderboardText,
        inline: false
      }
    ]);

    await message.reply({ embeds: [embed] });
    
  } catch (error) {
    console.error('Error in leaderboard command:', error);
    await message.reply('❌ There was an error loading the leaderboard. Please try again later.');
  }
}

export async function executeSlash(interaction: ChatInputCommandInteraction) {
  try {
    const rpgService = new RPGService();
    const topCharacters = rpgService.getTopCharacters(10);
    
    if (topCharacters.length === 0) {
      const embed = new EmbedBuilder()
        .setTitle('📊 RPG Leaderboard')
        .setDescription('No characters found! Be the first to create one with `/create`!')
        .setColor(0x5865f2)
        .setTimestamp();
      
      await interaction.reply({ embeds: [embed], ephemeral: true });
      return;
    }

    const embed = new EmbedBuilder()
      .setTitle('🏆 RPG Leaderboard')
      .setDescription('Top adventurers in the realm')
      .setColor(0xf1c40f)
      .setThumbnail(interaction.client.user?.displayAvatarURL())
      .setTimestamp()
      .setFooter({ 
        text: `Requested by ${interaction.user.tag}`,
        iconURL: interaction.user.displayAvatarURL()
      });

    const classEmojis: Record<string, string> = {
      'Warrior': '⚔️',
      'Mage': '🔮',
      'Archer': '🏹',
      'Priest': '⛪'
    };

    let leaderboardText = '';
    topCharacters.forEach((character: any, index: number) => {
      const rank = index + 1;
      const medal = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : `${rank}.`;
      const emoji = classEmojis[character.class] || '🎭';
      
      leaderboardText += `${medal} **${character.username}** ${emoji}\n`;
      leaderboardText += `   Level ${character.level} • ${character.xp} XP • ${character.gold} Gold\n`;
      leaderboardText += `   Class: ${character.class}\n\n`;
    });

    embed.addFields([
      {
        name: '🏅 Top Adventurers',
        value: leaderboardText,
        inline: false
      }
    ]);

    await interaction.reply({ embeds: [embed] });
    
  } catch (error) {
    console.error('Error in leaderboard slash command:', error);
    await interaction.reply({ 
      content: '❌ There was an error loading the leaderboard. Please try again later.',
      ephemeral: true 
    });
  }
} 