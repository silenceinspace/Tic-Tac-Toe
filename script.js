// Wrap my IIFEs inside of one global IIEF, so that the user cannot manipulate with data in the console
(function () {
  // 1. Creates an initial reprensentation of the gameboard in the console
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

  // 2. Game control section in the console
  const displayController = (function () {
    // Factory function to create two players with identical parameters
    const _createPlayer = (name, token, moves, score) => {
      return { name, token, moves, score };
    };

    let players = [
      _createPlayer("Player One", "X", [], 0),
      _createPlayer("Player Two", "O", [], 0),
    ];

    let activePlayer = players[0];
    const getActivePlayer = () => activePlayer;
    let board = gameBoard.getBoard();

    const _switchPlayer = function () {
      activePlayer = activePlayer === players[0] ? players[1] : players[0];
      indicateTurn.toggleTurnColor(getActivePlayer());
    };

    // Hardcore the winning combinations
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

    const _checkForWin = () => {
      const madeMoves = getActivePlayer().moves;

      for (let i = 0; i < winningCombinations.length; i++) {
        // Push into the array to check if there are three numbers, meaning there is a winning combination
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

    // If all cells are occupied but there is no winner, then it is a tie
    const _registerTie = () => {
      if (usedCells.length === 9 && winner !== true) {
        congratulateWinner.displayMessage();
        return true;
      }
    };

    // Clear all data for a new game
    const startNewGame = () => {
      const playerResponse = confirm("Would you like to start a new game?");

      function resetBoard() {
        board = [
          [1, 2, 3],
          [4, 5, 6],
          [7, 8, 9],
        ];
        return board;
      }

      if (playerResponse) {
        // Invisible changes
        winner = false;
        players[0].moves = [];
        players[1].moves = [];
        usedCells = [];
        activePlayer = players[0];
        board = resetBoard();
        // Visible changes
        const cells = document.querySelectorAll(".cell");
        cells.forEach((cell) => (cell.textContent = ""));
        indicateTurn.toggleTurnColor(activePlayer);
      }
    };

    // Make a move and keep track of already made moves
    let winner = false;
    let usedCells = [];

    const getWinner = () => winner;
    const getUsedCells = () => usedCells;

    const makeMove = function (cellNumber, playerMark) {
      if (winner || usedCells.length === 9) {
        alert("Game is over. Start a new game.");
        return;
      }

      // Make sure that if there's someone's token in the cell, then the cell cannot be used anymore. But it does not stop the function's run here
      usedCells.forEach((usedCell) => {
        if (usedCell === cellNumber) {
          alert("Cell is taken. Use another one.");
        }
      });

      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          if (cellNumber === board[i][j]) {
            usedCells.push(cellNumber);
            getActivePlayer().moves.push(cellNumber);
            board[i][j] = getActivePlayer().token;
            playerMark.textContent = getActivePlayer().token;

            if (_checkForWin()) {
              return;
            } else if (_registerTie()) {
              return;
            } else {
              _switchPlayer();
              // Return true so that the computer can make its move (to prevent the player making a move on an occupied cell, nothing will happen until they use a free spot)
              return true;
            }
          }
        }
      }
    };

    const _addMark = (e) => {
      // A value inside a data attribute is of the string type, so "cellIndex * 1" to convert it to a number
      const specificCell = e.target;
      const cellIndex = specificCell
        .closest("[data-index]")
        .getAttributeNode("data-index").value;

      const validMove = makeMove(cellIndex * 1, specificCell);
      // If validMove returned true, it means the player made a move on an availabe cell
      if (validMove) {
        if (
          playWithAi.getStatusOfAi() &&
          getWinner() !== true &&
          getUsedCells().length !== 9
        ) {
          const moveAi = playWithAi.makeMoveAi();
          cells.forEach((cell) => {
            if (cell.getAttributeNode("data-index").value * 1 === moveAi) {
              makeMove(moveAi, cell);
            }
          });
        }
      }
    };

    const cells = document.querySelectorAll(".cell");
    cells.forEach((cell) => cell.addEventListener("click", _addMark));

    return {
      makeMove,
      getUsedCells,
      getActivePlayer,
      startNewGame,
      getWinner,
      players,
    };
  })();

  // 3. Work with DOM
  // Create an AI to play against (no minimax algorithm... so the computer just makes any random legal move)
  const playWithAi = (function () {
    const activateAiBtn = document.querySelector(".play-against-ai");
    let aiIsActive = false;
    const getStatusOfAi = () => aiIsActive;

    const _switchBetweenAiAndPlayer = () => {
      if (displayController.getUsedCells().length !== 0) {
        alert("You have already started the game.");
        return;
      }

      if (!aiIsActive) {
        displayController.players[1].name = "Computer";
        renderPlayersNames.getPlayerTwo().textContent = "Computer";
        renderPlayersNames.getPlayerTwo().contentEditable = "false";
        activateAiBtn.textContent = "play vs Player";
        aiIsActive = true;
      } else {
        displayController.players[1].name = "Player Two";
        renderPlayersNames.getPlayerTwo().textContent = "Player Two";
        renderPlayersNames.getPlayerTwo().contentEditable = "true";
        activateAiBtn.textContent = "play vs AI";
        aiIsActive = false;
      }
    };
    activateAiBtn.addEventListener("click", _switchBetweenAiAndPlayer);

    // Allow a legal move for the computer
    const makeMoveAi = () => {
      let randomMove;
      const usedMoves = displayController.getUsedCells();

      generateMove();
      function generateMove() {
        randomMove = Math.floor(Math.random() * 9) + 1;
        usedMoves.forEach((move) => {
          if (move != randomMove) {
            return;
          } else {
            // Implement recursion here! Keep using math.random() till there is a number that the usedMoves array does not contain
            generateMove();
          }
        });
      }

      return randomMove;
    };

    return { makeMoveAi, getStatusOfAi };
  })();

  // Change player names
  const renderPlayersNames = (function () {
    const playerObjects = displayController.players;

    const namePlayerOne = document.querySelector(".player-one-name");
    const namePlayerTwo = document.querySelector(".player-two-name");
    namePlayerOne.textContent = playerObjects[0].name;
    namePlayerTwo.textContent = playerObjects[1].name;

    const _updatePlayerNames = (playerNum, playerDiv, oppositeDiv) => {
      const num = playerNum;
      const theirDiv = playerDiv;
      const opponentsDiv = oppositeDiv;

      playerObjects[num].name = theirDiv.textContent;
      const defaultName = num === 0 ? "Player One" : "Player Two";
      if (theirDiv.textContent === "" || theirDiv.textContent === "Computer") {
        alert("Default name was set");
        playerObjects[num].name = defaultName;
        theirDiv.textContent = defaultName;
      }

      if (theirDiv.textContent === opponentsDiv.textContent) {
        alert("You cannot have the same name");
        playerObjects[num].name = defaultName;
        theirDiv.textContent = defaultName;
      }
    };

    namePlayerOne.addEventListener("blur", () => {
      _updatePlayerNames(0, namePlayerOne, namePlayerTwo);
    });

    namePlayerTwo.addEventListener("blur", () => {
      _updatePlayerNames(1, namePlayerTwo, namePlayerOne);
    });

    const getPlayerTwo = () => namePlayerTwo;
    return { getPlayerTwo };
  })();

  // Display the game score and update it
  const playerScore = (function () {
    const playerOne = displayController.players[0];
    const playerTwo = displayController.players[1];

    const playerOneScore = document.querySelector(".player-one-score");
    const playerTwoScore = document.querySelector(".player-two-score");

    playerOneScore.textContent = playerOne.score;
    playerTwoScore.textContent = playerTwo.score;

    const updateScore = () => {
      playerOneScore.textContent = playerOne.score;
      playerTwoScore.textContent = playerTwo.score;
    };

    const resetScoreBtn = document.querySelector(".reset-score");
    resetScoreBtn.addEventListener("click", () => {
      const confirmScoreReset = confirm(
        "Would you really like to reset the game score?"
      );
      if (confirmScoreReset) {
        playerOne.score = 0;
        playerTwo.score = 0;
        updateScore();
      }
    });

    const restartBtn = document.querySelector(".restart-game");
    restartBtn.addEventListener("click", () => {
      displayController.startNewGame();
    });

    return { updateScore };
  })();

  // Highlight the player name when it is their turn
  const indicateTurn = (function () {
    const toggleTurnColor = (turn) => {
      if (turn.token === "X") {
        document.querySelector(".player-one-name").style.backgroundColor =
          "orange";
        document.querySelector(".player-two-name").style.backgroundColor =
          "white";
      } else {
        document.querySelector(".player-two-name").style.backgroundColor =
          "orange";
        document.querySelector(".player-one-name").style.backgroundColor =
          "white";
      }
    };

    toggleTurnColor(displayController.getActivePlayer());

    return { toggleTurnColor };
  })();

  // When there is a winner, then display a popup message to congratulate
  const congratulateWinner = (function () {
    const popupBlock = document.querySelector(".congratulate-block");
    const popupMessage = document.querySelector(".popup-message");
    const closePopBtn = document.querySelector(".close-popup");

    const displayMessage = (name, combination) => {
      popupBlock.style.display = "block";

      // If two arguments are passed in, then give me more details about the win (name + combination of the winner)
      if (name !== undefined || combination !== undefined) {
        popupMessage.textContent = `GG! ${name} won with combination ${combination}!`;
      } else {
        popupMessage.textContent = `Tough round! It is a tie!`;
      }
    };

    closePopBtn.addEventListener("click", () => {
      popupBlock.style.display = "none";
    });

    return { displayMessage };
  })();
})();

// My name is anton
