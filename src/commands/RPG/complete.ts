

import { RPGService } from '../../services/rpgService';

export const data = {
  name: 'complete',
  description: 'Complete your ongoing activities like training, adventures, or rest.',
  aliases: ['finish', 'done'],
  category: CommandCategory.RPG,
  usage: '!complete [activity]',
  cooldown: 5
};

export const slashData = new SlashCommandBuilder()
  .setName('complete')
  .setDescription('Complete your ongoing activities like training, adventures, or rest.')
  .addStringOption(option =>
    option.setName('activity')
      .setDescription('Which activity to complete')
      .setRequired(false)
      .addChoices(
        { name: 'Training', value: 'training' },
        { name: 'Adventure', value: 'adventure' },
        { name: 'Rest', value: 'rest' }
      )
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

    const activity = args?.[0]?.toLowerCase();
    
    if (!activity) {
      await showCompletionOptions(message, character);
      return;
    }

    let result;
    let activityName = '';
    
    switch (activity) {
      case 'training':
      case 'train':
        result = rpgService.completeTraining(message.author.id, 'strength'); // Default stat, will be overridden
        activityName = 'Training';
        break;
      case 'adventure':
      case 'adventuring':
        result = rpgService.completeAdventure(message.author.id);
        activityName = 'Adventure';
        break;
      case 'rest':
      case 'resting':
        result = rpgService.completeRest(message.author.id);
        activityName = 'Rest';
        break;
      default:
        await message.reply('❌ Invalid activity! Choose from: training, adventure, rest');
        return;
    }

    const embed = new EmbedBuilder()
      .setTitle(result.success ? `✅ ${activityName} Completed!` : `❌ ${activityName} Failed!`)
      .setDescription(result.message)
      .setColor(result.success ? 0x2ecc71 : 0xe74c3c);
    
    await message.reply({ embeds: [embed] });
    
  } catch (error) {
    console.error('Error in complete command:', error);
    await message.reply('❌ There was an error completing your activity. Please try again later.');
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

    const activity = interaction.options.getString('activity');
    
    if (!activity) {
      await showCompletionOptionsSlash(interaction, character);
      return;
    }

    let result;
    let activityName = '';
    
    switch (activity) {
      case 'training':
        result = rpgService.completeTraining(interaction.user.id, 'strength'); // Default stat, will be overridden
        activityName = 'Training';
        break;
      case 'adventure':
        result = rpgService.completeAdventure(interaction.user.id);
        activityName = 'Adventure';
        break;
      case 'rest':
        result = rpgService.completeRest(interaction.user.id);
        activityName = 'Rest';
        break;
      default:
        await interaction.reply({ 
          content: '❌ Invalid activity! Choose from: training, adventure, rest',
          ephemeral: true 
        });
        return;
    }

    const embed = new EmbedBuilder()
      .setTitle(result.success ? `✅ ${activityName} Completed!` : `❌ ${activityName} Failed!`)
      .setDescription(result.message)
      .setColor(result.success ? 0x2ecc71 : 0xe74c3c);
    
    await interaction.reply({ embeds: [embed], ephemeral: true });
    
  } catch (error) {
    console.error('Error in complete slash command:', error);
    await interaction.reply({ 
      content: '❌ There was an error completing your activity. Please try again later.',
      ephemeral: true 
    });
  }
}

async function showCompletionOptions(message: Message, character: any) {
  const statusEmojis: Record<string, string> = {
    'idle': '😴',
    'adventuring': '🗺️',
    'training': '💪',
    'resting': '😴',
    'questing': '📜'
  };

  const embed = new EmbedBuilder()
    .setTitle('✅ Activity Completion')
    .setDescription(
      `Your current status: ${statusEmojis[character.status]} ${character.status.charAt(0).toUpperCase() + character.status.slice(1)}\n\n` +
      `**Available Activities to Complete:**\n` +
      `• \`!complete training\` - Complete your training session\n` +
      `• \`!complete adventure\` - Complete your adventure\n` +
      `• \`!complete rest\` - Complete your rest period\n\n` +
      `**Current Status:**\n` +
      `• HP: ${character.hp}/${character.maxHp}\n` +
      `• Mana: ${character.mana}/${character.maxMana}\n` +
      `• Stamina: ${character.stamina}/${character.maxStamina}`
    )
    .setColor(0x5865f2)
    .setThumbnail(message.author.displayAvatarURL())
    .setTimestamp();

  if (character.status !== 'idle' && character.statusEndTime > Date.now()) {
    const timeLeft = Math.ceil((character.statusEndTime - Date.now()) / 1000);
    embed.addFields([
      {
        name: '⏰ Time Remaining',
        value: `${timeLeft} seconds`,
        inline: true
      }
    ]);
  }

  await message.reply({ embeds: [embed] });
}

async function showCompletionOptionsSlash(interaction: ChatInputCommandInteraction, character: any) {
  const statusEmojis: Record<string, string> = {
    'idle': '😴',
    'adventuring': '🗺️',
    'training': '💪',
    'resting': '😴',
    'questing': '📜'
  };

  const embed = new EmbedBuilder()
    .setTitle('✅ Activity Completion')
    .setDescription(
      `Your current status: ${statusEmojis[character.status]} ${character.status.charAt(0).toUpperCase() + character.status.slice(1)}\n\n` +
      `**Available Activities to Complete:**\n` +
      `• \`/complete training\` - Complete your training session\n` +
      `• \`/complete adventure\` - Complete your adventure\n` +
      `• \`/complete rest\` - Complete your rest period\n\n` +
      `**Current Status:**\n` +
      `• HP: ${character.hp}/${character.maxHp}\n` +
      `• Mana: ${character.mana}/${character.maxMana}\n` +
      `• Stamina: ${character.stamina}/${character.maxStamina}`
    )
    .setColor(0x5865f2)
    .setThumbnail(interaction.user.displayAvatarURL())
    .setTimestamp();

  if (character.status !== 'idle' && character.statusEndTime > Date.now()) {
    const timeLeft = Math.ceil((character.statusEndTime - Date.now()) / 1000);
    embed.addFields([
      {
        name: '⏰ Time Remaining',
        value: `${timeLeft} seconds`,
        inline: true
      }
    ]);
  }

  await interaction.reply({ embeds: [embed], ephemeral: true });
} 
