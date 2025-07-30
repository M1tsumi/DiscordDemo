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
import { Command } from '../../types/Command';
export const data = {
  name: 'train',
  description: 'Train your character stats to become stronger.',
  aliases: ['practice', 'exercise'],
  category: CommandCategory.RPG,
  usage: '!train [stat]',
  cooldown: 5
};

export const slashData = new SlashCommandBuilder()
  .setName('train')
  .setDescription('Train your character stats to become stronger.')
  .addStringOption(option =>
    option.setName('stat')
      .setDescription('Which stat to train')
      .setRequired(false)
      .addChoices(
        { name: 'Strength', value: 'strength' },
        { name: 'Dexterity', value: 'dexterity' },
        { name: 'Intelligence', value: 'intelligence' },
        { name: 'Vitality', value: 'vitality' },
        { name: 'Wisdom', value: 'wisdom' },
        { name: 'Charisma', value: 'charisma' }
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

    const stat = args?.[0]?.toLowerCase();
    
    if (!stat) {
      await showTrainingOptions(message, character);
      return;
    }

    const validStats = ['strength', 'dexterity', 'intelligence', 'vitality', 'wisdom', 'charisma'];
    if (!validStats.includes(stat)) {
      await message.reply('❌ Invalid stat! Choose from: strength, dexterity, intelligence, vitality, wisdom, charisma');
      return;
    }

    const result = rpgService.startTraining(message.author.id, stat);
    const embed = new EmbedBuilder()
      .setTitle(result.success ? '💪 Training Started!' : '❌ Training Failed!')
      .setDescription(result.message)
      .setColor(result.success ? 0x2ecc71 : 0xe74c3c);
    
    await message.reply({ embeds: [embed] });
    
  } catch (error) {
    console.error('Error in train command:', error);
    await message.reply('❌ There was an error with your training. Please try again later.');
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

    const stat = interaction.options.getString('stat');
    
    if (!stat) {
      await showTrainingOptionsSlash(interaction, character);
      return;
    }

    const result = rpgService.startTraining(interaction.user.id, stat);
    const embed = new EmbedBuilder()
      .setTitle(result.success ? '💪 Training Started!' : '❌ Training Failed!')
      .setDescription(result.message)
      .setColor(result.success ? 0x2ecc71 : 0xe74c3c);
    
    await interaction.reply({ embeds: [embed], ephemeral: true });
    
  } catch (error) {
    console.error('Error in train slash command:', error);
    await interaction.reply({ 
      content: '❌ There was an error with your training. Please try again later.',
      ephemeral: true 
    });
  }
}

async function showTrainingOptions(message: Message, character: any) {
  const embed = new EmbedBuilder()
    .setTitle('💪 Training Grounds')
    .setDescription(
      `Welcome to the training grounds! Choose a stat to train and improve your character.\n\n` +
      `**Current Stats:**\n` +
      `• Strength: ${character.strength}\n` +
      `• Dexterity: ${character.dexterity}\n` +
      `• Intelligence: ${character.intelligence}\n` +
      `• Vitality: ${character.vitality}\n` +
      `• Wisdom: ${character.wisdom}\n` +
      `• Charisma: ${character.charisma}\n\n` +
      `**Training Costs:**\n` +
      `• Stamina: 20\n` +
      `• Time: 3 minutes\n` +
      `• Reward: +1 to chosen stat\n\n` +
      `Use the dropdown menu below to select which stat to train!`
    )
    .setColor(0x5865f2)
    .setThumbnail(message.author.displayAvatarURL())
    .setTimestamp()
    .setFooter({ 
      text: `Current Stamina: ${character.stamina}/${character.maxStamina}`,
      iconURL: message.client.user?.displayAvatarURL()
    });

  // Create stat selection dropdown
  const selectMenu = new StringSelectMenuBuilder()
    .setCustomId('train_stat')
    .setPlaceholder('Select a stat to train')
    .addOptions([
      new StringSelectMenuOptionBuilder()
        .setLabel('Strength')
        .setDescription('Train your physical power and attack damage')
        .setValue('strength')
        .setEmoji('💪'),
      new StringSelectMenuOptionBuilder()
        .setLabel('Dexterity')
        .setDescription('Train your agility and critical chance')
        .setValue('dexterity')
        .setEmoji('🏃'),
      new StringSelectMenuOptionBuilder()
        .setLabel('Intelligence')
        .setDescription('Train your magical power and spell damage')
        .setValue('intelligence')
        .setEmoji('🧠'),
      new StringSelectMenuOptionBuilder()
        .setLabel('Vitality')
        .setDescription('Train your health and defense')
        .setValue('vitality')
        .setEmoji('❤️'),
      new StringSelectMenuOptionBuilder()
        .setLabel('Wisdom')
        .setDescription('Train your magical defense and mana')
        .setValue('wisdom')
        .setEmoji('📚'),
      new StringSelectMenuOptionBuilder()
        .setLabel('Charisma')
        .setDescription('Train your social skills and influence')
        .setValue('charisma')
        .setEmoji('✨')
    ]);

  const row = new ActionRowBuilder<StringSelectMenuBuilder>()
    .addComponents(selectMenu);

  await message.reply({ 
    embeds: [embed], 
    components: [row] 
  });
}

async function showTrainingOptionsSlash(interaction: ChatInputCommandInteraction, character: any) {
  const embed = new EmbedBuilder()
    .setTitle('💪 Training Grounds')
    .setDescription(
      `Welcome to the training grounds! Choose a stat to train and improve your character.\n\n` +
      `**Current Stats:**\n` +
      `• Strength: ${character.strength}\n` +
      `• Dexterity: ${character.dexterity}\n` +
      `• Intelligence: ${character.intelligence}\n` +
      `• Vitality: ${character.vitality}\n` +
      `• Wisdom: ${character.wisdom}\n` +
      `• Charisma: ${character.charisma}\n\n` +
      `**Training Costs:**\n` +
      `• Stamina: 20\n` +
      `• Time: 3 minutes\n` +
      `• Reward: +1 to chosen stat\n\n` +
      `Use the dropdown menu below to select which stat to train!`
    )
    .setColor(0x5865f2)
    .setThumbnail(interaction.user.displayAvatarURL())
    .setTimestamp()
    .setFooter({ 
      text: `Current Stamina: ${character.stamina}/${character.maxStamina}`,
      iconURL: interaction.client.user?.displayAvatarURL()
    });

  // Create stat selection dropdown
  const selectMenu = new StringSelectMenuBuilder()
    .setCustomId('train_stat')
    .setPlaceholder('Select a stat to train')
    .addOptions([
      new StringSelectMenuOptionBuilder()
        .setLabel('Strength')
        .setDescription('Train your physical power and attack damage')
        .setValue('strength')
        .setEmoji('💪'),
      new StringSelectMenuOptionBuilder()
        .setLabel('Dexterity')
        .setDescription('Train your agility and critical chance')
        .setValue('dexterity')
        .setEmoji('🏃'),
      new StringSelectMenuOptionBuilder()
        .setLabel('Intelligence')
        .setDescription('Train your magical power and spell damage')
        .setValue('intelligence')
        .setEmoji('🧠'),
      new StringSelectMenuOptionBuilder()
        .setLabel('Vitality')
        .setDescription('Train your health and defense')
        .setValue('vitality')
        .setEmoji('❤️'),
      new StringSelectMenuOptionBuilder()
        .setLabel('Wisdom')
        .setDescription('Train your magical defense and mana')
        .setValue('wisdom')
        .setEmoji('📚'),
      new StringSelectMenuOptionBuilder()
        .setLabel('Charisma')
        .setDescription('Train your social skills and influence')
        .setValue('charisma')
        .setEmoji('✨')
    ]);

  const row = new ActionRowBuilder<StringSelectMenuBuilder>()
    .addComponents(selectMenu);

  await interaction.reply({ 
    embeds: [embed], 
    components: [row] 
  });
}

// Handle training stat selection interaction
export async function handleTrainStatInteraction(interaction: any) {
  try {
    const rpgService = new RPGService();
    const selectedStat = interaction.values[0];
    
    const result = rpgService.startTraining(interaction.user.id, selectedStat);
    const embed = new EmbedBuilder()
      .setTitle(result.success ? '💪 Training Started!' : '❌ Training Failed!')
      .setDescription(result.message)
      .setColor(result.success ? 0x2ecc71 : 0xe74c3c);
    
    await interaction.reply({
      embeds: [embed],
      ephemeral: true
    });

  } catch (error) {
    console.error('Error in train stat interaction:', error);
    await interaction.reply({
      content: '❌ There was an error starting your training. Please try again later.',
      ephemeral: true
    });
  }
} 
