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
    let gameOver = false;
                
    const boardBoxes = document.querySelectorAll(".board-box")
    const topLeft = document.querySelector(".top-left");
    const topCenter = document.querySelector(".top-center");
    const topRight = document.querySelector(".top-right");
    const midLeft = document.querySelector(".mid-left");
    const midCenter = document.querySelector(".mid-center");
    const midRight = document.querySelector(".mid-right");
    const botLeft = document.querySelector(".bot-left");
    const botCenter = document.querySelector(".bot-center");
    const botRight = document.querySelector(".bot-right");

    boardBoxes.forEach((box) => {
        box.addEventListener('click', () => {
            if (!gameOver) {
                mark(box);
            } else {
                clear();
            }
            
        })
    })

    const clear = () => {
        console.log('test clear')
        for (let i = 0; i < grid.length; i ++) {
            grid[i] = null;
        }
        boardBoxes.forEach((box) => {
            box.style.color = 'black';
        })
        player1.active = true;
        player2.active = false;
        draw();
        gameOver = false;
    }

    const draw = () => {
        boardBoxes.forEach((box) => {
            box.textContent = grid[box.getAttribute("data-box")];
        })
    }

    const mark = (box) => {
        if (player1.active && !box.textContent) {
            grid[box.getAttribute("data-box")] = 'X';
        } else if (player2.active && !box.textContent) {
            grid[box.getAttribute("data-box")] = 'O';
        }
        draw();
        checkWinner();
        if (gameOver) {
            console.log("Game over!")
        } else {
            player1.active = !player1.active
            player2.active = !player2.active
        }

    }

    const getActive = () => {
        if (player1.active) return player1.name
        return player2.name
    }

    const checkWinner = () => {
        let winner = null;

        // Check for row
        if (grid[0] && grid[0] == grid[1] && grid[0] == grid[2]) {
            winner = getActive()
            topLeft.style.color = "lightgreen";
            topCenter.style.color = "lightgreen";
            topRight.style.color = "lightgreen";
        }
        if (grid[3] && grid[3] == grid[4] && grid[3] == grid[5]) {
            winner = getActive()
            midLeft.style.color = "lightgreen";
            midCenter.style.color = "lightgreen";
            midRight.style.color = "lightgreen";
        }
        if (grid[6] && grid[6] == grid[7] && grid[6] == grid[8]) {
            winner = getActive()
            botLeft.style.color = "lightgreen";
            botCenter.style.color = "lightgreen";
            botRight.style.color = "lightgreen";
        }
        
        // Check for column
        if (grid[0] && grid[0] == grid[3] && grid[0] == grid[6]) {
            topLeft.style.color = "lightgreen";
            midLeft.style.color = "lightgreen";
            botLeft.style.color = "lightgreen";
            winner = getActive()
        }
        if (grid[1] && grid[1] == grid[4] && grid[1] == grid[7]) {
            winner = getActive()
            topCenter.style.color = "lightgreen";
            midCenter.style.color = "lightgreen";
            botCenter.style.color = "lightgreen";
        }
        if (grid[2] && grid[2] == grid[5] && grid[2] == grid[8]) {
            winner = getActive()
            topRight.style.color = "lightgreen";
            midRight.style.color = "lightgreen";
            botRight.style.color = "lightgreen";
        }

        // Check for diagonal
        if (grid[0] && grid[0] == grid[4] && grid[0] == grid[8]) {
            winner = getActive()
            topLeft.style.color = "lightgreen";
            midCenter.style.color = "lightgreen";
            botRight.style.color = "lightgreen";
        }
        if (grid[2] && grid[2] == grid[4] && grid[2] == grid[6]) {
            winner = getActive()
            topRight.style.color = "lightgreen";
            midCenter.style.color = "lightgreen";
            botLeft.style.color = "lightgreen";
        }

        if (winner) {
            console.log(`${winner} wins!`)
            gameOver = true;
        }
    }


    return {
        draw, mark
    };
});

const playerFactory = (name, marker, active) => {

    return {name, marker, active} ;
}

Game();



