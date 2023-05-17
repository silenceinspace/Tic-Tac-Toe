// gameBoard creates a visual reprensentation of the gameboard in the console
const gameBoard = (function () {
  const gameBoard = [];
  const rows = 3;
  const columns = 3;
  let index = 1;

  for (let i = 0; i < rows; i++) {
    gameBoard[i] = [];
    for (let j = 0; j < columns; j++) {
      gameBoard[i].push(index);
      index++;
    }
  }

  const getBoard = () => gameBoard;

  return { getBoard };
})();

// what makes the game progress
const displayController = (function () {
  const createPlayer = (name, token, moves) => {
    return { name, token, moves };
  };

  const players = [
    createPlayer("firstPlayer", "X", []),
    createPlayer("secondPlayer", "O", []),
  ];

  let activePlayer = players[0];
  let board = gameBoard.getBoard();

  const printMove = function () {
    console.log(`It is ${activePlayer.name}'s turn`);
    console.log(board);
  };

  const switchPlayer = function () {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
    console.log(`Player was switched. New player is ${activePlayer.name}`);
  };

  const getActivePlayer = () => activePlayer;

  // hardcore the winning combinations
  const checkForWin = () => {
    const winningCombinations = [
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9],
      [1, 4, 7],
      [2, 5, 8],
      [3, 6, 9],
      [1, 5, 9],
      [3, 5, 7],
    ];

    const madeMoves = getActivePlayer().moves;

    for (let i = 0; i < winningCombinations.length; i++) {
      const result = [];
      for (let j = 0; j < 3; j++) {
        for (let k = 0; k < madeMoves.length; k++) {
          if (winningCombinations[i][j] === madeMoves[k]) {
            result.push(madeMoves[k]);
          }
        }
      }

      if (result.length === 3) {
        console.log(
          `${getActivePlayer().name} won with combination ${result.sort()}`
        );
        console.log(board);
        winner = true;
        return true;
      }
    }
  };

  // if all cells are occupied but there is no winner, then it is a tie
  const registerTie = () => {
    if (usedCells.length === 9 && winner !== true) {
      console.log("It is a tie");
      return true;
    }
  };

  // clear all data for a new game
  const startNewGame = () => {
    let playerResponse = confirm("Would you like to start a new game?");

    function resetBoard() {
      board = [
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
      ];
      return board;
    }

    if (playerResponse) {
      console.log("Starting a new game...");
      winner = false;
      players[0].moves = [];
      players[1].moves = [];
      usedCells = [];
      activePlayer = players[0];
      board = resetBoard();
      printMove();
    } else {
      console.log("Alright, never mind...");
    }
  };

  // use displayController.makeMove() in the console to play a round
  let winner = false;
  let usedCells = [];
  const makeMove = function (cell) {
    if (winner) {
      console.log("You cannot make any moves. The game is over.");
      return;
    }

    // here I make sure that if there's someone's token in the cell, then the cell cannot be used anymore
    usedCells.forEach((usedCell) => {
      if (usedCell === cell) {
        console.log("This cell was taken already...");
        console.log("Make a move one more time.");
      }
    });

    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (cell === board[i][j]) {
          usedCells.push(cell);
          getActivePlayer().moves.push(cell);
          board[i][j] = getActivePlayer().token;
          console.log(usedCells);

          if (checkForWin()) {
            return;
          } else if (registerTie()) {
            return;
          } else {
            switchPlayer();
            printMove();
          }
        }
      }
    }
  };

  // initial message
  printMove();

  return { makeMove, getActivePlayer, startNewGame };
})();
