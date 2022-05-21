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

const Player = (name, marker, color, num, order) => {
    return {name, marker, color, num, order};
}

const gameController = (() => {
    const playerOne = Player("Player One", 'X', '#22c55e', 1, 1);
    const playerTwo = Player("Player Two", 'O', '#a855f7', 2, 2);
    const winningCombos = [[0, 1, 2], [3, 4, 5], [6, 7, 8],  // rows
                           [0, 3, 6], [1, 4, 7], [2, 5, 8],  // columns
                           [0, 4, 8], [2, 4, 6]]             // diagonals
    let activePlayer = playerOne;
    let gameOver = false;

    const getActivePlayer = () => activePlayer;

    const changeActivePlayer = () => {
        activePlayer == playerOne ? activePlayer = playerTwo : activePlayer = playerOne;

        const currentMarker = document.querySelector(".current-marker");
        currentMarker.textContent = activePlayer.marker;
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
                displayController.colorWin(combo);
                displayController.updateScore();
                menuController.announceWinner();
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
        displayController.updateTies();
        menuController.announceTie();
        gameOver = true;
        return true;
    }

    const getGameOver = () => {
        return gameOver;
    }

    const newRound = () => {
        playerOne.order == 1 ? activePlayer = playerOne : activePlayer = playerTwo;
        gameOver = false;
        gameBoard.clearBoard();
        displayController.colorNew();
        displayController.drawBoard();
    }

    const setPlayerNames = (playerOneName, playerTwoName) => {
        playerOne.name = playerOneName;
        playerTwo.name = playerTwoName;

        const playerOneNameDisplay = document.querySelector(".player-one-name");
        const playerTwoNameDisplay = document.querySelector(".player-two-name");
        playerOneNameDisplay.textContent = playerOne.name;
        playerTwoNameDisplay.textContent = playerTwo.name;
    }

    const switchOrder = () => {
        const oneMarker = document.querySelector(".player-one-marker");
        const twoMarker = document.querySelector(".player-two-marker");

        if (playerOne.order == 1) {
            playerOne.order = 2;
            playerOne.marker = 'O';
            playerTwo.order = 1;
            playerTwo.marker = 'X';
            oneMarker.textContent = playerOne.marker;
            twoMarker.textContent = playerTwo.marker;
        } else {
            playerOne.order = 1;
            playerOne.marker = 'X';
            playerTwo.order = 2;
            playerTwo.marker = 'O';
            oneMarker.textContent = playerOne.marker;
            twoMarker.textContent = playerTwo.marker;
        }
    }

    return {
        getActivePlayer,
        changeActivePlayer,
        checkWinner,
        checkTie,
        getGameOver,
        newRound,
        setPlayerNames,
        switchOrder
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

    const updateScore = () => {
        let player = gameController.getActivePlayer();
        const playerOneScoreDisplay = document.querySelector(".player-one-score");
        const playerTwoScoreDisplay = document.querySelector(".player-two-score");

        if (player.num == 1) {
            let score = parseInt(playerOneScoreDisplay.textContent);
            score++;
            playerOneScoreDisplay.textContent = score;
        } else {
            let score = parseInt(playerTwoScoreDisplay.textContent);
            score++;
            playerTwoScoreDisplay.textContent = score;
        }
        console.log(player);
    }

    const updateTies = () => {
        const tieCountDisplay = document.querySelector(".tie-count");
        let ties = parseInt(tieCountDisplay.textContent);
        ties++;
        tieCountDisplay.textContent = ties;
    }

    return {
        drawBoard,
        colorWin,
        colorTie,
        colorNew,
        updateScore,
        updateTies
    };
})();

const menuController = (() => {
    const modeModal = document.querySelector(".game-mode-modal");
    const nameModal = document.querySelector(".player-name-modal");
    const roundOverModal = document.querySelector(".round-over-modal");
    const tiedModal = document.querySelector(".tied-modal");
    const playerModeBtn = document.querySelector(".player-mode");
    const startGameBtn = document.querySelector(".start-btn");
    const overlay = document.querySelector(".overlay");
    const playerOneNameInput = document.querySelector("#player-one");
    const playerTwoNameInput = document.querySelector("#player-two");
    const winnerName = document.querySelector(".winner-name");
    const newRoundBtn = document.querySelector(".new-round-btn");
    const tieNewRoundBtn = document.querySelector(".tie-new-round-btn");

    playerModeBtn.addEventListener("click", () => {
        modeModal.classList.remove("modal-active");
        nameModal.classList.add("modal-active");
    })

    startGameBtn.addEventListener("click", () => {
        let playerOneName = playerOneNameInput.value;
        let playerTwoName = playerTwoNameInput.value;
        if (playerOneName.length > 0 && playerTwoName.length > 0) {
            nameModal.classList.remove("modal-active");
            overlay.classList.remove("overlay-active");
            gameController.setPlayerNames(playerOneName, playerTwoName)
        }

    })

    newRoundBtn.addEventListener("click", () => {
        roundOverModal.classList.remove("modal-active");
        overlay.classList.remove("overlay-active");
        gameController.switchOrder();
        gameController.newRound();
    })

    tieNewRoundBtn.addEventListener("click", () => {
        tiedModal.classList.remove("modal-active");
        overlay.classList.remove("overlay-active");
        gameController.switchOrder();
        gameController.newRound();
    })


    const announceWinner = () => {
        let winner = gameController.getActivePlayer();
        winnerName.textContent = winner.name;
        roundOverModal.classList.add("modal-active");
        overlay.classList.add("overlay-active");
    }

    const announceTie = () => {
        tiedModal.classList.add("modal-active");
        overlay.classList.add("overlay-active");
    }

    return {
        announceWinner,
        announceTie
    };

})();