const gameBoard = (() => {
    const board = Array(9);

    const getBoard = () => board;

    const updateBoard = (index, newVal) => {
        board[index] = newVal;
    }

    return {
        getBoard,
        updateBoard
    };
})();

const Player = (name, marker) => {
    return {name, marker};
}

const gameController = (() => {
    const playerOne = Player("Player One", 'X');
    const playerTwo = Player("Player Two", 'O');
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
        return true;
    }

    const getGameOver = () => {
        return gameOver;
    }

    return {
        getActivePlayer,
        changeActivePlayer,
        checkWinner,
        checkTie,
        getGameOver
    };
})();

const displayController = (() => {
    const boardBoxes = document.querySelectorAll(".board-box");

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

        // If the clicked box is empty and game isn't over...
        if (!boardArray[box.getAttribute("data-box")] && !gameController.getGameOver()) {
            // Add the active player's mark to the board array
            gameBoard.updateBoard(box.getAttribute("data-box"), player.marker)

            // Refresh the visual board, drawing the new array content
            drawBoard();

            // Check for a win
            gameController.checkWinner();

            // Check for a tie
            gameController.checkTie();

            // If game is still going, move on to the next player's turn
            gameController.changeActivePlayer();
        }

    }

    const colorWin = (combo) => {
        combo.forEach(index => {
            boardBoxes[index].style.color = "lightgreen";
        })
    }

    const colorTie = () => {
        boardBoxes.forEach((box) => {
            box.style.color = "red";
        })
    }

    return {
        drawBoard,
        colorWin,
        colorTie
    };
})();