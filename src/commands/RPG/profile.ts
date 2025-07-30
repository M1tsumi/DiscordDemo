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
  name: 'profile-rpg',
  description: 'View your RPG character profile and stats.',
  aliases: ['char', 'character', 'stats', 'profile'],
  category: CommandCategory.RPG,
  usage: '!profile-rpg [@user]',
  cooldown: 5
};

export const slashData = new SlashCommandBuilder()
  .setName('profile-rpg')
  .setDescription('View your RPG character profile and stats.')
  .addUserOption(option =>
    option.setName('user')
      .setDescription('User to view profile for (optional)')
      .setRequired(false)
  );

export async function execute(message: Message, args?: string[]) {
  try {
    const rpgService = new RPGService();
    
    // Determine target user
    const targetUser = message.mentions.users.first() || message.author;
    const character = rpgService.getCharacter(targetUser.id);
    
    if (!character) {
      const embed = new EmbedBuilder()
        .setTitle('❌ Character Not Found!')
        .setDescription(
          targetUser.id === message.author.id 
            ? `You don't have a character yet! Use \`!create\` to create your character.`
            : `${targetUser.username} doesn't have a character yet!`
        )
        .setColor(0xe74c3c)
        .setFooter({ 
          text: `Use !create to start your adventure!`,
          iconURL: message.client.user?.displayAvatarURL()
        });
      
      await message.reply({ embeds: [embed] });
      return;
    }

    // Create detailed profile embed
    const embed = createProfileEmbed(character, targetUser, message.client);
    
    await message.reply({ embeds: [embed] });

  } catch (error) {
    console.error('Error in profile command:', error);
    await message.reply('❌ There was an error loading your profile. Please try again later.');
  }
}

export async function executeSlash(interaction: ChatInputCommandInteraction) {
  try {
    const rpgService = new RPGService();
    
    // Get target user from interaction
    const targetUser = interaction.options.getUser('user') || interaction.user;
    const character = rpgService.getCharacter(targetUser.id);
    
    if (!character) {
      const embed = new EmbedBuilder()
        .setTitle('❌ Character Not Found!')
        .setDescription(
          targetUser.id === interaction.user.id 
            ? `You don't have a character yet! Use \`/create\` to create your character.`
            : `${targetUser.username} doesn't have a character yet!`
        )
        .setColor(0xe74c3c)
        .setFooter({ 
          text: `Use /create to start your adventure!`,
          iconURL: interaction.client.user?.displayAvatarURL()
        });
      
      await interaction.reply({ embeds: [embed], ephemeral: true });
      return;
    }

    // Create detailed profile embed
    const embed = createProfileEmbed(character, targetUser, interaction.client);
    
    await interaction.reply({ embeds: [embed] });

  } catch (error) {
    console.error('Error in profile slash command:', error);
    await interaction.reply({ 
      content: '❌ There was an error loading your profile. Please try again later.',
      ephemeral: true 
    });
  }
}

function createProfileEmbed(character: any, user: any, client: any): EmbedBuilder {
  const classEmojis: Record<string, string> = {
    'Warrior': '⚔️',
    'Mage': '🔮',
    'Archer': '🏹',
    'Priest': '⛪'
  };

  const rarityColors: Record<string, number> = {
    'common': 0x95a5a6,
    'uncommon': 0x2ecc71,
    'rare': 0x3498db,
    'epic': 0x9b59b6,
    'legendary': 0xf1c40f,
    'mythic': 0xe74c3c
  };

  // Calculate XP progress
  const currentLevelXP = Math.pow((character.level - 1) / 0.1, 2);
  const nextLevelXP = Math.pow(character.level / 0.1, 2);
  const xpProgress = ((character.xp - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100;

  // Create progress bar
  const progressBarLength = 20;
  const filledLength = Math.floor((xpProgress / 100) * progressBarLength);
  const progressBar = '█'.repeat(filledLength) + '░'.repeat(progressBarLength - filledLength);

  const embed = new EmbedBuilder()
    .setTitle(`${classEmojis[character.class]} ${character.username}'s RPG Profile`)
    .setDescription(
      `**${character.title} ${character.class}**\n` +
      `Level ${character.level} • ${character.xp} XP\n` +
      `Progress to next level: ${progressBar} ${xpProgress.toFixed(1)}%`
    )
    .setColor(rarityColors[character.class.toLowerCase()] || 0x5865f2)
    .setThumbnail(user.displayAvatarURL())
    .setTimestamp()
    .setFooter({ 
      text: `${client.user?.username} RPG System`,
      iconURL: client.user?.displayAvatarURL()
    });

  // Basic Stats
  embed.addFields([
    {
      name: '💖 Health & Resources',
      value: `HP: ${character.hp}/${character.maxHp}\nMana: ${character.mana}/${character.maxMana}\nStamina: ${character.stamina}/${character.maxStamina}`,
      inline: true
    },
    {
      name: '💰 Economy',
      value: `Gold: ${character.gold}\nSkill Points: ${character.skillPoints}`,
      inline: true
    },
    {
      name: '📊 Core Stats',
      value: `Strength: ${character.strength}\nDexterity: ${character.dexterity}\nIntelligence: ${character.intelligence}`,
      inline: true
    },
    {
      name: '⚔️ Combat Stats',
      value: `Attack: ${character.attack}\nDefense: ${character.defense}\nMagic Attack: ${character.magicAttack}\nMagic Defense: ${character.magicDefense}`,
      inline: true
    },
    {
      name: '🎯 Critical Stats',
      value: `Critical Chance: ${character.criticalChance}%\nCritical Damage: ${character.criticalDamage}%`,
      inline: true
    },
    {
      name: '📈 Additional Stats',
      value: `Vitality: ${character.vitality}\nWisdom: ${character.wisdom}\nCharisma: ${character.charisma}`,
      inline: true
    }
  ]);

  // Equipment section
  const equipment = [];
  if (character.weapon) equipment.push(`⚔️ **Weapon:** ${character.weapon.name} (Level ${character.weapon.level})`);
  if (character.armor) equipment.push(`🛡️ **Armor:** ${character.armor.name} (Level ${character.armor.level})`);
  if (character.helmet) equipment.push(`⛑️ **Helmet:** ${character.helmet.name} (Level ${character.helmet.level})`);
  if (character.gloves) equipment.push(`🧤 **Gloves:** ${character.gloves.name} (Level ${character.gloves.level})`);
  if (character.boots) equipment.push(`👢 **Boots:** ${character.boots.name} (Level ${character.boots.level})`);
  if (character.accessory1) equipment.push(`💍 **Accessory 1:** ${character.accessory1.name} (Level ${character.accessory1.level})`);
  if (character.accessory2) equipment.push(`💍 **Accessory 2:** ${character.accessory2.name} (Level ${character.accessory2.level})`);

  if (equipment.length > 0) {
    embed.addFields([
      {
        name: '🎒 Equipment',
        value: equipment.join('\n') || 'No equipment equipped',
        inline: false
      }
    ]);
  }

  // Skills section
  if (character.skills.length > 0) {
    const skillList = character.skills.map((skill: any) => 
      `• **${skill.name}** (Level ${skill.level}/${skill.maxLevel}) - ${skill.description}`
    ).join('\n');
    
    embed.addFields([
      {
        name: '⚡ Skills',
        value: skillList,
        inline: false
      }
    ]);
  }

  // Inventory section (show first 5 items)
  if (character.inventory.length > 0) {
    const inventoryItems = character.inventory
      .slice(0, 5)
      .map((item: any) => `• **${item.name}** x${item.quantity} (${item.rarity})`)
      .join('\n');
    
    const remainingItems = character.inventory.length > 5 ? `\n... and ${character.inventory.length - 5} more items` : '';
    
    embed.addFields([
      {
        name: '🎒 Inventory',
        value: inventoryItems + remainingItems,
        inline: false
      }
    ]);
  }

  // Status section
  const statusEmojis: Record<string, string> = {
    'idle': '😴',
    'adventuring': '🗺️',
    'training': '💪',
    'resting': '😴',
    'questing': '📜'
  };

  let statusText = `${statusEmojis[character.status]} ${character.status.charAt(0).toUpperCase() + character.status.slice(1)}`;
  if (character.status !== 'idle' && character.statusEndTime > Date.now()) {
    const timeLeft = Math.ceil((character.statusEndTime - Date.now()) / 1000);
    statusText += ` (${timeLeft}s remaining)`;
  }

  embed.addFields([
    {
      name: '📊 Status',
      value: statusText,
      inline: true
    },
    {
      name: '🏆 Achievements',
      value: character.achievements.length > 0 ? character.achievements.join(', ') : 'None yet',
      inline: true
    },
    {
      name: '📜 Quests',
      value: `Active: ${character.activeQuests.length} | Completed: ${character.completedQuests.length}`,
      inline: true
    }
  ]);

  return embed;
} 

