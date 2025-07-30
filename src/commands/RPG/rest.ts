

import { RPGService } from '../../services/rpgService';

export const data = {
  name: 'rest',
  description: 'Rest to restore your HP, Mana, and Stamina.',
  aliases: ['sleep', 'heal'],
  category: CommandCategory.RPG,
  usage: '!rest',
  cooldown: 0
};

export const slashData = new SlashCommandBuilder()
  .setName('rest')
  .setDescription('Rest to restore your HP, Mana, and Stamina.');

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

    const result = rpgService.rest(message.author.id);
    const embed = new EmbedBuilder()
      .setTitle(result.success ? '😴 Rest Started!' : '❌ Rest Failed!')
      .setDescription(result.message)
      .setColor(result.success ? 0x2ecc71 : 0xe74c3c);
    
    if (result.success) {
      embed.addFields([
        { 
          name: '⏰ Rest Duration', 
          value: '2 minutes', 
          inline: true 
        },
        {
          name: '💖 Restoration',
          value: 'Full HP, Mana, and Stamina',
          inline: true
        },
        {
          name: '⏳ Cooldown',
          value: '1 hour between rests',
          inline: true
        }
      ]);
    }
    
    await message.reply({ embeds: [embed] });
    
  } catch (error) {
    console.error('Error in rest command:', error);
    await message.reply('❌ There was an error with your rest. Please try again later.');
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

    const result = rpgService.rest(interaction.user.id);
    const embed = new EmbedBuilder()
      .setTitle(result.success ? '😴 Rest Started!' : '❌ Rest Failed!')
      .setDescription(result.message)
      .setColor(result.success ? 0x2ecc71 : 0xe74c3c);
    
    if (result.success) {
      embed.addFields([
        { 
          name: '⏰ Rest Duration', 
          value: '2 minutes', 
          inline: true 
        },
        {
          name: '💖 Restoration',
          value: 'Full HP, Mana, and Stamina',
          inline: true
        },
        {
          name: '⏳ Cooldown',
          value: '1 hour between rests',
          inline: true
        }
      ]);
    }
    
    await interaction.reply({ embeds: [embed], ephemeral: true });
    
  } catch (error) {
    console.error('Error in rest slash command:', error);
    await interaction.reply({ 
      content: '❌ There was an error with your rest. Please try again later.',
      ephemeral: true 
    });
  }
} 
