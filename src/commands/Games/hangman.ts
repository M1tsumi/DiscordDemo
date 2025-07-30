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

import { MessageFlags, User, StringSelectMenuInteraction, EmbedField } from 'discord.js';
import { Command } from '../../types/Command';
export const data = {
  name: 'hangman',
  description: 'Play a team-based game of Hangman with friends!',
  aliases: ['hang', 'guess'],
  category: CommandCategory.GAMES,
  usage: '!hangman [difficulty]',
  cooldown: 5
};

export const slashData = new SlashCommandBuilder()
  .setName('hangman')
  .setDescription('Play a team-based game of Hangman with friends!')
  .addStringOption(option =>
    option.setName('difficulty')
      .setDescription('Choose difficulty level')
      .addChoices(
        { name: 'Easy (4-5 letters)', value: 'easy' },
        { name: 'Medium (6-7 letters)', value: 'medium' },
        { name: 'Hard (8+ letters)', value: 'hard' }
      )
      .setRequired(false)
  );

interface HangmanGame {
  word: string;
  guessedLetters: Set<string>;
  wrongGuesses: number;
  maxWrongGuesses: number;
  gameEnded: boolean;
  difficulty: string;
  category: string;
  gameId: string;
  channelId: string;
  starterId: string;
  players: Set<string>; // Players who have participated
  lastGuesses: Array<{ letter: string; playerId: string; playerName: string; correct: boolean }>; // Track recent guesses
  startTime: number;
  messageId?: string; // ID of the main game message to update
}

const words = {
  easy: {
    animals: ['CAT', 'DOG', 'FISH', 'BIRD', 'LION', 'BEAR', 'FROG', 'DUCK'],
    food: ['CAKE', 'BREAD', 'MILK', 'RICE', 'SOUP', 'MEAT', 'CORN', 'BEAN'],
    colors: ['BLUE', 'RED', 'GREEN', 'BLACK', 'WHITE', 'PINK', 'GRAY'],
    objects: ['BOOK', 'CHAIR', 'TABLE', 'PHONE', 'CLOCK', 'DOOR', 'WINDOW']
  },
  medium: {
    animals: ['ELEPHANT', 'GIRAFFE', 'PENGUIN', 'DOLPHIN', 'OCTOPUS', 'RABBIT', 'TURTLE'],
    technology: ['COMPUTER', 'INTERNET', 'WEBSITE', 'KEYBOARD', 'MONITOR', 'SPEAKER'],
    nature: ['MOUNTAIN', 'FOREST', 'DESERT', 'RAINBOW', 'THUNDER', 'GLACIER'],
    sports: ['FOOTBALL', 'TENNIS', 'CRICKET', 'HOCKEY', 'BOXING', 'SURFING']
  },
  hard: {
    science: ['CHEMISTRY', 'PHILOSOPHY', 'MATHEMATICS', 'PSYCHOLOGY', 'GEOGRAPHY', 'ASTRONOMY'],
    programming: ['JAVASCRIPT', 'ALGORITHM', 'DATABASE', 'FRAMEWORK', 'DEBUGGING', 'TYPESCRIPT'],
    advanced: ['EXTRAORDINARY', 'MAGNIFICENT', 'REVOLUTIONARY', 'SOPHISTICATED', 'INCOMPREHENSIBLE'],
    vocabulary: ['SERENDIPITY', 'MELANCHOLY', 'EPHEMERAL', 'WANDERLUST', 'ELOQUENCE', 'RESILIENCE']
  }
};

const hangmanStages = [
  "```\n  +---+\n      |\n      |\n      |\n      |\n      |\n=========\n```",
  "```\n  +---+\n  |   |\n      |\n      |\n      |\n      |\n=========\n```",
  "```\n  +---+\n  |   |\n  O   |\n      |\n      |\n      |\n=========\n```",
  "```\n  +---+\n  |   |\n  O   |\n  |   |\n      |\n      |\n=========\n```",
  "```\n  +---+\n  |   |\n  O   |\n /|   |\n      |\n      |\n=========\n```",
  "```\n  +---+\n  |   |\n  O   |\n /|\\  |\n      |\n      |\n=========\n```",
  "```\n  +---+\n  |   |\n  O   |\n /|\\  |\n /    |\n      |\n=========\n```",
  "```\n  +---+\n  |   |\n  O   |\n /|\\  |\n / \\  |\n      |\n=========\n```"
];

// Store games by gameId instead of userId to allow multiple players
const activeGames = new Map<string, HangmanGame>();

function getRandomWord(difficulty: string = 'medium'): { word: string; category: string } {
  const difficultyWords = words[difficulty as keyof typeof words] || words.medium;
  const categories = Object.keys(difficultyWords);
  const randomCategory = categories[Math.floor(Math.random() * categories.length)];
  const categoryWords = (difficultyWords as any)[randomCategory] as string[];
  const randomWord = categoryWords[Math.floor(Math.random() * categoryWords.length)];
  
  return { word: randomWord, category: randomCategory };
}

function createWordDisplay(word: string, guessedLetters: Set<string>): string {
  return word.split('').map(letter => 
    guessedLetters.has(letter) ? letter : '_'
  ).join(' ');
}

function createLetterButtons(guessedLetters: Set<string>, gameEnded: boolean): ActionRowBuilder<ButtonBuilder>[] {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const rows: ActionRowBuilder<ButtonBuilder>[] = [];
  
  // Discord limits: Max 5 ActionRows per message, Max 5 components per ActionRow
  // Create 4 rows of 5 letters each, then 1 row with remaining 6 letters + control buttons won't fit
  // So we'll do 5 rows: 5, 5, 5, 5, 5 letters (25 total) and handle Z in the last row with controls
  
  // First 4 rows: 5 letters each (20 letters total)
  for (let rowIndex = 0; rowIndex < 4; rowIndex++) {
    const row = new ActionRowBuilder<ButtonBuilder>();
    
    for (let i = 0; i < 5; i++) {
      const letterIndex = rowIndex * 5 + i;
      const letter = alphabet[letterIndex];
      const isGuessed = guessedLetters.has(letter);
      
      const button = new ButtonBuilder()
        .setCustomId(`hangman_letter_${letter}`)
        .setLabel(letter)
        .setStyle(isGuessed ? ButtonStyle.Secondary : ButtonStyle.Primary)
        .setDisabled(isGuessed || gameEnded);
      
      row.addComponents(button);
    }
    
    rows.push(row);
  }
  
  // Last row: remaining letters (UVWXYZ) - need to fit in 5 components max
  // We'll include U,V,W,X,Y and mention Z can be typed in chat
  const lastRow = new ActionRowBuilder<ButtonBuilder>();
  for (let i = 20; i < 25; i++) {
    const letter = alphabet[i]; // UVWXY (skipping Z for now)
    const isGuessed = guessedLetters.has(letter);
    
    const button = new ButtonBuilder()
      .setCustomId(`hangman_letter_${letter}`)
      .setLabel(letter)
      .setStyle(isGuessed ? ButtonStyle.Secondary : ButtonStyle.Primary)
      .setDisabled(isGuessed || gameEnded);
    
    lastRow.addComponents(button);
  }
  
  rows.push(lastRow);
  
  return rows;
}

function createGameEmbed(game: HangmanGame, client: any): EmbedBuilder {
  const wordDisplay = createWordDisplay(game.word, game.guessedLetters);
  const wrongLetters = Array.from(game.guessedLetters).filter(letter =>
    !game.word.includes(letter)
  );

  // Get team member names
  const teamMembers = Array.from(game.players).map(playerId => {
    const user = client.users.cache.get(playerId);
    return user ? user.username : 'Unknown Player';
  }).slice(0, 5); // Show max 5 players

  // Show recent guesses with player names
  const recentGuesses = game.lastGuesses.slice(-3).map(guess => {
    const status = guess.correct ? '✅' : '❌';
    return `${status} **${guess.letter}** by ${guess.playerName}`;
  });

  const timeElapsed = Math.floor((Date.now() - game.startTime) / 1000);
  const minutes = Math.floor(timeElapsed / 60);
  const seconds = timeElapsed % 60;

  let title = '🎮 **Team Hangman**';
  let description = '';
  let color = game.wrongGuesses >= 6 ? 0xe74c3c : game.wrongGuesses >= 4 ? 0xf39c12 : 0x3498db;

  if (game.gameEnded) {
    const isWin = !game.word.split('').some(letter => !game.guessedLetters.has(letter));
    title = isWin ? '🎉 **Team Victory!**' : '💀 **Game Over!**';
    color = isWin ? 0x27ae60 : 0xe74c3c;

    if (isWin) {
      description = 
        `🏆 **Congratulations Team!** You guessed the word!\n\n` +
        `**Word:** \`${game.word}\`\n` +
        `**Category:** ${game.category}\n` +
        `**Difficulty:** ${game.difficulty}\n` +
        `**Team Size:** ${game.players.size} player${game.players.size === 1 ? '' : 's'}\n` +
        `**Wrong Guesses:** ${game.wrongGuesses}/${game.maxWrongGuesses}\n` +
        `**Time:** ${minutes}m ${seconds}s\n\n` +
        `🎊 **Team Members:** ${teamMembers.join(', ')}\n\n` +
        `Well done everyone! 🏆`;
    } else {
      description = 
        `💀 **The word was:** \`${game.word}\`\n\n` +
        `${hangmanStages[game.wrongGuesses]}\n` +
        `**Category:** ${game.category}\n` +
        `**Difficulty:** ${game.difficulty}\n` +
        `**Team Size:** ${game.players.size} player${game.players.size === 1 ? '' : 's'}\n` +
        `**Time:** ${minutes}m ${seconds}s\n\n` +
        `🤝 **Team Members:** ${teamMembers.join(', ')}\n\n` +
        `Better luck next time! 🎯`;
    }
  } else {
    description = 
      `**Category:** ${game.category.charAt(0).toUpperCase() + game.category.slice(1)}\n` +
      `**Difficulty:** ${game.difficulty.charAt(0).toUpperCase() + game.difficulty.slice(1)}\n` +
      `**Team Size:** ${game.players.size} player${game.players.size === 1 ? '' : 's'}\n` +
      `**Time:** ${minutes}m ${seconds}s\n\n` +
      `${hangmanStages[game.wrongGuesses]}\n` +
      `**Word:** \`${wordDisplay}\`\n\n` +
      `**Wrong Letters:** ${wrongLetters.length > 0 ? wrongLetters.join(', ') : 'None'}\n` +
      `**Remaining Guesses:** ${game.maxWrongGuesses - game.wrongGuesses}\n\n`;

    if (recentGuesses.length > 0) {
      description += `**Recent Guesses:**\n${recentGuesses.join('\n')}\n\n`;
    }

    description += 
      `🤝 **Team:** ${teamMembers.join(', ')}${game.players.size > 5 ? ` +${game.players.size - 5} more` : ''}\n\n` +
      `🎯 Anyone can help! Click letter buttons or type **Z** in chat!\n` +
      `💡 Type **hint** for a clue | 🎮 Type **newgame** to restart`;
  }

  const embed = new EmbedBuilder()
    .setTitle(title)
    .setDescription(description)
    .setColor(color)
    .setFooter({ text: 'Team Hangman • Everyone can contribute to win together!' });

  if (game.gameEnded) {
    const isWin = !game.word.split('').some(letter => !game.guessedLetters.has(letter));
    embed.setTitle(isWin ? '🎉 **You Win!**' : '💀 **Game Over!**');
    
    if (isWin) {
      embed.setDescription(
        `🎊 **Congratulations!** You guessed the word!\n\n` +
        `**Word:** \`${game.word}\`\n` +
        `**Category:** ${game.category}\n` +
        `**Difficulty:** ${game.difficulty}\n` +
        `**Wrong Guesses:** ${game.wrongGuesses}/${game.maxWrongGuesses}\n\n` +
        `Well done! 🏆`
      );
      embed.setColor(0x27ae60);
    } else {
      embed.setDescription(
        `💀 **The word was:** \`${game.word}\`\n\n` +
        `${hangmanStages[game.wrongGuesses]}\n` +
        `**Category:** ${game.category}\n` +
        `**Difficulty:** ${game.difficulty}\n\n` +
        `Better luck next time! 🎯`
      );
      embed.setColor(0xe74c3c);
    }
  }

  return embed;
}

export async function execute(message: Message, args?: string[]) {
  const difficulty = args?.[0]?.toLowerCase() || 'medium';
  const validDifficulties = ['easy', 'medium', 'hard'];
  
  const selectedDifficulty = validDifficulties.includes(difficulty) ? difficulty : 'medium';
  const { word, category } = getRandomWord(selectedDifficulty);
  
  const gameId = `hangman_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  const game: HangmanGame = {
    word: word,
    guessedLetters: new Set(),
    wrongGuesses: 0,
    maxWrongGuesses: 7,
    gameEnded: false,
    difficulty: selectedDifficulty,
    category: category,
    gameId: gameId,
    channelId: message.channel.id,
    starterId: message.author.id,
    players: new Set([message.author.id]),
    lastGuesses: [],
    startTime: Date.now()
  };

  activeGames.set(gameId, game);

  const embed = createGameEmbed(game, message.client);
  const letterButtons = createLetterButtons(game.guessedLetters, game.gameEnded);

  const gameMessage = await message.reply({ 
    content: `🎮 **Team Hangman Started!**\n🤝 Anyone can join by clicking buttons or typing in chat!`,
    embeds: [embed], 
    components: letterButtons 
  });

  // Store the message ID for updates
  game.messageId = gameMessage.id;

  // Auto-cleanup after 30 minutes
  setTimeout(() => {
    activeGames.delete(gameId);
  }, 1800000);
}

export async function executeSlash(interaction: ChatInputCommandInteraction) {
  const difficulty = interaction.options.getString('difficulty') || 'medium';
  const { word, category } = getRandomWord(difficulty);
  
  const gameId = `hangman_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  const game: HangmanGame = {
    word: word,
    guessedLetters: new Set(),
    wrongGuesses: 0,
    maxWrongGuesses: 7,
    gameEnded: false,
    difficulty: difficulty,
    category: category,
    gameId: gameId,
    channelId: interaction.channel?.id || '',
    starterId: interaction.user.id,
    players: new Set([interaction.user.id]),
    lastGuesses: [],
    startTime: Date.now()
  };

  activeGames.set(gameId, game);

  const embed = createGameEmbed(game, interaction.client);
  const letterButtons = createLetterButtons(game.guessedLetters, game.gameEnded);

  const reply = await interaction.reply({ 
    content: `🎮 **Team Hangman Started!**\n🤝 Anyone can join by clicking buttons or typing in chat!`,
    embeds: [embed], 
    components: letterButtons 
  });

  // Store the message ID for updates
  const replyMessage = await interaction.fetchReply();
  game.messageId = replyMessage.id;

  // Auto-cleanup after 30 minutes
  setTimeout(() => {
    activeGames.delete(gameId);
  }, 1800000);
}

export async function handleHangmanInteraction(interaction: any) {
  if (!interaction.isButton()) return;

  const customId = interaction.customId;
  if (!customId.startsWith('hangman_')) return;

  const parts = customId.split('_');

  if (parts[1] === 'letter') {
    // Letter guess
    const letter = parts[2];
    
    // Find the game in this channel
    let game: HangmanGame | null = null;
    for (const [gameId, g] of activeGames) {
      if (g.channelId === interaction.channel?.id && !g.gameEnded) {
        game = g;
        break;
      }
    }

    if (!game) {
      return interaction.reply({
        content: '❌ No active hangman game in this channel! Start one with `/hangman`',
        flags: MessageFlags.Ephemeral
      });
    }

    if (game.gameEnded) {
      return interaction.reply({
        content: '❌ This game has already ended! Start a new one.',
        flags: MessageFlags.Ephemeral
      });
    }

    // Check if letter was already guessed
    if (game.guessedLetters.has(letter)) {
      return interaction.reply({
        content: `❌ The letter **${letter}** has already been guessed!`,
        flags: MessageFlags.Ephemeral
      });
    }

    // Add player to the game if not already in
    game.players.add(interaction.user.id);

    // Make the guess
    game.guessedLetters.add(letter);
    const isCorrect = game.word.includes(letter);
    
    if (!isCorrect) {
      game.wrongGuesses++;
    }

    // Track the guess
    game.lastGuesses.push({
      letter: letter,
      playerId: interaction.user.id,
      playerName: interaction.user.username,
      correct: isCorrect
    });

    // Keep only last 10 guesses
    if (game.lastGuesses.length > 10) {
      game.lastGuesses = game.lastGuesses.slice(-10);
    }

    // Check win condition
    const isWin = game.word.split('').every(l => game.guessedLetters.has(l));
    const isLose = game.wrongGuesses >= game.maxWrongGuesses;

    if (isWin || isLose) {
      game.gameEnded = true;
    }

    // Acknowledge the guess privately
    await interaction.reply({
      content: `${isCorrect ? '✅' : '❌'} You guessed **${letter}**! ${isCorrect ? 'Good job!' : 'Not in the word.'}`,
      flags: MessageFlags.Ephemeral
    });

    const embed = createGameEmbed(game, interaction.client);
    const letterButtons = createLetterButtons(game.guessedLetters, game.gameEnded);

    // Update the original game message
    if (game.messageId && interaction.channel && 'messages' in interaction.channel) {
      try {
        const originalMessage = await interaction.channel.messages.fetch(game.messageId);
        await originalMessage.edit({ embeds: [embed], components: letterButtons });
      } catch (error) {
        console.error('Failed to update hangman game message:', error);
        // Fallback: try to find the message by searching
        try {
          const messages = await interaction.channel.messages.fetch({ limit: 50 });
          const gameMessage = messages.find((m: any) => 
            m.author.id === interaction.client.user?.id && 
            m.embeds.length > 0 && 
            m.embeds[0].title?.includes('Hangman')
          );
          if (gameMessage) {
            await gameMessage.edit({ embeds: [embed], components: letterButtons });
            game.messageId = gameMessage.id; // Update stored ID
          }
        } catch (fallbackError) {
          console.error('Failed to find and update hangman game message:', fallbackError);
        }
      }
    }
  }
}

export async function handleHangmanMessage(message: Message): Promise<boolean> {
  // Find the game in this channel
  let game: HangmanGame | null = null;
  for (const [gameId, g] of activeGames) {
    if (g.channelId === message.channel.id && !g.gameEnded) {
      game = g;
      break;
    }
  }

  if (!game) return false; // No active game in this channel

  const content = message.content.toLowerCase().trim();
  
      // Handle letter Z
    if (content === 'z') {
      if (game.guessedLetters.has('Z')) return false; // Already guessed
    
    // Add player to the game if not already in
    game.players.add(message.author.id);
    
    // Process the Z guess
    game.guessedLetters.add('Z');
    const isCorrect = game.word.includes('Z');
    
    if (!isCorrect) {
      game.wrongGuesses++;
    }

    // Track the guess
    game.lastGuesses.push({
      letter: 'Z',
      playerId: message.author.id,
      playerName: message.author.username,
      correct: isCorrect
    });

    // Keep only last 10 guesses
    if (game.lastGuesses.length > 10) {
      game.lastGuesses = game.lastGuesses.slice(-10);
    }

    // Check win condition
    const isWin = game.word.split('').every(l => game.guessedLetters.has(l));
    const isLose = game.wrongGuesses >= game.maxWrongGuesses;

    if (isWin || isLose) {
      game.gameEnded = true;
    }

    const embed = createGameEmbed(game, message.client);
    const letterButtons = createLetterButtons(game.guessedLetters, game.gameEnded);

    // Send a quick acknowledgment
    const ackMessage = await message.reply(`${isCorrect ? '✅' : '❌'} **${message.author.username}** guessed **Z**! ${isCorrect ? 'Great job!' : 'Not in the word.'}`);
    
    // Update the original game message
    if (game.messageId) {
      try {
        const originalMessage = await message.channel.messages.fetch(game.messageId);
        await originalMessage.edit({ embeds: [embed], components: letterButtons });
      } catch (error) {
        console.error('Failed to update hangman game message:', error);
      }
    }

    // Delete the acknowledgment after a short delay to keep chat clean
    setTimeout(async () => {
      try {
        await ackMessage.delete();
      } catch {
        // Ignore deletion errors
      }
    }, 3000); // Delete after 3 seconds
    
    return true;
  }

  // Handle hint command
  if (content === 'hint') {
    if (game.gameEnded) {
      await message.reply('❌ The game has already ended!');
      return true;
    }

    // Find an unguessed letter
    const unguessedLetters = game.word.split('').filter(letter => !game.guessedLetters.has(letter));
    if (unguessedLetters.length === 0) {
      await message.reply('❌ All letters have been guessed!');
      return true;
    }

    const hintLetter = unguessedLetters[Math.floor(Math.random() * unguessedLetters.length)];
    await message.reply(`💡 **Hint for the team:** The word contains the letter **${hintLetter}**!`);
    return true;
  }

  // Handle new game command - only the starter or any team member can restart
  if (content === 'newgame' || content === 'new game') {
    // Only allow team members to start new games
    if (!game.players.has(message.author.id)) {
      await message.reply('❌ Only team members can start a new game! Join the current game first by making a guess.');
      return true;
    }

    const difficulty = game.difficulty;
    const { word, category } = getRandomWord(difficulty);
    
    const newGameId = `hangman_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const newGame: HangmanGame = {
      word: word,
      guessedLetters: new Set(),
      wrongGuesses: 0,
      maxWrongGuesses: 7,
      gameEnded: false,
      difficulty: difficulty,
      category: category,
      gameId: newGameId,
      channelId: message.channel.id,
      starterId: message.author.id,
      players: new Set([message.author.id]), // Start fresh with just the restarter
      lastGuesses: [],
      startTime: Date.now()
    };

    // Remove old game
    activeGames.delete(game.gameId);
    activeGames.set(newGameId, newGame);

    const embed = createGameEmbed(newGame, message.client);
    const letterButtons = createLetterButtons(newGame.guessedLetters, newGame.gameEnded);

    // Send acknowledgment that new game started
    const ackMessage = await message.reply(`🎮 **${message.author.username}** started a new Team Hangman game!`);
    
    // Update the original game message with the new game
    if (game.messageId) {
      try {
        const originalMessage = await message.channel.messages.fetch(game.messageId);
        await originalMessage.edit({ 
          content: `🎮 **Team Hangman**\n🤝 Anyone can join by clicking buttons or typing in chat!`,
          embeds: [embed], 
          components: letterButtons 
        });
        newGame.messageId = game.messageId; // Transfer the message ID to new game
      } catch (error) {
        console.error('Failed to update hangman game message:', error);
      }
    }

    // Delete the acknowledgment after a short delay
    setTimeout(async () => {
      try {
        await ackMessage.delete();
      } catch {
        // Ignore deletion errors
      }
    }, 3000);

    // Auto-cleanup after 30 minutes
    setTimeout(() => {
      activeGames.delete(newGameId);
    }, 1800000);
    
    return true;
  }
  
  return false; // No game interaction handled
} 
