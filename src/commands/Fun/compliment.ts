


export const data = {
  name: 'compliment',
  description: 'Get a personalized compliment',
  category: CommandCategory.FUN,
  usage: '!compliment [@user]',
  aliases: ['praise', 'nice'],
  cooldown: 15
};

export const slashData = new SlashCommandBuilder()
  .setName('compliment')
  .setDescription('Get a personalized compliment')
  .addUserOption(option =>
    option.setName('target')
      .setDescription('User to compliment (optional)')
      .setRequired(false)
  );

const compliments = [
  "Your Discord presence brightens up every server you join!",
  "You have the most creative username I've ever seen!",
  "Your typing speed is absolutely impressive!",
  "You always know the perfect emoji for every situation!",
  "Your server activity is genuinely inspiring!",
  "You have the best taste in profile pictures!",
  "Your messages always bring positive energy to the chat!",
  "You're the kind of person who makes Discord a better place!",
  "Your avatar is absolutely stunning!",
  "You have such a great sense of humor!",
  "Your Discord status is always so creative!",
  "You're the friendliest person in every server!",
  "Your message formatting is always on point!",
  "You have the best reaction game!",
  "Your server contributions are always valuable!"
];

export async function execute(message: Message, args?: string[]) {
  const target = message.mentions.users.first() || message.author;
  const compliment = compliments[Math.floor(Math.random() * compliments.length)];
  
  const embed = new EmbedBuilder()
    .setTitle('💝 Compliment')
    .setDescription(`**${compliment}**`)
    .setColor(0xFF69B4)
    .addFields([
      { name: '💖 For', value: target.toString(), inline: true },
      { name: '💝 From', value: message.author.toString(), inline: true }
    ])
    .setFooter({ text: 'Spread kindness everywhere! 🌟' })
    .setTimestamp();
  
  await message.reply({ embeds: [embed] });
}

export async function executeSlash(interaction: ChatInputCommandInteraction) {
  const target = interaction.options.getUser('target') || interaction.user;
  const compliment = compliments[Math.floor(Math.random() * compliments.length)];
  
  const embed = new EmbedBuilder()
    .setTitle('💝 Compliment')
    .setDescription(`**${compliment}**`)
    .setColor(0xFF69B4)
    .addFields([
      { name: '💖 For', value: target.toString(), inline: true },
      { name: '💝 From', value: interaction.user.toString(), inline: true }
    ])
    .setFooter({ text: 'Spread kindness everywhere! 🌟' })
    .setTimestamp();
  
  await interaction.reply({ embeds: [embed] });
} 
