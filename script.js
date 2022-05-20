const gameBoard = (() => {
    let board = Array(9);

    const getBoard = () => board;

    const updateBoard = (index, newVal) => {
        board[index] = newVal;
    }

    const clearBoard = () => {
        board = Array(9);
    }

    return {
        getBoard,
        updateBoard,
        clearBoard
    };
})();

const Player = (name, marker, color) => {
    return {name, marker, color};
}

const gameController = (() => {
    const playerOne = Player("Player One", 'X', '#22c55e');
    const playerTwo = Player("Player Two", 'O', '#a855f7');
    const winningCombos = [[0, 1, 2], [3, 4, 5], [6, 7, 8],  // rows
                           [0, 3, 6], [1, 4, 7], [2, 5, 8],  // columns
                           [0, 4, 8], [2, 4, 6]]             // diagonals
    let activePlayer = playerOne;
    let gameOver = false;

    const getActivePlayer = () => activePlayer;

    const changeActivePlayer = () => {
        activePlayer == playerOne ? activePlayer = playerTwo : activePlayer = playerOne;
    }
    
    const checkWinner = () => {
        const boardArray = gameBoard.getBoard()
        let win = false;

        // Check each combo against the current board
        winningCombos.forEach(combo => {
            if (boardArray[combo[0]] &&                         
                boardArray[combo[0]] == boardArray[combo[1]] &&  
                boardArray[combo[0]] == boardArray[combo[2]]) {  
                win = true; 
                gameOver = true;
                console.log('Win!')
                displayController.colorWin(combo);
                displayController.showRestart();
            }
        })

        return win;
    }

    const checkTie = () => {
        const boardArray = gameBoard.getBoard()
        
        // Loop through the gameboard to check for empty spaces
        for (i = 0; i < 9; i++) {
            if (!boardArray[i]) return false  // Not yet a tie if there are any
        }

        console.log('Tie!')
        displayController.colorTie();
        gameOver = true;
        displayController.showRestart();
        return true;
    }

    const getGameOver = () => {
        return gameOver;
    }

    const newGame = () => {
        activePlayer = playerOne;
        gameOver = false;
        gameBoard.clearBoard();
        displayController.colorNew();
        displayController.drawBoard();
    }

    return {
        getActivePlayer,
        changeActivePlayer,
        checkWinner,
        checkTie,
        getGameOver,
        newGame
    };
})();

const displayController = (() => {
    const boardBoxes = document.querySelectorAll(".board-box");
    const restartBtn = document.querySelector(".restart-btn");

    // Clicking on a box will attempt to draw a mark
    boardBoxes.forEach((box) => {
        box.addEventListener('click', () => {
            drawMark(box);
        })
    })
    
    const drawBoard = () => {
        const boardArray = gameBoard.getBoard()

        // Loop through each box display, draw content of respective board array element
        boardBoxes.forEach((box) => {
            box.textContent = boardArray[box.getAttribute("data-box")];
        })
    };

    const drawMark = (box) => {
        const boardArray = gameBoard.getBoard()
        let player = gameController.getActivePlayer();
        let gameOver = false;

        // If the clicked box is empty and game isn't over...
        if (!boardArray[box.getAttribute("data-box")] && !gameController.getGameOver()) {
            // Add the active player's mark to the board array
            gameBoard.updateBoard(box.getAttribute("data-box"), player.marker)
            box.style.color = player.color;

            // Refresh the visual board, drawing the new array content
            drawBoard();

            // Check for a win
            gameOver = gameController.checkWinner();

            // If no win, check for a tie
            if (!gameOver) {
                gameController.checkTie();
            }

            // If game is still going, move on to the next player's turn
            if (!gameOver) {
                gameController.changeActivePlayer();
            }

        }

    }

    const colorWin = (combo) => {
        let player = gameController.getActivePlayer();
        combo.forEach(index => {
            boardBoxes[index].style.backgroundColor = player.color;
        })
    }

    const colorTie = () => {
        boardBoxes.forEach((box) => {
            box.style.color = "#d1d5db";
            box.style.backgroundColor = "#d1d5db";
        })
    }

    const colorNew = () => {
        boardBoxes.forEach((box) => {
            box.style.backgroundColor = "#2563eb";
        })
    }

    const showRestart = () => {
        restartBtn.style.display = 'inline';
    }

    restartBtn.addEventListener('click', () => {
        gameController.newGame();
    })

    return {
        drawBoard,
        colorWin,
        colorTie,
        colorNew,
        showRestart
    };
})();