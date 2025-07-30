

import { RPGService } from '../../services/rpgService';

export const data = {
  name: 'adventure',
  description: 'Start or complete an adventure in dungeons.',
  aliases: ['dungeon', 'explore'],
  category: CommandCategory.RPG,
  usage: '!adventure [start/complete] [dungeon]',
  cooldown: 10
};

export const slashData = new SlashCommandBuilder()
  .setName('adventure')
  .setDescription('Start or complete an adventure in dungeons.')
  .addStringOption(option =>
    option.setName('action')
      .setDescription('What action to perform')
      .setRequired(true)
      .addChoices(
        { name: 'Start Adventure', value: 'start' },
        { name: 'Complete Adventure', value: 'complete' },
        { name: 'List Dungeons', value: 'list' }
      )
  )
  .addStringOption(option =>
    option.setName('dungeon')
      .setDescription('Dungeon to adventure in')
      .setRequired(false)
  );

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

    const action = args?.[0]?.toLowerCase();
    
    if (!action || action === 'list') {
      await showDungeonList(message, rpgService, character);
      return;
    }

    if (action === 'start') {
      const dungeonId = args?.[1];
      if (!dungeonId) {
        await showDungeonList(message, rpgService, character);
        return;
      }
      
      const result = rpgService.startAdventure(message.author.id, dungeonId);
      const embed = new EmbedBuilder()
        .setTitle(result.success ? '🗺️ Adventure Started!' : '❌ Adventure Failed!')
        .setDescription(result.message)
        .setColor(result.success ? 0x2ecc71 : 0xe74c3c);
      
      await message.reply({ embeds: [embed] });
      return;
    }

    if (action === 'complete') {
      const result = rpgService.completeAdventure(message.author.id);
      const embed = new EmbedBuilder()
        .setTitle(result.success ? '🎉 Adventure Completed!' : '❌ Adventure Failed!')
        .setDescription(result.message)
        .setColor(result.success ? 0x2ecc71 : 0xe74c3c);
      
      if (result.success && result.rewards) {
        embed.addFields([
          { name: '💰 Rewards', value: `XP: ${result.rewards.xp}\nGold: ${result.rewards.gold}`, inline: true }
        ]);
      }
      
      await message.reply({ embeds: [embed] });
      return;
    }

    await message.reply('❌ Invalid action! Use `start`, `complete`, or `list`.');
    
  } catch (error) {
    console.error('Error in adventure command:', error);
    await message.reply('❌ There was an error with your adventure. Please try again later.');
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

    const action = interaction.options.getString('action');
    const dungeonId = interaction.options.getString('dungeon');
    
    if (action === 'list') {
      await showDungeonListSlash(interaction, rpgService, character);
      return;
    }

    if (action === 'start') {
      if (!dungeonId) {
        await showDungeonListSlash(interaction, rpgService, character);
        return;
      }
      
      const result = rpgService.startAdventure(interaction.user.id, dungeonId);
      const embed = new EmbedBuilder()
        .setTitle(result.success ? '🗺️ Adventure Started!' : '❌ Adventure Failed!')
        .setDescription(result.message)
        .setColor(result.success ? 0x2ecc71 : 0xe74c3c);
      
      await interaction.reply({ embeds: [embed], ephemeral: true });
      return;
    }

    if (action === 'complete') {
      const result = rpgService.completeAdventure(interaction.user.id);
      const embed = new EmbedBuilder()
        .setTitle(result.success ? '🎉 Adventure Completed!' : '❌ Adventure Failed!')
        .setDescription(result.message)
        .setColor(result.success ? 0x2ecc71 : 0xe74c3c);
      
      if (result.success && result.rewards) {
        embed.addFields([
          { name: '💰 Rewards', value: `XP: ${result.rewards.xp}\nGold: ${result.rewards.gold}`, inline: true }
        ]);
      }
      
      await interaction.reply({ embeds: [embed], ephemeral: true });
      return;
    }

    await interaction.reply({ 
      content: '❌ Invalid action! Use `start`, `complete`, or `list`.',
      ephemeral: true 
    });
    
  } catch (error) {
    console.error('Error in adventure slash command:', error);
    await interaction.reply({ 
      content: '❌ There was an error with your adventure. Please try again later.',
      ephemeral: true 
    });
  }
}

async function showDungeonList(message: Message, rpgService: RPGService, character: any) {
  const dungeons = rpgService.getDungeons();
  
  const embed = new EmbedBuilder()
    .setTitle('🗺️ Available Dungeons')
    .setDescription('Choose a dungeon to start your adventure!')
    .setColor(0x5865f2)
    .setThumbnail(message.author.displayAvatarURL())
    .setTimestamp();

  Object.values(dungeons).forEach((dungeon: any) => {
    const canEnter = character.level >= dungeon.requirements.level;
    const status = canEnter ? '✅ Available' : `❌ Requires Level ${dungeon.requirements.level}`;
    
    embed.addFields([
      {
        name: `${getDifficultyEmoji(dungeon.difficulty)} ${dungeon.name}`,
        value: `${dungeon.description}\n**Level:** ${dungeon.level} | **Difficulty:** ${dungeon.difficulty}\n**Status:** ${status}`,
        inline: false
      }
    ]);
  });

  embed.addFields([
    {
      name: '📋 How to Adventure',
      value: 'Use `!adventure start <dungeon_id>` to start an adventure.\nUse `!adventure complete` to finish your current adventure.',
      inline: false
    }
  ]);

  await message.reply({ embeds: [embed] });
}

async function showDungeonListSlash(interaction: ChatInputCommandInteraction, rpgService: RPGService, character: any) {
  const dungeons = rpgService.getDungeons();
  
  const embed = new EmbedBuilder()
    .setTitle('🗺️ Available Dungeons')
    .setDescription('Choose a dungeon to start your adventure!')
    .setColor(0x5865f2)
    .setThumbnail(interaction.user.displayAvatarURL())
    .setTimestamp();

  Object.values(dungeons).forEach((dungeon: any) => {
    const canEnter = character.level >= dungeon.requirements.level;
    const status = canEnter ? '✅ Available' : `❌ Requires Level ${dungeon.requirements.level}`;
    
    embed.addFields([
      {
        name: `${getDifficultyEmoji(dungeon.difficulty)} ${dungeon.name}`,
        value: `${dungeon.description}\n**Level:** ${dungeon.level} | **Difficulty:** ${dungeon.difficulty}\n**Status:** ${status}`,
        inline: false
      }
    ]);
  });

  embed.addFields([
    {
      name: '📋 How to Adventure',
      value: 'Use `/adventure start <dungeon_id>` to start an adventure.\nUse `/adventure complete` to finish your current adventure.',
      inline: false
    }
  ]);

  await interaction.reply({ embeds: [embed], ephemeral: true });
}

function getDifficultyEmoji(difficulty: string): string {
  const emojis: Record<string, string> = {
    'easy': '🟢',
    'normal': '🟡',
    'hard': '🟠',
    'nightmare': '🔴',
    'hell': '⚫'
  };
  return emojis[difficulty] || '⚪';
} 
