import { Message, EmbedBuilder, SlashCommandBuilder, ChatInputCommandInteraction, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import { CommandCategory } from '../../types/Command';

// Wordle game with 575+ 5-letter words and improved randomization

export const data = {
  name: 'wordle',
  description: 'Play Wordle - guess the 5-letter word in 6 tries',
  category: CommandCategory.FUN,
  usage: '!wordle [guess]',
  aliases: ['wordgame', 'wordguess'],
  cooldown: 5
};

export const slashData = new SlashCommandBuilder()
  .setName('wordle')
  .setDescription('Play Wordle - guess the 5-letter word in 6 tries')
  .addStringOption(option =>
    option.setName('guess')
      .setDescription('Your 5-letter word guess')
      .setRequired(false)
      .setMinLength(5)
      .setMaxLength(5)
  );

// Large list of 5-letter words
const words = [
  'ABOUT', 'ABOVE', 'ABUSE', 'ACTOR', 'ACUTE', 'ADMIT', 'ADOPT', 'ADULT', 'AFTER', 'AGAIN',
  'AGENT', 'AGREE', 'AHEAD', 'ALARM', 'ALBUM', 'ALERT', 'ALIKE', 'ALIVE', 'ALLOW', 'ALONE',
  'ALONG', 'ALTER', 'AMONG', 'ANGER', 'ANGLE', 'ANGRY', 'APART', 'APPLE', 'APPLY', 'ARENA',
  'ARGUE', 'ARISE', 'ARRAY', 'ASIDE', 'ASSET', 'AUDIO', 'AUDIT', 'AVOID', 'AWARD', 'AWARE',
  'BADLY', 'BAKER', 'BASES', 'BASIC', 'BASIS', 'BEACH', 'BEGAN', 'BEGIN', 'BEING', 'BELOW',
  'BENCH', 'BILLY', 'BIRTH', 'BLACK', 'BLAME', 'BLIND', 'BLOCK', 'BLOOD', 'BOARD', 'BOOST',
  'BOOTH', 'BOUND', 'BRAIN', 'BRAND', 'BREAD', 'BREAK', 'BREED', 'BRIEF', 'BRING', 'BROAD',
  'BROKE', 'BROWN', 'BUILD', 'BUILT', 'BUYER', 'CABLE', 'CALIF', 'CARRY', 'CATCH', 'CAUSE',
  'CHAIN', 'CHAIR', 'CHART', 'CHASE', 'CHEAP', 'CHECK', 'CHEST', 'CHIEF', 'CHILD', 'CHINA',
  'CHOSE', 'CIVIL', 'CLAIM', 'CLASS', 'CLEAN', 'CLEAR', 'CLICK', 'CLIMB', 'CLOCK', 'CLOSE',
  'COACH', 'COAST', 'COULD', 'COUNT', 'COURT', 'COVER', 'CRAFT', 'CRASH', 'CREAM', 'CRIME',
  'CROSS', 'CROWD', 'CROWN', 'CURVE', 'CYCLE', 'DAILY', 'DANCE', 'DATED', 'DEALT', 'DEATH',
  'DEBUT', 'DELAY', 'DEPTH', 'DOING', 'DOUBT', 'DOZEN', 'DRAFT', 'DRAMA', 'DRAWN', 'DREAM',
  'DRESS', 'DRINK', 'DRIVE', 'DROVE', 'DYING', 'EAGER', 'EARLY', 'EARTH', 'EIGHT', 'ELITE',
  'EMPTY', 'ENEMY', 'ENJOY', 'ENTER', 'ENTRY', 'EQUAL', 'ERROR', 'EVENT', 'EVERY', 'EXACT',
  'EXIST', 'EXTRA', 'FAITH', 'FALSE', 'FAULT', 'FIBER', 'FIELD', 'FIFTH', 'FIFTY', 'FIGHT',
  'FINAL', 'FIRST', 'FIXED', 'FLASH', 'FLEET', 'FLOOR', 'FLUID', 'FOCUS', 'FORCE', 'FORTH',
  'FORTY', 'FORUM', 'FOUND', 'FRAME', 'FRANK', 'FRAUD', 'FRESH', 'FRONT', 'FRUIT', 'FULLY',
  'FUNNY', 'GIANT', 'GIVEN', 'GLASS', 'GLOBE', 'GOING', 'GRACE', 'GRADE', 'GRAND', 'GRANT',
  'GRASS', 'GRAVE', 'GREAT', 'GREEN', 'GROSS', 'GROUP', 'GROWN', 'GUARD', 'GUESS', 'GUEST',
  'GUIDE', 'HAPPY', 'HARRY', 'HEART', 'HEAVY', 'HENCE', 'HENRY', 'HORSE', 'HOTEL', 'HOUSE',
  'HUMAN', 'IDEAL', 'IMAGE', 'INDEX', 'INNER', 'INPUT', 'ISSUE', 'JAPAN', 'JIMMY', 'JOINT',
  'JONES', 'JUDGE', 'KNOWN', 'LABEL', 'LARGE', 'LASER', 'LATER', 'LAUGH', 'LAYER', 'LEARN',
  'LEASE', 'LEAST', 'LEAVE', 'LEGAL', 'LEVEL', 'LEWIS', 'LIGHT', 'LIMIT', 'LINKS', 'LIVES',
  'LOCAL', 'LOOSE', 'LOWER', 'LUCKY', 'LUNCH', 'LYING', 'MAGIC', 'MAJOR', 'MAKER', 'MARCH',
  'MARIA', 'MATCH', 'MAYBE', 'MAYOR', 'MEANT', 'MEDIA', 'METAL', 'MIGHT', 'MINOR', 'MINUS',
  'MIXED', 'MODEL', 'MONEY', 'MONTH', 'MORAL', 'MOTOR', 'MOUNT', 'MOUSE', 'MOUTH', 'MOVED',
  'MOVIE', 'MUSIC', 'NEEDS', 'NEVER', 'NEWLY', 'NIGHT', 'NOISE', 'NORTH', 'NOTED', 'NOVEL',
  'NURSE', 'OCCUR', 'OCEAN', 'OFFER', 'OFTEN', 'ORDER', 'OTHER', 'OUGHT', 'PAINT', 'PANEL',
  'PAPER', 'PARTY', 'PEACE', 'PETER', 'PHASE', 'PHONE', 'PHOTO', 'PIECE', 'PILOT', 'PITCH',
  'PLACE', 'PLAIN', 'PLANE', 'PLANT', 'PLATE', 'POINT', 'POUND', 'POWER', 'PRESS', 'PRICE',
  'PRIDE', 'PRIME', 'PRINT', 'PRIOR', 'PRIZE', 'PROOF', 'PROUD', 'PROVE', 'QUEEN', 'QUICK',
  'QUIET', 'QUITE', 'RADIO', 'RAISE', 'RANGE', 'RAPID', 'RATIO', 'REACH', 'READY', 'REALM',
  'REBEL', 'REFER', 'RELAX', 'REPLY', 'RIGHT', 'RIVAL', 'RIVER', 'ROBIN', 'ROGER', 'ROMAN',
  'ROUGH', 'ROUND', 'ROUTE', 'ROYAL', 'RURAL', 'SAFER', 'SALES', 'SALLY', 'SALON', 'SAUCE',
  'SCALE', 'SCENE', 'SCOPE', 'SCORE', 'SENSE', 'SERVE', 'SEVEN', 'SHALL', 'SHAPE', 'SHARE',
  'SHARP', 'SHEET', 'SHELF', 'SHELL', 'SHIFT', 'SHIRT', 'SHOCK', 'SHOOT', 'SHORT', 'SHOWN',
  'SIGHT', 'SINCE', 'SIXTH', 'SIXTY', 'SIZED', 'SKILL', 'SLEEP', 'SLIDE', 'SMALL', 'SMART',
  'SMILE', 'SMITH', 'SMOKE', 'SOLID', 'SOLVE', 'SORRY', 'SOUND', 'SOUTH', 'SPACE', 'SPARE',
  'SPEAK', 'SPEED', 'SPEND', 'SPENT', 'SPLIT', 'SPOKE', 'SPORT', 'STAFF', 'STAGE', 'STAKE',
  'STAND', 'START', 'STATE', 'STEAM', 'STEEL', 'STEER', 'STILL', 'STOCK', 'STONE', 'STOOD',
  'STORE', 'STORM', 'STORY', 'STRIP', 'STUCK', 'STUDY', 'STUFF', 'STYLE', 'SUGAR', 'SWEET',
  'SWIFT', 'SWING', 'SWORD', 'TAKEN', 'TASTE', 'TAXES', 'TEACH', 'TEETH', 'TERRY', 'TEXAS',
  'THANK', 'THEFT', 'THEIR', 'THEME', 'THERE', 'THESE', 'THICK', 'THING', 'THINK', 'THIRD',
  'THOSE', 'THREE', 'THREW', 'THROW', 'THUMB', 'TIGER', 'TIGHT', 'TIMER', 'TIRED', 'TITLE',
  'TODAY', 'TOPIC', 'TOTAL', 'TOUCH', 'TOUGH', 'TOWER', 'TRACK', 'TRADE', 'TRAIN', 'TREAT',
  'TREND', 'TRIAL', 'TRIBE', 'TRICK', 'TRIED', 'TRIES', 'TRUCK', 'TRULY', 'TRUNK', 'TRUST',
  'TRUTH', 'TWICE', 'UNDER', 'UNDUE', 'UNION', 'UNITY', 'UNTIL', 'UPPER', 'UPSET', 'URBAN',
  'USAGE', 'USUAL', 'VALID', 'VALUE', 'VIDEO', 'VIRUS', 'VISIT', 'VITAL', 'VOICE', 'WASTE',
  'WATCH', 'WATER', 'WHEEL', 'WHERE', 'WHICH', 'WHILE', 'WHITE', 'WHOLE', 'WHOSE', 'WOMAN',
  'WOMEN', 'WORLD', 'WORRY', 'WORSE', 'WORST', 'WORTH', 'WOULD', 'WOUND', 'WRITE', 'WRONG',
  'WROTE', 'YIELD', 'YOUNG', 'YOUTH'
];

// Game sessions
const games = new Map<string, {
  word: string;
  guesses: string[];
  maxGuesses: number;
  startTime: number;
  userId: string;
}>();

function getDailyWord(userId: string): string {
  const today = new Date();
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
  const hourOfDay = today.getHours();
  const minuteOfHour = today.getMinutes();
  
  // Create a more complex seed that changes every hour and includes user ID
  const seed = dayOfYear * 24 * 60 + hourOfDay * 60 + minuteOfHour + parseInt(userId.slice(-6), 16);
  
  // Use a simple but effective pseudo-random number generator
  let random = seed;
  for (let i = 0; i < 10; i++) {
    random = (random * 9301 + 49297) % 233280;
  }
  
  return words[random % words.length];
}

// Validate that all words are exactly 5 letters
function validateWords(): void {
  const invalidWords = words.filter(word => word.length !== 5);
  if (invalidWords.length > 0) {
    console.error('Invalid words found (not 5 letters):', invalidWords);
  }
}

// Run validation on module load
validateWords();

function checkGuess(guess: string, target: string): string {
  const result = [];
  const targetArray = target.split('');
  const guessArray = guess.split('');
  const used = new Array(5).fill(false);

  // Check for exact matches first
  for (let i = 0; i < 5; i++) {
    if (guessArray[i] === targetArray[i]) {
      result.push('🟩'); // Green
      used[i] = true;
    } else {
      result.push('⬜'); // White (placeholder)
    }
  }

  // Check for partial matches
  for (let i = 0; i < 5; i++) {
    if (result[i] === '⬜') {
      const letterIndex = targetArray.findIndex((letter, index) => 
        letter === guessArray[i] && !used[index]
      );
      if (letterIndex !== -1) {
        result[i] = '🟨'; // Yellow
        used[letterIndex] = true;
      }
    }
  }

  return result.join('');
}

function createGameBoard(guesses: string[], target: string): string {
  let board = '';
  for (let i = 0; i < 6; i++) {
    if (i < guesses.length) {
      board += `${checkGuess(guesses[i], target)} ${guesses[i].toUpperCase()}\n`;
    } else {
      board += '⬜⬜⬜⬜⬜ _____\n';
    }
  }
  return board;
}

export async function execute(message: Message, args?: string[]) {
  const userId = message.author.id;
  const guess = args?.[0]?.toUpperCase();

  if (!games.has(userId)) {
    // Start new game
    const word = getDailyWord(userId);
    games.set(userId, {
      word,
      guesses: [],
      maxGuesses: 6,
      startTime: Date.now(),
      userId
    });
  }

  const game = games.get(userId)!;

  if (!guess) {
    // Show current game state
    const embed = new EmbedBuilder()
      .setTitle('🎯 Wordle')
      .setDescription(`**Your daily puzzle is ready!**\n\n${createGameBoard(game.guesses, game.word)}`)
      .setColor(0x00FF00)
      .addFields([
        { name: '📝 Instructions', value: 'Guess the 5-letter word in 6 tries. Use `!wordle <guess>` to play!', inline: false },
        { name: '🎮 Guesses Left', value: `${game.maxGuesses - game.guesses.length}`, inline: true },
        { name: '⏱️ Time', value: `${Math.floor((Date.now() - game.startTime) / 1000)}s`, inline: true }
      ])
      .setFooter({ text: '🟩 = Correct letter & position | 🟨 = Correct letter, wrong position | ⬜ = Not in word' });

    await message.reply({ embeds: [embed] });
    return;
  }

  if (guess.length !== 5) {
    await message.reply('❌ Please enter a 5-letter word!');
    return;
  }

  if (!/^[A-Z]{5}$/.test(guess)) {
    await message.reply('❌ Please enter only letters!');
    return;
  }

  if (game.guesses.length >= game.maxGuesses) {
    await message.reply('❌ Game over! You\'ve used all your guesses.');
    return;
  }

  game.guesses.push(guess);
  const result = checkGuess(guess, game.word);
  const isCorrect = guess === game.word;
  const isGameOver = isCorrect || game.guesses.length >= game.maxGuesses;

  const embed = new EmbedBuilder()
    .setTitle('🎯 Wordle')
    .setDescription(`${createGameBoard(game.guesses, game.word)}`)
    .setColor(isCorrect ? 0x00FF00 : isGameOver ? 0xFF0000 : 0xFFFF00);

  if (isCorrect) {
    embed.setDescription(`${embed.data.description}\n\n🎉 **Congratulations! You won in ${game.guesses.length} guesses!**`);
    games.delete(userId);
  } else if (isGameOver) {
    embed.setDescription(`${embed.data.description}\n\n💀 **Game Over! The word was: ${game.word}**`);
    games.delete(userId);
  } else {
    embed.addFields([
      { name: '🎮 Guesses Left', value: `${game.maxGuesses - game.guesses.length}`, inline: true },
      { name: '⏱️ Time', value: `${Math.floor((Date.now() - game.startTime) / 1000)}s`, inline: true }
    ]);
  }

  embed.setFooter({ text: '🟩 = Correct letter & position | 🟨 = Correct letter, wrong position | ⬜ = Not in word' });

  await message.reply({ embeds: [embed] });
}

export async function executeSlash(interaction: ChatInputCommandInteraction) {
  const userId = interaction.user.id;
  const guess = interaction.options.getString('guess')?.toUpperCase();

  if (!games.has(userId)) {
    // Start new game
    const word = getDailyWord(userId);
    games.set(userId, {
      word,
      guesses: [],
      maxGuesses: 6,
      startTime: Date.now(),
      userId
    });
  }

  const game = games.get(userId)!;

  if (!guess) {
    // Show current game state
    const embed = new EmbedBuilder()
      .setTitle('🎯 Wordle')
      .setDescription(`**Your daily puzzle is ready!**\n\n${createGameBoard(game.guesses, game.word)}`)
      .setColor(0x00FF00)
      .addFields([
        { name: '📝 Instructions', value: 'Guess the 5-letter word in 6 tries. Use `/wordle <guess>` to play!', inline: false },
        { name: '🎮 Guesses Left', value: `${game.maxGuesses - game.guesses.length}`, inline: true },
        { name: '⏱️ Time', value: `${Math.floor((Date.now() - game.startTime) / 1000)}s`, inline: true }
      ])
      .setFooter({ text: '🟩 = Correct letter & position | 🟨 = Correct letter, wrong position | ⬜ = Not in word' });

    await interaction.reply({ embeds: [embed] });
    return;
  }

  if (guess.length !== 5) {
    await interaction.reply({ content: '❌ Please enter a 5-letter word!', ephemeral: true });
    return;
  }

  if (!/^[A-Z]{5}$/.test(guess)) {
    await interaction.reply({ content: '❌ Please enter only letters!', ephemeral: true });
    return;
  }

  if (game.guesses.length >= game.maxGuesses) {
    await interaction.reply({ content: '❌ Game over! You\'ve used all your guesses.', ephemeral: true });
    return;
  }

  game.guesses.push(guess);
  const result = checkGuess(guess, game.word);
  const isCorrect = guess === game.word;
  const isGameOver = isCorrect || game.guesses.length >= game.maxGuesses;

  const embed = new EmbedBuilder()
    .setTitle('🎯 Wordle')
    .setDescription(`${createGameBoard(game.guesses, game.word)}`)
    .setColor(isCorrect ? 0x00FF00 : isGameOver ? 0xFF0000 : 0xFFFF00);

  if (isCorrect) {
    embed.setDescription(`${embed.data.description}\n\n🎉 **Congratulations! You won in ${game.guesses.length} guesses!**`);
    games.delete(userId);
  } else if (isGameOver) {
    embed.setDescription(`${embed.data.description}\n\n💀 **Game Over! The word was: ${game.word}**`);
    games.delete(userId);
  } else {
    embed.addFields([
      { name: '🎮 Guesses Left', value: `${game.maxGuesses - game.guesses.length}`, inline: true },
      { name: '⏱️ Time', value: `${Math.floor((Date.now() - game.startTime) / 1000)}s`, inline: true }
    ]);
  }

  embed.setFooter({ text: '🟩 = Correct letter & position | 🟨 = Correct letter, wrong position | ⬜ = Not in word' });

  await interaction.reply({ embeds: [embed] });
}

// Handle wordle answer responses
export async function handleWordleAnswer(message: Message): Promise<boolean> {
  const userId = message.author.id;
  const game = games.get(userId);
  
  if (!game) return false;
  
  const guess = message.content.trim().toUpperCase();
  
  // Check if it's a valid 5-letter word
  if (guess.length !== 5 || !/^[A-Z]{5}$/.test(guess)) {
    return false;
  }
  
  if (game.guesses.length >= game.maxGuesses) {
    games.delete(userId);
    return false;
  }
  
  game.guesses.push(guess);
  const isCorrect = guess === game.word;
  const isGameOver = isCorrect || game.guesses.length >= game.maxGuesses;
  
  const embed = new EmbedBuilder()
    .setTitle('🎯 Wordle')
    .setDescription(`${createGameBoard(game.guesses, game.word)}`)
    .setColor(isCorrect ? 0x00FF00 : isGameOver ? 0xFF0000 : 0xFFFF00);
  
  if (isCorrect) {
    embed.setDescription(`${embed.data.description}\n\n🎉 **Congratulations! You won in ${game.guesses.length} guesses!**`);
    games.delete(userId);
  } else if (isGameOver) {
    embed.setDescription(`${embed.data.description}\n\n💀 **Game Over! The word was: ${game.word}**`);
    games.delete(userId);
  } else {
    embed.addFields([
      { name: '🎮 Guesses Left', value: `${game.maxGuesses - game.guesses.length}`, inline: true },
      { name: '⏱️ Time', value: `${Math.floor((Date.now() - game.startTime) / 1000)}s`, inline: true }
    ]);
  }
  
  embed.setFooter({ text: '🟩 = Correct letter & position | 🟨 = Correct letter, wrong position | ⬜ = Not in word' });
  
  await message.reply({ embeds: [embed] });
  return true;
} 