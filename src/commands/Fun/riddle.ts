import { Message, EmbedBuilder, SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { CommandCategory } from '../../types/Command';

export const data = {
  name: 'riddle',
  description: 'Solve riddles with hints',
  category: CommandCategory.FUN,
  usage: '!riddle [answer]',
  aliases: ['puzzle', 'brainteaser'],
  cooldown: 15
};

export const slashData = new SlashCommandBuilder()
  .setName('riddle')
  .setDescription('Solve riddles with hints')
  .addStringOption(option =>
    option.setName('answer')
      .setDescription('Your answer to the riddle')
      .setRequired(false)
  );

interface Riddle {
  question: string;
  answer: string;
  hint: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

const riddles: Riddle[] = [
  {
    question: "I speak without a mouth and hear without ears. I have no body, but I come alive with wind. What am I?",
    answer: "echo",
    hint: "I repeat what you say",
    difficulty: "easy"
  },
  {
    question: "What has keys, but no locks; space, but no room; and you can enter, but not go in?",
    answer: "keyboard",
    hint: "You use this to type",
    difficulty: "easy"
  },
  {
    question: "The more you take, the more you leave behind. What am I?",
    answer: "footsteps",
    hint: "You make these when you walk",
    difficulty: "medium"
  },
  {
    question: "What gets wetter and wetter the more it dries?",
    answer: "towel",
    hint: "You use this after a shower",
    difficulty: "medium"
  },
  {
    question: "What has a head and a tail but no body?",
    answer: "coin",
    hint: "You flip this to make decisions",
    difficulty: "easy"
  },
  {
    question: "What can travel around the world while staying in a corner?",
    answer: "stamp",
    hint: "You put this on letters",
    difficulty: "medium"
  },
  {
    question: "What has keys that open no doors, space but no room, and you can enter but not go in?",
    answer: "computer",
    hint: "You're using one right now",
    difficulty: "easy"
  },
  {
    question: "What is always in front of you but can't be seen?",
    answer: "future",
    hint: "It hasn't happened yet",
    difficulty: "medium"
  },
  {
    question: "What breaks when you say it?",
    answer: "silence",
    hint: "It's the opposite of noise",
    difficulty: "hard"
  },
  {
    question: "What has cities, but no houses; forests, but no trees; and rivers, but no water?",
    answer: "map",
    hint: "You use this to find your way",
    difficulty: "medium"
  }
];

interface ActiveRiddle {
  riddle: Riddle;
  userId: string;
  startTime: number;
  hintsGiven: number;
  solved: boolean;
}

const activeRiddles = new Map<string, ActiveRiddle>();

function getRandomRiddle(): Riddle {
  return riddles[Math.floor(Math.random() * riddles.length)];
}

function checkAnswer(userAnswer: string, correctAnswer: string): boolean {
  return userAnswer.toLowerCase().trim() === correctAnswer.toLowerCase();
}

export async function execute(message: Message, args?: string[]) {
  const userId = message.author.id;
  const userAnswer = args?.join(' ').toLowerCase();
  
  if (!activeRiddles.has(userId)) {
    // Start new riddle
    const riddle = getRandomRiddle();
    activeRiddles.set(userId, {
      riddle,
      userId,
      startTime: Date.now(),
      hintsGiven: 0,
      solved: false
    });
    
    const embed = new EmbedBuilder()
      .setTitle('🧩 Riddle Time!')
      .setDescription(`**${riddle.question}**`)
      .setColor(0xFF9800)
      .addFields([
        { name: '🎯 Difficulty', value: riddle.difficulty.charAt(0).toUpperCase() + riddle.difficulty.slice(1), inline: true },
        { name: '💡 Hints Available', value: '1', inline: true },
        { name: '⏱️ Time Limit', value: '2 minutes', inline: true }
      ])
      .setFooter({ text: 'Reply with your answer or type "hint" for a clue!' })
      .setTimestamp();
    
    await message.reply({ embeds: [embed] });
    
    // Set timeout to end riddle
    setTimeout(() => {
      const currentRiddle = activeRiddles.get(userId);
      if (currentRiddle && !currentRiddle.solved) {
        activeRiddles.delete(userId);
        if ('send' in message.channel) {
          message.channel.send(`⏰ Time's up! The answer was: **${riddle.answer}**`);
        }
      }
    }, 120000); // 2 minutes
    
    return;
  }
  
  const activeRiddle = activeRiddles.get(userId)!;
  
  if (userAnswer === 'hint') {
    if (activeRiddle.hintsGiven >= 1) {
      await message.reply('❌ You\'ve already used your hint!');
      return;
    }
    
    activeRiddle.hintsGiven++;
    await message.reply(`💡 **Hint:** ${activeRiddle.riddle.hint}`);
    return;
  }
  
  if (!userAnswer) {
    await message.reply('❌ Please provide an answer!');
    return;
  }
  
  if (checkAnswer(userAnswer, activeRiddle.riddle.answer)) {
    activeRiddle.solved = true;
    activeRiddles.delete(userId);
    
    const timeTaken = Math.floor((Date.now() - activeRiddle.startTime) / 1000);
    
    const embed = new EmbedBuilder()
      .setTitle('🎉 Correct!')
      .setDescription(`**${activeRiddle.riddle.question}**`)
      .setColor(0x4CAF50)
      .addFields([
        { name: '✅ Your Answer', value: userAnswer, inline: true },
        { name: '⏱️ Time Taken', value: `${timeTaken} seconds`, inline: true },
        { name: '💡 Hints Used', value: activeRiddle.hintsGiven.toString(), inline: true }
      ])
      .setFooter({ text: 'Great job solving the riddle!' })
      .setTimestamp();
    
    await message.reply({ embeds: [embed] });
  } else {
    await message.reply('❌ That\'s not correct. Try again or type "hint" for a clue!');
  }
}

export async function executeSlash(interaction: ChatInputCommandInteraction) {
  const userId = interaction.user.id;
  const userAnswer = interaction.options.getString('answer')?.toLowerCase();
  
  if (!activeRiddles.has(userId)) {
    // Start new riddle
    const riddle = getRandomRiddle();
    activeRiddles.set(userId, {
      riddle,
      userId,
      startTime: Date.now(),
      hintsGiven: 0,
      solved: false
    });
    
    const embed = new EmbedBuilder()
      .setTitle('🧩 Riddle Time!')
      .setDescription(`**${riddle.question}**`)
      .setColor(0xFF9800)
      .addFields([
        { name: '🎯 Difficulty', value: riddle.difficulty.charAt(0).toUpperCase() + riddle.difficulty.slice(1), inline: true },
        { name: '💡 Hints Available', value: '1', inline: true },
        { name: '⏱️ Time Limit', value: '2 minutes', inline: true }
      ])
      .setFooter({ text: 'Reply with your answer or type "hint" for a clue!' })
      .setTimestamp();
    
    await interaction.reply({ embeds: [embed] });
    
    // Set timeout to end riddle
    setTimeout(() => {
      const currentRiddle = activeRiddles.get(userId);
      if (currentRiddle && !currentRiddle.solved) {
        activeRiddles.delete(userId);
        if (interaction.channel && 'send' in interaction.channel) {
          interaction.channel.send(`⏰ Time's up! The answer was: **${riddle.answer}**`);
        }
      }
    }, 120000); // 2 minutes
    
    return;
  }
  
  const activeRiddle = activeRiddles.get(userId)!;
  
  if (!userAnswer) {
    await interaction.reply({ content: '❌ Please provide an answer!', ephemeral: true });
    return;
  }
  
  if (checkAnswer(userAnswer, activeRiddle.riddle.answer)) {
    activeRiddle.solved = true;
    activeRiddles.delete(userId);
    
    const timeTaken = Math.floor((Date.now() - activeRiddle.startTime) / 1000);
    
    const embed = new EmbedBuilder()
      .setTitle('🎉 Correct!')
      .setDescription(`**${activeRiddle.riddle.question}**`)
      .setColor(0x4CAF50)
      .addFields([
        { name: '✅ Your Answer', value: userAnswer, inline: true },
        { name: '⏱️ Time Taken', value: `${timeTaken} seconds`, inline: true },
        { name: '💡 Hints Used', value: activeRiddle.hintsGiven.toString(), inline: true }
      ])
      .setFooter({ text: 'Great job solving the riddle!' })
      .setTimestamp();
    
    await interaction.reply({ embeds: [embed] });
  } else {
    await interaction.reply({ content: '❌ That\'s not correct. Try again!', ephemeral: true });
  }
}

export { activeRiddles }; 