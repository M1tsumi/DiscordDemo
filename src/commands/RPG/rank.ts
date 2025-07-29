import { Message, EmbedBuilder, SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { CommandCategory } from '../../types/Command';
import { RPGService } from '../../services/rpgService';

export const data = {
  name: 'rank-rpg',
  description: 'View your RPG rank and the top players in the server.',
  aliases: ['rank', 'top', 'rankings', 'lb'],
  category: CommandCategory.RPG,
  usage: '!rank-rpg',
  cooldown: 10
};

export const slashData = new SlashCommandBuilder()
  .setName('rank-rpg')
  .setDescription('View your RPG rank and the top players in the server.');

export async function execute(message: Message, args?: string[]) {
  try {
    const rpgService = new RPGService();
    const topCharacters = rpgService.getTopCharacters(10);
    
    if (topCharacters.length === 0) {
      const embed = new EmbedBuilder()
        .setTitle('📊 RPG Rankings')
        .setDescription('No characters found! Be the first to create one with `!create`!')
        .setColor(0x5865f2)
        .setTimestamp();
      
      await message.reply({ embeds: [embed] });
      return;
    }

    // Find user's rank
    const userRank = topCharacters.findIndex(character => character.id === message.author.id) + 1;
    const userCharacter = rpgService.getCharacter(message.author.id);

    const embed = new EmbedBuilder()
      .setTitle('🏆 RPG Rankings')
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
      const isCurrentUser = character.id === message.author.id;
      
      leaderboardText += `${medal} **${character.username}** ${emoji}${isCurrentUser ? ' **← YOU**' : ''}\n`;
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

    // Add user's rank if they're not in top 10
    if (userRank === 0 && userCharacter) {
      const classEmoji = classEmojis[userCharacter.class] || '🎭';
      embed.addFields([
        {
          name: '📊 Your Rank',
          value: `You are not in the top 10 players.\n${classEmoji} **${userCharacter.username}**\nLevel: ${userCharacter.level} • XP: ${userCharacter.xp} • Gold: ${userCharacter.gold}\nClass: ${userCharacter.class}`,
          inline: false
        }
      ]);
    }

    await message.reply({ embeds: [embed] });
    
  } catch (error) {
    console.error('Error in rank command:', error);
    await message.reply('❌ There was an error loading the rankings. Please try again later.');
  }
}

export async function executeSlash(interaction: ChatInputCommandInteraction) {
  try {
    const rpgService = new RPGService();
    const topCharacters = rpgService.getTopCharacters(10);
    
    if (topCharacters.length === 0) {
      const embed = new EmbedBuilder()
        .setTitle('📊 RPG Rankings')
        .setDescription('No characters found! Be the first to create one with `/create`!')
        .setColor(0x5865f2)
        .setTimestamp();
      
      await interaction.reply({ embeds: [embed], ephemeral: true });
      return;
    }

    // Find user's rank
    const userRank = topCharacters.findIndex(character => character.id === interaction.user.id) + 1;
    const userCharacter = rpgService.getCharacter(interaction.user.id);

    const embed = new EmbedBuilder()
      .setTitle('🏆 RPG Rankings')
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
      const isCurrentUser = character.id === interaction.user.id;
      
      leaderboardText += `${medal} **${character.username}** ${emoji}${isCurrentUser ? ' **← YOU**' : ''}\n`;
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

    // Add user's rank if they're not in top 10
    if (userRank === 0 && userCharacter) {
      const classEmoji = classEmojis[userCharacter.class] || '🎭';
      embed.addFields([
        {
          name: '📊 Your Rank',
          value: `You are not in the top 10 players.\n${classEmoji} **${userCharacter.username}**\nLevel: ${userCharacter.level} • XP: ${userCharacter.xp} • Gold: ${userCharacter.gold}\nClass: ${userCharacter.class}`,
          inline: false
        }
      ]);
    }

    await interaction.reply({ embeds: [embed] });
    
  } catch (error) {
    console.error('Error in rank slash command:', error);
    await interaction.reply({ 
      content: '❌ There was an error loading the rankings. Please try again later.',
      ephemeral: true 
    });
  }
} 