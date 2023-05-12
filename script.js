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
  const board = gameBoard.getBoard();

  const printMove = function () {
    console.log(`It is ${activePlayer.name}'s turn`);
    console.log(gameBoard.getBoard());
  };

  const switchPlayer = function () {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
    console.log(`Player was switched - new player is ${activePlayer.name}`);
  };

  const getActivePlayer = () => activePlayer;

  // hardcore the winning combinations
  const checkForWin = (playerMoves) => {
    const rowCombinations = [
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9],
    ];

    const columnCombinations = [
      [1, 4, 7],
      [2, 5, 8],
      [3, 6, 9],
    ];

    // potentially filter and compare only three
    // every() + filter()
    let madeMoves = playerMoves.join("");
    let rowWin = rowCombinations.map((array) => array.join(""));
    let columnWin = columnCombinations.map((array) => array.join(""));

    for (let i = 0; i < 3; i++) {
      if (rowWin[i] === madeMoves) {
        console.log(
          `${getActivePlayer().name} won with row combination ${
            getActivePlayer().moves
          }`
        );
        console.log(gameBoard.getBoard());
        return true;
      } else if (columnWin[i] === madeMoves) {
        console.log(
          `${getActivePlayer().name} won with column combination ${
            getActivePlayer().moves
          }`
        );
        console.log(gameBoard.getBoard());
        return true;
      }
    }
  };

  // use makeMove() in the console to play a round
  const usedCells = [];
  const makeMove = function (cell) {
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

          if (checkForWin(getActivePlayer().moves)) {
            return;
          } else {
            switchPlayer();
            printMove();
          }
        }
      }
    }
  };

  printMove();

  return { makeMove, getActivePlayer };
})();

//   gameBoard.getBoard().forEach((array) => {
//     for (let i = 0; i < 3; i++) {
//       if (array[i] === cell) {
//         console.log(array[i]);
//         array[i] = getActivePlayer().token;
//         usedCells.push(cell);
//         console.log(`${usedCells} was used`);

//         //if there are 3 x's in a givenRow, then it is a win
//         if (checkForWin(array)) {
//           return;
//         } else {
//           switchPlayer();
//           printMove();
//         }
//       }
//     }
// });
// };

// // function to rended 'x's and 'o'x to the cells
// const renderGameboard = (function () {
//   const cells = document.querySelectorAll(".cell");
//   // let num = 0;
//   cells.forEach((cell) => {
//     // cell.textContent = gameBoard.gameBoard[num];
//     // num++;

//     cell.addEventListener("click", leaveMark);
//   });

//   function leaveMark() {
//     if (this.textContent === "") {
//       this.textContent = "X";
//     } else {
//       console.log("the spot is taken");
//     }
//   }
// })();
