const Game = (() => {
    gameBoard = Board();
    gameBoard.draw();


    return {

    };
});

const Board = (() => {

    const grid = ['X', 'O', 'X',
                  'O', 'X', 'O',
                  'O', 'X', 'O']

    const draw = () => {
        boardBoxes.forEach((box) => {
            console.log(box.getAttribute("data-box"));
            box.textContent = grid[box.getAttribute("data-box")];
        })
    }

    return {
        draw
    };
});

const playerFactory = () => {

    return { } ;
}

const boardBoxes = document.querySelectorAll(".board-box")

Game();