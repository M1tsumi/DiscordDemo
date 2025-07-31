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
import { CommandCategory } from '../../types/Command.js';


interface MojangProfile {
  id: string;
  name: string;
}

interface NameHistoryEntry {
  name: string;
  changedToAt?: number;
}

export const data = {
  name: 'mcjava',
  description: 'Show Minecraft Java user info by username',
  aliases: ['minecraft'],
  category: CommandCategory.INFORMATION,
  usage: '!mcjava <username>',
  cooldown: 10
};

async function fetchMinecraftProfile(username: string) {
  try {
    // Mojang API for UUID
    const uuidRes = await fetch(`https://api.mojang.com/users/profiles/minecraft/${username}`);
    if (!uuidRes.ok) return null;
    const uuidData = await uuidRes.json() as MojangProfile;
    const uuid = uuidData.id;
    
    // Mojang API for name history (to get creation time)
    const historyRes = await fetch(`https://api.mojang.com/user/profiles/${uuid}/names`);
    const history = historyRes.ok ? (await historyRes.json() as NameHistoryEntry[]) : [];
    
    return {
      username: uuidData.name,
      uuid,
      createdAt: history.length > 0 ? new Date(history[0].changedToAt || Date.now()).toLocaleString() : 'Unknown',
      nameHistoryCount: history.length
    };
  } catch (error) {
    console.error('Error fetching Minecraft profile:', error);
    return null;
  }
}

export async function execute(message: Message, args: string[]) {
  const username = args[0];
  if (!username) {
    return message.reply('Please provide a Minecraft Java username. Usage: `!mcjava <username>`');
  }
  
  try {
    const profile = await fetchMinecraftProfile(username);
    if (!profile) {
      return message.reply('Could not find that Minecraft Java user.');
    }
    
    const embed = new EmbedBuilder()
      .setTitle(`Minecraft Java Profile: ${profile.username}`)
      .addFields(
        { name: 'Username', value: profile.username, inline: true },
        { name: 'UUID', value: profile.uuid, inline: false },
        { name: 'Account Creation', value: profile.createdAt, inline: false },
        { name: 'Name Changes', value: `${profile.nameHistoryCount ?? 'Unknown'}`, inline: true }
      )
      .setColor(0x00c3ff)
      .setFooter({ text: 'Data from Mojang' });
    
    await message.reply({ embeds: [embed] });
  } catch (error) {
    console.error('Error in mcjava command:', error);
    await message.reply('❌ An error occurred while fetching the Minecraft profile.');
  }
}

export async function executeSlash(interaction: ChatInputCommandInteraction) {
  const username = interaction.options.getString('username', true);
  
  try {
    const profile = await fetchMinecraftProfile(username);
    if (!profile) {
      return interaction.reply({ content: 'Could not find that Minecraft Java user.', ephemeral: true });
    }
    
    const embed = new EmbedBuilder()
      .setTitle(`Minecraft Java Profile: ${profile.username}`)
      .addFields(
        { name: 'Username', value: profile.username, inline: true },
        { name: 'UUID', value: profile.uuid, inline: false },
        { name: 'Account Creation', value: profile.createdAt, inline: false },
        { name: 'Name Changes', value: `${profile.nameHistoryCount ?? 'Unknown'}`, inline: true }
      )
      .setColor(0x00c3ff)
      .setFooter({ text: 'Data from Mojang' });
    
    await interaction.reply({ embeds: [embed] });
  } catch (error) {
    console.error('Error in mcjava slash command:', error);
    await interaction.reply({ content: '❌ An error occurred while fetching the Minecraft profile.', ephemeral: true });
  }
}

export const slashData = new SlashCommandBuilder()
  .setName('mcjava')
  .setDescription('Show Minecraft Java user info by username')
  .addStringOption(option =>
    option.setName('username')
      .setDescription('The Minecraft username to look up')
      .setRequired(true)
  );

