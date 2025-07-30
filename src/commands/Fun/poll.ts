import { 
  Message, 
  EmbedBuilder, 
  SlashCommandBuilder, 
  ChatInputCommandInteraction, 
  ActionRowBuilder, 
  ButtonBuilder, 
  ButtonStyle, 
  ComponentType 
} from 'discord.js';


export const data = {
  name: 'poll',
  description: 'Create an interactive poll with up to 4 options.',
  aliases: ['vote'],
  category: CommandCategory.FUN,
  usage: '!poll "Question?" "Option 1" "Option 2" ["Option 3"] ["Option 4"]',
  cooldown: 10
};

export const slashData = new SlashCommandBuilder()
  .setName('poll')
  .setDescription('Create an interactive poll with up to 4 options.')
  .addStringOption(option =>
    option.setName('question')
      .setDescription('The poll question')
      .setRequired(true)
  )
  .addStringOption(option =>
    option.setName('option1')
      .setDescription('First option')
      .setRequired(true)
  )
  .addStringOption(option =>
    option.setName('option2')
      .setDescription('Second option')
      .setRequired(true)
  )
  .addStringOption(option =>
    option.setName('option3')
      .setDescription('Third option (optional)')
      .setRequired(false)
  )
  .addStringOption(option =>
    option.setName('option4')
      .setDescription('Fourth option (optional)')
      .setRequired(false)
  );

interface PollData {
  question: string;
  options: string[];
  votes: Record<string, number>;
  voters: Set<string>;
  messageId: string;
  createdBy: string;
  createdAt: number;
}

const activePolls = new Map<string, PollData>();

function parseArguments(args: string[]): { question: string; options: string[] } | null {
  const text = args.join(' ');
  
  // Match quoted strings
  const matches = text.match(/"([^"]+)"/g);
  
  if (!matches || matches.length < 3) {
    return null;
  }

  const question = matches[0].slice(1, -1); // Remove quotes
  const options = matches.slice(1).map(option => option.slice(1, -1)); // Remove quotes

  if (options.length < 2 || options.length > 4) {
    return null;
  }

  return { question, options };
}

function createPollEmbed(pollData: PollData): EmbedBuilder {
  const totalVotes = Object.values(pollData.votes).reduce((sum, votes) => sum + votes, 0);
  
  const embed = new EmbedBuilder()
    .setTitle(`📊 ${pollData.question}`)
    .setColor(0x3498db)
    .setFooter({ text: `Poll by User ID: ${pollData.createdBy} • Total Votes: ${totalVotes}` })
    .setTimestamp(pollData.createdAt);

  let description = '';
  
  pollData.options.forEach((option, index) => {
    const votes = pollData.votes[index.toString()] || 0;
    const percentage = totalVotes > 0 ? Math.round((votes / totalVotes) * 100) : 0;
    const barLength = Math.round(percentage / 5); // 20 segments max
    const bar = '█'.repeat(barLength) + '░'.repeat(20 - barLength);
    
    description += `**${index + 1}.** ${option}\n`;
    description += `${bar} **${votes}** (${percentage}%)\n\n`;
  });

  embed.setDescription(description);
  return embed;
}

function createPollButtons(options: string[]): ActionRowBuilder<ButtonBuilder>[] {
  const rows: ActionRowBuilder<ButtonBuilder>[] = [];
  let currentRow = new ActionRowBuilder<ButtonBuilder>();
  
  options.forEach((option, index) => {
    const button = new ButtonBuilder()
      .setCustomId(`poll_vote_${index}`)
      .setLabel(`${index + 1}. ${option.substring(0, 20)}${option.length > 20 ? '...' : ''}`)
      .setStyle(ButtonStyle.Primary)
      .setEmoji(['1️⃣', '2️⃣', '3️⃣', '4️⃣'][index]);

    currentRow.addComponents(button);
    
    // Discord has a limit of 5 buttons per row
    if (currentRow.components.length === 5 || index === options.length - 1) {
      rows.push(currentRow);
      currentRow = new ActionRowBuilder<ButtonBuilder>();
    }
  });

  // Add end poll button
  const endButton = new ButtonBuilder()
    .setCustomId('poll_end')
    .setLabel('End Poll')
    .setStyle(ButtonStyle.Danger)
    .setEmoji('🛑');

  if (rows[rows.length - 1].components.length < 5) {
    rows[rows.length - 1].addComponents(endButton);
  } else {
    const endRow = new ActionRowBuilder<ButtonBuilder>().addComponents(endButton);
    rows.push(endRow);
  }

  return rows;
}

export async function execute(message: Message, args?: string[]) {
  if (!args || args.length === 0) {
    return message.reply('❓ Please provide a poll question and options!\nUsage: `!poll "Question?" "Option 1" "Option 2" ["Option 3"] ["Option 4"]`');
  }

  const parsed = parseArguments(args);
  if (!parsed) {
    return message.reply('❌ Invalid format! Use: `!poll "Question?" "Option 1" "Option 2" ["Option 3"] ["Option 4"]`\nMake sure to use quotes around each option!');
  }

  const { question, options } = parsed;

  const pollData: PollData = {
    question,
    options,
    votes: {},
    voters: new Set(),
    messageId: '',
    createdBy: message.author.id,
    createdAt: Date.now()
  };

  // Initialize vote counts
  options.forEach((_, index) => {
    pollData.votes[index.toString()] = 0;
  });

  const embed = createPollEmbed(pollData);
  const buttons = createPollButtons(options);

  const pollMessage = await message.reply({
    embeds: [embed],
    components: buttons
  });

  pollData.messageId = pollMessage.id;
  activePolls.set(pollMessage.id, pollData);

  // Auto-end poll after 1 hour
  setTimeout(() => {
    if (activePolls.has(pollMessage.id)) {
      endPoll(pollMessage.id);
    }
  }, 3600000); // 1 hour
}

export async function executeSlash(interaction: ChatInputCommandInteraction) {
  const question = interaction.options.getString('question', true);
  const options = [
    interaction.options.getString('option1', true),
    interaction.options.getString('option2', true),
    interaction.options.getString('option3'),
    interaction.options.getString('option4')
  ].filter(Boolean) as string[];

  const pollData: PollData = {
    question,
    options,
    votes: {},
    voters: new Set(),
    messageId: '',
    createdBy: interaction.user.id,
    createdAt: Date.now()
  };

  // Initialize vote counts
  options.forEach((_, index) => {
    pollData.votes[index.toString()] = 0;
  });

  const embed = createPollEmbed(pollData);
  const buttons = createPollButtons(options);

  await interaction.reply({
    embeds: [embed],
    components: buttons
  });

  const reply = await interaction.fetchReply();
  pollData.messageId = reply.id;
  activePolls.set(reply.id, pollData);

  // Auto-end poll after 1 hour
  setTimeout(() => {
    if (activePolls.has(reply.id)) {
      endPoll(reply.id);
    }
  }, 3600000); // 1 hour
}

async function endPoll(messageId: string) {
  const pollData = activePolls.get(messageId);
  if (!pollData) return;

  activePolls.delete(messageId);
  
  // The poll ending would be handled by the button interaction handler
  // This is just cleanup
}

// Handle button interactions (this would be called from the main bot file)
export async function handlePollInteraction(interaction: any) {
  if (!interaction.isButton()) return;

  const [action, type, optionIndex] = interaction.customId.split('_');
  if (action !== 'poll') return;

  const pollData = activePolls.get(interaction.message.id);
  if (!pollData) {
    return interaction.reply({ content: '❌ This poll has expired!', ephemeral: true });
  }

  if (type === 'end') {
    // Only poll creator or users with manage messages can end
    if (interaction.user.id !== pollData.createdBy && 
        !interaction.memberPermissions?.has('ManageMessages')) {
      return interaction.reply({ 
        content: '❌ Only the poll creator or moderators can end this poll!', 
        ephemeral: true 
      });
    }

    activePolls.delete(interaction.message.id);
    
    const finalEmbed = createPollEmbed(pollData)
      .setTitle(`📊 ${pollData.question} [ENDED]`)
      .setColor(0xe74c3c);

    await interaction.update({
      embeds: [finalEmbed],
      components: []
    });
    return;
  }

  if (type === 'vote') {
    // Check if user already voted
    if (pollData.voters.has(interaction.user.id)) {
      return interaction.reply({ 
        content: '❌ You have already voted in this poll!', 
        ephemeral: true 
      });
    }

    // Add vote
    pollData.voters.add(interaction.user.id);
    pollData.votes[optionIndex] = (pollData.votes[optionIndex] || 0) + 1;

    const updatedEmbed = createPollEmbed(pollData);
    const buttons = createPollButtons(pollData.options);

    await interaction.update({
      embeds: [updatedEmbed],
      components: buttons
    });
  }
} 
