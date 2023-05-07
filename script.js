// modules for ONE of something
const gameBoard = (function () {
  const gameBoard = [];
  const rows = 3;
  const columns = 3;

  for (let i = 0; i < rows; i++) {
    gameBoard.push([]);
    for (let j = 0; j < columns; j++) {
      gameBoard[i].push("X");
    }
  }

  return { gameBoard };
})();

const displayController = (function () {})();

// factory function for MULTIPLES of something
const createPlayer = (name, token) => {
  const fullName = () => {
    console.log(`This player's name is ${name} with ${token}`);
  };

  return { fullName };
};

const player1 = createPlayer("Anton", "X");
const player2 = createPlayer("Vadim", "O");

// function to rended 'x's and 'o'x to the cells
const renderGameboard = (function () {
  const cells = document.querySelectorAll(".cell");
  // let num = 0;
  cells.forEach((cell) => {
    // cell.textContent = gameBoard.gameBoard[num];
    // num++;

    cell.addEventListener("click", leaveMark);
  });

  function leaveMark() {
    if (this.textContent === "") {
      this.textContent = "X";
    } else {
      console.log("the spot is taken");
    }
  }
})();
