


export const data = {
  name: 'serveravatar',
  description: 'Show a user\'s server-specific avatar (for Nitro users).',
  aliases: ['savatar', 'guildavatar'],
  category: CommandCategory.GENERAL,
  usage: '!serveravatar [@user]',
  cooldown: 3
};

export const slashData = new SlashCommandBuilder()
  .setName('serveravatar')
  .setDescription('Show a user\'s server-specific avatar (for Nitro users).')
  .addUserOption(option =>
    option.setName('user')
      .setDescription('The user whose server avatar to display')
      .setRequired(false)
  );

export async function execute(message: Message, args?: string[]) {
  if (!message.guild) {
    return message.reply('❌ This command can only be used in a server.');
  }

  const user = message.mentions.users.first() || message.author;
  const member = message.guild.members.cache.get(user.id);

  if (!member) {
    return message.reply('❌ User not found in this server.');
  }

  // Get server-specific avatar
  const serverAvatarURL = member.displayAvatarURL({ size: 512, extension: 'png' });
  const globalAvatarURL = user.displayAvatarURL({ size: 512, extension: 'png' });

  // Check if user has a server-specific avatar
  const hasServerAvatar = member.avatar !== null;

  const embed = new EmbedBuilder()
    .setTitle(`🖼️ ${user.username}'s Server Avatar`)
    .setImage(serverAvatarURL)
    .setColor(0x3498db)
    .setURL(serverAvatarURL)
    .setFooter({ 
      text: hasServerAvatar 
        ? 'This user has a custom avatar for this server!' 
        : 'This user is using their global avatar (no server-specific avatar set)'
    });

  // Add field showing both avatars if they're different
  if (hasServerAvatar) {
    embed.addFields([
      { 
        name: '🌐 Global vs Server Avatar', 
        value: `[Global Avatar](${globalAvatarURL}) • [Server Avatar](${serverAvatarURL})`, 
        inline: false 
      }
    ]);
  }

  await message.reply({ embeds: [embed] });
}

export async function executeSlash(interaction: ChatInputCommandInteraction) {
  if (!interaction.guild) {
    return interaction.reply({ 
      content: '❌ This command can only be used in a server.',
      ephemeral: true 
    });
  }

  const user = interaction.options.getUser('user') || interaction.user;
  const member = interaction.guild.members.cache.get(user.id);

  if (!member) {
    return interaction.reply({ 
      content: '❌ User not found in this server.',
      ephemeral: true 
    });
  }

  // Get server-specific avatar
  const serverAvatarURL = member.displayAvatarURL({ size: 512, extension: 'png' });
  const globalAvatarURL = user.displayAvatarURL({ size: 512, extension: 'png' });

  // Check if user has a server-specific avatar
  const hasServerAvatar = member.avatar !== null;

  const embed = new EmbedBuilder()
    .setTitle(`🖼️ ${user.username}'s Server Avatar`)
    .setImage(serverAvatarURL)
    .setColor(0x3498db)
    .setURL(serverAvatarURL)
    .setFooter({ 
      text: hasServerAvatar 
        ? 'This user has a custom avatar for this server!' 
        : 'This user is using their global avatar (no server-specific avatar set)'
    });

  // Add field showing both avatars if they're different
  if (hasServerAvatar) {
    embed.addFields([
      { 
        name: '🌐 Global vs Server Avatar', 
        value: `[Global Avatar](${globalAvatarURL}) • [Server Avatar](${serverAvatarURL})`, 
        inline: false 
      }
    ]);
  }

  await interaction.reply({ embeds: [embed] });
} 
