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

import { Command } from '../../types/Command';
export const data = {
  name: 'trivia',
  description: 'Play trivia with multiple categories and difficulty levels',
  category: CommandCategory.FUN,
  usage: '!trivia [category] [difficulty]',
  aliases: ['quiz', 'question'],
  cooldown: 10
};

export const slashData = new SlashCommandBuilder()
  .setName('trivia')
  .setDescription('Play trivia with multiple categories and difficulty levels')
  .addStringOption(option =>
    option.setName('category')
      .setDescription('Trivia category')
      .setRequired(false)
      .addChoices(
        { name: 'General Knowledge', value: 'general' },
        { name: 'Science', value: 'science' },
        { name: 'History', value: 'history' },
        { name: 'Geography', value: 'geography' },
        { name: 'Entertainment', value: 'entertainment' },
        { name: 'Sports', value: 'sports' },
        { name: 'Technology', value: 'technology' },
        { name: 'Random', value: 'random' }
      )
  )
  .addStringOption(option =>
    option.setName('difficulty')
      .setDescription('Question difficulty')
      .setRequired(false)
      .addChoices(
        { name: 'Easy', value: 'easy' },
        { name: 'Medium', value: 'medium' },
        { name: 'Hard', value: 'hard' }
      )
  );

interface TriviaQuestion {
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
  category: string;
  difficulty: string;
}

const triviaQuestions: TriviaQuestion[] = [
  // General Knowledge
  {
    question: "What is the capital of France?",
    correct_answer: "Paris",
    incorrect_answers: ["London", "Berlin", "Madrid"],
    category: "general",
    difficulty: "easy"
  },
  {
    question: "Which planet is known as the Red Planet?",
    correct_answer: "Mars",
    incorrect_answers: ["Venus", "Jupiter", "Saturn"],
    category: "general",
    difficulty: "easy"
  },
  {
    question: "What is the largest ocean on Earth?",
    correct_answer: "Pacific Ocean",
    incorrect_answers: ["Atlantic Ocean", "Indian Ocean", "Arctic Ocean"],
    category: "general",
    difficulty: "easy"
  },
  // Science
  {
    question: "What is the chemical symbol for gold?",
    correct_answer: "Au",
    incorrect_answers: ["Ag", "Fe", "Cu"],
    category: "science",
    difficulty: "medium"
  },
  {
    question: "What is the hardest natural substance on Earth?",
    correct_answer: "Diamond",
    incorrect_answers: ["Steel", "Iron", "Platinum"],
    category: "science",
    difficulty: "medium"
  },
  {
    question: "What is the atomic number of carbon?",
    correct_answer: "6",
    incorrect_answers: ["5", "7", "8"],
    category: "science",
    difficulty: "hard"
  },
  // History
  {
    question: "In which year did World War II end?",
    correct_answer: "1945",
    incorrect_answers: ["1944", "1946", "1943"],
    category: "history",
    difficulty: "medium"
  },
  {
    question: "Who was the first President of the United States?",
    correct_answer: "George Washington",
    incorrect_answers: ["Thomas Jefferson", "John Adams", "Benjamin Franklin"],
    category: "history",
    difficulty: "easy"
  },
  {
    question: "What ancient wonder was located in Alexandria?",
    correct_answer: "Lighthouse",
    incorrect_answers: ["Colossus", "Temple", "Pyramid"],
    category: "history",
    difficulty: "hard"
  },
  // Geography
  {
    question: "What is the largest country in the world by area?",
    correct_answer: "Russia",
    incorrect_answers: ["China", "Canada", "United States"],
    category: "geography",
    difficulty: "easy"
  },
  {
    question: "Which mountain range runs through South America?",
    correct_answer: "Andes",
    incorrect_answers: ["Rocky Mountains", "Alps", "Himalayas"],
    category: "geography",
    difficulty: "medium"
  },
  {
    question: "What is the capital of Australia?",
    correct_answer: "Canberra",
    incorrect_answers: ["Sydney", "Melbourne", "Brisbane"],
    category: "geography",
    difficulty: "medium"
  },
  // Entertainment
  {
    question: "Who played Iron Man in the Marvel Cinematic Universe?",
    correct_answer: "Robert Downey Jr.",
    incorrect_answers: ["Chris Evans", "Chris Hemsworth", "Mark Ruffalo"],
    category: "entertainment",
    difficulty: "easy"
  },
  {
    question: "What year did the first Star Wars film release?",
    correct_answer: "1977",
    incorrect_answers: ["1975", "1979", "1980"],
    category: "entertainment",
    difficulty: "medium"
  },
  {
    question: "Which band released the album 'The Dark Side of the Moon'?",
    correct_answer: "Pink Floyd",
    incorrect_answers: ["Led Zeppelin", "The Beatles", "The Rolling Stones"],
    category: "entertainment",
    difficulty: "medium"
  },
  // Sports
  {
    question: "Which country has won the most FIFA World Cups?",
    correct_answer: "Brazil",
    incorrect_answers: ["Germany", "Argentina", "Italy"],
    category: "sports",
    difficulty: "medium"
  },
  {
    question: "What is the national sport of Japan?",
    correct_answer: "Sumo",
    incorrect_answers: ["Baseball", "Soccer", "Tennis"],
    category: "sports",
    difficulty: "hard"
  },
  {
    question: "In which year did the first modern Olympics take place?",
    correct_answer: "1896",
    incorrect_answers: ["1900", "1892", "1904"],
    category: "sports",
    difficulty: "hard"
  },
  // Technology
  {
    question: "What does CPU stand for?",
    correct_answer: "Central Processing Unit",
    incorrect_answers: ["Computer Personal Unit", "Central Program Utility", "Computer Processing Unit"],
    category: "technology",
    difficulty: "easy"
  },
  {
    question: "Who founded Microsoft?",
    correct_answer: "Bill Gates",
    incorrect_answers: ["Steve Jobs", "Mark Zuckerberg", "Elon Musk"],
    category: "technology",
    difficulty: "medium"
  },
  {
    question: "What year was the first iPhone released?",
    correct_answer: "2007",
    incorrect_answers: ["2005", "2006", "2008"],
    category: "technology",
    difficulty: "medium"
  }
];

interface GameSession {
  question: TriviaQuestion;
  answers: string[];
  correctAnswer: string;
  startTime: number;
  answered: boolean;
}

const activeGames = new Map<string, GameSession>();

function getRandomQuestion(category?: string, difficulty?: string): TriviaQuestion {
  let filteredQuestions = triviaQuestions;
  
  if (category && category !== 'random') {
    filteredQuestions = filteredQuestions.filter(q => q.category === category);
  }
  
  if (difficulty) {
    filteredQuestions = filteredQuestions.filter(q => q.difficulty === difficulty);
  }
  
  if (filteredQuestions.length === 0) {
    filteredQuestions = triviaQuestions; // Fallback to all questions
  }
  
  return filteredQuestions[Math.floor(Math.random() * filteredQuestions.length)];
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function getDifficultyColor(difficulty: string): number {
  switch (difficulty) {
    case 'easy': return 0x00FF00;
    case 'medium': return 0xFFFF00;
    case 'hard': return 0xFF0000;
    default: return 0x00FF00;
  }
}

export async function execute(message: Message, args?: string[]) {
  const userId = message.author.id;
  const category = args?.[0]?.toLowerCase();
  const difficulty = args?.[1]?.toLowerCase();
  
  // Validate category and difficulty
  const validCategories = ['general', 'science', 'history', 'geography', 'entertainment', 'sports', 'technology', 'random'];
  const validDifficulties = ['easy', 'medium', 'hard'];
  
  if (category && !validCategories.includes(category)) {
    await message.reply(`❌ Invalid category! Valid categories: ${validCategories.join(', ')}`);
    return;
  }
  
  if (difficulty && !validDifficulties.includes(difficulty)) {
    await message.reply(`❌ Invalid difficulty! Valid difficulties: ${validDifficulties.join(', ')}`);
    return;
  }
  
  const question = getRandomQuestion(category, difficulty);
  const answers = shuffleArray([question.correct_answer, ...question.incorrect_answers]);
  
  const gameSession: GameSession = {
    question,
    answers,
    correctAnswer: question.correct_answer,
    startTime: Date.now(),
    answered: false
  };
  
  activeGames.set(userId, gameSession);
  
  const embed = new EmbedBuilder()
    .setTitle('🎯 Trivia Question')
    .setDescription(`**${question.question}**`)
    .setColor(getDifficultyColor(question.difficulty))
    .addFields([
      { name: '📚 Category', value: question.category.charAt(0).toUpperCase() + question.category.slice(1), inline: true },
      { name: '🎚️ Difficulty', value: question.difficulty.charAt(0).toUpperCase() + question.difficulty.slice(1), inline: true },
      { name: '⏱️ Time Limit', value: '30 seconds', inline: true },
      { name: '📝 Options', value: answers.map((answer, index) => `${String.fromCharCode(65 + index)}. ${answer}`).join('\n'), inline: false }
    ])
    .setFooter({ text: 'Reply with A, B, C, or D to answer!' })
    .setTimestamp();
  
  await message.reply({ embeds: [embed] });
  
  // Set timeout to end game
      setTimeout(() => {
      const currentGame = activeGames.get(userId);
      if (currentGame && !currentGame.answered) {
        activeGames.delete(userId);
        if ('send' in message.channel) {
          message.channel.send(`⏰ Time's up! The correct answer was: **${question.correct_answer}**`);
        }
      }
    }, 30000);
}

export async function executeSlash(interaction: ChatInputCommandInteraction) {
  const userId = interaction.user.id;
  const category = interaction.options.getString('category')?.toLowerCase();
  const difficulty = interaction.options.getString('difficulty')?.toLowerCase();
  
  const question = getRandomQuestion(category, difficulty);
  const answers = shuffleArray([question.correct_answer, ...question.incorrect_answers]);
  
  const gameSession: GameSession = {
    question,
    answers,
    correctAnswer: question.correct_answer,
    startTime: Date.now(),
    answered: false
  };
  
  activeGames.set(userId, gameSession);
  
  const embed = new EmbedBuilder()
    .setTitle('🎯 Trivia Question')
    .setDescription(`**${question.question}**`)
    .setColor(getDifficultyColor(question.difficulty))
    .addFields([
      { name: '📚 Category', value: question.category.charAt(0).toUpperCase() + question.category.slice(1), inline: true },
      { name: '🎚️ Difficulty', value: question.difficulty.charAt(0).toUpperCase() + question.difficulty.slice(1), inline: true },
      { name: '⏱️ Time Limit', value: '30 seconds', inline: true },
      { name: '📝 Options', value: answers.map((answer, index) => `${String.fromCharCode(65 + index)}. ${answer}`).join('\n'), inline: false }
    ])
    .setFooter({ text: 'Reply with A, B, C, or D to answer!' })
    .setTimestamp();
  
  await interaction.reply({ embeds: [embed] });
  
  // Set timeout to end game
      setTimeout(() => {
      const currentGame = activeGames.get(userId);
      if (currentGame && !currentGame.answered) {
        activeGames.delete(userId);
        if (interaction.channel && 'send' in interaction.channel) {
          interaction.channel.send(`⏰ Time's up! The correct answer was: **${question.correct_answer}**`);
        }
      }
    }, 30000);
}

// Handle answer responses
export async function handleTriviaAnswer(message: Message) {
  const userId = message.author.id;
  const game = activeGames.get(userId);
  
  if (!game || game.answered) return false;
  
  const answer = message.content.trim().toUpperCase();
  const answerIndex = answer.charCodeAt(0) - 65; // A=0, B=1, C=2, D=3
  
  if (answerIndex < 0 || answerIndex >= game.answers.length) return false;
  
  const selectedAnswer = game.answers[answerIndex];
  const isCorrect = selectedAnswer === game.correctAnswer;
  const timeTaken = Math.floor((Date.now() - game.startTime) / 1000);
  
  game.answered = true;
  activeGames.delete(userId);
  
  const embed = new EmbedBuilder()
    .setTitle(isCorrect ? '✅ Correct!' : '❌ Incorrect!')
    .setDescription(`**${game.question.question}**`)
    .setColor(isCorrect ? 0x00FF00 : 0xFF0000)
    .addFields([
      { name: '🎯 Your Answer', value: selectedAnswer, inline: true },
      { name: '✅ Correct Answer', value: game.correctAnswer, inline: true },
      { name: '⏱️ Time Taken', value: `${timeTaken} seconds`, inline: true }
    ])
    .setFooter({ text: isCorrect ? 'Great job!' : 'Better luck next time!' })
    .setTimestamp();
  
  await message.reply({ embeds: [embed] });
  return true;
}

export { activeGames }; 
