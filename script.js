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
  const createPlayer = (name, token) => {
    return { name, token };
  };

  const players = [
    createPlayer("firstPlayer", "X"),
    createPlayer("secondPlayer", "O"),
  ];

  let activePlayer = players[0];

  const printMove = function () {
    console.log(`It is ${activePlayer.name}'s turn`);
    console.log(gameBoard.getBoard());
  };

  const switchPlayer = function () {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
    console.log(`Player was switched - new player is ${activePlayer.name}`);
  };

  const getActivePlayer = () => activePlayer;

  const checkForWin = (row) => {
    // win conditions
    const rowWin = ["X", "X", "X"];

    if (row.toString() === rowWin.toString()) {
      console.log(`${getActivePlayer().name} won`);
      return true;
    }
  };

  const usedCells = [];
  const makeMove = function (cell) {
    usedCells.forEach((cellNum) => {
      if (cellNum === cell) {
        console.log("This cell was taken already...");
      }
    });

    gameBoard.getBoard().forEach((array) => {
      for (let i = 0; i < 3; i++) {
        if (array[i] === cell) {
          array[i] = getActivePlayer().token;
          usedCells.push(cell);
          console.log(`${usedCells} was used`);

          //if there are 3 x's in a row, then it is a win
          if (checkForWin(array)) {
            return;
          } else {
            switchPlayer();
            printMove();
          }
        }
      }
    });
  };

  printMove();

  return { makeMove, getActivePlayer };
})();

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
