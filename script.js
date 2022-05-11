const Game = (() => {
    const player = playerFactory('Player', 'X', true)
    const computer = playerFactory('Computer', 'O', false)
    gameBoard = Board(player, computer);
    gameBoard.draw();



    return {

    };
});

const Board = ((player1, player2) => {

    const grid = [null, null, null,
                  null, null, null,
                  null, null, null]

    const boardBoxes = document.querySelectorAll(".board-box")

    boardBoxes.forEach((box) => {
        box.addEventListener('click', () => {
            mark(box);
        })
    })

    const draw = () => {
        boardBoxes.forEach((box) => {
            box.textContent = grid[box.getAttribute("data-box")];
        })
    }

    const mark = (box) => {
        if (player1.active && !box.textContent) {
            grid[box.getAttribute("data-box")] = 'X';
            player1.active = false;
            player2.active = true;
        } else if (player2.active && !box.textContent) {
            grid[box.getAttribute("data-box")] = 'O';
            player2.active = false;
            player1.active = true;
        }
        draw();
    }

    return {
        draw, mark
    };
});

const playerFactory = (name, marker, active) => {

    return {name, marker, active} ;
}

Game();



