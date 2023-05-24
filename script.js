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
  const createPlayer = (name, token, moves, score) => {
    return { name, token, moves, score };
  };

  const players = [
    createPlayer("Player One", "X", [], 0),
    createPlayer("Player Two", "O", [], 0),
  ];

  let activePlayer = players[0];
  let board = gameBoard.getBoard();

  const printMove = function () {
    console.log(`It is ${activePlayer.name}'s turn`);
    console.log(board);
  };

  const switchPlayer = function () {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
    indicateTurn.toggleTurnColor(getActivePlayer());
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
        congratulateWinner.displayMessage(
          getActivePlayer().name,
          result.sort()
        );
        getActivePlayer().score += 1;
        playerScore.updateScore();
        winner = true;
        return true;
      }
    }
  };

  // if all cells are occupied but there is no winner, then it is a tie
  const registerTie = () => {
    if (usedCells.length === 9 && winner !== true) {
      congratulateWinner.displayMessage();
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
      // invisible changes
      winner = false;
      players[0].moves = [];
      players[1].moves = [];
      usedCells = [];
      activePlayer = players[0];
      board = resetBoard();
      // visible changes
      const cells = document.querySelectorAll(".cell");
      cells.forEach((cell) => (cell.textContent = ""));
      indicateTurn.toggleTurnColor(activePlayer);
      printMove();
    }
  };

  // use displayController.makeMove() in the console to play a round
  let winner = false;
  let usedCells = [];
  const makeMove = function (cell, mark) {
    if (winner) {
      alert("Game is over. Start a new game.");
      return;
    }

    // here I make sure that if there's someone's token in the cell, then the cell cannot be used anymore
    usedCells.forEach((usedCell) => {
      if (usedCell === cell) {
        alert("Cell is taken. Use another one.");
      }
    });

    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (cell === board[i][j]) {
          usedCells.push(cell);
          getActivePlayer().moves.push(cell);
          board[i][j] = getActivePlayer().token;
          mark.textContent = getActivePlayer().token;

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

  return { makeMove, getActivePlayer, startNewGame, players };
})();

// Work with DOM
const renderBoard = (function () {
  const addMark = (e) => {
    // a value inside a data attribute is of string type
    const specificBtn = e.target;
    const cellIndex = specificBtn
      .closest("[data-index]")
      .getAttributeNode("data-index").value;

    displayController.makeMove(cellIndex * 1, specificBtn);
  };

  const cells = document.querySelectorAll(".cell");
  cells.forEach((cell) => cell.addEventListener("click", addMark));
})();

// Edit player names
// Refactor this module. It can be definitely shorten!
const renderPlayersNames = (function () {
  const playerObjects = displayController.players;

  const namePlayerOne = document.querySelector(".player-one");
  namePlayerOne.textContent = playerObjects[0].name;

  const namePlayerTwo = document.querySelector(".player-two");
  namePlayerTwo.textContent = playerObjects[1].name;

  namePlayerOne.addEventListener("blur", () => {
    playerObjects[0].name = namePlayerOne.textContent;

    const defaultName = "Player One";
    if (namePlayerOne.textContent === "") {
      alert("Default name was set");
      playerObjects[0].name = defaultName;
      namePlayerOne.textContent = defaultName;
    }

    if (namePlayerOne.textContent === namePlayerTwo.textContent) {
      alert("You cannot have the same name");
      playerObjects[0].name = defaultName;
      namePlayerOne.textContent = defaultName;
    }
  });

  namePlayerTwo.addEventListener("blur", () => {
    playerObjects[1].name = namePlayerTwo.textContent;
    const defaultName = "Player Two";

    if (namePlayerTwo.textContent === "") {
      alert("Default name was set");
      playerObjects[1].name = defaultName;
      namePlayerTwo.textContent = defaultName;
    }

    if (namePlayerOne.textContent === namePlayerTwo.textContent) {
      alert("You cannot have the same name");
      playerObjects[1].name = defaultName;
      namePlayerTwo.textContent = defaultName;
    }
  });
})();

// Start a new game
const restartGame = (function () {
  const restartBtn = document.querySelector(".restart-game");
  restartBtn.addEventListener("click", () => {
    displayController.startNewGame();
  });
})();

// Highlight the player name when it is their turn
const indicateTurn = (function () {
  const toggleTurnColor = (turn) => {
    if (turn.token === "X") {
      document.querySelector(".player-one").style.backgroundColor = "orange";
      document.querySelector(".player-two").style.backgroundColor = "white";
    } else {
      document.querySelector(".player-two").style.backgroundColor = "orange";
      document.querySelector(".player-one").style.backgroundColor = "white";
    }
  };

  toggleTurnColor(displayController.getActivePlayer());

  return { toggleTurnColor };
})();

// when there is a winner, then to display a popup message to congratulate
const congratulateWinner = (function () {
  const popupBlock = document.querySelector(".congratulate-block");
  const congratulateText = document.querySelector(".congratulate-text");
  const closeBtn = document.querySelector(".close-popup-btn");

  const displayMessage = (name, combination) => {
    popupBlock.style.display = "block";

    if (name !== undefined || combination !== undefined) {
      congratulateText.textContent = `GG! ${name} won with combination ${combination}!`;
    } else {
      congratulateText.textContent = `Tough round! It is a tie!`;
    }
  };

  closeBtn.addEventListener("click", () => {
    popupBlock.style.display = "none";
  });

  return { displayMessage };
})();

// display the game score and update it
const playerScore = (function () {
  const playerOne = displayController.players[0];
  const playerTwo = displayController.players[1];

  let playerOneScore = document.querySelector(".player-one-score");
  let playerTwoScore = document.querySelector(".player-two-score");

  playerOneScore.textContent = playerOne.score;
  playerTwoScore.textContent = playerTwo.score;

  const updateScore = () => {
    playerOneScore.textContent = playerOne.score;
    playerTwoScore.textContent = playerTwo.score;
  };

  const resetScoreBtn = document.querySelector(".reset-score");
  resetScoreBtn.addEventListener("click", () => {
    const answer = confirm("Would you really like to reset the game score?");
    if (answer) {
      playerOne.score = 0;
      playerTwo.score = 0;
      updateScore();
    }
  });

  return { updateScore };
})();
