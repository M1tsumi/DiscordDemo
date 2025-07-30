

import { RPGService } from '../../services/rpgService';

export const data = {
  name: 'create',
  description: 'Create your RPG character and begin your adventure!',
  aliases: ['start', 'begin'],
  category: CommandCategory.RPG,
  usage: '!create',
  cooldown: 0
};

export const slashData = new SlashCommandBuilder()
  .setName('create')
  .setDescription('Create your RPG character and begin your adventure!');

export async function execute(message: Message, args?: string[]) {
  try {
    const rpgService = new RPGService();
    
    // Check if character already exists
    const existingCharacter = rpgService.getCharacter(message.author.id);
    if (existingCharacter) {
      const embed = new EmbedBuilder()
        .setTitle('❌ Character Already Exists!')
        .setDescription(`You already have a character: **${existingCharacter.class}** level ${existingCharacter.level}`)
        .setColor(0xe74c3c)
        .setFooter({ 
          text: `Use !profile to view your character or !delete to start over`,
          iconURL: message.author.displayAvatarURL()
        });
      
      await message.reply({ embeds: [embed] });
      return;
    }

    // Get available classes
    const classes = rpgService.getClasses();
    
    // Create class selection embed
    const embed = new EmbedBuilder()
      .setTitle('🎮 **Create Your Character**')
      .setDescription(
        `Welcome to the RPG adventure! Choose your class to begin your journey.\n\n` +
        `**Available Classes:**\n` +
        Object.entries(classes).map(([className, classData]: [string, any]) => 
          `**${className}** - ${classData.description}`
        ).join('\n\n') + `\n\n` +
        `Use the dropdown menu below to select your class and begin your adventure!`
      )
      .setColor(0x5865f2)
      .setThumbnail(message.author.displayAvatarURL())
      .setTimestamp()
      .setFooter({ 
        text: `Choose wisely - your class will determine your playstyle!`,
        iconURL: message.client.user?.displayAvatarURL()
      });

    // Create class selection dropdown
    const selectMenu = new StringSelectMenuBuilder()
      .setCustomId('create_character')
      .setPlaceholder('Select your class')
      .addOptions(
        Object.entries(classes).map(([className, classData]: [string, any]) => {
          const emojis: Record<string, string> = {
            'Warrior': '⚔️',
            'Mage': '🔮',
            'Archer': '🏹',
            'Priest': '⛪'
          };
          
          return new StringSelectMenuOptionBuilder()
            .setLabel(className)
            .setDescription(classData.description)
            .setValue(className)
            .setEmoji(emojis[className] || '🎭');
        })
      );

    const row = new ActionRowBuilder<StringSelectMenuBuilder>()
      .addComponents(selectMenu);

    await message.reply({ 
      embeds: [embed], 
      components: [row] 
    });

  } catch (error) {
    console.error('Error in create command:', error);
    await message.reply('❌ There was an error creating your character. Please try again later.');
  }
}

export async function executeSlash(interaction: ChatInputCommandInteraction) {
  try {
    const rpgService = new RPGService();
    
    // Check if character already exists
    const existingCharacter = rpgService.getCharacter(interaction.user.id);
    if (existingCharacter) {
      const embed = new EmbedBuilder()
        .setTitle('❌ Character Already Exists!')
        .setDescription(`You already have a character: **${existingCharacter.class}** level ${existingCharacter.level}`)
        .setColor(0xe74c3c)
        .setFooter({ 
          text: `Use /profile to view your character or /delete to start over`,
          iconURL: interaction.user.displayAvatarURL()
        });
      
      await interaction.reply({ embeds: [embed], ephemeral: true });
      return;
    }

    // Get available classes
    const classes = rpgService.getClasses();
    
    // Create class selection embed
    const embed = new EmbedBuilder()
      .setTitle('🎮 **Create Your Character**')
      .setDescription(
        `Welcome to the RPG adventure! Choose your class to begin your journey.\n\n` +
        `**Available Classes:**\n` +
        Object.entries(classes).map(([className, classData]: [string, any]) => 
          `**${className}** - ${classData.description}`
        ).join('\n\n') + `\n\n` +
        `Use the dropdown menu below to select your class and begin your adventure!`
      )
      .setColor(0x5865f2)
      .setThumbnail(interaction.user.displayAvatarURL())
      .setTimestamp()
      .setFooter({ 
        text: `Choose wisely - your class will determine your playstyle!`,
        iconURL: interaction.client.user?.displayAvatarURL()
      });

    // Create class selection dropdown
    const selectMenu = new StringSelectMenuBuilder()
      .setCustomId('create_character')
      .setPlaceholder('Select your class')
      .addOptions(
        Object.entries(classes).map(([className, classData]: [string, any]) => {
          const emojis: Record<string, string> = {
            'Warrior': '⚔️',
            'Mage': '🔮',
            'Archer': '🏹',
            'Priest': '⛪'
          };
          
          return new StringSelectMenuOptionBuilder()
            .setLabel(className)
            .setDescription(classData.description)
            .setValue(className)
            .setEmoji(emojis[className] || '🎭');
        })
      );

    const row = new ActionRowBuilder<StringSelectMenuBuilder>()
      .addComponents(selectMenu);

    await interaction.reply({ 
      embeds: [embed], 
      components: [row] 
    });

  } catch (error) {
    console.error('Error in create slash command:', error);
    await interaction.reply({ 
      content: '❌ There was an error creating your character. Please try again later.',
      ephemeral: true 
    });
  }
}

// Handle character creation interaction
export async function handleCreateCharacterInteraction(interaction: any) {
  try {
    const rpgService = new RPGService();
    const selectedClass = interaction.values[0];
    
    // Create the character
    const character = rpgService.createCharacter({
      id: interaction.user.id,
      username: interaction.user.username,
      avatar: interaction.user.displayAvatarURL()
    }, selectedClass);

    const classEmojis: Record<string, string> = {
      'Warrior': '⚔️',
      'Mage': '🔮',
      'Archer': '🏹',
      'Priest': '⛪'
    };

    const embed = new EmbedBuilder()
      .setTitle(`${classEmojis[selectedClass]} **Character Created!**`)
      .setDescription(
        `Congratulations! You have created your **${selectedClass}** character!\n\n` +
        `**Starting Stats:**\n` +
        `• HP: ${character.hp}/${character.maxHp}\n` +
        `• Mana: ${character.mana}/${character.maxMana}\n` +
        `• Stamina: ${character.stamina}/${character.maxStamina}\n` +
        `• Gold: ${character.gold}\n\n` +
        `**Next Steps:**\n` +
        `• Use \`!profile\` to view your character\n` +
        `• Use \`!adventure\` to start your first adventure\n` +
        `• Use \`!daily\` to claim daily rewards\n` +
        `• Use \`!train\` to improve your stats\n\n` +
        `**Good luck on your adventure!** 🎮`
      )
      .setColor(0x2ecc71)
      .setThumbnail(interaction.user.displayAvatarURL())
      .setTimestamp()
      .setFooter({ 
        text: `Your adventure begins now!`,
        iconURL: interaction.client.user?.displayAvatarURL()
      });

    await interaction.reply({
      embeds: [embed],
      ephemeral: true
    });

  } catch (error) {
    console.error('Error in create character interaction:', error);
    await interaction.reply({
      content: '❌ There was an error creating your character. Please try again later.',
      ephemeral: true
    });
  }
} 
