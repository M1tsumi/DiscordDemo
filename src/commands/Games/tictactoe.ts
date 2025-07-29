import { 
  Message, 
  EmbedBuilder, 
  SlashCommandBuilder, 
  ChatInputCommandInteraction, 
  ActionRowBuilder, 
  ButtonBuilder, 
  ButtonStyle,
  User,
  MessageFlags
} from 'discord.js';
import { CommandCategory } from '../../types/Command';

export const data = {
  name: 'tictactoe',
  description: 'Play tic-tac-toe against another player.',
  aliases: ['ttt', 'tic'],
  category: CommandCategory.GAMES,
  usage: '!tictactoe @user',
  cooldown: 5
};

export const slashData = new SlashCommandBuilder()
  .setName('tictactoe')
  .setDescription('Play tic-tac-toe against another player.')
  .addUserOption(option =>
    option.setName('opponent')
      .setDescription('The user to play against')
      .setRequired(true)
  );

interface TicTacToeGame {
  player1: string;
  player2: string;
  currentPlayer: string;
  board: string[];
  messageId: string;
  gameEnded: boolean;
}

const activeGames = new Map<string, TicTacToeGame>();

function createBoard(): string[] {
  return Array(9).fill('⬜');
}

function createGameEmbed(game: TicTacToeGame, player1: User, player2: User): EmbedBuilder {
  const board = game.board;
  const boardDisplay = 
    `${board[0]} ${board[1]} ${board[2]}\n` +
    `${board[3]} ${board[4]} ${board[5]}\n` +
    `${board[6]} ${board[7]} ${board[8]}`;

  const currentPlayerName = game.currentPlayer === game.player1 ? player1.username : player2.username;
  const currentSymbol = game.currentPlayer === game.player1 ? '❌' : '⭕';

  let description = `**${player1.username}** ❌ vs **${player2.username}** ⭕\n\n${boardDisplay}`;
  
  if (!game.gameEnded) {
    description += `\n\n**${currentPlayerName}'s turn** (${currentSymbol})`;
  }

  return new EmbedBuilder()
    .setTitle('🎮 Tic-Tac-Toe')
    .setDescription(description)
    .setColor(0x3498db);
}

function createGameButtons(game: TicTacToeGame): ActionRowBuilder<ButtonBuilder>[] {
  const rows: ActionRowBuilder<ButtonBuilder>[] = [];
  
  for (let i = 0; i < 3; i++) {
    const row = new ActionRowBuilder<ButtonBuilder>();
    
    for (let j = 0; j < 3; j++) {
      const index = i * 3 + j;
      const isOccupied = game.board[index] !== '⬜';
      
      const button = new ButtonBuilder()
        .setCustomId(`ttt_move_${index}`)
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(isOccupied || game.gameEnded);

      if (isOccupied) {
        button.setEmoji(game.board[index]);
      } else {
        button.setLabel('​'); // Invisible character for empty buttons
      }

      row.addComponents(button);
    }
    
    rows.push(row);
  }

  // Add end game button for players
  const endRow = new ActionRowBuilder<ButtonBuilder>()
    .addComponents(
      new ButtonBuilder()
        .setCustomId('ttt_end')
        .setLabel('End Game')
        .setStyle(ButtonStyle.Danger)
        .setEmoji('🛑')
        .setDisabled(game.gameEnded)
    );

  rows.push(endRow);
  return rows;
}

function checkWinner(board: string[]): string | null {
  const winPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6] // Diagonals
  ];

  for (const pattern of winPatterns) {
    const [a, b, c] = pattern;
    if (board[a] !== '⬜' && board[a] === board[b] && board[b] === board[c]) {
      return board[a] === '❌' ? 'player1' : 'player2';
    }
  }

  return board.every(cell => cell !== '⬜') ? 'tie' : null;
}

export async function execute(message: Message, args?: string[]) {
  const opponent = message.mentions.users.first();
  
  if (!opponent) {
    return message.reply('❌ Please mention a user to play against!\nUsage: `!tictactoe @user`');
  }

  if (opponent.bot) {
    return message.reply('❌ You cannot play against bots!');
  }

  if (opponent.id === message.author.id) {
    return message.reply('❌ You cannot play against yourself!');
  }

  const game: TicTacToeGame = {
    player1: message.author.id,
    player2: opponent.id,
    currentPlayer: message.author.id,
    board: createBoard(),
    messageId: '',
    gameEnded: false
  };

  const embed = createGameEmbed(game, message.author, opponent);
  const buttons = createGameButtons(game);

  const gameMessage = await message.reply({
    content: `🎮 **${message.author.username}** challenged **${opponent.username}** to Tic-Tac-Toe!`,
    embeds: [embed],
    components: buttons
  });

  game.messageId = gameMessage.id;
  activeGames.set(gameMessage.id, game);

  // Auto-end game after 10 minutes
  setTimeout(() => {
    if (activeGames.has(gameMessage.id)) {
      activeGames.delete(gameMessage.id);
    }
  }, 600000); // 10 minutes
}

export async function executeSlash(interaction: ChatInputCommandInteraction) {
  const opponent = interaction.options.getUser('opponent', true);
  
  if (opponent.bot) {
    return interaction.reply({ content: '❌ You cannot play against bots!', flags: MessageFlags.Ephemeral });
  }

  if (opponent.id === interaction.user.id) {
    return interaction.reply({ content: '❌ You cannot play against yourself!', flags: MessageFlags.Ephemeral });
  }

  const game: TicTacToeGame = {
    player1: interaction.user.id,
    player2: opponent.id,
    currentPlayer: interaction.user.id,
    board: createBoard(),
    messageId: '',
    gameEnded: false
  };

  const embed = createGameEmbed(game, interaction.user, opponent);
  const buttons = createGameButtons(game);

  await interaction.reply({
    content: `🎮 **${interaction.user.username}** challenged **${opponent.username}** to Tic-Tac-Toe!`,
    embeds: [embed],
    components: buttons
  });

  const reply = await interaction.fetchReply();
  game.messageId = reply.id;
  activeGames.set(reply.id, game);

  // Auto-end game after 10 minutes
  setTimeout(() => {
    if (activeGames.has(reply.id)) {
      activeGames.delete(reply.id);
    }
  }, 600000); // 10 minutes
}

// Handle button interactions
export async function handleTicTacToeInteraction(interaction: any) {
  if (!interaction.isButton()) return;

  const [action, type, position] = interaction.customId.split('_');
  if (action !== 'ttt') return;

  const game = activeGames.get(interaction.message.id);
  if (!game) {
    return interaction.reply({ content: '❌ This game has expired!', flags: MessageFlags.Ephemeral });
  }

  if (type === 'end') {
    // Only players can end the game
    if (interaction.user.id !== game.player1 && interaction.user.id !== game.player2) {
      return interaction.reply({ 
        content: '❌ Only the players can end this game!', 
        flags: MessageFlags.Ephemeral 
      });
    }

    activeGames.delete(interaction.message.id);
    
    const player1 = await interaction.client.users.fetch(game.player1);
    const player2 = await interaction.client.users.fetch(game.player2);
    
    game.gameEnded = true;
    const finalEmbed = createGameEmbed(game, player1, player2)
      .setTitle('🎮 Tic-Tac-Toe [ENDED]')
      .setColor(0xe74c3c);

    await interaction.update({
      embeds: [finalEmbed],
      components: []
    });
    return;
  }

  if (type === 'move') {
    // Check if it's the player's turn
    if (interaction.user.id !== game.currentPlayer) {
      return interaction.reply({ 
        content: '❌ It\'s not your turn!', 
        flags: MessageFlags.Ephemeral 
      });
    }

    // Check if player is in the game
    if (interaction.user.id !== game.player1 && interaction.user.id !== game.player2) {
      return interaction.reply({ 
        content: '❌ You are not a player in this game!', 
        flags: MessageFlags.Ephemeral 
      });
    }

    const pos = parseInt(position);
    
    // Make move
    const symbol = game.currentPlayer === game.player1 ? '❌' : '⭕';
    game.board[pos] = symbol;

    // Check for winner
    const winner = checkWinner(game.board);
    
    const player1 = await interaction.client.users.fetch(game.player1);
    const player2 = await interaction.client.users.fetch(game.player2);
    
    if (winner) {
      game.gameEnded = true;
      activeGames.delete(interaction.message.id);
      
      let resultMessage = '';
      if (winner === 'tie') {
        resultMessage = '🤝 **It\'s a tie!**';
      } else {
        const winnerUser = winner === 'player1' ? player1 : player2;
        resultMessage = `🎉 **${winnerUser.username} wins!**`;
      }

      const finalEmbed = createGameEmbed(game, player1, player2)
        .setTitle('🎮 Tic-Tac-Toe [FINISHED]')
        .setDescription(createGameEmbed(game, player1, player2).data.description + `\n\n${resultMessage}`)
        .setColor(winner === 'tie' ? 0xf39c12 : 0x27ae60);

      await interaction.update({
        embeds: [finalEmbed],
        components: []
      });
    } else {
      // Switch turns
      game.currentPlayer = game.currentPlayer === game.player1 ? game.player2 : game.player1;
      
      const updatedEmbed = createGameEmbed(game, player1, player2);
      const updatedButtons = createGameButtons(game);

      await interaction.update({
        embeds: [updatedEmbed],
        components: updatedButtons
      });
    }
  }
} 