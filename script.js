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

  const getWinner = () => winner;
  const getUsedCells = () => usedCells;

  const makeMove = function (cell, mark) {
    if (winner || usedCells.length === 9) {
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
            return true;
          }
        }
      }
    }
  };

  // initial message
  printMove();

  return {
    makeMove,
    getActivePlayer,
    startNewGame,
    players,
    getUsedCells,
    getWinner,
  };
})();

// Work with DOM
const renderBoard = (function () {
  const addMark = (e) => {
    // a value inside a data attribute is of string type
    const specificBtn = e.target;
    const cellIndex = specificBtn
      .closest("[data-index]")
      .getAttributeNode("data-index").value;

    let validMove = displayController.makeMove(cellIndex * 1, specificBtn);
    if (validMove) {
      if (
        playWithAi.getStatusOfAi() &&
        displayController.getWinner() !== true &&
        displayController.getUsedCells().length !== 9
      ) {
        let moveAi = playWithAi.makeMoveAi();
        cells.forEach((cell) => {
          if (cell.getAttributeNode("data-index").value == moveAi) {
            displayController.makeMove(moveAi, cell);
          }
        });
      }
    }
  };

  const cells = document.querySelectorAll(".cell");
  cells.forEach((cell) => cell.addEventListener("click", addMark));
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

// Edit player names
const renderPlayersNames = (function () {
  const playerObjects = displayController.players;

  const namePlayerOne = document.querySelector(".player-one");
  const namePlayerTwo = document.querySelector(".player-two");
  namePlayerOne.textContent = playerObjects[0].name;
  namePlayerTwo.textContent = playerObjects[1].name;

  const updatePlayerNames = (playerNum, playerDiv, oppositeDiv) => {
    const num = playerNum;
    const div = playerDiv;
    const divTwo = oppositeDiv;

    playerObjects[num].name = div.textContent;
    const defaultName = num === 0 ? "Player One" : "Player Two";
    if (div.textContent === "" || div.textContent === "Computer") {
      alert("Default name was set");
      playerObjects[num].name = defaultName;
      div.textContent = defaultName;
    }

    if (div.textContent === divTwo.textContent) {
      alert("You cannot have the same name");
      playerObjects[num].name = defaultName;
      div.textContent = defaultName;
    }
  };

  namePlayerOne.addEventListener("blur", () => {
    updatePlayerNames(0, namePlayerOne, namePlayerTwo);
  });

  namePlayerTwo.addEventListener("blur", () => {
    updatePlayerNames(1, namePlayerTwo, namePlayerOne);
  });

  const getPlayerTwo = () => namePlayerTwo;
  return { getPlayerTwo };
})();

// create an AI to play against
const playWithAi = (function () {
  const btn = document.querySelector(".add-AI");
  let aiIsActive = false;
  const switchBetweenAiAndPlayer = () => {
    if (displayController.getUsedCells().length !== 0) {
      alert("You have already started the game.");
      return;
    }

    if (!aiIsActive) {
      displayController.players[1].name = "Computer";
      renderPlayersNames.getPlayerTwo().textContent = "Computer";
      renderPlayersNames.getPlayerTwo().contentEditable = "false";
      btn.textContent = "play vs Player";
      aiIsActive = true;
    } else {
      displayController.players[1].name = "Player Two";
      renderPlayersNames.getPlayerTwo().textContent = "Player Two";
      renderPlayersNames.getPlayerTwo().contentEditable = "true";
      btn.textContent = "play vs AI";
      aiIsActive = false;
    }
  };
  btn.addEventListener("click", switchBetweenAiAndPlayer);

  const getStatusOfAi = () => aiIsActive;

  // allow a legal move for the computer
  const makeMoveAi = () => {
    let randomNum;
    let usedMoves = displayController.getUsedCells();

    generateMove();
    function generateMove() {
      randomNum = Math.floor(Math.random() * 9) + 1;
      usedMoves.forEach((move) => {
        if (move != randomNum) {
          return;
        } else {
          // implement recursion here! Keep using math.random() till there is a number that the usedMoves array does not contain
          generateMove();
        }
      });
    }

    return randomNum;
  };

  return { makeMoveAi, getStatusOfAi };
})();

/*
  Refacture:
  
  1. Create AI (an easy one + an impossible one)
 
  2. Get rid of unnecessary console logs 
  3. Organize functions inside of the modules and think about what I REALLY need to reveal
  4. Go over all usages of my const vs let. Explain to myself why I chose one over the other
  5. DRY - do not repeat yourself!
  6. Change some function/variable names?
*/
