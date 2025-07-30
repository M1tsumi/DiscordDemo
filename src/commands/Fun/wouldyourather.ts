import { 
  Message, 
  EmbedBuilder, 
  SlashCommandBuilder, 
  ChatInputCommandInteraction,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} from 'discord.js';


export const data = {
  name: 'wouldyourather',
  description: 'Get a thought-provoking "Would You Rather" question!',
  aliases: ['wyr', 'rather', 'dilemma'],
  category: CommandCategory.FUN,
  usage: '!wouldyourather',
  cooldown: 5
};

export const slashData = new SlashCommandBuilder()
  .setName('wouldyourather')
  .setDescription('Get a thought-provoking "Would You Rather" question!');

const wouldYouRatherQuestions = [
  {
    option1: "Have the ability to fly",
    option2: "Have the ability to become invisible",
    category: "🦸 Superpowers"
  },
  {
    option1: "Always know when someone is lying",
    option2: "Always get away with lying",
    category: "🎭 Truth & Lies"
  },
  {
    option1: "Be able to speak all languages",
    option2: "Be able to talk to animals",
    category: "🗣️ Communication"
  },
  {
    option1: "Have unlimited money",
    option2: "Have unlimited time",
    category: "💰 Resources"
  },
  {
    option1: "Live forever but stay your current age",
    option2: "Live a normal lifespan but never age after 25",
    category: "⏰ Time & Age"
  },
  {
    option1: "Always be 10 minutes late",
    option2: "Always be 20 minutes early",
    category: "⏰ Timing"
  },
  {
    option1: "Have perfect memory but never forget anything (including bad stuff)",
    option2: "Have selective memory but sometimes forget important things",
    category: "🧠 Memory"
  },
  {
    option1: "Be famous for something terrible",
    option2: "Be unknown for something amazing",
    category: "🌟 Fame"
  },
  {
    option1: "Only be able to whisper",
    option2: "Only be able to shout",
    category: "🔊 Voice"
  },
  {
    option1: "Have to sing everything you say",
    option2: "Have to rhyme everything you say",
    category: "🎵 Speech"
  },
  {
    option1: "Know the date of your death",
    option2: "Know the cause of your death",
    category: "💀 Mortality"
  },
  {
    option1: "Be able to read minds but can't turn it off",
    option2: "Have everyone else able to read your mind",
    category: "🧠 Mind Reading"
  },
  {
    option1: "Always be slightly hungry",
    option2: "Always be slightly tired",
    category: "😴 Discomfort"
  },
  {
    option1: "Have to wear clown shoes everywhere",
    option2: "Have to wear a clown nose everywhere",
    category: "🤡 Embarrassment"
  },
  {
    option1: "Be able to control time but age twice as fast",
    option2: "Live twice as long but time moves twice as slow for you",
    category: "⏰ Time Control"
  },
  {
    option1: "Have taste buds in your hands",
    option2: "Have fingers as long as your arms",
    category: "🖐️ Body Modifications"
  },
  {
    option1: "Fight 100 duck-sized horses",
    option2: "Fight 1 horse-sized duck",
    category: "⚔️ Classic Battle"
  },
  {
    option1: "Only be able to use a fork to eat",
    option2: "Only be able to use a spoon to eat",
    category: "🍽️ Eating"
  },
  {
    option1: "Have every movie spoiled for you",
    option2: "Never be able to watch movies again",
    category: "🎬 Entertainment"
  },
  {
    option1: "Be able to teleport but arrive naked",
    option2: "Be able to fly but only at walking speed",
    category: "🚀 Transportation"
  },
  {
    option1: "Have unlimited pizza for life but it's always cold",
    option2: "Have unlimited ice cream for life but it's always melted",
    category: "🍕 Food Dilemma"
  },
  {
    option1: "Always have perfect hair but terrible skin",
    option2: "Always have perfect skin but terrible hair",
    category: "💄 Appearance"
  },
  {
    option1: "Be stuck in a room with someone who never stops talking",
    option2: "Be stuck in a room with someone who never talks at all",
    category: "🤐 Social Situations"
  },
  {
    option1: "Have to hop everywhere instead of walking",
    option2: "Have to crawl everywhere instead of walking",
    category: "🦘 Movement"
  },
  {
    option1: "Only be able to eat spicy food",
    option2: "Only be able to eat bland food",
    category: "🌶️ Taste"
  }
];

// Store active polls for vote tracking
const activePolls = new Map<string, {
  option1Votes: Set<string>;
  option2Votes: Set<string>;
  question: any;
  messageId: string;
  channelId: string;
  createdAt: number;
}>();

export async function execute(message: Message) {
  const randomQuestion = wouldYouRatherQuestions[Math.floor(Math.random() * wouldYouRatherQuestions.length)];
  const pollId = `wyr_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  // Initialize poll data
  activePolls.set(pollId, {
    option1Votes: new Set(),
    option2Votes: new Set(),
    question: randomQuestion,
    messageId: '',
    channelId: message.channel.id,
    createdAt: Date.now()
  });

  const embed = createWYREmbed(randomQuestion, pollId);
  const buttons = createWYRButtons(pollId);

  const sentMessage = await message.reply({ embeds: [embed], components: [buttons] });
  
  // Update poll data with message ID
  const pollData = activePolls.get(pollId)!;
  pollData.messageId = sentMessage.id;

  // Auto-end poll after 5 minutes
  setTimeout(() => {
    if (activePolls.has(pollId)) {
      endPoll(pollId, sentMessage);
    }
  }, 5 * 60 * 1000);
}

export async function executeSlash(interaction: ChatInputCommandInteraction) {
  const randomQuestion = wouldYouRatherQuestions[Math.floor(Math.random() * wouldYouRatherQuestions.length)];
  const pollId = `wyr_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  // Initialize poll data
  activePolls.set(pollId, {
    option1Votes: new Set(),
    option2Votes: new Set(),
    question: randomQuestion,
    messageId: '',
    channelId: interaction.channel!.id,
    createdAt: Date.now()
  });

  const embed = createWYREmbed(randomQuestion, pollId);
  const buttons = createWYRButtons(pollId);

  await interaction.reply({ embeds: [embed], components: [buttons] });
  
  const reply = await interaction.fetchReply();
  
  // Update poll data with message ID
  const pollData = activePolls.get(pollId)!;
  pollData.messageId = reply.id;

  // Auto-end poll after 5 minutes
  setTimeout(() => {
    if (activePolls.has(pollId)) {
      endPoll(pollId, reply);
    }
  }, 5 * 60 * 1000);
}

function createWYREmbed(question: any, pollId: string) {
  const pollData = activePolls.get(pollId)!;
  const option1Count = pollData.option1Votes.size;
  const option2Count = pollData.option2Votes.size;
  const totalVotes = option1Count + option2Count;

  const option1Percentage = totalVotes > 0 ? Math.round((option1Count / totalVotes) * 100) : 0;
  const option2Percentage = totalVotes > 0 ? Math.round((option2Count / totalVotes) * 100) : 0;

  const progressBar1 = createProgressBar(option1Percentage);
  const progressBar2 = createProgressBar(option2Percentage);

  return new EmbedBuilder()
    .setTitle('🤔 **Would You Rather?**')
    .setDescription(`**${question.category}**\n\nChoose your option and see what others think!`)
    .addFields([
      {
        name: '🅰️ Option A',
        value: `**${question.option1}**\n${progressBar1} ${option1Count} votes (${option1Percentage}%)`,
        inline: false
      },
      {
        name: '🅱️ Option B', 
        value: `**${question.option2}**\n${progressBar2} ${option2Count} votes (${option2Percentage}%)`,
        inline: false
      },
      {
        name: '📊 Stats',
        value: `**Total Votes:** ${totalVotes}\n**Poll ID:** \`${pollId.split('_')[2]}\``,
        inline: true
      }
    ])
    .setColor(0x3498db)
    .setThumbnail('https://cdn.discordapp.com/emojis/692028702406189087.png')
    .setFooter({ text: 'Vote by clicking the buttons below! • Poll ends in 5 minutes' })
    .setTimestamp();
}

function createWYRButtons(pollId: string) {
  return new ActionRowBuilder<ButtonBuilder>()
    .addComponents(
      new ButtonBuilder()
        .setCustomId(`wyr_vote_a_${pollId}`)
        .setLabel('Choose Option A')
        .setStyle(ButtonStyle.Primary)
        .setEmoji('🅰️'),
      new ButtonBuilder()
        .setCustomId(`wyr_vote_b_${pollId}`)
        .setLabel('Choose Option B')
        .setStyle(ButtonStyle.Secondary)
        .setEmoji('🅱️'),
      new ButtonBuilder()
        .setCustomId(`wyr_results_${pollId}`)
        .setLabel('View Results')
        .setStyle(ButtonStyle.Success)
        .setEmoji('📊')
    );
}

function createProgressBar(percentage: number): string {
  const barLength = 10;
  const filledLength = Math.round((percentage / 100) * barLength);
  const emptyLength = barLength - filledLength;
  
  return '▰'.repeat(filledLength) + '▱'.repeat(emptyLength);
}

async function endPoll(pollId: string, message: any) {
  const pollData = activePolls.get(pollId);
  if (!pollData) return;

  const option1Count = pollData.option1Votes.size;
  const option2Count = pollData.option2Votes.size;
  const totalVotes = option1Count + option2Count;

  let winner = '';
  if (option1Count > option2Count) {
    winner = `🏆 **Option A wins!** (${option1Count} vs ${option2Count})`;
  } else if (option2Count > option1Count) {
    winner = `🏆 **Option B wins!** (${option2Count} vs ${option1Count})`;
  } else {
    winner = `🤝 **It's a tie!** (${option1Count} vs ${option2Count})`;
  }

  const finalEmbed = createWYREmbed(pollData.question, pollId)
    .setTitle('🏁 **Would You Rather? - ENDED**')
    .setColor(0x95a5a6)
    .addFields([{ name: '🎉 Final Results', value: winner, inline: false }])
    .setFooter({ text: 'This poll has ended. Thanks for participating!' });

  try {
    await message.edit({ embeds: [finalEmbed], components: [] });
  } catch (error) {
    console.error('Error ending WYR poll:', error);
  }

  activePolls.delete(pollId);
}

export async function handleWYRInteraction(interaction: any) {
  if (!interaction.isButton()) return;

  const customId = interaction.customId;
  if (!customId.startsWith('wyr_')) return;

  const parts = customId.split('_');
  const action = parts[1];
  const pollId = parts.slice(2).join('_');

  const pollData = activePolls.get(pollId);
  if (!pollData) {
    return interaction.reply({ content: '❌ This poll has expired or ended.', ephemeral: true });
  }

  const userId = interaction.user.id;

  if (action === 'vote') {
    const option = parts[2]; // 'a' or 'b'
    
    // Remove user from both vote sets (in case they're changing their vote)
    pollData.option1Votes.delete(userId);
    pollData.option2Votes.delete(userId);
    
    // Add user to the selected option
    if (option === 'a') {
      pollData.option1Votes.add(userId);
    } else if (option === 'b') {
      pollData.option2Votes.add(userId);
    }

    const updatedEmbed = createWYREmbed(pollData.question, pollId);
    const buttons = createWYRButtons(pollId);

    await interaction.update({ embeds: [updatedEmbed], components: [buttons] });

  } else if (action === 'results') {
    const option1Count = pollData.option1Votes.size;
    const option2Count = pollData.option2Votes.size;
    const totalVotes = option1Count + option2Count;

    const userVote = pollData.option1Votes.has(userId) ? 'Option A' : 
                     pollData.option2Votes.has(userId) ? 'Option B' : 'No vote yet';

    await interaction.reply({
      content: `📊 **Current Results:**\n\n` +
               `🅰️ **Option A:** ${option1Count} votes\n` +
               `🅱️ **Option B:** ${option2Count} votes\n` +
               `📈 **Total:** ${totalVotes} votes\n\n` +
               `Your vote: **${userVote}**`,
      ephemeral: true
    });
  }
} 
