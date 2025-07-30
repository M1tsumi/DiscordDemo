


export const data = {
  name: 'avatar',
  description: 'Show your or another user\'s avatar.',
  aliases: ['pfp'],
  category: CommandCategory.GENERAL,
  usage: '!avatar [@user]',
  cooldown: 3
};

export const slashData = new SlashCommandBuilder()
  .setName('avatar')
  .setDescription('Show your or another user\'s avatar.')
  .addUserOption(option =>
    option.setName('user')
      .setDescription('The user whose avatar to display')
      .setRequired(false)
  );

export async function execute(message: Message, args?: string[]) {
  const user = message.mentions.users.first() || message.author;
  const avatarURL = user.displayAvatarURL({ size: 512, extension: 'png' });
  
  const embed = new EmbedBuilder()
    .setTitle(`🖼️ ${user.username}'s Avatar`)
    .setImage(avatarURL)
    .setColor(0x3498db)
    .setURL(avatarURL)
    .setFooter({ text: 'Click the title to open in full size!' });
    
  await message.reply({ embeds: [embed] });
}

export async function executeSlash(interaction: ChatInputCommandInteraction) {
  const user = interaction.options.getUser('user') || interaction.user;
  const avatarURL = user.displayAvatarURL({ size: 512, extension: 'png' });
  
  const embed = new EmbedBuilder()
    .setTitle(`🖼️ ${user.username}'s Avatar`)
    .setImage(avatarURL)
    .setColor(0x3498db)
    .setURL(avatarURL)
    .setFooter({ text: 'Click the title to open in full size!' });
    
  await interaction.reply({ embeds: [embed] });
}
